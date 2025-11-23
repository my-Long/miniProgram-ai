<script setup>
import { ref, onMounted, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useSystemStore } from "@/store/system";
import { arrayBufferToString, ChunkProcessor } from "@/utils";
import { saveMessage, getMessage } from "./mockApi";

const { apiUrl } = useSystemStore();
const chatMessage = ref("");
const currentReceivingId = ref(null); // 记录当前正在接收的 AI 消息 ID

const chatList = ref([]); // 聊天列表
const addMessage = (messageItem) => {
  chatList.value.unshift(messageItem);
};

const onHandleChunk = (chunk) => {
  const { delta, role = "ai" } = chunk; // 设置默认 role 为 "ai"
  if (typeof delta === "string" && !delta?.trim()) return;
  const last = chatList.value[0];
  if (last && last.role === role) {
    last.delta += delta;
  } else {
    chatList.value.unshift({
      delta,
      role,
    });
  }
  console.log(chatList.value);
};

const processor = ref(new ChunkProcessor(onHandleChunk));

const onFetch = () => {
  console.log("开始请求，API地址:", apiUrl);

  // 创建一个唯一 ID 用于标识这次对话
  const messageId = Date.now();
  currentReceivingId.value = messageId;

  // 先创建一个空的 AI 消息占位
  const aiMessage = {
    id: messageId,
    role: "ai",
    delta: "",
    timestamp: Date.now(),
  };
  addMessage(aiMessage);

  const requestTask = wx.request({
    url: `${apiUrl}/chat`,
    method: "POST",
    enableChunked: true, // 启用分块传输
    data: {
      message: chatMessage.value,
    },
    success: (res) => {
      console.log("✅ 请求完成", res);
    },
    fail: (err) => {
      console.error("❌ 请求失败", err);
    },
    complete: () => {
      console.log("⭕ 请求结束");
      // 请求结束后，清除当前接收状态
      // 但打字机效果会在组件内部继续完成
      currentReceivingId.value = null;
      saveMessage("chatMessages", chatList.value);
    },
  });

  // 监听数据返回
  if (requestTask.onChunkReceived) {
    requestTask.onChunkReceived(async (res) => {
      try {
        const text = await arrayBufferToString(res.data);
        await processor.value.enqueue(text);
      } catch (error) {
        console.error("❌ 解析失败", error);
      }
    });
  }
};

const sendMessage = (message) => {
  chatMessage.value = message;
  const obj = {
    id: Date.now(),
    role: "user",
    delta: message,
  };
  addMessage(obj);
  onFetch();
};

// 页面加载时恢复聊天记录
onMounted(async () => {
  try {
    const messages = await getMessage("chatMessages");
    if (messages && messages.length > 0) {
      chatList.value = messages;
      console.log(messages);
      console.log("已恢复聊天记录:", messages.length, "条");
    }
  } catch (error) {}
});
</script>

<template>
  <view class="container">
    <ai-navbar title="AI聊天"> </ai-navbar>
    <view class="chat-container">
      <scroll-view class="chat-content" scroll-y>
        <div class="chat-list">
          <div
            class="chat-item"
            v-for="(item, index) in chatList"
            :key="item.id"
            :class="{ user: item.role === 'user', ai: item.role === 'sys' }"
          >
            <ai-user-text v-if="item.role === 'user'" :text="item.delta" />
            <ai-sys-text
              v-if="item.role === 'ai'"
              :text="item.delta"
              :is-receiving="item.id === currentReceivingId"
            />
          </div>
        </div>
      </scroll-view>
    </view>
    <ai-keyboard @send="sendMessage" />
  </view>
</template>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #f07e88 0%, #d6ebfb 61.76%, #fff 100%);
  padding-bottom: env(safe-area-inset-bottom);

  .chat-item {
    width: 700rpx;
    transform: rotateX(180deg);
    &.user {
      display: flex;
      justify-content: flex-end;
    }
    &.ai {
      display: flex;
      justify-content: flex-start;
    }
  }
  .chat-container {
    flex: 1;
    overflow: hidden;
    .chat-content {
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      height: 100%;
      overflow-y: auto;
      transform: rotateX(180deg);
      .chat-list {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 20rpx;
      }
    }
  }
}
</style>
