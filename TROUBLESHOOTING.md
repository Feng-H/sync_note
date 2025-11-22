# 问题排查指南

## 已解决的问题

### ✅ ES Module 错误

**问题：**
```
ReferenceError: require is not defined in ES module scope
```

**原因：**
项目 package.json 设置了 `"type": "module"`，但 Electron 文件使用了 CommonJS 语法（require）。

**解决方案：**
将 Electron 文件重命名为 `.cjs` 扩展名：
- `electron/main.js` → `electron/main.cjs`
- `electron/preload.js` → `electron/preload.cjs`

并更新 package.json：
```json
{
  "main": "electron/main.cjs"
}
```

**状态：** ✅ 已修复

---

## 常见问题

### 1. 应用无法打开

**症状：**
双击应用后没有反应，或提示"应用已损坏"。

**解决方案：**
```bash
# 移除隔离属性
xattr -cr dist-electron/mac-arm64/音频转录助手.app

# 然后重新打开
open dist-electron/mac-arm64/音频转录助手.app
```

**或者：**
1. 尝试打开应用
2. 打开"系统偏好设置 > 安全性与隐私"
3. 点击"仍要打开"

---

### 2. 打包失败 - 下载 Electron 超时

**症状：**
```
Get "https://github.com/electron/electron/releases/download/...": EOF
```

**解决方案：**
配置国内镜像，创建 `.npmrc` 文件：
```bash
cat > .npmrc << EOF
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
EOF

# 重新安装
npm install electron --save-dev
```

---

### 3. 打包失败 - 找不到 electron-builder

**症状：**
```
sh: electron-builder: command not found
```

**解决方案：**
```bash
# 使用 npx 运行
npx electron-builder --mac --arm64 --config.mac.notarize=false

# 或全局安装
npm install -g electron-builder
```

---

### 4. 应用启动后服务器无法连接

**症状：**
应用打开了，但无法加载内容，控制台显示网络错误。

**可能原因：**
- 后端服务器未正确启动
- 端口被占用

**解决方案：**
```bash
# 检查端口占用
lsof -i :3001

# 如果被占用，杀掉进程
kill -9 <PID>

# 重新打开应用
```

---

### 5. 数据丢失

**症状：**
之前的项目和数据都不见了。

**原因：**
打包后的应用数据存储位置不同。

**数据位置：**
- 开发环境：`server/database.json`
- 打包应用：`~/Library/Application Support/音频转录助手/database.json`

**迁移数据：**
```bash
# 从开发环境复制到打包应用
mkdir -p ~/Library/Application\ Support/音频转录助手
cp server/database.json ~/Library/Application\ Support/音频转录助手/
cp -r server/uploads ~/Library/Application\ Support/音频转录助手/
cp -r server/markdown-files ~/Library/Application\ Support/音频转录助手/
```

---

### 6. TypeScript 编译错误

**症状：**
```
error TS6133: 'xxx' is declared but its value is never read
```

**解决方案：**
删除未使用的变量或参数，或在 tsconfig.json 中禁用该检查：
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

---

### 7. 打包后应用很大

**症状：**
应用大小超过 100MB。

**原因：**
这是正常的，Electron 应用包含：
- Electron 运行时（~80MB）
- Node.js 运行时
- 你的应用代码
- 所有依赖包

**优化建议：**
- 使用 `electron-builder` 的压缩选项
- 移除不必要的依赖
- 考虑使用 Tauri（更小的包体积）

---

### 8. 开发模式无法启动

**症状：**
运行 `npm run electron:dev` 后报错。

**解决方案：**
```bash
# 确保前端服务器在运行
npm run dev

# 在另一个终端启动 Electron
npm run electron:dev

# 或分别启动
# 终端 1
npm run dev

# 终端 2（等待前端启动后）
npx electron .
```

---

### 9. 修改代码后需要重新打包吗？

**开发阶段：** 不需要
- 使用 `npm run dev` 开发
- 或使用 `npm run electron:dev` 在 Electron 中开发
- 代码会热重载

**发布阶段：** 需要
```bash
# 重新构建和打包
npm run build
cd server && npm run build && cd ..
npx electron-builder --mac --arm64 --config.mac.notarize=false
```

---

### 10. 如何查看应用日志？

**方法 1：开发模式**
```bash
npm run electron:dev
# 日志会显示在终端
```

**方法 2：打包应用**
```bash
# 打开控制台应用
open /Applications/Utilities/Console.app

# 搜索"音频转录助手"
```

**方法 3：命令行启动**
```bash
# 从命令行启动，查看输出
/Applications/音频转录助手.app/Contents/MacOS/音频转录助手
```

---

## 调试技巧

### 启用开发者工具

编辑 `electron/main.cjs`，添加：
```javascript
mainWindow.webContents.openDevTools();
```

### 查看后端日志

在 `electron/main.cjs` 中，服务器输出会打印到控制台：
```javascript
serverProcess.stdout.on('data', (data) => {
  console.log(`[Server] ${data}`);
});
```

### 重置应用状态

```bash
# 删除应用数据（会清空所有内容）
rm -rf ~/Library/Application\ Support/音频转录助手/

# 重新打开应用，会创建新的数据库
```

---

## 获取帮助

如果以上方法都无法解决问题：

1. 查看 `README.md` 完整文档
2. 查看 `ELECTRON_GUIDE.md` 快速指南
3. 查看 `PACKAGE_SUCCESS.md` 打包说明
4. 提交 Issue 并附上：
   - 错误信息
   - 操作步骤
   - 系统版本
   - 应用版本

---

**最后更新：** 2024-11-22
