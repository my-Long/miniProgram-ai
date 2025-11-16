/*
 * @Author: Lmy
 * @Date: 2025-11-16 14:43:15
 * @LastEditors: Lmy
 * @LastEditTime: 2025-11-16 15:37:52
 * @FilePath: /ai-demo/utils/index.js
 * @Description: 流式处理器 —— 输出打字机效果
 */

// 定义一个全局缓冲区
let jsonBuffer = "";

export const arrayBufferToString = async (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const uint8Array = new Uint8Array(buffer);
      let encodedString = "";
      for (let i = 0; i < uint8Array.length; i++) {
        encodedString += String.fromCharCode(uint8Array[i]);
      }
      // 使用 encodeURIComponent 替代 escape
      const decodedString = decodeURIComponent(
        Array.from(encodedString)
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
      resolve(decodedString);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * @description: 处理 JSON 流文本（支持拼接、数组、单条），并逐条回调
 * @param {string} text 由 arrayBuffer 转为字符串的文本
 * @param {(obj: object) => Promise<void> | void} handleItem 每个 JSON 项的处理函数（支持 async）
 * @param {number} delay 可选，逐项处理之间的延迟时间（ms），默认 100ms
 */
export async function parseJsonChunks(text, handleItem, delay = 100) {
  // 将新的文本追加到缓冲区
  jsonBuffer += text;

  let remainingBuffer = jsonBuffer;
  let parsedAny = false;
  while (remainingBuffer) {
    // 1. 先尝试整体解析：可能是完整对象或数组
    try {
      const parsed = JSON.parse(remainingBuffer);

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          await handleItem(item);
          if (delay > 0) {
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      } else {
        await handleItem(parsed);
        if (delay > 0) {
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      // 解析成功，清空缓冲区
      jsonBuffer = "";
      parsedAny = true;
      break;
    } catch {
      // 进入拆分逻辑
    }

    // 2. 尝试处理拼接 JSON 对象：如 {...}{...}
    const safeText = remainingBuffer.replace(/}\s*{/g, "}\n{");
    const parts = safeText.split("\n");
    let lastValidIndex = -1;

    for (let i = 0; i < parts.length; i++) {
      const trimmed = parts[i].trim();
      if (!trimmed) continue;

      try {
        const json = JSON.parse(trimmed);
        await handleItem(json);
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        parsedAny = true;
        // 记录最后一个有效解析的位置
        lastValidIndex = safeText.indexOf(parts[i]) + parts[i].length;
      } catch {
        // 忽略无法解析的部分
        break;
      }
    }

    if (lastValidIndex > -1) {
      // 更新剩余缓冲区内容
      remainingBuffer = remainingBuffer.slice(lastValidIndex);
      jsonBuffer = remainingBuffer;
    } else {
      // 没有解析出有效 JSON，保留缓冲区等待下次拼接
      break;
    }
  }

  // 3. fallback：如果所有都失败了，保留缓冲区内容等待下次拼接
  if (!parsedAny) {
    parsedAny = false;
    jsonBuffer = "";
  }
}

export class ChunkProcessor {
  constructor(handleChunk) {
    this.handleChunk = handleChunk;
    this.queue = Promise.resolve();
  }

  enqueue(text) {
    this.queue = this.queue.then(() => this._process(text));
    return this.queue;
  }

  async _process(text) {
    await parseJsonChunks(
      text,
      async (item) => {
        this.handleChunk(item);
      },
      0
    );
  }
}
