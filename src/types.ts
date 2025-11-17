export interface TimestampedText {
  id: string;
  text: string;
  timestamp: number;
  startIndex: number;
  endIndex: number;
}

export interface Project {
  id: number;
  title: string;
  audio_filename: string;
  content: string;
  timestamps: string;
  created_at: string;
  updated_at: string;
}
