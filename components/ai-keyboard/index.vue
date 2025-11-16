<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:52:03
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-16 15:39:08
 * @FilePath: /ai-demo/components/ai-keyboard/index.vue
 * @Description: 键盘
-->
<script setup>
import { ref } from "vue";
const inputValue = ref("");
const emit = defineEmits(["send"]);
const sendMessage = () => {
  if (!inputValue.value.trim()) {
    uni.showToast({
      title: "请输入内容",
      icon: "none",
    });
    return;
  }
  emit("send", inputValue.value);
  inputValue.value = "";
};
</script>
<template>
  <div class="ai-keyboard">
    <div class="ai-keyboard__input">
      <input
        type="text"
        placeholder="请输入内容"
        v-model="inputValue"
        @confirm="sendMessage"
      />
      <div class="ai-keyboard__input-send" @click="sendMessage">Send</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.ai-keyboard {
  padding: 10rpx 16rpx 0;
  .ai-keyboard__input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    padding: 0 10rpx 0 16rpx;
    background-color: #f8fafb;
    border-radius: 8rpx;
    .ai-keyboard__input-send {
      width: 100rpx;
      height: 60rpx;
      background-color: #ff5655;
      color: #fff;
      text-align: center;
      line-height: 60rpx;
      border-radius: 8rpx;
    }
  }
}
</style>
