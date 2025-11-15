# AI Demo 后端服务

这是一个为 AI Demo 小程序提供的 Node.js 后端服务。

## 安装依赖

```bash
cd server
npm install
```

## 启动服务

### 方式一：普通启动

```bash
npm start
```

### 方式二：开发模式（自动重启）

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 上运行。

## API 接口列表

### 1. 测试接口

- **URL**: `GET /api/test`
- **说明**: 测试服务器是否正常运行
- **返回示例**:

```json
{
  "code": 200,
  "message": "服务器连接成功",
  "data": {
    "timestamp": 1699999999999,
    "server": "Node.js Server"
  }
}
```

### 2. AI 聊天接口

- **URL**: `POST /api/chat`
- **参数**:
  - `message` (必需): 用户发送的消息
  - `userId` (可选): 用户 ID
- **返回示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "reply": "AI 的回复内容",
    "timestamp": 1699999999999,
    "userId": "guest"
  }
}
```

### 3. 获取用户信息

- **URL**: `GET /api/user/:id`
- **说明**: 根据用户 ID 获取用户信息
- **返回示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "123",
    "name": "用户123",
    "avatar": "https://via.placeholder.com/150",
    "createTime": 1699999999999
  }
}
```

### 4. 数据提交接口

- **URL**: `POST /api/submit`
- **说明**: 提交任意数据
- **返回示例**:

```json
{
  "code": 200,
  "message": "数据提交成功",
  "data": {
    "received": {},
    "processTime": 1699999999999
  }
}
```

### 5. 列表数据接口

- **URL**: `GET /api/list`
- **参数**:
  - `page`: 页码（默认 1）
  - `pageSize`: 每页数量（默认 10）
- **返回示例**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "list": [],
    "page": 1,
    "pageSize": 10,
    "total": 100
  }
}
```

## 在小程序中调用

### 示例 1: GET 请求

```javascript
uni.request({
  url: "http://localhost:3000/api/test",
  method: "GET",
  success: (res) => {
    console.log("请求成功:", res.data);
  },
  fail: (err) => {
    console.error("请求失败:", err);
  },
});
```

### 示例 2: POST 请求

```javascript
uni.request({
  url: "http://localhost:3000/api/chat",
  method: "POST",
  data: {
    message: "你好",
    userId: "123",
  },
  success: (res) => {
    console.log("回复:", res.data);
  },
  fail: (err) => {
    console.error("请求失败:", err);
  },
});
```

### 示例 3: 带参数的 GET 请求

```javascript
uni.request({
  url: "http://localhost:3000/api/list",
  method: "GET",
  data: {
    page: 1,
    pageSize: 20,
  },
  success: (res) => {
    console.log("列表数据:", res.data);
  },
});
```

## 注意事项

1. **开发环境配置**: 小程序开发时需要在微信开发者工具中勾选"不校验合法域名"
2. **生产环境**: 正式上线需要配置 HTTPS 域名并在微信公众平台配置服务器域名
3. **端口占用**: 默认使用 3000 端口，如需修改请编辑 `index.js` 中的 `PORT` 变量
4. **跨域配置**: 已配置 CORS，允许小程序跨域请求

## 扩展功能

### 添加数据库

可以集成 MongoDB、MySQL 等数据库：

```bash
npm install mongoose  # MongoDB
# 或
npm install mysql2    # MySQL
```

### 添加文件上传

集成 multer 中间件：

```bash
npm install multer
```

### 添加认证功能

集成 JWT 认证：

```bash
npm install jsonwebtoken
```

## 目录结构建议

```
server/
├── index.js           # 主入口文件
├── package.json       # 项目配置
├── README.md         # 说明文档
├── config/           # 配置文件
├── controllers/      # 控制器
├── models/           # 数据模型
├── routes/           # 路由
└── middleware/       # 中间件
```
