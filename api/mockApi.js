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
 * @param {Object} options 分页参数
 * @param {number} options.page 当前页码，从1开始，默认为1
 * @param {number} options.pageSize 每页数量，默认为20
 * @return {Promise<Object>} 返回标准接口格式 {code, data, msg}
 */
export const getMessage = (key = "chatMessages", options = {}) => {
  const { page = 1, pageSize = 5 } = options;

  return new Promise((resolve, reject) => {
    try {
      uni.getStorage({
        key,
        success: (res) => {
          const allMessages = res.data || [];
          const total = allMessages.length;

          // 计算分页起始索引
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;

          // 获取当前页的数据
          const list = allMessages.slice(startIndex, endIndex);

          resolve({
            code: 200,
            data: {
              list,
              total,
              hasMore: endIndex < total,
            },
            msg: "success",
          });
        },
        fail: (err) => {
          resolve({
            code: 200,
            data: {
              list: [],
              total: 0,
              hasMore: false,
            },
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
