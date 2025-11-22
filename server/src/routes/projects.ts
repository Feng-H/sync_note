import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.js';
import db from '../db.js';

const router = express.Router();

// 使用环境变量指定的数据目录，或使用当前目录
const DATA_DIR = process.env.USER_DATA_PATH || process.cwd();
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const MARKDOWN_DIR = path.join(DATA_DIR, 'markdown-files');

// 确保目录存在
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 确保目录存在
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.use(authenticateToken);

// 获取所有 markdown 文件列表（只返回文件名，不返回标题）- 必须在 /:id 之前
router.get('/markdown-files', (req: any, res) => {
  try {
    if (!fs.existsSync(MARKDOWN_DIR)) {
      return res.json([]);
    }

    const files = fs.readdirSync(MARKDOWN_DIR);
    const markdownFiles = files
      .filter((f: string) => f.endsWith('.md'))
      .map((filename: string) => {
        const displayName = filename.replace(/\.md$/, '');
        return {
          filename: displayName,
          fullPath: filename,
        };
      });

    res.json(markdownFiles);
  } catch (error) {
    console.error('读取 markdown 文件失败:', error);
    res.status(500).json({ error: '读取文件失败' });
  }
});

// 搜索文件中的标题
router.get('/markdown-files/:filename/search', (req: any, res) => {
  try {
    const filename = req.params.filename + '.md';
    const query = (req.query.q as string || '').toLowerCase().trim();
    const filepath = path.join(MARKDOWN_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: '文件不存在' });
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    
    // 如果没有查询，返回前 5 个标题
    if (!query) {
      const headings: string[] = [];
      for (const line of lines) {
        if (headings.length >= 5) break;
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          headings.push(match[2].trim());
        }
      }
      return res.json(headings);
    }

    // 搜索匹配的标题
    const queryParts = query.split(/\s+/).filter(p => p.length > 0);
    const matches: Array<{ heading: string; score: number }> = [];

    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const heading = match[2].trim();
        const headingLower = heading.toLowerCase();

        // 检查是否所有查询部分都匹配
        const allMatch = queryParts.every(part => headingLower.includes(part));
        if (!allMatch) continue;

        // 计算匹配分数
        let score = 0;
        if (headingLower === query) score = 10000;
        else if (headingLower.startsWith(query)) score = 5000;
        else if (headingLower.includes(query)) score = 1000;
        else {
          score = 500;
          let lastIndex = -1;
          let inOrder = true;
          for (const part of queryParts) {
            const index = headingLower.indexOf(part, lastIndex + 1);
            if (index <= lastIndex) {
              inOrder = false;
              break;
            }
            lastIndex = index;
          }
          if (inOrder) score += 200;
        }

        score -= headingLower.length * 0.1;
        const firstMatchIndex = headingLower.indexOf(queryParts[0]);
        score -= firstMatchIndex * 0.5;

        matches.push({ heading, score });

        // 限制最多找 50 个匹配，然后排序取前 5
        if (matches.length >= 50) break;
      }
    }

    // 排序并返回前 5 个
    matches.sort((a, b) => b.score - a.score);
    const results = matches.slice(0, 5).map(m => m.heading);

    res.json(results);
  } catch (error) {
    console.error('搜索标题失败:', error);
    res.status(500).json({ error: '搜索失败' });
  }
});

router.get('/', (req: any, res) => {
  const projects = db.findProjectsByUserId(req.user.userId);
  res.json(projects);
});

router.get('/:id', (req: any, res) => {
  const project = db.findProjectById(parseInt(req.params.id), req.user.userId);
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  res.json(project);
});

router.post('/', upload.single('audio'), (req: any, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请上传音频文件' });
  }

  const { title } = req.body;
  const project = db.createProject(req.user.userId, title || '未命名项目', req.file.filename);

  res.json({ id: project.id, message: '项目创建成功' });
});

router.put('/:id', (req: any, res) => {
  const { content, timestamps } = req.body;
  const timestampsJson = JSON.stringify(timestamps || []);

  const success = db.updateProject(parseInt(req.params.id), req.user.userId, content, timestampsJson);

  if (!success) {
    return res.status(404).json({ error: '项目不存在' });
  }

  res.json({ message: '保存成功' });
});

router.delete('/:id', (req: any, res) => {
  const success = db.deleteProject(parseInt(req.params.id), req.user.userId);

  if (!success) {
    return res.status(404).json({ error: '项目不存在' });
  }

  res.json({ message: '删除成功' });
});

export default router;
