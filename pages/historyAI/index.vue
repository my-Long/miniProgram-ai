<!--
 * @Author: Lmy
 * @LastEditors: Lmy
 * @Date: 2025-11-28 09:38:07
 * @LastEditTime: 2025-11-28 11:49:51
 * @FilePath: \miniProgram-ai\pages\historyAI\index.vue
 * @Description: 
-->
<script setup>
import { ref, nextTick, watch } from "vue";
const x = ref(0);
const y = ref(0);
const lastX = ref(0); // 保存上一次的 x 值
const source = ref(650); // 源位置
const scaleValue = ref(1);
const disabled = ref(true);
const dividingLine = ref(260);

const defaultScaleValue = 0.8;


const handleChange = (e) => {
  lastX.value = e.detail.x;
};
const handleClick = () => {
  const target = uni.upx2px(source.value);
  x.value = target;
  scaleValue.value = defaultScaleValue;
  setTimeout(() => {
    disabled.value = false;
  }, 0);
};
const handleTouchstart = () => {
  console.log("触摸开始");
};
const handleTouchmove = () => {
  console.log("触摸移动");
  console.log(lastX.value);
  // lastX 285-324 匀速变化 scaleValue 0.8 ~ 1
  if (lastX.value >= 324) {
    scaleValue.value = defaultScaleValue;
  } else if (lastX.value <= dividingLine.value) {
    scaleValue.value = 1;
  } else {
    scaleValue.value =
      1 -
      ((lastX.value - dividingLine.value) / (344 - dividingLine.value)) *
        (1 - defaultScaleValue);
    // 小于等于285时，scale为1；大于等于344时为0.8；中间线性插值
    // if (lastX.value <= dividingLine.value) {
    //   scaleValue.value = 1;
    // } else if (lastX.value >= 344) {
    //   scaleValue.value = 0.8;
    // } else {
    //   scaleValue.value = 1 - ((lastX.value - dividingLine.value) / (344 - dividingLine.value)) * (1 - 0.8);
    // }
  }
};
const handleTouchend = () => {
  if (lastX.value < dividingLine.value) {
    // 向左拖动超过阈值，回到初始位置
    x.value = 0;
    disabled.value = true;
  } else {
    nextTick(() => {
      // 没有拖动到阈值，回弹到 650 的位置
      console.log(lastX.value);
      if (x.value == 325) {
        source.value = 649;
      } else {
        source.value = 650;
      }
      const target = uni.upx2px(source.value);
      scaleValue.value = defaultScaleValue;
      x.value = target;
    });
  }
};
</script>
<template>
  <div class="container">
    <div class="button" @click="handleClick">按钮</div>
    <movable-area>
      <movable-view
        class="max"
        direction="horizontal"
        out-of-bounds
        scale
        :x="x"
        :y="y"
        :scale-min="0.5"
        :scale-max="1"
        :scale-value="scaleValue"
        :disabled="disabled"
        @change="handleChange"
        @touchstart="handleTouchstart"
        @touchend="handleTouchend"
        @touchmove="handleTouchmove"
        >text</movable-view
      >
    </movable-area>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
  .button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 999;
  }
  movable-area {
    width: 1400rpx;
    height: 100%;
    background-color: pink;
  }
  .max {
    width: 750rpx;
    height: 800rpx;
    background-color: red;
  }
}
</style>
