<script setup>
import { ref } from "vue";

const chatMessage = ref("");
const chatReply = ref("");

const sendMessage = () => {
  console.log(chatMessage.value);
};

const chatList = ref([
  {
    role: "user",
    delta: "你好啊",
  },
  {
    role: "ai",
    delta: "你好，有什么可以帮你的吗？",
  },
  {
    role: "user",
    delta: "我想知道关于AI的知识我想知道关于AI的知识我想知道关于AI的知识",
  },
  {
    role: "ai",
    delta:
      "AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。",
  },
  {
    role: "user",
    delta: "我想知道关于AI的知识",
  },
  {
    role: "ai",
    delta:
      "AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。  AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。",
  },
  {
    role: "user",
    delta: "我想知道关于AI的知识",
  },
  {
    role: "ai",
    delta:
      "AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。  AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。",
  },
  {
    role: "user",
    delta: "我想知道关于AI的知识",
  },
  {
    role: "ai",
    delta:
      "AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。  AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。",
  },
  {
    role: "user",
    delta: "我想知道关于AI的知识",
  },
  {
    role: "ai",
    delta:
      "AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。  AI是一种人工智能技术，它可以模拟人类的思维过程，从而实现自主决策和行动。",
  },
]);
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
      .chat-list {
        width: 100%;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20rpx;
      }
    }
  }
}
</style>
