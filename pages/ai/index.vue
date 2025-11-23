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

// 分页相关状态
const pagination = ref({
  page: 1,
  pageSize: 6,
  total: 0,
  hasMore: false,
});
const loading = ref(false); // 加载状态

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
};

const processor = ref(new ChunkProcessor(onHandleChunk));

const onFetch = () => {

  // 创建一个唯一 ID 用于标识这次对话
  const messageId = Date.now();
  currentReceivingId.value = messageId;

  // 先创建一个空的 AI 消息占位
  const aiMessage = {
    id: messageId,
    role: "ai",
    delta: "",
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

const getMessageList = async (isLoadMore = false) => {
  // 防止重复加载
  if (loading.value) return;

  // 如果是加载更多，检查是否还有更多数据
  if (isLoadMore && !pagination.value.hasMore) {
    console.log("没有更多数据了");
    return;
  }

  try {
    if (isLoadMore) {
      pagination.value.page += 1;
    } else {
      loading.value = true;
      pagination.value.page = 1;
    }

    const result = await getMessage("chatMessages", {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    });
    console.log("result", result.data);

    if (result.code === 200) {
      // 更新分页信息
      pagination.value.total = result.data.total;
      pagination.value.hasMore = result.data.hasMore;

      if (isLoadMore) {
        // 加载更多：追加到列表末尾
        chatList.value.push(...result.data.list);
        console.log("加载更多成功，当前页:", pagination.value.page);
      } else {
        // 初次加载：替换列表
        chatList.value = result.data.list;
      }
    }
  } catch (error) {
    // 加载失败时回退页码
    if (isLoadMore) {
      pagination.value.page -= 1;
    }
  } finally {
    loading.value = false;
  }
};

const onScrollToLower = () => {
  console.log("触发上拉加载");
  getMessageList(true);
};
onLoad(() => {
  getMessageList();
});
</script>

<template>
  <view class="container">
    <ai-navbar title="AI聊天"> </ai-navbar>
    <view class="chat-container">
      <scroll-view
        class="chat-content"
        scroll-y
        :lower-threshold="100"
        @scrolltolower="onScrollToLower"
      >
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
  .loading-tip {
    width: 100%;
    padding: 20rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: rotateX(180deg);
    .loading-text {
      font-size: 24rpx;
      color: #999;
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
