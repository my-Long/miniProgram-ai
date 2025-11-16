<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:38:19
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-16 16:57:45
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
const needTypingEffect = ref(false); // 标记是否需要打字效果

const typingText = (text) => {
  clearTimeout(timer);
  // 继续从当前位置打字
  const step = () => {
    if (typingIndex.value < text.length) {
      content.value = text.slice(0, ++typingIndex.value);
      timer = setTimeout(step, 30);
    } else {
      // 打字完成后，标记不再需要打字效果
      needTypingEffect.value = false;
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
    if (props.isReceiving || needTypingEffect.value) {
      // 正在接收中或需要继续打字效果
      typingText(newVal);
    } else {
      // 历史消息，直接显示
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
      // 从接收中变成接收完成，继续保持打字效果直到完成
      needTypingEffect.value = true;
      typingText(props.text);
    } else if (newVal && !oldVal) {
      // 重新开始接收
      needTypingEffect.value = true;
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
  border: 1px solid #e2dfdf;
  border-radius: 10rpx;
}
</style>
