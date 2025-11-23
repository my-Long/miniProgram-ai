/**
 * @description: 保存消息到本地缓存
 * @param {string} key 缓存的键名，默认为 'chatMessages'
 * @param {Array} messages 要保存的消息数组
 * @return {Promise<boolean>} 返回是否保存成功
 */
export const saveMessage = (key = "chatMessages", messages = []) => {
  return new Promise((resolve, reject) => {
    try {
      uni.setStorage({
        key,
        data: messages,
        success: () => {
          resolve(true);
        },
        fail: (err) => {
          reject(err);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * @description: 从本地缓存读取消息
 * @param {string} key 缓存的键名，默认为 'chatMessages'
 * @return {Promise<Array>} 返回消息数组
 */
export const getMessage = (key = "chatMessages") => {
  return new Promise((resolve, reject) => {
    try {
      uni.getStorage({
        key,
        success: (res) => {
          resolve(res.data || []);
        },
        fail: (err) => {
          resolve([]);
        },
      });
    } catch (error) {
      resolve([]);
    }
  });
};
