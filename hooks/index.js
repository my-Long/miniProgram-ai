import { computed } from "vue";
import { useSystemStore } from "@/store/system";


/**
 * 获取状态栏高度、胶囊信息高度、胶囊信息宽度、导航栏高度
 * @returns {Object}
 * @property {number} statusBarHeight 状态栏高度
 * @property {number} capsuleInfoHeight 胶囊信息高度
 * @property {number} capsuleInfoWidth 胶囊信息宽度
 * @property {number} navBarHeight 导航栏高度
 */
export const useStatusBar = () => {
  const { system } = useSystemStore();
  const capsuleInfoHeight = computed(() => system.capsuleInfo.height + 8);
  const capsuleInfoWidth = computed(() => system.capsuleInfo.width);
  const navBarHeight = computed(() => capsuleInfoHeight.value + system.statusBarHeight);
  return {
    statusBarHeight: computed(() => system.statusBarHeight),
    capsuleInfoHeight: computed(() => capsuleInfoHeight.value),
    capsuleInfoWidth: computed(() => capsuleInfoWidth.value),
    navBarHeight: computed(() => navBarHeight.value),
  };
};
