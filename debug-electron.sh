#!/bin/bash

echo "🔍 Electron 应用诊断"
echo "===================="
echo ""

# 1. 检查服务器
echo "1️⃣ 检查后端服务器..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ 服务器正在运行 (端口 3001)"
    
    # 测试 API
    echo ""
    echo "2️⃣ 测试 API..."
    response=$(curl -s http://localhost:3001)
    if [ $? -eq 0 ]; then
        echo "✅ API 可访问"
    else
        echo "❌ API 无法访问"
    fi
else
    echo "❌ 服务器未运行"
    echo "   请先启动应用"
    exit 1
fi

# 3. 检查数据目录
echo ""
echo "3️⃣ 检查数据目录..."
DATA_DIR=~/Library/Application\ Support/audio-transcription-app
if [ -d "$DATA_DIR" ]; then
    echo "✅ 数据目录存在: $DATA_DIR"
    
    # 检查子目录
    if [ -d "$DATA_DIR/uploads" ]; then
        file_count=$(ls -1 "$DATA_DIR/uploads" | wc -l)
        echo "   📁 uploads: $file_count 个文件"
    fi
    
    if [ -f "$DATA_DIR/database.json" ]; then
        echo "   📄 database.json 存在"
        project_count=$(grep -o '"id"' "$DATA_DIR/database.json" | wc -l)
        echo "   📊 项目数量: $((project_count / 2))"
    fi
else
    echo "❌ 数据目录不存在"
fi

# 4. 测试上传
echo ""
echo "4️⃣ 测试文件上传..."
echo "test" > /tmp/test-audio.mp3

# 先登录获取 token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ 登录成功"
    
    # 测试上传
    upload_result=$(curl -s -X POST http://localhost:3001/api/projects \
        -H "Authorization: Bearer $TOKEN" \
        -F "title=诊断测试" \
        -F "audio=@/tmp/test-audio.mp3")
    
    if echo "$upload_result" | grep -q "成功"; then
        echo "✅ 上传测试成功"
        echo "   响应: $upload_result"
    else
        echo "❌ 上传测试失败"
        echo "   响应: $upload_result"
    fi
else
    echo "❌ 登录失败"
fi

# 5. 检查应用进程
echo ""
echo "5️⃣ 检查应用进程..."
if ps aux | grep "音频转录助手" | grep -v grep > /dev/null; then
    echo "✅ 应用正在运行"
    process_count=$(ps aux | grep "音频转录助手" | grep -v grep | wc -l)
    echo "   进程数: $process_count"
else
    echo "❌ 应用未运行"
fi

echo ""
echo "===================="
echo "诊断完成"
echo ""
echo "💡 提示："
echo "   - 如果上传失败，请查看开发者工具的 Console 和 Network 标签"
echo "   - 数据位置: $DATA_DIR"
echo "   - 服务器端口: 3001"
