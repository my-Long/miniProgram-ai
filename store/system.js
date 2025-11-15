/*
 * @Author: Lmy
 * @Date: 2025-11-15 15:28:16
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-15 15:45:12
 * @FilePath: /ai-demo/store/system.js
 * @Description: 系统配置 Store（组合式）
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSystemStore = defineStore("system", () => {
  // 状态 (state)
  const baseUrl = ref("http://localhost:3000");
  const apiUrl = computed(() => `${baseUrl.value}/api`);

  const system = ref({});
  const setSystem = async () => {
    const res = await uni.getSystemInfo();
    system.value = res;
    const capsuleInfo = uni.getMenuButtonBoundingClientRect();
    system.value.capsuleInfo = capsuleInfo;
  };

  return {
    // 状态
    baseUrl,
    apiUrl,
    system,
    setSystem,
  };
});
