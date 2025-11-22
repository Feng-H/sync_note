# Electron 打包调试日志

## 当前状态（2024-11-22）

### ✅ 已完成
1. ✅ 安装 Electron 依赖（使用国内镜像）
2. ✅ 创建 Electron 配置文件（main.cjs, preload.cjs）
3. ✅ 配置打包脚本（electron-builder.json）
4. ✅ 修复 ES Module 错误（重命名为 .cjs）
5. ✅ 修复 Vite 路径问题（添加 `base: './'`）
6. ✅ 成功打包应用
7. ✅ 窗口可以显示

### ❌ 当前问题
**症状：** 窗口显示了，但页面内容没有正常加载

**已知信息：**
- 窗口可以打开（1400x900）
- 开发者工具已启用
- 之前的错误：CSS 和 JS 文件 404（已通过 `base: './'` 修复）
- 当前状态：需要查看最新的错误信息

### 🔍 需要检查的问题

#### 1. 前端资源加载
- [ ] CSS 文件是否正确加载
- [ ] JS 文件是否正确加载
- [ ] 是否有其他资源加载失败

#### 2. 后端服务器
- [ ] 服务器是否成功启动
- [ ] 端口 3001 是否可访问
- [ ] 数据库文件路径是否正确

#### 3. API 连接
- [ ] 前端是否能连接到后端 API
- [ ] CORS 配置是否正确
- [ ] API 请求是否成功

## 文件修改记录

### 已修改的文件

1. **vite.config.ts**
   ```typescript
   base: './', // 添加此行，使用相对路径
   ```

2. **electron/main.js → electron/main.cjs**
   - 重命名为 .cjs 支持 CommonJS
   - 添加详细日志
   - 添加开发者工具（生产环境）
   - 修改服务器路径为 `process.resourcesPath`

3. **electron/preload.js → electron/preload.cjs**
   - 重命名为 .cjs

4. **package.json**
   ```json
   {
     "main": "electron/main.cjs",
     "description": "音频转录助手 - 支持音频播放和文字同步记录",
     "author": "Your Name"
   }
   ```

5. **.npmrc** (新增)
   ```
   registry=https://registry.npmmirror.com
   electron_mirror=https://npmmirror.com/mirrors/electron/
   electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
   ```

### 创建的新文件

1. `electron/main.cjs` - Electron 主进程
2. `electron/preload.cjs` - 预加载脚本
3. `electron/main-simple.cjs` - 简化版本（测试用）
4. `electron-builder.json` - 打包配置
5. `build/entitlements.mac.plist` - macOS 权限
6. `build/ICON_README.md` - 图标说明
7. `.npmrc` - npm 镜像配置
8. `ELECTRON_GUIDE.md` - 快速指南
9. `PACKAGE_SUCCESS.md` - 打包说明
10. `TROUBLESHOOTING.md` - 问题排查
11. `test-app.sh` - 测试脚本
12. `test-server.sh` - 服务器测试脚本

## 调试步骤

### 明天继续时的检查清单

#### 步骤 1：查看开发者工具
```bash
# 打开应用（开发者工具会自动打开）
open dist-electron/mac-arm64/音频转录助手.app
```

在开发者工具中检查：
- **Console 标签**：查看 JavaScript 错误
- **Network 标签**：查看资源加载和 API 请求
- **Application 标签**：查看本地存储

#### 步骤 2：测试服务器
```bash
# 等待应用启动后，运行测试
./test-server.sh

# 或手动测试
curl http://localhost:3001
lsof -i :3001
```

#### 步骤 3：查看应用日志
```bash
# 从命令行启动查看日志
dist-electron/mac-arm64/音频转录助手.app/Contents/MacOS/音频转录助手
```

#### 步骤 4：检查文件结构
```bash
# 查看打包后的文件结构
ls -la dist-electron/mac-arm64/音频转录助手.app/Contents/Resources/app.asar
```

## 可能的问题和解决方案

### 问题 1：后端服务器未启动

**可能原因：**
- 服务器文件路径错误
- Node.js 无法执行 ES Module
- 数据库文件路径问题

**解决方案：**
1. 检查 `electron/main.cjs` 中的服务器路径
2. 确保 `server/dist/index.js` 存在
3. 考虑将服务器改为 CommonJS 格式

### 问题 2：API 连接失败

**可能原因：**
- 服务器未启动
- CORS 配置问题
- API 地址错误

**解决方案：**
1. 检查 `src/api.ts` 中的 API 地址
2. 确保使用 `http://localhost:3001`
3. 检查 CORS 配置

### 问题 3：数据库路径问题

**可能原因：**
- 打包后数据库路径不正确
- 没有写入权限

**解决方案：**
1. 修改 `server/src/db.ts` 使用用户数据目录
2. 使用 `app.getPath('userData')` 获取路径
3. 确保目录存在并有写入权限

## 下一步计划

### 优先级 1：修复页面加载
1. 查看开发者工具中的具体错误
2. 根据错误信息修复问题
3. 确保前端资源正确加载

### 优先级 2：修复后端服务器
1. 确保服务器正确启动
2. 修复数据库路径问题
3. 测试 API 连接

### 优先级 3：完善功能
1. 移除开发者工具（生产环境）
2. 添加应用图标
3. 优化启动速度
4. 添加错误处理

## 有用的命令

```bash
# 重新构建前端
npm run build

# 重新构建后端
cd server && npm run build && cd ..

# 快速打包（不生成 DMG）
npx electron-builder --mac --arm64 --config.mac.notarize=false --dir

# 完整打包
npx electron-builder --mac --arm64 --config.mac.notarize=false

# 移除隔离属性
xattr -cr dist-electron/mac-arm64/音频转录助手.app

# 打开应用
open dist-electron/mac-arm64/音频转录助手.app

# 从命令行启动（查看日志）
dist-electron/mac-arm64/音频转录助手.app/Contents/MacOS/音频转录助手

# 测试服务器
./test-server.sh

# 检查端口
lsof -i :3001

# 杀掉进程
pkill -f "音频转录助手"
```

## 参考资料

- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-builder 文档](https://www.electron.build/)
- [Vite Electron 配置](https://vitejs.dev/guide/build.html#public-base-path)

## 备注

- 所有原有开发流程不受影响
- 可以继续使用 `npm run dev` 进行浏览器开发
- Electron 配置是独立的，不影响现有功能
- 所有修改都有详细记录，可以回滚

---

## 最新更新（2024-11-22）

### ✅ 已修复的问题

1. **Vite 路径问题** - 添加 `base: './'` 使用相对路径
2. **服务器打包问题** - 使用 `asarUnpack` 解压服务器文件
3. **node_modules 过大** - 使用 afterPack 脚本在打包后安装依赖

### 最新配置

**vite.config.ts:**
```typescript
base: './', // 使用相对路径
```

**electron-builder.json:**
```json
{
  "asarUnpack": ["server/**/*"],
  "afterPack": "./scripts/after-pack.cjs"
}
```

**electron/main.cjs:**
- 服务器路径：`app.asar.unpacked/server/dist/index.js`
- 添加文件存在检查
- 详细日志输出

---

**最后更新：** 2024-11-22 上午
**状态：** ✅ 打包成功，等待测试
**下次任务：** 测试应用功能，如有问题查看开发者工具
