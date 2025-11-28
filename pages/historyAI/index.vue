<!--
 * @Author: Lmy
 * @LastEditors: Lmy
 * @Date: 2025-11-28 09:38:07
 * @LastEditTime: 2025-11-28 16:34:53
 * @FilePath: \miniProgram-ai\pages\historyAI\index.vue
 * @Description: 
-->
<script setup>
import { ref, nextTick, watch, onMounted } from "vue";
import AiPage from "@/components/ai-page/index.vue";
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
  if (lastX.value >= uni.upx2px(648)) {
    scaleValue.value = defaultScaleValue;
  } else if (lastX.value <= dividingLine.value) {
    scaleValue.value = 1;
  } else {
    scaleValue.value =
      1 -
      ((lastX.value - dividingLine.value) / (uni.upx2px(648) - dividingLine.value)) *
        (1 - defaultScaleValue);
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
      if (x.value == uni.upx2px(650)) {
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

const onClose = () => {
  scaleValue.value = 1;
  x.value = 0;
  disabled.value = true;
};
const aiPage = ref(null);
onMounted(() => {
  aiPage.value?.getMessageList();
});
</script>
<template>
  <view class="container">
    <movable-area>
      <view class="default-page">
        <ai-navbar>
          <template #navbar-left>
            <view class="iconfont icon-guanbi" @click="onClose"></view>
          </template>
        </ai-navbar>
        <view class="list-container">
          <view class="list">
            <view class="title">你的记录</view>
          </view>
          <view class="footer">
            <view class="avatar">
              <image src="@/static/avatar.png" mode="widthFix"></image>
            </view>
            <view class="name">AI</view>
          </view>
        </view>
      </view>
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
      >
        <ai-page ref="aiPage">
          <template #navbarLeft>
            <view class="navbar-left">
              <text class="iconfont icon-caidan" @click="handleClick"></text>
            </view>
          </template>
        </ai-page>
      </movable-view>
    </movable-area>
  </view>
</template>
<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
  .icon-guanbi {
    font-size: 40rpx;
  }
  .icon-caidan {
    font-size: 50rpx;
    color: #333;
  }
  .default-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background: linear-gradient(
      20deg,
      #975ff8 0%,
      #41e0d0 30%,
      #d6cbf6 66%,
      #fef9b8 100%
    );
    .list-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      width: 650rpx;
      padding-right: 4rpx;
      padding-left: 20rpx;
      padding-bottom: env(safe-area-inset-bottom);
      .list {
        flex: 1;
      }
      .footer {
        display: flex;
        align-items: center;
        height: 100rpx;
        gap: 20rpx;
        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          font-size: 32rpx;
          color: #333;
        }
      }
    }
  }
  movable-area {
    width: 1400rpx;
    height: 100%;
  }
  .max {
    width: 750rpx;
    height: 100vh;
    border-radius: 40rpx;
    overflow: hidden;
    box-shadow: -8rpx 4rpx 16rpx 0 rgba(0, 0, 0, 0.3);
  }
}
</style>
