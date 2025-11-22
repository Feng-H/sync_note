# 音频转录助手

一个功能强大的音频记录应用，支持边播放录音边输入文字，并实现时间戳同步功能。采用 Obsidian 风格的 Markdown 编辑器，支持双向链接。

**✨ 现已支持 macOS 原生应用！**

## 功能特性

### 核心功能
- **用户认证系统**：支持用户登录，数据隔离存储
- **项目管理**：创建、查看、删除多个音频项目
- **音频上传与播放**：支持上传各种格式的音频文件，提供播放/暂停控制
- **实时文字记录**：在播放音频的同时，使用 Markdown 编辑器记录内容
- **自动保存**：文字内容自动保存到数据库和 markdown 文件（1秒防抖）

### Obsidian 风格编辑器
- **暗色主题**：仿照 Obsidian 的专业暗色界面
- **双向链接**：支持 `[[文件名]]` 和 `[[文件名#标题]]` 语法
- **智能推荐**：
  - 输入 `[[` 自动推荐文件列表
  - 输入 `[[文件名#` 自动推荐文件内的标题
  - 支持模糊搜索和分词匹配
  - 最多显示 5 个最相关结果
- **自动补全**：输入 `[[` 自动补全为 `[[]]`
- **实时预览**：左右分栏，实时渲染 Markdown 效果

### 时间戳与跳转
- **时间戳同步**：自动记录每段文字输入时的音频播放时间点
- **智能跳转**：点击预览区的任意文字，音频自动跳转到该文字记录时的时间点（提前5秒）

### 快捷键控制
- 点击播放器区域后，使用 **← 键**快退 10 秒
- 点击播放器区域后，使用 **→ 键**快进 10 秒
- 编辑器中使用 **Tab 键**插入缩进
- 推荐列表中使用 **↑ ↓ 键**选择，**Enter/Tab** 确认，**Esc** 取消

### 用户管理（仅管理员）
- **创建用户**：管理员可以创建新用户
- **强制修改密码**：新用户首次登录必须修改密码
- **用户列表**：查看所有用户及其状态
- **删除用户**：管理员可以删除普通用户

## 使用场景

- 会议记录
- 采访整理
- 课程笔记
- 播客内容记录
- 音频内容转写
- 知识库构建（配合双链功能）

## 快速开始

### 方式一：macOS 应用（最简单）⭐⭐⭐

**适用于：** macOS 用户（Apple Silicon）

#### 下载安装

1. **下载安装包**
   - 从 `dist-electron/` 目录获取 `音频转录助手-1.0.0-arm64.dmg`
   - 或下载 Release 中的 DMG 文件

2. **安装应用**
   ```bash
   # 双击 DMG 文件，拖动到 Applications 文件夹
   ```

3. **首次运行**
   ```bash
   # 如果提示"无法打开"，运行以下命令：
   xattr -cr /Applications/音频转录助手.app
   
   # 或在"系统偏好设置 > 安全性与隐私"中点击"仍要打开"
   ```

4. **开始使用**
   - 默认账号：`admin` / `admin123`
   - 首次登录后建议修改密码

#### 数据存储位置

所有数据存储在本地，完全私密：

```
~/Library/Application Support/audio-transcription-app/
├── database.json          # 数据库
├── uploads/              # 音频文件
└── markdown-files/       # Markdown 文档
```

**快速访问：**
```bash
# 打开数据目录
open ~/Library/Application\ Support/audio-transcription-app
```

**备份数据：**
```bash
# 备份到桌面
cp -r ~/Library/Application\ Support/audio-transcription-app ~/Desktop/音频转录助手备份-$(date +%Y%m%d)
```

---

### 方式二：Docker 部署（服务器）⭐⭐

**前提条件：**
- 安装 Docker 和 Docker Compose

#### 一键启动（最简单）

```bash
git clone <repository-url>
cd audio-transcription-app
./start.sh
```

启动脚本会自动：
- 创建数据目录
- 初始化数据库
- 创建环境变量文件
- 启动 Docker 容器

#### 手动启动

1. **克隆项目**
```bash
git clone <repository-url>
cd audio-transcription-app
```

2. **配置环境变量（可选）**
```bash
cp .env.example .env
# 编辑 .env 文件，修改 JWT_SECRET
```

3. **启动服务**
```bash
docker-compose up -d
```

4. **访问应用**
- 前端：http://localhost:8080
- 后端 API：http://localhost:3001

5. **查看日志**
```bash
docker-compose logs -f
```

