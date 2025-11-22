#!/bin/bash

echo "🧪 测试后端服务器..."
echo ""

# 测试服务器是否在运行
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ 服务器正在运行"
    echo ""
    
    # 测试 API
    echo "📡 测试 API 端点..."
    
    # 测试登录
    response=$(curl -s -X POST http://localhost:3001/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"admin123"}')
    
    if echo "$response" | grep -q "token"; then
        echo "✅ 登录 API 正常"
    else
        echo "❌ 登录 API 失败"
        echo "响应: $response"
    fi
else
    echo "❌ 服务器未运行"
    echo ""
    echo "请检查："
    echo "  1. 应用是否已启动"
    echo "  2. 端口 3001 是否被占用: lsof -i :3001"
    echo "  3. 查看应用日志"
fi
