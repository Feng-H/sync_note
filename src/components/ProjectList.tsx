import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Project } from '../types';

interface ProjectListProps {
  token: string;
  onSelectProject: (project: Project) => void;
  onCreateNew: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ token, onSelectProject, onCreateNew }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects(token);
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定删除此项目？')) return;

    try {
      await api.deleteProject(token, id);
      loadProjects();
    } catch (err) {
      alert('删除失败');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>我的项目</h2>
        <button onClick={onCreateNew} style={styles.createButton}>
          新建项目
        </button>
      </div>
      <div style={styles.list}>
        {projects.map((project) => (
          <div key={project.id} style={styles.item} onClick={() => onSelectProject(project)}>
            <div style={styles.itemTitle}>{project.title}</div>
            <div style={styles.itemDate}>{new Date(project.updated_at).toLocaleString()}</div>
            <button onClick={(e) => handleDelete(project.id, e)} style={styles.deleteButton}>
              删除
            </button>
          </div>
        ))}
        {projects.length === 0 && <div style={styles.empty}>暂无项目，点击"新建项目"开始</div>}
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
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  item: {
    padding: '15px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
  },
  itemDate: {
    fontSize: '14px',
    color: '#666',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#999',
  },
};
