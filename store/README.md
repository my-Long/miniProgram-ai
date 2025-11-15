# Pinia Store 使用指南

这个项目使用了 **组合式 API（Composition API）** 风格的 Pinia store。

## 📁 Store 文件结构

```
store/
├── index.js       # 统一导出所有 store
├── system.js      # 系统配置 Store
├── chat.js        # 聊天消息 Store
└── user.js        # 用户信息 Store
```

## 🚀 快速开始

### 1. 在 main.js 中配置 Pinia

```javascript
import { createSSRApp } from "vue";
import { createPinia } from "pinia";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  app.use(pinia);

  return { app };
}
```

### 2. 在组件中使用 Store

#### 方式一：使用 `<script setup>`（推荐）

```vue
<script setup>
import { computed } from "vue";
import { useSystemStore } from "@/store";

const systemStore = useSystemStore();

// 直接访问状态
console.log(systemStore.baseUrl);

// 使用计算属性确保响应式
const apiUrl = computed(() => systemStore.apiUrl);

// 调用方法
const changeUrl = () => {
  systemStore.setBaseUrl("http://192.168.1.100:3000");
};
</script>

<template>
  <view>
    <text>{{ systemStore.baseUrl }}</text>
    <button @click="changeUrl">修改 URL</button>
  </view>
</template>
```

#### 方式二：使用选项式 API

```vue
<script>
import { useSystemStore } from "@/store";

export default {
  computed: {
    systemStore() {
      return useSystemStore();
    },
    baseUrl() {
      return this.systemStore.baseUrl;
    },
  },
  methods: {
    changeUrl() {
      this.systemStore.setBaseUrl("http://192.168.1.100:3000");
    },
  },
};
</script>
```

## 📚 Store 详细说明

### 1. System Store（系统配置）

**文件**: `store/system.js`

**状态**:

- `baseUrl`: 后端服务器地址
- `appName`: 应用名称
- `version`: 应用版本

**计算属性**:

- `apiUrl`: 完整的 API 地址
- `appInfo`: 应用信息字符串

**方法**:

- `setBaseUrl(url)`: 设置服务器地址
- `updateAppInfo(name, ver)`: 更新应用信息
- `resetConfig()`: 重置所有配置

**使用示例**:

```javascript
import { useSystemStore } from "@/store";

const systemStore = useSystemStore();

// 获取状态
console.log(systemStore.baseUrl); // 'http://localhost:3000'
console.log(systemStore.apiUrl); // 'http://localhost:3000/api'

// 修改状态
systemStore.setBaseUrl("http://192.168.1.100:3000");

// 重置配置
systemStore.resetConfig();
```

### 2. Chat Store（聊天消息）

**文件**: `store/chat.js`

**状态**:

- `messages`: 消息列表数组
- `currentMessage`: 当前输入的消息
- `isLoading`: 是否正在加载
- `userId`: 用户 ID

**计算属性**:

- `messageCount`: 消息数量
- `hasMessages`: 是否有消息
- `lastMessage`: 最后一条消息

**方法**:

- `addMessage(message, type)`: 添加消息
- `clearMessages()`: 清空所有消息
- `setCurrentMessage(message)`: 设置当前消息
- `setLoading(loading)`: 设置加载状态
- `setUserId(id)`: 设置用户 ID
- `removeMessage(messageId)`: 删除指定消息

**使用示例**:

```javascript
import { useChatStore } from "@/store";

const chatStore = useChatStore();

// 添加用户消息
chatStore.addMessage("你好", "user");

// 添加 AI 回复
chatStore.addMessage("你好！有什么可以帮助你的吗？", "ai");

// 获取消息列表
console.log(chatStore.messages);
console.log(chatStore.messageCount); // 2

// 清空消息
chatStore.clearMessages();
```

### 3. User Store（用户信息）

**文件**: `store/user.js`

**状态**:

- `userInfo`: 用户信息对象
  - `id`: 用户 ID
  - `name`: 用户名
  - `avatar`: 头像
  - `email`: 邮箱
