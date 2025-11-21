import React, { useRef, useEffect, useState } from 'react';

interface AudioPlayerProps {
  audioFile: File | null;
  audioUrl?: string | null;
  seekTime: number | null;
  onTimeUpdate: (time: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFile, audioUrl, seekTime, onTimeUpdate }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (audioFile && audioRef.current) {
      const url = URL.createObjectURL(audioFile);
      audioRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    } else if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioFile, audioUrl]);

  useEffect(() => {
    if (seekTime !== null && audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // 当音频加载时设置播放速度
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [audioFile, audioUrl, playbackRate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!audioRef.current || (!audioFile && !audioUrl)) return;

    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
    }
  };

  return (
    <div
      ref={containerRef}
      style={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button onClick={togglePlayPause} style={styles.button} disabled={!audioFile && !audioUrl}>
        {isPlaying ? '⏸ 暂停' : '▶ 播放'}
      </button>
      
      <div style={styles.speedControl}>
        <span style={styles.speedLabel}>速度:</span>
        <select 
          value={playbackRate} 
          onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
          style={styles.speedSelect}
        >
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
      
      <span style={styles.time}>{formatTime(currentTime)}</span>
      <div style={styles.progressContainer} onClick={handleProgressClick}>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
            }}
          />
        </div>
      </div>
      <span style={styles.time}>{formatTime(duration)}</span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 600,
    transition: 'background-color 0.2s',
  },
  time: {
    fontSize: '14px',
    color: '#333',
    fontWeight: 500,
    minWidth: '45px',
    textAlign: 'center' as const,
  },
  progressContainer: {
    flex: 1,
    cursor: 'pointer',
    padding: '10px 0',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#ddd',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: '4px',
    transition: 'width 0.1s linear',
  },
  speedControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  speedLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: 500,
  },
  speedSelect: {
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none',
  },
};
