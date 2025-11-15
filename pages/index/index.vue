<template>
  <view class="content">
    <view class="text-area" @click="handleClick"> AI 聊天 </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
			baseUrl: "http://localhost:3000",
    };
  },
  onLoad() {},
  methods: {
    handleClick() {
      uni.navigateTo({
        url: "/pages/ai/index",
      });
    },
    // 发送聊天消息
    sendMessage() {
      if (!this.chatMessage.trim()) {
        uni.showToast({
          title: "请输入消息",
          icon: "none",
        });
        return;
      }

      uni.showLoading({
        title: "发送中...",
      });

      uni.request({
        url: `${this.baseUrl}/api/chat`,
        method: "POST",
        data: {
          message: this.chatMessage,
          userId: "123",
        },
        success: (res) => {
          console.log("聊天回复:", res);
          if (res.data.code === 200) {
            this.chatReply = res.data.data.reply;
            this.chatMessage = ""; // 清空输入框
            uni.showToast({
              title: "发送成功",
              icon: "success",
            });
          }
        },
        fail: (err) => {
          console.error("发送失败:", err);
          uni.showToast({
            title: "发送失败",
            icon: "none",
          });
        },
        complete: () => {
          uni.hideLoading();
        },
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