6. **停止服务**
```bash
docker-compose down
```

#### 数据持久化

所有数据都存储在 `./data/` 目录下（映射到宿主机）：
- `./data/uploads/` - 音频文件
- `./data/markdown-files/` - Markdown 文件
- `./data/db/` - 数据库文件

即使删除容器，数据也不会丢失。

### 方式三：本地开发部署

**前提条件：**
- Node.js 18 或更高版本

**步骤：**

1. **克隆项目**
```bash
git clone <repository-url>
cd audio-transcription-app
```

2. **初始化数据库**
```bash
cd server
cp database.example.json database.json
cd ..
```

3. **安装依赖**
```bash
# 前端依赖
npm install

# 后端依赖
cd server
npm install
cd ..
```

4. **启动服务**

启动后端（终端1）：
```bash
cd server
npm run dev
```

启动前端（终端2）：
```bash
npm run dev
```

5. **访问应用**
- 前端：http://localhost:5173
- 后端 API：http://localhost:3001

### 默认管理员账号

- 用户名：`admin`
- 密码：`admin123`

⚠️ **首次部署后请立即修改密码！**

## 使用说明

### macOS 应用使用指南

#### 1. 启动应用
- 在 Applications 文件夹中找到"音频转录助手"
- 双击启动
- 首次运行可能需要在"安全性与隐私"中允许

#### 2. 登录
- 默认账号：`admin`
- 默认密码：`admin123`
- **重要：** 首次登录后请立即修改密码

#### 3. 创建项目
1. 点击"新建项目"
2. 点击"上传录音文件"
3. 选择音频文件（支持 MP3、WAV、M4A 等格式）
4. 在对话框中输入项目名称
5. 点击"确定"

#### 4. 播放和编辑
- **播放控制**：
  - 点击"▶ 播放"开始播放
  - 点击"⏸ 暂停"暂停播放
  - 拖动进度条跳转
  - 使用播放速度选择器（0.5x - 2x）
  
- **键盘快捷键**：
  - `空格键`：播放/暂停（需先点击播放器区域）
  - `← 键`：后退 10 秒
  - `→ 键`：前进 10 秒
  - `Ctrl+T`：插入当前时间戳
  - `Ctrl+S`：手动保存
  - `Ctrl+Enter`：在当前行下插入新行
  - `Ctrl+D`：复制当前行
  - `Ctrl+/`：注释/取消注释当前行

#### 5. 编辑器功能
- **Markdown 支持**：
  - 使用 `#` 创建标题
  - 使用 `**粗体**` 和 `*斜体*`
  - 使用 `- ` 创建列表
  - 使用 `> ` 创建引用

- **双向链接**：
  - 输入 `[[` 查看可引用的文件
  - 输入 `[[文件名#` 查看文件内的标题
  - 选择后自动插入链接

- **时间戳同步**：
  - 编辑时自动记录当前播放时间
  - 点击预览区的任意文字，音频跳转到对应时间点

#### 6. 演示模式
- 点击"🎬 演示模式"打开演示窗口
- 演示窗口只显示项目名称和预览内容
- 适合投影或分享
- 编辑内容会实时同步到演示窗口

#### 7. 保存和退出
- 内容自动保存（1秒防抖）
- 按 `Ctrl+S` 手动保存
- 直接关闭应用，数据不会丢失

#### 8. 管理项目
- 点击"← 返回项目列表"查看所有项目
- 点击项目卡片打开项目
- 点击"删除"按钮删除项目

### 浏览器版本使用指南

#### 基本操作

1. **登录**：使用 admin 账号登录
2. **创建项目**：点击"新建项目"，上传音频文件
3. **记录内容**：
   - 点击"播放"开始播放音频
   - 在左侧编辑器输入内容（支持 Markdown）
   - 内容会自动保存
4. **使用双链**：
   - 输入 `[[` 查看可引用的文件
   - 输入 `[[文件名#` 查看文件内的标题
   - 选择后自动插入链接
5. **时间跳转**：点击右侧预览区的任意文字，音频跳转到对应时间点

### 用户管理

1. 点击"用户管理"进入用户管理界面
2. 点击"创建用户"添加新用户
3. 新用户首次登录时会被要求修改密码
4. 所有用户都可以在项目列表页面点击"修改密码"

### 双链引用示例

```markdown
# 我的笔记

参考 [[bible#Gen 1:1]] 的内容...

详见 [[另一个文件]] 的说明。

## 相关链接
- [[文件A#第一章]]
- [[文件B#重要概念]]
```

