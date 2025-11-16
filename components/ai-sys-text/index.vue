<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:38:19
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-16 16:35:45
 * @FilePath: /ai-demo/components/ai-sys-text/index.vue
 * @Description: 系统文本
-->
<script setup>
import { ref, watch, onBeforeUnmount } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  isReceiving: {
    type: Boolean,
    default: false, // 是否正在接收中（需要打字效果）
  },
});

const content = ref("");
let timer = null;
const typingIndex = ref(0);

const typingText = (text) => {
  clearTimeout(timer);
  // 继续从当前位置打字
  const step = () => {
    if (typingIndex.value < text.length) {
      content.value = text.slice(0, ++typingIndex.value);
      timer = setTimeout(step, 60);
    }
  };
  step();
};

const handlerText = (text) => {
  // 历史消息直接显示全部内容
  content.value = text;
  typingIndex.value = text.length;
};

watch(
  () => props.text,
  (newVal) => {
    if (props.isReceiving) {
      // 正在接收中，打字效果
      typingText(newVal);
    } else {
      // 历史消息或接收完成，直接显示
      handlerText(newVal);
    }
  },
  { immediate: true }
);

// 监听 isReceiving 变化
watch(
  () => props.isReceiving,
  (newVal, oldVal) => {
    console.log("isReceiving 变化:", oldVal, "->", newVal);
    if (!newVal && oldVal) {
      // 从接收中变成接收完成，确保显示完整内容
      handlerText(props.text);
    } else if (newVal && !oldVal) {
      // 重新开始接收（理论上不应该发生，但以防万一）
      typingIndex.value = 0;
      typingText(props.text);
    }
  }
);

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});
</script>
<template>
  <div class="ai-sys-text">{{ content }}</div>
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
