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

### 1. 克隆项目
```bash
git clone <repository-url>
cd audio-transcription-app
```

### 2. 初始化数据库
```bash
cd server
cp database.example.json database.json
```

### 3. 安装依赖

**前端依赖：**
```bash
npm install
```

**后端依赖：**
```bash
cd server
npm install
cd ..
```

### 4. 启动服务

**启动后端服务器：**
```bash
cd server
npm run dev
```
后端服务器将运行在 http://localhost:3001

**启动前端开发服务器（新终端）：**
```bash
npm run dev
```
前端应用将运行在 http://localhost:5173

### 5. 登录使用

打开浏览器访问 http://localhost:5173

**默认管理员账号：**
- 用户名：`admin`
- 密码：`admin123`

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

## 开发说明

### 构建生产版本

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

可以创建 `.env` 文件配置环境变量（可选）：
```
PORT=3001
JWT_SECRET=your-secret-key
```

## 注意事项

1. **数据备份**：定期备份 `server/database.json`、`server/uploads/` 和 `server/markdown-files/` 目录
2. **密码安全**：首次部署后建议立即修改 admin 密码
3. **文件大小**：大型音频文件可能需要较长上传时间
4. **浏览器兼容**：建议使用 Chrome、Firefox 或 Edge 最新版本

## 常见问题

**Q: 忘记密码怎么办？**  
A: 删除 `server/database.json`，复制 `database.example.json` 重新开始，或手动编辑数据库文件。

**Q: 如何添加更多 Markdown 文件供引用？**  
A: 将 `.md` 文件放入 `server/markdown-files/` 目录即可。

**Q: 双链推荐很慢？**  
A: 大文件（如 bible.md）会影响搜索速度，后端已优化为实时搜索，限制返回 5 个结果。

**Q: 如何在多台设备间同步？**  
A: 可以使用 Git 同步代码，但需要手动同步 `server/database.json`、`uploads/` 和 `markdown-files/` 目录。

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
