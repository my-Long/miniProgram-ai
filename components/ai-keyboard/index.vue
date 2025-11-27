<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:52:03
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-27 11:38:44
 * @FilePath: \miniProgram-ai\components\ai-keyboard\index.vue
 * @Description: 键盘
-->
<script setup>
import { ref } from "vue";
const props = defineProps({
  isReplying: {
    type: Boolean,
    default: false,
  },
});
const inputValue = ref("");
const emit = defineEmits(["send"]);
const sendMessage = () => {
  if (props.isReplying) {
    return;
  }
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
  <view class="ai-keyboard">
    <view class="ai-keyboard__input">
      <input
        type="text"
        placeholder="请输入内容"
        v-model="inputValue"
        @confirm="sendMessage"
        placeholder-style="color: #79A5BE;"
      />
      <view class="ai-keyboard__input-send" @click="sendMessage">
        <text class="iconfont icon-tingzhi" v-if="isReplying"></text>
        <text class="iconfont icon-send-s" v-else></text>
      </view>
    </view>
  </view>
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
    border-radius: 8rpx;
    border: 1px solid #71d5f9;
    color: #FF45CA;
    .ai-keyboard__input-send {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      background: linear-gradient(56deg, #61dafb 0%, #d6cbf6 46%, #f2056f 100%);
      .iconfont{
        font-size: 48rpx;
        color: #fff;
      }
    }
  }
}
</style>
