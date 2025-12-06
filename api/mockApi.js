/**
 * @description: 保存消息到本地缓存
 * @param {string} key 缓存的键名，默认为 'chatMessages'
 * @param {Array} messages 要保存的消息数组
 * @return {Promise<boolean>} 返回是否保存成功
 */
import { useSystemStore } from "@/store/system";
export const saveMessage = (messages) => {
  const { apiUrl } = useSystemStore();
  return new Promise((resolve, reject) => {
    try {
      uni.request({
        url: `${apiUrl}/chat/saveMessage`,
        method: "POST",
        data: {
          messages,
        },
        success: (res) => {
          resolve(res.data);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getMessage = (params) => {
  const { page = 1, pageSize = 5, userId } = params;
  const { apiUrl } = useSystemStore();
  return new Promise((resolve, reject) => {
    try {
      uni.request({
        url: `${apiUrl}/chat/getMessage`,
        method: "POST",
        data: {
          page,
          pageSize,
          userId,
        },
        success: (res) => {
          resolve({
            code: 200,
            data: res.data,
            msg: "success",
          });
        },
      });
    } catch (error) {
      resolve({
        code: 500,
        data: {
          list: [],
          total: 0,
          hasMore: false,
        },
        msg: "获取消息失败",
      });
    }
  });
};

export const stopReply = () => {
  const { apiUrl } = useSystemStore();
  return new Promise((resolve, reject) => {
    try {
      uni.request({
        url: `${apiUrl}/chat/stop`,
        method: "POST",
        success: (res) => {
          resolve(res.data);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