- `token`: 登录令牌
- `isLoggedIn`: 是否已登录

**计算属性**:

- `userName`: 用户名（未登录显示"游客"）
- `userAvatar`: 用户头像（有默认值）
- `hasToken`: 是否有 token

**方法**:

- `setUserInfo(info)`: 设置用户信息
- `setToken(token)`: 设置 token
- `login(userData, token)`: 登录
- `logout()`: 退出登录
- `updateProfile(updates)`: 更新用户资料

**使用示例**:

```javascript
import { useUserStore } from "@/store";

const userStore = useUserStore();

// 登录
userStore.login(
  {
    id: "123",
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "https://xxx.com/avatar.jpg",
  },
  "token-123456"
);

// 检查登录状态
console.log(userStore.isLoggedIn); // true
console.log(userStore.userName); // '张三'

// 更新资料
userStore.updateProfile({ name: "李四" });

// 退出登录
userStore.logout();
```

## 🎯 组合式 Store 的优势

1. **更好的类型推导**: TypeScript 支持更好
2. **更灵活**: 可以自由组织代码结构
3. **更简洁**: 不需要 `this`，代码更清晰
4. **更易测试**: 函数式的结构更容易测试
5. **更好的代码复用**: 可以轻松抽取和复用逻辑

## 📝 组合式 vs 选项式对比

### 选项式写法（Options API）

```javascript
export const useSystemStore = defineStore("system", {
  state: () => ({
    baseUrl: "http://localhost:3000",
  }),
  getters: {
    apiUrl: (state) => `${state.baseUrl}/api`,
  },
  actions: {
    setBaseUrl(url) {
      this.baseUrl = url;
    },
  },
});
```

### 组合式写法（Composition API）✨

```javascript
export const useSystemStore = defineStore("system", () => {
  // 状态
  const baseUrl = ref("http://localhost:3000");

  // 计算属性
  const apiUrl = computed(() => `${baseUrl.value}/api`);

  // 方法
  const setBaseUrl = (url) => {
    baseUrl.value = url;
  };

  return {
    baseUrl,
    apiUrl,
    setBaseUrl,
  };
});
```

## 🔥 最佳实践

### 1. 使用 computed 包裹 store 状态

```vue
<script setup>
import { computed } from "vue";
import { useChatStore } from "@/store";

const chatStore = useChatStore();

// ✅ 好的做法 - 保证响应式
const messages = computed(() => chatStore.messages);

// ❌ 不好的做法 - 会失去响应式
const messages = chatStore.messages;
</script>
```

### 2. 统一导出 Store

```javascript
// store/index.js
export { useSystemStore } from "./system";
export { useChatStore } from "./chat";
export { useUserStore } from "./user";

// 使用时
import { useSystemStore, useChatStore } from "@/store";
```

### 3. 在 Store 中封装业务逻辑

```javascript
// store/chat.js
export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);

  // 封装发送消息的完整逻辑
  const sendMessage = async (content, baseUrl) => {
    // 添加用户消息
    addMessage(content, "user");

    try {
      // 调用 API
      const res = await uni.request({
        url: `${baseUrl}/api/chat`,
        method: "POST",
        data: { message: content },
      });

      // 添加 AI 回复
      addMessage(res.data.data.reply, "ai");
    } catch (error) {
      console.error("发送失败", error);
    }
  };

  return { messages, sendMessage };
});
```

## 💾 持久化存储

User Store 已经配置了持久化，数据会自动保存到本地存储：

```javascript
export const useUserStore = defineStore(
  "user",
  () => {
    // ... store 逻辑
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: "user",
          storage: {
            getItem: (key) => uni.getStorageSync(key),
            setItem: (key, value) => uni.setStorageSync(key, value),
            removeItem: (key) => uni.removeStorageSync(key),
          },
        },
      ],
    },
  }
);
```

## 🎮 完整示例

查看 `pages/store-demo/index.vue` 查看完整的使用示例。

## 📖 更多资源

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [uni-app 文档](https://uniapp.dcloud.net.cn/)
