<!--
 * @Author: Lmy
 * @Date: 2025-11-15 15:52:19
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-15 16:17:04
 * @FilePath: /ai-demo/components/ai-navbar/index.vue
 * @Description: 自定义头部
-->
<script setup>
import { useStatusBar } from "@/hooks";
const { statusBarHeight, capsuleInfoHeight } = useStatusBar();

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  backgroundColor: {
    type: String,
    default: "transparent",
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 90,
  },
});
</script>
<template>
  <view
    class="ai-navbar"
    :class="{ fixed: fixed }"
    :style="{
      paddingTop: statusBarHeight + 'px',
      backgroundColor: backgroundColor,
      zIndex: zIndex,
    }"
  >
    <div
      class="ai-nanbar__wrapper"
      :style="{ height: capsuleInfoHeight + 'px' }"
    >
      <div class="ai-nanbar__left">
        <div class="ai-nanbar__left-item">
          <slot name="navbar-left">
            <text>{{ title }}</text>
          </slot>
        </div>
      </div>
    </div>
  </view>
</template>

<style lang="scss" scoped>
.ai-navbar {
  width: 100%;
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }
  .ai-nanbar__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14rpx;
    .ai-nanbar__left {
      display: flex;
      align-items: center;
      justify-content: center;
      .ai-nanbar__left-item {
        font-size: 40rpx;
      }
    }
  }
}
</style>
