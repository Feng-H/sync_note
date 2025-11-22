#!/bin/bash

echo "🧪 测试打包后的应用..."
echo ""

APP_PATH="dist-electron/mac-arm64/音频转录助手.app"

if [ ! -d "$APP_PATH" ]; then
    echo "❌ 应用不存在: $APP_PATH"
    echo "请先运行打包命令："
    echo "  npx electron-builder --mac --arm64 --config.mac.notarize=false"
    exit 1
fi

echo "✅ 找到应用: $APP_PATH"
echo ""

# 检查隔离属性
echo "📋 检查隔离属性..."
if xattr -l "$APP_PATH" | grep -q "com.apple.quarantine"; then
    echo "⚠️  应用有隔离属性，正在移除..."
    xattr -cr "$APP_PATH"
    echo "✅ 隔离属性已移除"
else
    echo "✅ 无隔离属性"
fi
echo ""

# 显示应用信息
echo "📦 应用信息:"
echo "  大小: $(du -sh "$APP_PATH" | cut -f1)"
echo "  路径: $APP_PATH"
echo ""

# 询问是否启动
read -p "🚀 是否启动应用？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "启动应用..."
    open "$APP_PATH"
    echo "✅ 应用已启动"
    echo ""
    echo "💡 提示："
    echo "  - 默认账号: admin / admin123"
    echo "  - 数据位置: ~/Library/Application Support/音频转录助手/"
    echo "  - 如果无法打开，请在'系统偏好设置 > 安全性与隐私'中允许"
else
    echo "取消启动"
fi
