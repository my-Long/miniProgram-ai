import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import os from "os";
import { chatStream, saveMessage, getMessage } from "./chat.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      // 筛选条件：IPv4协议、非内部地址、非回环地址
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        iface.address !== "127.0.0.1"
      ) {
        return iface.address;
      }
    }
  }
  return "0.0.0.0"; // 如果没有找到，则返回默认值
}
const LOCAL_IP = getLocalIP(); // 获取本机IP

// ============ API 路由 ============

// 流式聊天
app.post("/api/chat/stream", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "message参数必填" });
    }
    await chatStream(messages, res);
  } catch (error) {
    console.error("API错误:", error);
  }
});

// 保存数据
app.post("/api/chat/saveMessage", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "message参数必填" });
    }
    await saveMessage(messages, res);
  } catch (error) {
    console.error("API错误:", error);
  }
});

// 获取数据
app.post("/api/chat/getMessage", async (req, res) => {
  try {
    const { userId, page, pageSize } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId参数必填" });
    }
    await getMessage({ userId, page, pageSize }, res);
  } catch (error) {
    console.error("API错误:", error);
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: "接口不存在",
    data: null,
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error("服务器错误:", err);
  res.status(500).json({
    code: 500,
    message: "服务器内部错误",
    data: null,
  });
});

// 启动服务器
app.listen(PORT, "0.0.0.0", () => {
  console.log("===============================");
  console.log(`✓ 本地访问: http://localhost:${PORT}`);
  console.log(`✓ 网络访问: http://${LOCAL_IP}:${PORT}`); // 替换为真实IP
});
