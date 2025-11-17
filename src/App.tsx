import React, { useState, useRef, useEffect } from 'react';
import { Login } from './components/Login';
import { ProjectList } from './components/ProjectList';
import { AudioPlayer } from './components/AudioPlayer';
import { ObsidianEditor } from './components/ObsidianEditor';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { UserManagement } from './components/UserManagement';
import { TimestampedText, Project } from './types';
import { api } from './api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('isAdmin') === 'true');
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(false);
  const [view, setView] = useState<'list' | 'editor' | 'users'>('list');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [timestamps, setTimestamps] = useState<TimestampedText[]>([]);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const lastContentLengthRef = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const handleLogin = (newToken: string, newUsername: string, newIsAdmin: boolean, newMustChangePassword: boolean) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAdmin(newIsAdmin);
    setMustChangePassword(newMustChangePassword);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('isAdmin', String(newIsAdmin));
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setView('list');
  };

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
    setMustChangePassword(false);
  };

  const handleCreateNew = () => {
    setCurrentProject(null);
    setAudioFile(null);
    setAudioUrl(null);
    setContent('');
    setTimestamps([]);
    lastContentLengthRef.current = 0;
    setView('editor');
  };

  const handleSelectProject = async (project: Project) => {
    if (!token) return;
    try {
      const fullProject = await api.getProject(token, project.id);
      setCurrentProject(fullProject);
      setContent(fullProject.content || '');
      setTimestamps(JSON.parse(fullProject.timestamps || '[]'));
      lastContentLengthRef.current = fullProject.content?.length || 0;
      setAudioUrl(`http://localhost:3001/uploads/${fullProject.audio_filename}`);
      setView('editor');
    } catch (err) {
      alert('加载项目失败');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('audio/') || !token) return;

    const title = prompt('请输入项目名称', '未命名项目');
    if (!title) return;

    try {
      const result = await api.createProject(token, title, file);
      const newProject = await api.getProject(token, result.id);
      setCurrentProject(newProject);
      setAudioFile(file);
      setContent('');
      setTimestamps([]);
      lastContentLengthRef.current = 0;
    } catch (err) {
      alert('上传失败');
    }
  };

  const handleContentChange = (newContent: string) => {
    const oldLength = lastContentLengthRef.current;
    const newLength = newContent.length;

    if (newLength > oldLength) {
      const newTimestamp: TimestampedText = {
        id: Date.now().toString(),
        text: newContent.slice(oldLength),
        timestamp: currentTime,
        startIndex: oldLength,
        endIndex: newLength,
      };
      setTimestamps([...timestamps, newTimestamp]);
    } else if (newLength < oldLength) {
      const updatedTimestamps = timestamps.filter((ts) => ts.endIndex <= newLength);
      setTimestamps(updatedTimestamps);
    }

    lastContentLengthRef.current = newLength;
    setContent(newContent);

    if (currentProject && token) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        api.updateProject(token, currentProject.id, newContent, timestamps);
      }, 1000);
    }
  };

  const handleTimestampClick = (timestamp: number) => {
    const adjustedTime = Math.max(0, timestamp - 5);
    setSeekTime(adjustedTime);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  if (mustChangePassword) {
    return (
      <ChangePasswordModal
        token={token}
        onClose={() => {}}
        onSuccess={handlePasswordChanged}
        mustChange={true}
      />
    );
  }

  if (view === 'users') {
    return (
      <div style={styles.app}>
        <UserManagement token={token} onBack={() => setView('list')} />
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div style={styles.app}>
        <header style={styles.header}>
          <h1 style={styles.h1}>音视频文字同步记录</h1>
          <div style={styles.userInfo}>
            <span>欢迎, {username}</span>
            <button onClick={() => setShowChangePassword(true)} style={styles.changePasswordButton}>
              修改密码
            </button>
            {isAdmin && (
              <button onClick={() => setView('users')} style={styles.userManagementButton}>
                用户管理
              </button>
            )}
            <button onClick={handleLogout} style={styles.logoutButton}>
              退出
            </button>
          </div>
        </header>
        <ProjectList token={token} onSelectProject={handleSelectProject} onCreateNew={handleCreateNew} />
        {showChangePassword && (
          <ChangePasswordModal
            token={token}
            onClose={() => setShowChangePassword(false)}
            onSuccess={handlePasswordChanged}
          />
        )}
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => setView('list')} style={styles.backButton}>
            ← 返回项目列表
          </button>
          <h1 style={styles.h1}>{currentProject?.title || '新建项目'}</h1>
        </div>
        {!currentProject && (
          <div style={styles.uploadContainer}>
            <label style={styles.uploadLabel}>
              上传录音文件
              <input type="file" accept="audio/*" onChange={handleFileUpload} style={styles.fileInput} />
            </label>
          </div>
        )}
      </header>

      <div style={styles.playerContainer}>
        <AudioPlayer audioFile={audioFile} audioUrl={audioUrl} seekTime={seekTime} onTimeUpdate={setCurrentTime} />
      </div>

      <div style={styles.editorContainer}>
        <ObsidianEditor
          content={content}
          onChange={handleContentChange}
          timestamps={timestamps}
          onTimestampClick={handleTimestampClick}
          currentTime={currentTime}
          token={token!}
        />
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  h1: {
    margin: 0,
    fontSize: '28px',
    color: '#333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  changePasswordButton: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  userManagementButton: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  uploadContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  uploadLabel: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  fileInput: {
    display: 'none',
  },
  playerContainer: {
    marginBottom: '20px',
  },
  editorContainer: {
    height: 'calc(100vh - 250px)',
  },
};

export default App;
