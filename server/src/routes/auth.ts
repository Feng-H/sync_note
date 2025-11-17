import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = 'your-secret-key-change-in-production';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = db.findUserByUsername(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, isAdmin: user.is_admin },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    username: user.username,
    isAdmin: user.is_admin,
    mustChangePassword: user.must_change_password,
  });
});

// 修改密码
router.post('/change-password', authenticateToken, (req: any, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: '旧密码和新密码不能为空' });
  }

  const user = db.findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(401).json({ error: '旧密码错误' });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  db.updateUserPassword(req.user.userId, hashedPassword, false);

  res.json({ message: '密码修改成功' });
});

// 获取所有用户（仅管理员）
router.get('/users', authenticateToken, (req: any, res) => {
  const user = db.findUserById(req.user.userId);
  if (!user || !user.is_admin) {
    return res.status(403).json({ error: '无权限' });
  }

  const users = db.getAllUsers();
  res.json(users);
});

// 创建用户（仅管理员）
router.post('/users', authenticateToken, (req: any, res) => {
  const user = db.findUserById(req.user.userId);
  if (!user || !user.is_admin) {
    return res.status(403).json({ error: '无权限' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const existingUser = db.findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: '用户名已存在' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = db.createUser(username, hashedPassword, false);

  res.json({ message: '用户创建成功', userId: newUser.id });
});

// 删除用户（仅管理员）
router.delete('/users/:id', authenticateToken, (req: any, res) => {
  const user = db.findUserById(req.user.userId);
  if (!user || !user.is_admin) {
    return res.status(403).json({ error: '无权限' });
  }

  const targetUserId = parseInt(req.params.id);
  if (targetUserId === req.user.userId) {
    return res.status(400).json({ error: '不能删除自己' });
  }

  const success = db.deleteUser(targetUserId);
  if (!success) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json({ message: '用户删除成功' });
});

export default router;
