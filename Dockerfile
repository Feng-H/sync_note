# 使用 Node.js 18 Alpine 作为基础镜像
FROM node:18-alpine

# 安装必要的工具
RUN apk add --no-cache nginx bash

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY package*.json ./
COPY server/package*.json ./server/

# 安装所有依赖（包括 devDependencies，用于构建）
RUN npm ci
RUN cd server && npm ci

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 构建后端
RUN cd server && npm run build

# 清理 devDependencies，只保留生产依赖
RUN npm prune --production
RUN cd server && npm prune --production

# 创建数据目录
RUN mkdir -p /app/data/uploads /app/data/markdown-files /app/data/db

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

# 启动
ENTRYPOINT ["/entrypoint.sh"]
