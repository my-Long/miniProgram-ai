<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:38:19
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-27 20:27:30
 * @FilePath: \miniProgram-ai\components\ai-sys-text\index.vue
 * @Description: 系统文本
-->
<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { marked } from "marked";
import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html.vue";
import { completeMarkdown } from "@/utils/completeMarkdown";

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

const isReplying = defineModel("isReplying");

const content = ref("");
const htmlContent = ref("");
let timer = null;
const typingIndex = ref(0);
const needTypingEffect = ref(false); // 标记是否需要打字效果

const typingText = (text) => {
  if (!text) return;
  clearTimeout(timer);
  // 继续从当前位置打字
  const step = () => {
    isReplying.value = true;
    if (typingIndex.value < text.length) {
      content.value = text.slice(0, ++typingIndex.value);
      // 补全未闭合的标记后再渲染
      const completedContent = completeMarkdown(content.value);
      htmlContent.value = marked(completedContent);
      timer = setTimeout(step, 20);
    } else {
      // 打字完成后，标记不再需要打字效果
      needTypingEffect.value = false;
      isReplying.value = false;
    }
  };
  step();
};

const handlerText = (text) => {
  // 历史消息直接显示全部内容
  content.value = text;
  htmlContent.value = marked(content.value);
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
const style = {
  h1: "line-height:1.5;color:#FE2BC2;margin:30rpx 0",
  h2: "line-height:1.5;color:#ff37c6;margin:30rpx 0",
  h3: "line-height:1.5;color:#ff45ca;margin:20rpx 0",
  h4: "line-height:1.5;color:#ff54ce;margin:15rpx 0",
  h5: "line-height:1.5;color:#ff67d4;margin:15rpx 0",
  ul: "padding-top:10rpx; padding-bottom:10rpx",
  ol: "padding-top:10rpx; padding-bottom:10rpx",
  li: "line-height:1.8;color:#333",
  p: "line-height:1.8;color:#333",
  strong: "color:#FD4E30;",
  hr: "border: none; border-top: 1px solid #EFEFEF; margin: 15px 0;",
};
</script>
<template>
  <view class="ai-sys-text">
    <mp-html :tag-style="style" :content="htmlContent" />
  </view>
</template>

<style lang="scss" scoped>
.ai-sys-text {
  width: fit-content;
  padding: 10rpx 15rpx;
  color: #ff67d4;
}
</style>
