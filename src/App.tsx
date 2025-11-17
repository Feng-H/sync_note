import React, { useState, useRef } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { MarkdownEditor } from './components/MarkdownEditor';
import { TimestampedText } from './types';

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [timestamps, setTimestamps] = useState<TimestampedText[]>([]);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const lastContentLengthRef = useRef(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setContent('');
      setTimestamps([]);
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
  };

  const handleTimestampClick = (timestamp: number) => {
    const adjustedTime = Math.max(0, timestamp - 5);
    setSeekTime(adjustedTime);
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.h1}>音视频文字同步记录</h1>
        <div style={styles.uploadContainer}>
          <label style={styles.uploadLabel}>
            上传录音文件
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={styles.fileInput}
            />
          </label>
          {audioFile && <span style={styles.fileName}>{audioFile.name}</span>}
        </div>
      </header>

      <div style={styles.playerContainer}>
        <AudioPlayer
          audioFile={audioFile}
          seekTime={seekTime}
          onTimeUpdate={setCurrentTime}
        />
      </div>

      <div style={styles.editorContainer}>
        <MarkdownEditor
          content={content}
          onChange={handleContentChange}
          timestamps={timestamps}
          onTimestampClick={handleTimestampClick}
          currentTime={currentTime}
        />
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '20px',
  },
  h1: {
    margin: '0 0 15px 0',
    fontSize: '28px',
    color: '#333',
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
  fileName: {
    fontSize: '14px',
    color: '#666',
  },
  playerContainer: {
    marginBottom: '20px',
  },
  editorContainer: {
    height: 'calc(100vh - 250px)',
  },
};

export default App;
