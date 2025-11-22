import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface PresentationViewProps {
  projectId: string;
  projectTitle: string;
  token: string;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ projectTitle }) => {
  const [content, setContent] = useState('');
  const previewRef = React.useRef<HTMLDivElement>(null);

  // 处理 [[链接]] 语法
  const processWikiLinks = (text: string) => {
    let processed = text.replace(/([^\n])\n([^\n])/g, '$1  \n$2');
    processed = processed.replace(/\[\[([^\]]+)\]\]/g, (_match, linkText) => {
      return `<span class="wiki-link">${linkText}</span>`;
    });
    return processed;
  };

  // 监听来自主窗口的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CONTENT_UPDATE') {
        setContent(event.data.content);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // 通知主窗口演示窗口已准备好
    if (window.opener) {
      window.opener.postMessage({ type: 'PRESENTATION_READY' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 当内容变化时，自动滚动到底部
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{projectTitle}</h1>
      </div>
      <div ref={previewRef} style={styles.contentSection}>
        <div style={styles.preview}>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ node, ...props }) => (
                <p {...props} style={{ margin: '0.8em 0', whiteSpace: 'pre-wrap', fontSize: '1.1em' }}>
                  {props.children}
                </p>
              ),
              h1: ({ node, ...props }) => (
                <h1 {...props} style={{ fontSize: '2.5em', marginTop: '0.5em', marginBottom: '0.5em' }}>
                  {props.children}
                </h1>
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} style={{ fontSize: '2em', marginTop: '0.5em', marginBottom: '0.5em' }}>
                  {props.children}
                </h2>
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} style={{ fontSize: '1.5em', marginTop: '0.5em', marginBottom: '0.5em' }}>
                  {props.children}
                </h3>
              ),
              span: ({ node, className, ...props }) => {
                if (className === 'wiki-link') {
                  return (
                    <span {...props} style={styles.wikiLink}>
                      {props.children}
                    </span>
                  );
                }
                return <span {...props}>{props.children}</span>;
              },
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} style={styles.blockquote}>
                  {props.children}
                </blockquote>
              ),
            }}
          >
            {processWikiLinks(content) || '*等待内容加载...*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#e8e8e8',
  },
  header: {
    padding: '30px 40px',
    backgroundColor: '#252525',
    borderBottom: '2px solid #3d3d3d',
    textAlign: 'center' as const,
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 600,
    color: '#e8e8e8',
  },
  contentSection: {
    flex: 1,
    overflow: 'auto',
    padding: '40px',
  },
  preview: {
    maxWidth: '1200px',
    margin: '0 auto',
    fontSize: '18px',
    lineHeight: '1.8',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  wikiLink: {
    color: '#8b9dc3',
    textDecoration: 'none',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'rgba(139, 157, 195, 0.15)',
    fontWeight: 500,
  },
  blockquote: {
    borderLeft: '4px solid #8b9dc3',
    paddingLeft: '20px',
    marginLeft: '0',
    color: '#b8b8b8',
    fontStyle: 'italic' as const,
  },
};
