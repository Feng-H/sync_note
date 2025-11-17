# 多阶段构建 - 前端构建阶段
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# 复制前端依赖文件
COPY package*.json ./
RUN npm ci

# 复制前端源码
COPY . .

# 构建前端
RUN npm run build

# 后端构建阶段
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# 复制后端依赖文件
COPY server/package*.json ./
RUN npm ci

# 复制后端源码
COPY server/ ./

# 构建后端
RUN npm run build

# 生产运行阶段
FROM node:18-alpine

WORKDIR /app

# 安装 nginx 用于服务前端静态文件
RUN apk add --no-cache nginx

# 创建数据目录
RUN mkdir -p /app/data/uploads /app/data/markdown-files /app/data/db

# 复制后端构建产物和依赖
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package.json ./server/

# 复制前端构建产物
COPY --from=frontend-builder /app/dist ./frontend

# 复制示例数据库
COPY server/database.example.json /app/data/db/database.example.json

# 复制 nginx 配置
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# 复制启动脚本
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 暴露端口
EXPOSE 80 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 启动脚本
ENTRYPOINT ["/entrypoint.sh"]
