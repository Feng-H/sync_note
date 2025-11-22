# 🎉 打包成功！

## 生成的文件

打包已完成，生成的文件位于 `dist-electron/` 目录：

```
dist-electron/
├── mac-arm64/
│   └── 音频转录助手.app          # 可直接运行的应用（117 MB）
├── 音频转录助手-1.0.0-arm64.dmg   # 安装包（121 MB）⭐ 推荐分发
└── 音频转录助手-1.0.0-arm64-mac.zip  # 压缩包（117 MB）
```

## 快速测试

### 方式 1：直接运行 .app
```bash
open dist-electron/mac-arm64/音频转录助手.app
```

### 方式 2：安装 DMG
```bash
open dist-electron/音频转录助手-1.0.0-arm64.dmg
```
然后拖动到 Applications 文件夹。

## 首次运行

由于应用未签名，macOS 可能会阻止运行。解决方法：

### 方法 1：移除隔离属性（推荐）
```bash
xattr -cr dist-electron/mac-arm64/音频转录助手.app
```

### 方法 2：系统设置
1. 尝试打开应用
2. 系统提示"无法打开"
3. 打开"系统偏好设置 > 安全性与隐私"
4. 点击"仍要打开"

## 应用特性

✅ **独立运行** - 不需要安装 Node.js
✅ **数据本地** - 所有数据存储在本地
✅ **离线使用** - 无需网络连接
✅ **自动启动服务器** - 内置后端，自动启动

## 数据存储位置

应用数据存储在：
```
~/Library/Application Support/音频转录助手/
├── database.json          # 数据库
├── uploads/              # 音频文件
└── markdown-files/       # Markdown 文件
```

## 备份数据

```bash
# 备份
cp -r ~/Library/Application\ Support/音频转录助手 ~/Desktop/backup-$(date +%Y%m%d)

# 恢复
cp -r ~/Desktop/backup-20231122 ~/Library/Application\ Support/音频转录助手
```

## 分发给其他人

### 推荐方式：分享 DMG 文件
```bash
# 1. 分享这个文件
dist-electron/音频转录助手-1.0.0-arm64.dmg

# 2. 告诉用户：
#    - 双击 DMG 文件
#    - 拖动应用到 Applications 文件夹
#    - 首次打开可能需要在"安全性与隐私"中允许
```

### 使用说明（给用户）

**安装步骤：**
1. 双击 `音频转录助手-1.0.0-arm64.dmg`
2. 拖动"音频转录助手"到"Applications"文件夹
3. 打开"应用程序"，找到"音频转录助手"
4. 右键点击，选择"打开"（首次需要）
5. 在弹出的对话框中点击"打开"

**首次运行：**
- 默认管理员账号：`admin` / `admin123`
- 建议首次登录后立即修改密码

## 已知限制

⚠️ **未签名** - 应用未经过 Apple 签名和公证
⚠️ **仅 Apple Silicon** - 当前版本仅支持 M1/M2/M3 芯片
⚠️ **安全警告** - 首次运行会有安全提示

## 如果需要签名

需要 Apple Developer 账号（$99/年）：

1. 在 Apple Developer 网站创建证书
2. 修改 `electron-builder.json`：
```json
{
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)",
    "hardenedRuntime": true
  }
}
```
3. 重新打包（会自动签名和公证）

## 打包 Intel 版本

如果需要支持 Intel Mac：

```bash
# 打包 Intel 版本
npx electron-builder --mac --x64 --config.mac.notarize=false

# 或同时打包两个版本
npx electron-builder --mac --config.mac.notarize=false
```

## 更新应用

当有新版本时：

```bash
# 1. 更新代码
git pull

# 2. 安装依赖
npm install

# 3. 重新打包
npm run build
cd server && npm run build && cd ..
npx electron-builder --mac --arm64 --config.mac.notarize=false

# 4. 新的安装包在 dist-electron/ 目录
```

## 问题排查

### 应用无法打开
```bash
# 检查隔离属性
xattr -l dist-electron/mac-arm64/音频转录助手.app

# 移除隔离
xattr -cr dist-electron/mac-arm64/音频转录助手.app
```

### 数据丢失
检查数据目录：
```bash
ls -la ~/Library/Application\ Support/音频转录助手/
```

### 重置应用
```bash
# 删除应用数据（会清空所有项目）
rm -rf ~/Library/Application\ Support/音频转录助手/
```

## 技术细节

- **Electron 版本**: 39.2.3
- **Node.js**: 内置
- **架构**: arm64 (Apple Silicon)
- **包大小**: ~120 MB
- **打包工具**: electron-builder 26.0.12

## 下一步

- [ ] 测试应用功能
- [ ] 准备应用图标（可选）
- [ ] 考虑购买 Apple Developer 账号进行签名
- [ ] 准备用户文档
- [ ] 分发给测试用户

---

**恭喜！你的应用已成功打包为 macOS 原生应用！** 🎊
