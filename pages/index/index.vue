<template>
  <view class="content">
    <view class="text-area" @click="handleClick(0)"> AI 聊天 </view>
    <!-- <view class="text-area" @click="handleClick(1)"> 历史 AI </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {},
  methods: {
    handleClick(index) {
      const route = ["/pages/ai/index", "/pages/historyAI/index"];
      uni.navigateTo({
        url: route[index],
      });
    },
  },
};
</script>

<style>
.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30rpx;
}
.text-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300rpx;
  height: 100rpx;
  font-size: 36rpx;
  color: #8f8f94;
  border: 1px solid #8f8f94;
}
</style>
