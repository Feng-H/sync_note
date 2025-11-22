# Electron 打包快速指南

## 🚀 快速开始

### 1. 安装依赖（首次）

**推荐方式（使用国内镜像）：**

```bash
# 安装依赖
npm install --save-dev electron electron-builder concurrently wait-on cross-env --registry=https://registry.npmmirror.com

# 配置镜像
cat > .npmrc << EOF
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
EOF

# 重新安装 electron
npm install electron --save-dev
```

**或使用代理：**

```bash
export https_proxy=http://127.0.0.1:7897
export http_proxy=http://127.0.0.1:7897
export all_proxy=socks5://127.0.0.1:7897
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

### 2. 开发模式

#### 选项 A：浏览器开发（推荐，和之前一样）
```bash
# 终端 1
cd server && npm run dev

# 终端 2
npm run dev

# 访问 http://localhost:5173
```

#### 选项 B：Electron 开发
```bash
npm run electron:dev
```

### 3. 打包应用

```bash
# 一键打包（推荐，跳过公证）
npx electron-builder --mac --arm64 --config.mac.notarize=false

# 或使用 npm 脚本
npm run electron:build:mac

# 输出：dist-electron/音频转录助手-1.0.0-arm64.dmg
```

## 📋 命令速查表

| 命令 | 说明 | 用途 |
|------|------|------|
| `npm run dev` | 启动前端开发服务器 | 浏览器开发 |
| `npm run build` | 构建前端生产版本 | 打包前准备 |
| `npm run electron:dev` | Electron 开发模式 | 测试桌面应用 |
| `npm run electron:build` | 打包所有平台 | 生产打包 |
| `npm run electron:build:mac` | 只打包 macOS (arm64) | 快速打包 |

## 📁 新增文件说明

```
项目/
├── electron/                    # Electron 配置
│   ├── main.cjs                # 主进程（窗口管理、服务器启动）
│   └── preload.cjs             # 预加载脚本（安全桥接）
├── build/                       # 打包资源
│   ├── icon.icns               # 应用图标（可选）
│   ├── entitlements.mac.plist  # macOS 权限配置
│   └── ICON_README.md          # 图标制作说明
├── dist-electron/               # 打包输出目录
│   ├── 音频转录助手.app         # macOS 应用
│   └── 音频转录助手-*.dmg       # 安装包
└── electron-builder.json        # 打包配置
```

## ⚙️ 配置文件说明

### electron/main.cjs
- 创建应用窗口
- 启动后端服务器
- 管理应用生命周期
- 使用 .cjs 扩展名以支持 CommonJS（因为项目使用 ES Module）

### electron-builder.json
- 应用 ID 和名称
- 打包目标平台
- 图标和资源配置

### package.json（新增部分）
```json
{
  "main": "electron/main.cjs",
  "scripts": {
    "electron:dev": "...",
    "electron:build": "...",
    "electron:build:mac": "..."
  }
}
```

**注意：** 使用 `.cjs` 扩展名是因为项目设置了 `"type": "module"`，Electron 文件需要使用 CommonJS 格式。

## 🎯 工作流程

### 日常开发
```bash
# 1. 启动后端
cd server && npm run dev

# 2. 启动前端
npm run dev

# 3. 浏览器访问 http://localhost:5173
```

### 测试 Electron 版本
```bash
npm run electron:dev
```

### 准备发布
```bash
# 1. 构建前端
npm run build

# 2. 构建后端
cd server && npm run build && cd ..

# 3. 打包应用
npm run electron:build:mac

# 4. 测试打包结果
open dist-electron/mac-arm64/音频转录助手.app
```

## 🔧 常见问题

### 1. 打包后无法打开？
```bash
# 移除隔离属性
xattr -cr dist-electron/mac-arm64/音频转录助手.app
```

### 2. 修改应用名称？
编辑 `electron-builder.json`：
```json
{
  "productName": "你的应用名称"
}
```

### 3. 修改应用图标？
1. 准备 1024x1024 PNG 图片
2. 转换为 .icns：https://cloudconvert.com/png-to-icns
3. 保存到 `build/icon.icns`

### 4. 打包 Intel 版本？
编辑 `electron-builder.json`：
```json
{
  "mac": {
    "target": [
      {
        "target": "dmg",
        "arch": ["arm64", "x64"]  // 添加 x64
      }
    ]
  }
}
```

### 5. 数据存储位置？
打包后的应用数据存储在：
```
~/Library/Application Support/音频转录助手/
├── database.json
├── uploads/
└── markdown-files/
```

### 6. 如何备份数据？
```bash
# 备份
cp -r ~/Library/Application\ Support/音频转录助手 ~/Desktop/backup

# 恢复
cp -r ~/Desktop/backup ~/Library/Application\ Support/音频转录助手
```

## 📦 打包输出说明

打包完成后，`dist-electron/` 目录包含：

```
dist-electron/
├── mac-arm64/
│   └── 音频转录助手.app          # 可直接运行
├── 音频转录助手-1.0.0-arm64.dmg   # 安装包（推荐分发）
└── 音频转录助手-1.0.0-arm64-mac.zip  # 压缩包
```

**分发建议：**
- 分享 `.dmg` 文件给用户
- 用户双击安装，拖到 Applications
- 首次打开可能需要在"系统偏好设置 > 安全性与隐私"中允许

## 🎨 自定义配置

### 修改窗口大小
编辑 `electron/main.cjs`：
```javascript
mainWindow = new BrowserWindow({
  width: 1600,  // 修改宽度
  height: 1000, // 修改高度
  // ...
});
```

### 修改应用 ID
编辑 `electron-builder.json`：
```json
{
  "appId": "com.yourcompany.yourapp"
}
```

### 添加应用菜单
在 `electron/main.cjs` 中添加：
```javascript
const { Menu } = require('electron');

const template = [
  {
    label: '文件',
    submenu: [
      { role: 'quit', label: '退出' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

## 🚢 发布流程

### 1. 更新版本号
编辑 `package.json`：
```json
{
  "version": "1.0.1"
}
```

### 2. 构建和打包
```bash
npm run electron:build:mac
```

### 3. 测试
```bash
open dist-electron/mac-arm64/音频转录助手.app
```

### 4. 分发
- 上传 `.dmg` 到 GitHub Releases
- 或通过其他方式分享给用户

## 💡 提示

- ✅ 原有开发流程完全不受影响
- ✅ 可以随时在浏览器和 Electron 之间切换
- ✅ 所有功能在两种模式下都能正常工作
- ✅ 打包是可选的，不影响日常开发

## 📚 更多资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-builder 文档](https://www.electron.build/)
- [图标转换工具](https://cloudconvert.com/png-to-icns)

---

**需要帮助？** 查看主 README.md 或提交 Issue。
