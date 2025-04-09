# UE5 + WebSocket 连接案例

## 项目概述
本项目演示了如何使用Vue.js前端与Unreal Engine 5通过WebSocket进行实时通信。项目包含一个简单的聊天界面，可以发送消息和颜色指令到UE5应用。

## 技术栈
- 前端: Vue 3 + Vite
- WebSocket: 原生WebSocket API
- 部署平台: Vercel

## 本地开发环境搭建
1. 确保已安装Node.js (建议版本16+)和pnpm
2. 克隆本项目
3. 安装依赖:
```bash
pnpm install
```
4. 启动开发服务器:
```bash
pnpm dev
```
```

## 部署指南

### Vercel部署
1. 注册Vercel账号(https://vercel.com)
2. 安装Vercel CLI:
```bash
npm install -g vercel
```
3. 登录Vercel:
```bash
vercel login
```
4. 在项目根目录执行部署:
```bash
vercel
```
5. 按照提示完成部署:
   - 选择项目目录
   - 选择默认配置
   - 部署完成后会获得生产环境URL

### Docker部署
1. 确保已安装Docker
2. 构建Docker镜像:
```bash
docker build -t vue-ws-app .
```
3. 运行容器:
```bash
docker run -d -p 8080:80 --name vue-ws-container vue-ws-app
```
4. 访问应用:
   - 打开浏览器访问 http://localhost:8080
```

## 环境变量配置
在Vercel中需要配置以下环境变量:
- `VITE_WS_URL`: WebSocket服务器地址

## 常见问题
Q: 部署后WebSocket连接失败
A: 确保WebSocket服务器已正确部署，且Vercel环境变量配置正确

Q: 本地运行时无法连接
A: 检查WebSocket服务器是否运行，端口是否被占用

## 项目结构
```
├── src/
│   ├── assets/                       # 静态资源
│   │   └── vue.svg
│   ├── components/                   # 组件
│   │   ├── ColorButtons.vue          # 颜色按钮组件
│   │   ├── MessageInput.vue          # 消息输入组件
│   │   ├── MessageList.vue           # 消息列表组件
│   │   └── StatusIndicator.vue       # 状态指示器组件
│   ├── hooks/                        # 自定义Hook
│   │   └── useChat.js                # 聊天相关Hook
│   ├── pages/                        # 页面
│   │   └── Chat.vue                  # 聊天页面
│   ├── App.vue                       # 根组件
│   └── main.js                       # 应用入口
├── vite.config.js                    # Vite配置
├── nginx.conf                        # Nginx配置
└── Dockerfile                        # Docker配置
```