## 技术栈

### 前端
- **React 18**：UI 框架
- **TypeScript**：类型安全
- **Vite**：构建工具
- **react-markdown**：Markdown 渲染

### 后端
- **Node.js**：运行环境
- **Express**：Web 框架
- **JSON 文件存储**：轻量级数据存储
- **JWT**：用户认证
- **bcrypt**：密码加密
- **multer**：文件上传

## 项目结构

```
audio-transcription-app/
├── src/                      # 前端源码
│   ├── components/          # React 组件
│   │   ├── ObsidianEditor.tsx    # Obsidian 风格编辑器
│   │   ├── AudioPlayer.tsx       # 音频播放器
│   │   ├── ProjectList.tsx       # 项目列表
│   │   ├── Login.tsx             # 登录组件
│   │   ├── UserManagement.tsx    # 用户管理
│   │   └── ChangePasswordModal.tsx # 修改密码
│   ├── styles/              # 样式文件
│   ├── api.ts               # API 接口
│   ├── types.ts             # TypeScript 类型
│   └── App.tsx              # 主应用
├── server/                   # 后端源码
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── middleware/      # 中间件
│   │   ├── db.ts            # 数据库操作
│   │   └── index.ts         # 服务器入口
│   ├── uploads/             # 音频文件存储（不提交）
│   ├── markdown-files/      # Markdown 文件存储（不提交）
│   ├── database.json        # 数据库文件（不提交）
│   └── database.example.json # 示例数据库
├── README.md
└── package.json
```

## 数据存储

### macOS 应用
所有数据存储在用户目录，完全私密：

```
~/Library/Application Support/audio-transcription-app/
├── database.json          # 数据库（用户、项目信息）
├── uploads/              # 音频文件
└── markdown-files/       # Markdown 文档
```

**访问数据：**
```bash
# 打开数据目录
open ~/Library/Application\ Support/audio-transcription-app

# 查看音频文件
ls -lh ~/Library/Application\ Support/audio-transcription-app/uploads/

# 备份数据
cp -r ~/Library/Application\ Support/audio-transcription-app ~/Desktop/备份
```

### 浏览器/Docker 版本
- **音频文件**：`server/uploads/` 或 `./data/uploads/`
- **Markdown 文件**：`server/markdown-files/` 或 `./data/markdown-files/`
- **数据库**：`server/database.json` 或 `./data/db/database.json`

所有用户数据都存储在本地，不会上传到云端。

## Docker 部署详细说明

### 构建镜像
```bash
docker-compose build
```

### 启动服务
```bash
# 后台运行
docker-compose up -d

# 前台运行（查看日志）
docker-compose up
```

### 管理容器
```bash
# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 停止并删除容器和数据卷（⚠️ 会删除所有数据）
docker-compose down -v
```

### 数据备份
```bash
# 备份数据目录
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# 恢复数据
tar -xzf backup-20231117.tar.gz
```

### 更新应用
```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

### 故障排查

#### 运行诊断工具
```bash
./docker-test.sh
```

#### 常见问题

**构建失败：**
```bash
# 清理旧的构建缓存
docker-compose down
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

**端口被占用：**
```bash
# 检查端口占用
lsof -i :8080
lsof -i :3001

# 修改 docker-compose.yml 中的端口映射
```

**查看详细日志：**
```bash
# 查看构建日志
docker-compose build

# 查看运行日志
docker-compose logs -f app

# 进入容器调试
docker-compose exec app sh
```

**数据权限问题：**
```bash
# 修复数据目录权限
chmod -R 755 data/
```

## 开发说明

### 本地构建生产版本

**前端：**
```bash
npm run build
```

**后端：**
```bash
cd server
npm run build
npm start
```

### 环境变量

创建 `.env` 文件配置环境变量：
```bash
cp .env.example .env
```

