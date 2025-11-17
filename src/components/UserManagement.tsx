import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface User {
  id: number;
  username: string;
  is_admin: boolean;
  must_change_password: boolean;
  created_at: string;
}

interface UserManagementProps {
  token: string;
  onBack: () => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ token, onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    try {
      await api.createUser(token, newUsername, newPassword);
      setNewUsername('');
      setNewPassword('');
      setShowCreateForm(false);
      loadUsers();
      alert('用户创建成功');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`确定删除用户 ${username}？`)) return;

    try {
      await api.deleteUser(token, userId);
      loadUsers();
      alert('用户删除成功');
    } catch (err) {
      alert('删除失败');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← 返回
        </button>
        <h2 style={styles.title}>用户管理</h2>
        <button onClick={() => setShowCreateForm(true)} style={styles.createButton}>
          创建用户
        </button>
      </div>

      {showCreateForm && (
        <div style={styles.createForm}>
          <h3>创建新用户</h3>
          <form onSubmit={handleCreateUser} style={styles.form}>
            <input
              type="text"
              placeholder="用户名"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="密码（至少6位）"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitButton}>
                创建
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setError('');
                }}
                style={styles.cancelButton}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.userList}>
        {users.map((user) => (
          <div key={user.id} style={styles.userItem}>
            <div>
              <div style={styles.username}>
                {user.username}
                {user.is_admin && <span style={styles.adminBadge}>管理员</span>}
              </div>
              <div style={styles.userInfo}>
                创建时间: {new Date(user.created_at).toLocaleString()}
                {user.must_change_password && <span style={styles.warningBadge}>需要修改密码</span>}
              </div>
            </div>
            {!user.is_admin && (
              <button onClick={() => handleDeleteUser(user.id, user.username)} style={styles.deleteButton}>
                删除
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  createForm: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  userItem: {
    padding: '15px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    marginBottom: '5px',
  },
  userInfo: {
    fontSize: '14px',
    color: '#666',
  },
  adminBadge: {
    marginLeft: '10px',
    padding: '2px 8px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '12px',
    borderRadius: '3px',
  },
  warningBadge: {
    marginLeft: '10px',
    padding: '2px 8px',
    backgroundColor: '#ffc107',
    color: '#333',
    fontSize: '12px',
    borderRadius: '3px',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};
