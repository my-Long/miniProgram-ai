<script setup>
import { ref } from "vue";
import { useSystemStore } from "@/store/system";

const { apiUrl } = useSystemStore();
const chatMessage = ref("");

const onFetch = () => {
  console.log(apiUrl);
  uni.request({
    url: `${apiUrl}/chat`,
    method: "POST",
    data: {
      message: chatMessage.value,
    },
    success: (res) => {
      const result = res.data;
      const { data } = result;
      console.log("success", data);
      addMessage(data);
    },
    complete: () => {
      console.log("complete");
    },
  });
};

const addMessage = (messageItem) => {
  chatList.value.unshift(messageItem);
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

const chatList = ref([]);
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
