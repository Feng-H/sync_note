#!/bin/sh
set -e

echo "🚀 启动音视频文字同步记录应用..."

# 初始化数据库（如果不存在）
if [ ! -f /app/data/db/database.json ]; then
    echo "📝 初始化数据库..."
    cp /app/data/db/database.example.json /app/data/db/database.json
    echo "✅ 数据库初始化完成"
else
    echo "✅ 数据库已存在"
fi

# 创建符号链接，让后端能访问数据目录
cd /app/server
ln -sf /app/data/uploads ./uploads
ln -sf /app/data/markdown-files ./markdown-files
ln -sf /app/data/db/database.json ./database.json

# 启动 nginx
echo "🌐 启动 Nginx..."
nginx

# 启动后端服务
echo "🔧 启动后端服务..."
cd /app/server
exec node dist/index.js
