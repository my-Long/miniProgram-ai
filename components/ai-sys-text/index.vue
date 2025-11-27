<!--
 * @Author: Lmy
 * @Date: 2025-11-15 16:38:19
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-27 09:54:51
 * @FilePath: \miniProgram-ai\components\ai-sys-text\index.vue
 * @Description: 系统文本
-->
<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { marked } from "marked";
import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html.vue";

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
const htmlContent = ref("");
let timer = null;
const typingIndex = ref(0);
const needTypingEffect = ref(false); // 标记是否需要打字效果

const typingText = (text) => {
  clearTimeout(timer);
  // 继续从当前位置打字
  const step = () => {
    if (typingIndex.value < text.length) {
      content.value = text.slice(0, ++typingIndex.value);
      htmlContent.value = marked(content.value);
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
  h2: "line-height:1.5;color:#000;margin:30rpx 0",
  h3: "line-height:1.5;color:#000;margin:20rpx 0",
  h4: "line-height:1.5;color:#000;margin:15rpx 0",
  h5: "line-height:1.5;color:#000;margin:15rpx 0",
  ul: "padding-top:10rpx; padding-bottom:10rpx",
  ol: "padding-top:10rpx; padding-bottom:10rpx",
  li: "line-height:1.8;color:#000",
  p: "line-height:1.8;color:#000",
  hr: "border: none; border-top: 1px solid #EFEFEF; margin: 15px 0;",
};
</script>
<template>
  <div class="ai-sys-text">
    <mp-html :tag-style="style" :content="htmlContent" />
  </div>
</template>

<style lang="scss" scoped>
.ai-sys-text {
  width: fit-content;
  padding: 10rpx 15rpx;
  color: #333;
}
</style>