可配置项：
```
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

## 注意事项

1. **数据备份**：定期备份 `server/database.json`、`server/uploads/` 和 `server/markdown-files/` 目录
2. **密码安全**：首次部署后建议立即修改 admin 密码
3. **文件大小**：大型音频文件可能需要较长上传时间
4. **浏览器兼容**：建议使用 Chrome、Firefox 或 Edge 最新版本

## 常见问题

### Docker 相关

**Q: Docker 容器无法启动？**  
A: 检查端口是否被占用（8080, 3001），或查看日志 `docker-compose logs`。

**Q: 数据存储在哪里？**  
A: 所有数据存储在 `./data/` 目录，映射到容器外部，删除容器不会丢失数据。

**Q: 如何修改端口？**  
A: 编辑 `docker-compose.yml` 中的 `ports` 配置，例如改为 `"9090:80"`。

**Q: 如何备份数据？**  
A: 直接备份 `./data/` 目录即可，包含所有用户数据和文件。

### 应用相关

**Q: 忘记密码怎么办？**  
A: 
- Docker 部署：删除 `./data/db/database.json`，重启容器会自动创建新数据库
- 本地部署：删除 `server/database.json`，复制 `database.example.json`

**Q: 如何添加更多 Markdown 文件供引用？**  
A: 
- Docker 部署：将 `.md` 文件放入 `./data/markdown-files/` 目录
- 本地部署：将 `.md` 文件放入 `server/markdown-files/` 目录

**Q: 双链推荐很慢？**  
A: 大文件（如 bible.md）会影响搜索速度，后端已优化为实时搜索，限制返回 5 个结果。

**Q: 如何在多台设备间同步？**  
A: 
- 使用 Docker：将 `./data/` 目录同步到其他设备
- 使用 Git：同步代码，手动同步数据目录
- 使用网络存储：将 `./data/` 目录挂载到 NAS 或云存储

**Q: 上传大文件失败？**  
A: 检查 nginx 配置中的 `client_max_body_size`，默认为 500M。

## 更新日志

### v1.0.0 (2025-11-17)
- ✨ 初始版本发布
- ✨ Obsidian 风格编辑器
- ✨ 双向链接支持
- ✨ 智能推荐系统
- ✨ 用户认证和管理
- ✨ 时间戳同步和跳转
- ✨ 自动保存功能

## macOS 应用打包（Electron）

### 前提条件

- macOS 系统（Apple Silicon 或 Intel）
- Node.js 18+
- 已完成上述"本地开发部署"的步骤

### 安装 Electron 依赖

**推荐方式（使用国内镜像）：**

```bash
# 安装依赖（使用淘宝镜像）
npm install --save-dev electron electron-builder concurrently wait-on cross-env --registry=https://registry.npmmirror.com

# 配置 Electron 镜像（创建 .npmrc 文件）
cat > .npmrc << EOF
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
EOF

# 重新安装 electron 以使用镜像
npm install electron --save-dev
```

**或使用代理方式：**

```bash
export https_proxy=http://127.0.0.1:7897
export http_proxy=http://127.0.0.1:7897
export all_proxy=socks5://127.0.0.1:7897
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

**关于警告信息：**
安装过程中可能出现 `deprecated` 警告，这些是依赖包的警告，不影响使用，可以忽略。

### 开发模式

#### 方式 A：浏览器开发（推荐，和之前一样）

```bash
# 终端 1：启动后端
cd server
npm run dev

# 终端 2：启动前端
npm run dev

# 浏览器访问 http://localhost:5173
```

#### 方式 B：Electron 开发

```bash
# 一条命令启动（会自动启动前端和 Electron）
npm run electron:dev
```

这会：
1. 启动 Vite 开发服务器（http://localhost:5173）
2. 等待服务器就绪
3. 启动 Electron 窗口
4. 自动启动后端服务器

### 打包成 macOS 应用

#### 1. 准备应用图标（可选）

```bash
# 如果有 1024x1024 的 PNG 图标
# 1. 访问 https://cloudconvert.com/png-to-icns
# 2. 转换为 .icns 格式
# 3. 保存到 build/icon.icns

# 如果没有图标，会使用 Electron 默认图标
```

#### 2. 构建前端和后端

```bash
# 构建前端
npm run build

# 构建后端
cd server
npm run build
cd ..
```

#### 3. 打包应用

```bash
# 打包 Apple Silicon 版本（推荐，跳过公证）
npx electron-builder --mac --arm64 --config.mac.notarize=false

# 或使用 npm 脚本
npm run electron:build:mac

# 或打包所有配置的版本
npm run electron:build
```

**注意：** 如果没有 Apple Developer 账号，需要添加 `--config.mac.notarize=false` 跳过公证。

打包过程需要 5-10 分钟，完成后会在 `dist-electron/` 目录生成：
- **音频转录助手.app** - 可直接运行的应用
- **音频转录助手-1.0.0-arm64.dmg** - 可分发的安装包
- **音频转录助手-1.0.0-arm64-mac.zip** - 压缩包

#### 4. 运行打包后的应用

