import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const DB_FILE = 'database.json';

interface User {
  id: number;
  username: string;
  password: string;
  is_admin: boolean;
  must_change_password: boolean;
  created_at: string;
}

interface Project {
  id: number;
  user_id: number;
  title: string;
  audio_filename: string;
  content: string;
  timestamps: string;
  created_at: string;
  updated_at: string;
}

interface Database {
  users: User[];
  projects: Project[];
  nextUserId: number;
  nextProjectId: number;
}

let db: Database = {
  users: [],
  projects: [],
  nextUserId: 1,
  nextProjectId: 1,
};

function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(data);
  }
}

function saveDatabase() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function initDatabase() {
  loadDatabase();

  const adminExists = db.users.find((u) => u.username === 'admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.users.push({
      id: db.nextUserId++,
      username: 'admin',
      password: hashedPassword,
      is_admin: true,
      must_change_password: false,
      created_at: new Date().toISOString(),
    });
    saveDatabase();
    console.log('默认管理员账号已创建: admin / admin123');
  } else if (adminExists.is_admin === undefined) {
    // 迁移旧数据
    adminExists.is_admin = true;
    adminExists.must_change_password = false;
    saveDatabase();
  }

  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  if (!fs.existsSync('markdown-files')) {
    fs.mkdirSync('markdown-files');
  }
}

export const dbOperations = {
  // Users
  findUserByUsername(username: string): User | undefined {
    loadDatabase();
    return db.users.find((u) => u.username === username);
  },

  findUserById(id: number): User | undefined {
    loadDatabase();
    return db.users.find((u) => u.id === id);
  },

  getAllUsers(): User[] {
    loadDatabase();
    return db.users.map((u) => ({ ...u, password: '' })); // 不返回密码
  },

  createUser(username: string, password: string, isAdmin: boolean = false): User {
    loadDatabase();
    const user: User = {
      id: db.nextUserId++,
      username,
      password,
      is_admin: isAdmin,
      must_change_password: true,
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    saveDatabase();
    return user;
  },

  updateUserPassword(userId: number, newPassword: string, mustChange: boolean = false): boolean {
    loadDatabase();
    const user = db.users.find((u) => u.id === userId);
    if (!user) return false;

    user.password = newPassword;
    user.must_change_password = mustChange;
    saveDatabase();
    return true;
  },

  deleteUser(userId: number): boolean {
    loadDatabase();
    const index = db.users.findIndex((u) => u.id === userId);
    if (index === -1) return false;

    db.users.splice(index, 1);
    saveDatabase();
    return true;
  },

  // Projects
  findProjectsByUserId(userId: number): Project[] {
    loadDatabase();
    return db.projects.filter((p) => p.user_id === userId).sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },

  findProjectById(id: number, userId: number): Project | undefined {
    loadDatabase();
    return db.projects.find((p) => p.id === id && p.user_id === userId);
  },

  createProject(userId: number, title: string, audioFilename: string): Project {
    loadDatabase();
    const project: Project = {
      id: db.nextProjectId++,
      user_id: userId,
      title,
      audio_filename: audioFilename,
      content: '',
      timestamps: '[]',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.projects.push(project);
    saveDatabase();
    return project;
  },

  updateProject(id: number, userId: number, content: string, timestamps: string): boolean {
    loadDatabase();
    const project = db.projects.find((p) => p.id === id && p.user_id === userId);
    if (!project) return false;

    project.content = content;
    project.timestamps = timestamps;
    project.updated_at = new Date().toISOString();
    saveDatabase();

    // 保存为 markdown 文件
    const filename = `${userId}_${id}_${project.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.md`;
    const filepath = path.join('markdown-files', filename);
    fs.writeFileSync(filepath, content, 'utf-8');

    return true;
  },

  deleteProject(id: number, userId: number): boolean {
    loadDatabase();
    const index = db.projects.findIndex((p) => p.id === id && p.user_id === userId);
    if (index === -1) return false;

    const project = db.projects[index];
    db.projects.splice(index, 1);
    saveDatabase();

    // 删除对应的 markdown 文件
    const filename = `${userId}_${id}_${project.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.md`;
    const filepath = path.join('markdown-files', filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return true;
  },

  // Markdown 文件管理
  getMarkdownFiles(userId: number): string[] {
    if (!fs.existsSync('markdown-files')) {
      return [];
    }
    const files = fs.readdirSync('markdown-files');
    return files.filter((f) => f.startsWith(`${userId}_`) && f.endsWith('.md'));
  },
};

export default dbOperations;
