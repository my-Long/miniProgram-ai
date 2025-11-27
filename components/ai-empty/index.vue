<template>
  <view class="ai-empty">
    <image class="img" src="@/static/chat.png" mode="widthFix"></image>
    <view class="text">让我们开始聊天吧</view>
  </view>
</template>

<style lang="scss" scoped>
.ai-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img {
    width: 450rpx;
  }
  .text {
    font-size: 60rpx;
    margin-top: 50rpx;
    color: #e467b2;
    font-weight: bold;
  }
}
</style>
