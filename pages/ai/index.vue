<!--
 * @Author: Lmy
 * @LastEditors: Lmy
 * @Date: 2025-11-27 19:50:31
 * @LastEditTime: 2025-12-02 13:28:39
 * @FilePath: \miniProgram-ai\pages\ai\index.vue
 * @Description: ai 聊天页面
-->
<script setup>
import { ref, onMounted } from "vue";
import AiPage from "@/components/ai-page/index.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
const aiPage = ref(null);
onMounted(() => {
  aiPage.value?.getMessageList();
});
onLoad(() => {
  aiPage.value?.getMessageList();
});
onShow(() => {
  aiPage.value?.getMessageList();
});
</script>
<template>
  <ai-page ref="aiPage" title="AI聊天" />
</template>
