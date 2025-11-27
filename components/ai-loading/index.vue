<template>
  <view class="loading">
    <view class="loading-item"></view>
    <view class="loading-item"></view>
    <view class="loading-item"></view>
    <view class="loading-item"></view>
  </view>
</template>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  width: 700rpx;
  height: 56rpx;
  padding: 0 15rpx;
}

.loading {
  .loading-item {
    border-radius: 50%;
    position: relative;
    width: 30rpx;
    height: 30rpx;
    margin: 0 6rpx;
    animation: loading 800ms infinite;
    &:nth-child(1) {
      background-color: #EC2E8B;
    }
    &:nth-child(2) {
      animation-delay: 100ms;
      background-color: #5DDDD8;
    }
    &:nth-child(3) {
      animation-delay: 200ms;
      background-color: #fafafa;
    }
    &:nth-child(4) {
      animation-delay: 300ms;
      background-color: #8bc34a;
    }
    &:nth-child(5) {
      animation-delay: 400ms;
      background-color: #ffeb3b;
    }
  }
}

@keyframes loading {
  0% {
    top: 0;
  }
  25% {
    top: 5rpx;
  }
  50% {
    top: -15rpx;
  }
  75% {
    top: 5rpx;
  }
  100% {
    top: -1rpx;
  }
}
</style>
