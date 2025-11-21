import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PresentationView } from '../components/PresentationView';

export const Presentation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const projectTitle = searchParams.get('projectTitle');
  const token = searchParams.get('token');

  if (!projectId || !token || !projectTitle) {
    return (
      <div style={styles.error}>
        <h1>错误</h1>
        <p>缺少必要的参数</p>
      </div>
    );
  }

  return <PresentationView projectId={projectId} projectTitle={decodeURIComponent(projectTitle)} token={token} />;
};

const styles = {
  error: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#e8e8e8',
  },
};
