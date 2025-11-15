<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:23:36
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-15 16:49:46
 * @FilePath: /ai-demo/components/ai-user-text/index.vue
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
  color: #333;
  background-color: #fffae6;
  border-radius: 20rpx 0 20rpx 20rpx;
}
</style>
