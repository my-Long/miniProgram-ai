<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:38:19
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-15 16:49:13
 * @FilePath: /ai-demo/components/ai-sys-text/index.vue
 * @Description: 系统文本
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
  <div class="ai-sys-text">{{ text }}</div>
</template>

<style lang="scss" scoped>
.ai-sys-text {
  width: fit-content;
  padding: 10rpx 15rpx;
  color: #333;
  border: 1px solid #9c9c9c;
  border-radius: 10rpx;
}
</style>
