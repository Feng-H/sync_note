#!/bin/bash

echo "🧹 清理项目文件..."
echo ""

# 清理构建产物
echo "1️⃣ 清理构建产物..."
rm -rf dist/
rm -rf dist-electron/
rm -rf server/dist/
echo "   ✅ 已清理 dist/, dist-electron/, server/dist/"

# 清理 node_modules
echo ""
echo "2️⃣ 清理 node_modules..."
read -p "   是否清理 node_modules？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf node_modules/
    rm -rf server/node_modules/
    echo "   ✅ 已清理 node_modules"
else
    echo "   ⏭️  跳过 node_modules"
fi

# 清理开发数据
echo ""
echo "3️⃣ 清理开发数据..."
read -p "   是否清理开发数据（database.json, uploads/, markdown-files/）？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f server/database.json
    rm -rf server/uploads/
    rm -rf server/markdown-files/
    rm -rf data/
    echo "   ✅ 已清理开发数据"
else
    echo "   ⏭️  跳过开发数据"
fi

# 清理临时文件
echo ""
echo "4️⃣ 清理临时文件..."
find . -name ".DS_Store" -delete
find . -name "*.log" -delete
find . -name "*.tmp" -delete
echo "   ✅ 已清理临时文件"

echo ""
echo "===================="
echo "✨ 清理完成！"
echo ""
echo "💡 提示："
echo "   - 如果清理了 node_modules，需要重新运行 npm install"
echo "   - 如果清理了开发数据，需要重新初始化数据库"
