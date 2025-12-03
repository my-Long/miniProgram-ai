<script setup>
import { ref, reactive, useSlots } from "vue";
import { useSystemStore } from "@/store/system";
import { arrayBufferToString, ChunkProcessor } from "@/utils";
import { saveMessage, getMessage } from "@/api/mockApi";

const { apiUrl } = useSystemStore();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
const chatMessage = ref("");
const currentReceivingId = ref(null); // 记录当前正在接收的 assistant 消息 ID

const chatList = ref([]); // 聊天列表

const isReplying = ref(false); // 是否正在回复(从发送到打字结束)
const isWaiting = ref(false); // 是否正在等待(从发送到接收消息)

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
  const { content, role = "assistant" } = chunk; // 设置默认 role 为 "assistant"
  if (typeof content === "string" && !content?.trim()) return;
  const last = chatList.value[0];
  if (last && last.role === role) {
    last.content += content;
  } else {
    chatList.value.unshift({
      content,
      role,
    });
  }
};

const processor = ref(new ChunkProcessor(onHandleChunk));

let requestTask = reactive(null);
const onFetch = () => {
  // 创建一个唯一 ID 用于标识这次对话
  const messageId = Date.now();
  currentReceivingId.value = messageId;

  // 先创建一个空的 assistant 消息占位
  const aiMessage = {
    id: messageId,
    role: "assistant",
    content: "",
  };
  addMessage(aiMessage);

  requestTask = wx.request({
    url: `${apiUrl}/chat/stream`,
    method: "POST",
    enableChunked: true, // 启用分块传输
    data: {
      messages: { role: "user", content: chatMessage.value },
    },
    success: (res) => {
      console.log("✅ 请求完成", res);
    },
    fail: (err) => {
      console.error("❌ 请求失败", err);
      isReplying.value = false;
      currentReceivingId.value = null;
    },
    complete: () => {
      console.log("⭕ 请求结束");
      // 请求结束后，清除当前接收状态
      // 但打字机效果会在组件内部继续完成
      currentReceivingId.value = null;
    },
  });

  // 监听数据返回
  if (requestTask.onChunkReceived) {
    requestTask.onChunkReceived(async (res) => {
      isWaiting.value = false;
      try {
        const text = await arrayBufferToString(res.data);
        await processor.value.enqueue(text);
        scrollTop.value = 0;
      } catch (error) {
        console.error("❌ 解析失败", error);
      }
    });
  }
};

const scrollTop = ref(1);
const sendMessage = (message) => {
  isReplying.value = true;
  isWaiting.value = true;
  chatMessage.value = message;
  const obj = {
    id: Date.now(),
    role: "user",
    content: message,
  };
  addMessage(obj);
  saveMessage(obj);
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

    const result = await getMessage({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      userId: "xx123",
    });

    if (result.code === 200) {
      // 更新分页信息
      pagination.value.total = result.data.total;
      pagination.value.hasMore = result.data.hasMore;
      const list = result.data.list;

      if (isLoadMore) {
        // 加载更多：追加到列表末尾
        chatList.value.unshift(...list);
        console.log("加载更多成功，当前页:", pagination.value.page);
      } else {
        // 初次加载：替换列表
        chatList.value = list;
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

const isStop = ref(false);
const onStop = () => {
  isStop.value = true;
  isReplying.value = false;
  requestTask.abort();
};
const onStopSuccess = (text) => {
  const messages = { role: "assistant", content: text };
  saveMessage(messages);
};

const onScrollToLower = () => {
  console.log("触发上拉加载");
  getMessageList(true);
};

const slots = useSlots();
defineExpose({
  getMessageList,
});
</script>

<template>
  <view class="container">
    <!-- 有自定义插槽时 -->
    <ai-navbar v-if="slots.navbarLeft" :title="title">
      <template #navbar-left>
        <slot name="navbarLeft"></slot>
      </template>
    </ai-navbar>
    <!-- 没有自定义插槽时，使用默认的 title -->
    <ai-navbar v-else :title="title"></ai-navbar>
    <view class="chat-container">
      <scroll-view
        v-if="chatList.length > 0"
        class="chat-content"
        :scroll-top="scrollTop"
        scroll-y
        :lower-threshold="100"
        @scrolltolower="onScrollToLower"
      >
        <view class="chat-list">
          <ai-loading v-if="isWaiting"></ai-loading>
          <view
            class="chat-item"
            v-for="(item, index) in chatList"
            :key="item.id"
            :class="{
              user: item.role === 'user',
              assistant: item.role === 'assistant',
            }"
          >
            <ai-user-text v-if="item.role === 'user'" :text="item.content" />
            <ai-sys-text
              v-if="item.role === 'assistant'"
              v-model:is-replying="isReplying"
              :text="item.content"
              :is-stop="isStop"
              :is-receiving="item.id === currentReceivingId"
              @stopSuccess="onStopSuccess"
            />
          </view>
        </view>
      </scroll-view>
      <ai-empty v-else></ai-empty>
    </view>
    <ai-keyboard :is-replying="isReplying" @send="sendMessage" @stop="onStop" />
  </view>
</template>
<style>
page {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
  background: linear-gradient(
    20deg,
    #975ff8 0%,
    #41e0d0 30%,
    #d6cbf6 66%,
    #fef9b8 100%
  );
  .chat-item {
    width: 700rpx;
    transform: rotateX(180deg);
    &.user {
      display: flex;
      justify-content: flex-end;
    }
    &.assistant {
      display: flex;
      justify-content: flex-start;
    }
  }
  .loading-tip {
    width: 100%;
    padding: 20rpx;
    display: flex;
    justify-content: flex-start;
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
