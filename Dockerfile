# 使用Node.js官方镜像作为构建环境
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建生产版本
RUN npm run build

# 使用Nginx作为生产环境
FROM nginx:stable-alpine

# 复制Nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建好的文件
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露8080端口
EXPOSE 8080

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]