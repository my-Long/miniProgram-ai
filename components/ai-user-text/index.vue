<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:23:36
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-27 09:57:52
 * @FilePath: \miniProgram-ai\components\ai-user-text\index.vue
 * @Description: 用户文本
-->
<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="ai-user-text">{{ text }}</div>
</template>

<style lang="scss" scoped>
.ai-user-text {
  width: fit-content;
  max-width: 620rpx;
  padding: 10rpx 15rpx;
  color: #fff;
  background: linear-gradient(56deg, #61dafb 0%, #d6cbf6 46%, #f2056f 100%);
  border-radius: 20rpx 0 20rpx 20rpx;
}
</style>