```bash
# 方式 1：直接打开
open dist-electron/mac-arm64/音频转录助手.app

# 方式 2：安装 DMG
open dist-electron/音频转录助手-1.0.0-arm64.dmg
# 然后拖动到 Applications 文件夹
```

### 打包后的应用特性

✅ **独立运行** - 不需要安装 Node.js
✅ **数据本地** - 所有数据存储在 `~/Library/Application Support/音频转录助手/`
✅ **离线使用** - 无需网络连接
✅ **原生体验** - macOS 原生窗口和菜单
✅ **自动启动服务器** - 内置后端服务器，自动启动

### 文件结构说明

```
项目根目录/
├── electron/                 # Electron 配置（新增）
│   ├── main.cjs             # 主进程（使用 .cjs 支持 CommonJS）
│   └── preload.cjs          # 预加载脚本
├── build/                    # 打包资源（新增）
│   ├── icon.icns            # 应用图标
│   └── entitlements.mac.plist # macOS 权限配置
├── dist-electron/            # 打包输出（新增）
│   ├── 音频转录助手.app
│   └── 音频转录助手-1.0.0-arm64.dmg
├── electron-builder.json     # 打包配置（新增）
└── ... (其他文件保持不变)
```

### 开发流程建议

**日常开发新功能：**
```bash
# 使用浏览器开发（和之前一样）
cd server && npm run dev  # 终端 1
npm run dev               # 终端 2
```

**测试 Electron 版本：**
```bash
npm run electron:dev
```

**准备发布：**
```bash
npm run electron:build:mac
```

### 常见问题

**Q: 打包后的应用无法打开？**  
A: macOS 可能阻止未签名的应用。解决方法：
```bash
# 移除隔离属性
xattr -cr dist-electron/mac-arm64/音频转录助手.app

# 或在"系统偏好设置 > 安全性与隐私"中允许
```

**Q: 如何签名和公证应用？**  
A: 需要 Apple Developer 账号（$99/年）：
1. 在 Apple Developer 网站创建证书
2. 在 `electron-builder.json` 中配置签名信息
3. 运行打包命令时会自动签名和公证

**Q: 打包后的应用数据存储在哪里？**  
A: 
- 数据库：`~/Library/Application Support/音频转录助手/database.json`
- 音频文件：`~/Library/Application Support/音频转录助手/uploads/`
- Markdown：`~/Library/Application Support/音频转录助手/markdown-files/`

**Q: 如何更新应用？**  
A: 
- 手动：重新打包并替换旧版本
- 自动：可以集成 electron-updater（需要额外配置）

**Q: 打包后的应用很大？**  
A: 正常现象，包含了：
- Electron 运行时（~80MB）
- Node.js 运行时
- 你的应用代码
- 所有依赖包

总大小约 100-150MB。

**Q: 可以打包 Intel 版本吗？**  
A: 可以，修改 `electron-builder.json`：
```json
"arch": ["arm64", "x64"]  // 同时打包两个架构
```

**Q: 原有的开发流程会受影响吗？**  
A: 完全不会！所有原有命令都保持不变：
- `npm run dev` - 继续使用
- `cd server && npm run dev` - 继续使用
- Docker 部署 - 继续使用

Electron 只是新增的选项，不影响现有工作流程。

### 分发应用

#### 分发文件
打包完成后，在 `dist-electron/` 目录中有：
- **音频转录助手-1.0.0-arm64.dmg** (110 MB) - 推荐分发
- **音频转录助手-1.0.0-arm64-mac.zip** (107 MB) - 备选

#### 给其他人使用

**安装说明（提供给用户）：**

1. **下载并安装**
   - 双击 `音频转录助手-1.0.0-arm64.dmg`
   - 拖动"音频转录助手"到"Applications"文件夹

2. **首次运行**
   - 打开"应用程序"，找到"音频转录助手"
   - 右键点击，选择"打开"
   - 在弹出的对话框中点击"打开"
   
   或使用命令行：
   ```bash
   xattr -cr /Applications/音频转录助手.app
   ```

3. **开始使用**
   - 默认账号：`admin` / `admin123`
   - 建议首次登录后修改密码

#### 系统要求
- macOS 11.0 或更高版本
- Apple Silicon (M1/M2/M3) 芯片
- 约 200 MB 可用磁盘空间

#### 注意事项
- ⚠️ 应用未签名，会有安全警告（正常现象）
- ✅ 所有数据存储在本地，完全私密
- ✅ 无需网络连接，离线可用
- ✅ 无需安装 Node.js 或其他依赖

## 许可证

MIT License

---

*由 Kiro 开发*
