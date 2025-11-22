import express from 'express';
import cors from 'cors';
import path from 'path';
import { initDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';

const app = express();
const PORT = 3001;

// 使用环境变量指定的数据目录，或使用当前目录
const DATA_DIR = process.env.USER_DATA_PATH || process.cwd();
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const MARKDOWN_DIR = path.join(DATA_DIR, 'markdown-files');

console.log('Server starting...');
console.log('Data directory:', DATA_DIR);
console.log('Uploads directory:', UPLOADS_DIR);
console.log('Markdown directory:', MARKDOWN_DIR);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/markdown-files', express.static(MARKDOWN_DIR));

initDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
