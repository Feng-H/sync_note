# 音视频文字同步记录

一个功能强大的音频记录应用，支持边播放录音边输入文字，并实现时间戳同步功能。采用 Obsidian 风格的 Markdown 编辑器，支持双向链接。

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

### 方式一：Docker 部署（推荐）⭐

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

### 方式二：本地开发部署

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

### 基本操作

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

- **音频文件**：`server/uploads/`
- **Markdown 文件**：`server/markdown-files/`（自动生成）
- **数据库**：`server/database.json`（包含用户和项目信息）

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

## 许可证

MIT License

---

*由 Kiro 开发*
