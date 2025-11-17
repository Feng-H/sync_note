const API_BASE = 'http://localhost:3001/api';

export const api = {
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('登录失败');
    return res.json();
  },

  changePassword: async (token: string, oldPassword: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    if (!res.ok) throw new Error('修改密码失败');
    return res.json();
  },

  getUsers: async (token: string) => {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('获取用户列表失败');
    return res.json();
  },

  createUser: async (token: string, username: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('创建用户失败');
    return res.json();
  },

  deleteUser: async (token: string, userId: number) => {
    const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('删除用户失败');
    return res.json();
  },

  getMarkdownFiles: async (token: string) => {
    const res = await fetch(`${API_BASE}/projects/markdown-files`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('获取文件列表失败');
    return res.json();
  },

  searchMarkdownHeadings: async (token: string, filename: string, query: string) => {
    const res = await fetch(`${API_BASE}/projects/markdown-files/${filename}/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('搜索标题失败');
    return res.json();
  },

  getProjects: async (token: string) => {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('获取项目列表失败');
    return res.json();
  },

  getProject: async (token: string, id: number) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('获取项目失败');
    return res.json();
  },

  createProject: async (token: string, title: string, audioFile: File) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('audio', audioFile);

    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error('创建项目失败');
    return res.json();
  },

  updateProject: async (token: string, id: number, content: string, timestamps: any[]) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, timestamps }),
    });
    if (!res.ok) throw new Error('保存失败');
    return res.json();
  },

  deleteProject: async (token: string, id: number) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('删除失败');
    return res.json();
  },
};
