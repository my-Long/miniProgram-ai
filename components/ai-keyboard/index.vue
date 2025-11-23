<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:52:03
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-23 16:43:12
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
      <div class="ai-keyboard__input-send" @click="sendMessage">↑</div>
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
    height: 90rpx;
    padding: 0 10rpx 0 16rpx;
    background-color: #f8fafb;
    border-radius: 8rpx;
    border: 1px solid #e2dfdf;
    .ai-keyboard__input-send {
      width: 70rpx;
      height: 70rpx;
      font-size: 40rpx;
      color: #333;
      text-align: center;
      line-height: 80rpx;
      border-radius: 50%;
      background-color: #ffe7d9;
    }
  }
}
</style>
