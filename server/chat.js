/*
 * @Author: Lmy
 * @LastEditors: Lmy
 * @Date: 2025-12-02 09:47:48
 * @LastEditTime: 2025-12-02 14:17:04
 * @FilePath: \miniProgram-ai\server\chat.js
 * @Description: 聊天接口
 */
import fetch from "node-fetch";
import readline from "readline";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "data", "messages.json");

const KEY = process.env.GEMINI_API_KEY; // 替换为你的有效Key
const URL = process.env.URL;

export const chatStream = async (messages, res) => {
  console.log(messages);
  const body = {
    model: "lite", // 示例，可换 spark-v3、spark-max、deepseek-r1 等
    user: "",
    messages: [messages],
    stream: true,
  };
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify(body),
  });

  const rl = readline.createInterface({
    input: response.body, // Node.js Readable
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    line = line.trim();
    if (line.startsWith("data:")) {
      const jsonStr = line.replace(/^data:\s*/, "");
      if (jsonStr === "[DONE]") return;
      try {
        const data = JSON.parse(jsonStr);
        console.log(data.choices[0].delta);
        if (data.choices[0].delta.content) {
          res.write(JSON.stringify(data.choices[0].delta));
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  });
  rl.on("close", () => {
    console.log("✅ 流处理完成");
    res.end();
  });
};

export const saveMessage = async (messages, res) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.push({ ...messages });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ success: true });
};

export const getMessage = async (params, res) => {
  const { page, pageSize } = params;
  const data = JSON.parse(fs.readFileSync(filePath, "utf8")).reverse();
  const total = data.length;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = data.slice(startIndex, endIndex);
  res.json({ list, total, hasMore: endIndex < total });
};
