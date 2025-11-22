# 发布清单

## 📦 发布文件

### 主要文件
- **音频转录助手-1.0.0-arm64.dmg** (110 MB) - macOS 安装包 ⭐ 推荐
- **音频转录助手-1.0.0-arm64-mac.zip** (107 MB) - 压缩包

### 位置
```
dist-electron/
├── 音频转录助手-1.0.0-arm64.dmg
└── 音频转录助手-1.0.0-arm64-mac.zip
```

## 📋 发布前检查清单

- [x] 应用可以正常启动
- [x] 登录功能正常
- [x] 可以上传音频文件
- [x] 可以播放音频
- [x] 可以编辑和保存内容
- [x] 数据持久化正常
- [x] 演示模式正常
- [x] 所有快捷键正常工作

## 🚀 发布步骤

### 1. 准备发布文件
```bash
# 确保已生成 DMG
ls -lh dist-electron/*.dmg

# 如果没有，运行打包命令
npm run build
cd server && npm run build && cd ..
npx electron-builder --mac --arm64 --config.mac.notarize=false
```

### 2. 测试安装包
```bash
# 打开 DMG 测试
open dist-electron/音频转录助手-1.0.0-arm64.dmg

# 测试安装和运行
```

### 3. 准备发布说明

**版本：** 1.0.0  
**日期：** 2024-11-22  
**平台：** macOS (Apple Silicon)

**新功能：**
- ✨ 音频播放和文字同步记录
- ✨ Obsidian 风格 Markdown 编辑器
- ✨ 双向链接支持
- ✨ 智能时间戳跳转
- ✨ 演示模式
- ✨ 多种快捷键支持
- ✨ 播放速度控制

**系统要求：**
- macOS 11.0+
- Apple Silicon (M1/M2/M3)

**安装说明：**
1. 下载 DMG 文件
2. 双击打开
3. 拖动到 Applications 文件夹
4. 首次运行右键选择"打开"

**默认账号：**
- 用户名：admin
- 密码：admin123

### 4. 上传到 GitHub Releases

```bash
# 1. 创建 Git tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 2. 在 GitHub 上创建 Release
# 3. 上传 DMG 文件
# 4. 添加发布说明
```

### 5. 分发渠道

**选项 A：GitHub Releases**
- 上传到 GitHub Releases
- 用户可以直接下载

**选项 B：直接分享**
- 通过网盘分享 DMG 文件
- 提供安装说明

**选项 C：自建下载页面**
- 创建简单的下载页面
- 提供安装指南

## 📝 用户安装指南（复制给用户）

### 音频转录助手 - 安装指南

**系统要求：**
- macOS 11.0 或更高版本
- Apple Silicon (M1/M2/M3) 芯片

**安装步骤：**

1. 下载 `音频转录助手-1.0.0-arm64.dmg`

2. 双击 DMG 文件打开

3. 拖动"音频转录助手"到"Applications"文件夹

4. 打开"应用程序"，找到"音频转录助手"

5. **首次运行**（重要）：
   - 右键点击应用
   - 选择"打开"
   - 在弹出的对话框中点击"打开"
   
   或使用终端：
   ```bash
   xattr -cr /Applications/音频转录助手.app
   ```

6. 使用默认账号登录：
   - 用户名：`admin`
   - 密码：`admin123`
   - 建议首次登录后立即修改密码

**数据存储：**
所有数据存储在本地：
```
~/Library/Application Support/audio-transcription-app/
```

**备份数据：**
```bash
cp -r ~/Library/Application\ Support/audio-transcription-app ~/Desktop/备份
```

**卸载应用：**
1. 删除应用：拖动到废纸篓
2. 删除数据（可选）：
   ```bash
   rm -rf ~/Library/Application\ Support/audio-transcription-app
   ```

**常见问题：**

Q: 为什么提示"应用已损坏"？  
A: 这是因为应用未签名。请按照上述"首次运行"步骤操作。

Q: 数据会上传到云端吗？  
A: 不会。所有数据都存储在本地，完全私密。

Q: 如何更新应用？  
A: 下载新版本，覆盖安装即可。数据会保留。

---

**需要帮助？** 查看完整文档：README.md

## 🔄 更新应用

当有新版本时：

1. 修改代码
2. 更新版本号（package.json）
3. 重新构建和打包
4. 发布新版本

```bash
# 更新版本号
npm version patch  # 1.0.0 -> 1.0.1
# 或
npm version minor  # 1.0.0 -> 1.1.0

# 重新打包
npm run build
cd server && npm run build && cd ..
npx electron-builder --mac --arm64 --config.mac.notarize=false
```

## 📊 文件大小说明

- **DMG 安装包**：~110 MB
- **ZIP 压缩包**：~107 MB
- **安装后大小**：~120 MB

包含：
- Electron 运行时 (~80 MB)
- Node.js 运行时
- 应用代码和依赖
- 服务器代码和依赖

## ✅ 发布完成

恭喜！你的应用已准备好发布！🎊

**下一步：**
- [ ] 测试安装包
- [ ] 准备用户文档
- [ ] 发布到 GitHub Releases
- [ ] 收集用户反馈
- [ ] 计划下一个版本
