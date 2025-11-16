<script setup>
import { ref, reactive, onBeforeUnmount, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useSystemStore } from "@/store/system";
import { arrayBufferToString, ChunkProcessor } from "@/utils";

const { apiUrl } = useSystemStore();
const chatMessage = ref("");
const currentAIMessageIndex = ref(-1); // 记录当前正在接收的 AI 消息索引

const chatList = ref([]); // 聊天列表
const addMessage = (messageItem) => {
  chatList.value.unshift(messageItem);
};

const onHandleChunk = (chunk) => {
  const { delta, role = "ai" } = chunk;
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
};

const processor = ref(new ChunkProcessor(onHandleChunk));

const onFetch = () => {
  console.log("开始请求，API地址:", apiUrl);

  // 先创建一个空的 AI 消息占位
  const aiMessage = {
    role: "ai",
    delta: "",
    timestamp: Date.now(),
  };
  addMessage(aiMessage);
  currentAIMessageIndex.value = 0; // 最新消息在数组开头

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
    role: "user",
    delta: message,
  };
  addMessage(obj);
  onFetch();
};
</script>

<template>
  <view class="container">
    <ai-navbar title="AI聊天"> </ai-navbar>
    <view class="chat-container">
      <scroll-view class="chat-content" scroll-y>
        <div class="chat-list">
          <div
            class="chat-item"
            v-for="item in chatList"
            :key="item.id"
            :class="{ user: item.role === 'user', ai: item.role === 'sys' }"
          >
            <ai-user-text v-if="item.role === 'user'" :text="item.delta" />
            <ai-sys-text v-if="item.role === 'ai'" :text="item.delta" />
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
  background: linear-gradient(180deg, #93ae7a 0%, #fff 26.13%, #d6ebfb 81.76%);
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
