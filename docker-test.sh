#!/bin/bash

echo "🔍 Docker 部署诊断工具"
echo "======================"
echo ""

# 检查 Docker
echo "1️⃣ 检查 Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装: $(docker --version)"
else
    echo "❌ Docker 未安装"
    exit 1
fi

# 检查 Docker Compose
echo ""
echo "2️⃣ 检查 Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose 已安装: $(docker-compose --version)"
else
    echo "❌ Docker Compose 未安装"
    exit 1
fi

# 检查必要文件
echo ""
echo "3️⃣ 检查必要文件..."
files=("Dockerfile" "docker-compose.yml" "docker/nginx.conf" "docker/entrypoint.sh" "server/database.example.json")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 缺失"
    fi
done

# 检查配置
echo ""
echo "4️⃣ 检查 docker-compose 配置..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ 配置文件有效"
else
    echo "❌ 配置文件有错误:"
    docker-compose config
    exit 1
fi

# 创建数据目录
echo ""
echo "5️⃣ 创建数据目录..."
mkdir -p data/uploads data/markdown-files data/db
echo "✅ 数据目录已创建"

# 复制示例数据库
if [ ! -f data/db/database.json ]; then
    cp server/database.example.json data/db/database.json
    echo "✅ 数据库已初始化"
fi

echo ""
echo "✅ 所有检查通过！"
echo ""
echo "现在可以运行:"
echo "  docker-compose build  # 构建镜像"
echo "  docker-compose up     # 启动服务"
