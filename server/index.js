const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// ============ API 路由 ============

// AI 聊天接口示例
app.post("/api/chat", (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.json({
      code: 400,
      message: "消息不能为空",
      data: null,
    });
  }

  // 这里可以接入真实的 AI 服务，现在模拟返回
  setTimeout(() => {
    res.json({
      code: 200,
      message: "成功",
      data: {
        delta: `你说的是："${message}"，这是服务器的回复`,
        timestamp: Date.now(),
        role: "ai",
        userId: userId || "guest",
      },
    });
  }, 500);
});

// 获取用户信息接口示例
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;

  res.json({
    code: 200,
    message: "成功",
    data: {
      id: userId,
      name: `用户${userId}`,
      avatar: "https://via.placeholder.com/150",
      createTime: Date.now(),
    },
  });
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
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`✓ 服务器启动成功！`);
  console.log(`✓ 运行地址: http://localhost:${PORT}`);
});
