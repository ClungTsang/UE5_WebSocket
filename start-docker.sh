#!/bin/bash

# 构建Docker镜像
docker build -t chat-app .

# 停止并删除旧容器（如果存在）
docker stop chat-app || true
docker rm chat-app || true

# 运行新容器并映射8080端口
docker run -d --name chat-app -p 8080:8080 chat-app

echo "容器已启动，访问 http://localhost:8080 查看应用"