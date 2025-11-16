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
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  const chunks = [
    '{"role": "ai", "delta": "你好，"}',
    '{"role": "ai", "delta": "这是模拟的"}',
    '{"role": "ai", "delta": "流式返回"}',
    '{"role": "ai", "delta": "数据。"}',
  ];
  const { message, userId } = req.body;

  if (!message) {
    return res.json({
      code: 400,
      message: "消息不能为空",
      data: null,
    });
  }

  let i = 0;
  const timer = setInterval(() => {
    if (i >= chunks.length) {
      // res.write("EOF"); // 自己约定的结束标记
      res.end();
      clearInterval(timer);
      return;
    }

    res.write(chunks[i]); // 单次发送一段
    i++;
  }, 300);
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
