#!/bin/bash

echo "🚀 音视频文字同步记录 - 快速启动脚本"
echo "========================================"

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：未检测到 Docker，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误：未检测到 Docker Compose，请先安装 Docker Compose"
    exit 1
fi

# 创建数据目录
echo "📁 创建数据目录..."
mkdir -p ./uploads ./markdown-files ./db

# 复制示例数据库（如果不存在）
if [ ! -f ./db/database.json ]; then
    echo "📝 初始化数据库..."
    cp server/database.example.json ./db/database.json
    echo "✅ 数据库初始化完成"
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "⚙️  创建环境变量文件..."
    cp .env.example .env
    echo "✅ 请编辑 .env 文件修改 JWT_SECRET"
fi

# 启动服务
echo "🐳 启动 Docker 容器..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ 服务启动成功！"
    echo ""
    echo "📱 访问地址："
    echo "   前端：http://localhost:8080"
    echo "   后端：http://localhost:3001"
    echo ""
    echo "👤 默认账号："
    echo "   用户名：admin"
    echo "   密码：admin123"
    echo ""
    echo "📊 查看日志："
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 停止服务："
    echo "   docker-compose down"
else
    echo ""
    echo "❌ 服务启动失败，请查看日志："
    echo "   docker-compose logs"
fi
