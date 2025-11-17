import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TimestampedText } from '../types';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  timestamps: TimestampedText[];
  onTimestampClick: (timestamp: number) => void;
  currentTime: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  timestamps,
  onTimestampClick,
  currentTime,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(e.currentTarget);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const clickPosition = preCaretRange.toString().length;

    const clickedTimestamp = timestamps.find(
      (ts) => clickPosition >= ts.startIndex && clickPosition <= ts.endIndex
    );

    if (clickedTimestamp) {
      onTimestampClick(clickedTimestamp.timestamp);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.editorSection}>
        <h3 style={styles.title}>编辑器</h3>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          style={styles.textarea}
          placeholder="在这里输入内容，支持 Markdown 格式..."
        />
      </div>
      <div style={styles.previewSection}>
        <h3 style={styles.title}>预览（点击文本跳转）</h3>
        <div style={styles.preview} onClick={handleClick}>
          <ReactMarkdown>{content || '*暂无内容*'}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    height: '100%',
  },
  editorSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  previewSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#333',
  },
  textarea: {
    flex: 1,
    padding: '15px',
    fontSize: '16px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
    borderRadius: '5px',
    resize: 'none' as const,
  },
  preview: {
    flex: 1,
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fafafa',
    overflow: 'auto',
    cursor: 'pointer',
  },
};
