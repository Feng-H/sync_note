import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TimestampedText } from '../types';
import { api } from '../api';

interface ObsidianEditorProps {
  content: string;
  onChange: (content: string) => void;
  timestamps: TimestampedText[];
  onTimestampClick: (timestamp: number) => void;
  currentTime: number;
  token: string;
}

interface MarkdownFile {
  filename: string;
  fullPath: string;
}

interface Suggestion {
  text: string;
  type: 'file' | 'heading';
  icon: string;
}

export const ObsidianEditor: React.FC<ObsidianEditorProps> = ({
  content,
  onChange,
  timestamps,
  onTimestampClick,
  currentTime,
  token,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [markdownFiles, setMarkdownFiles] = useState<MarkdownFile[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [currentContext, setCurrentContext] = useState<{
    type: 'file' | 'heading';
    filename?: string;
    start: number;
    query: string;
  } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // 加载所有 markdown 文件
  useEffect(() => {
    loadMarkdownFiles();
  }, [token]);

  // 当显示推荐框时，确保光标可见
  useEffect(() => {
    if (showSuggestions && textareaRef.current) {
      const textarea = textareaRef.current;
      
      // 如果有滚动条，滚动到当前行
      if (textarea.scrollHeight > textarea.clientHeight) {
        const position = textarea.selectionStart;
        const lines = content.substring(0, position).split('\n');
        const currentLine = lines.length;
        const lineHeight = 24;
        const scrollTop = Math.max(0, (currentLine - 1) * lineHeight);
        
        textarea.scrollTop = scrollTop;
        console.log('滚动到行:', currentLine, 'scrollTop:', scrollTop);
      }
    }
  }, [showSuggestions]);

  const loadMarkdownFiles = async () => {
    try {
      const files = await api.getMarkdownFiles(token);
      console.log('加载的 markdown 文件:', files);
      setMarkdownFiles(files);
    } catch (err) {
      console.error('加载文件列表失败', err);
    }
  };

  // 处理 [[链接]] 语法
  const processWikiLinks = (text: string) => {
    return text.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      return `[${linkText}](#${linkText})`;
    });
  };

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

  // 检查是否在输入双链
  const checkForWikiLink = (text: string, position: number) => {
    let start = position - 1;
    
    while (start >= 0) {
      if (text[start] === '[' && text[start - 1] === '[') {
        start--;
        break;
      }
      if (text[start] === ']' && text[start - 1] === ']') {
        return null; // 已经闭合
      }
      start--;
    }

    if (start >= 0 && text[start] === '[' && text[start + 1] === '[') {
      // 找到了 [[，提取内容
      const linkContent = text.substring(start + 2, position);
      
      // 检查是否有 #
      const hashIndex = linkContent.indexOf('#');
      
      if (hashIndex === -1) {
        // 没有 #，推荐文件名
        return {
          type: 'file' as const,
          start: start + 2,
          query: linkContent,
        };
      } else {
        // 有 #，推荐标题
        const filename = linkContent.substring(0, hashIndex);
        const headingQuery = linkContent.substring(hashIndex + 1);
        
        return {
          type: 'heading' as const,
          filename,
          start: start + 2 + hashIndex + 1,
          query: headingQuery,
        };
      }
    }

    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 处理推荐列表的键盘事件
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (filteredSuggestions.length > 0) {
          insertSuggestion(filteredSuggestions[selectedIndex].text);
        }
        return;
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }

    // Tab 键缩进
    if (e.key === 'Tab' && !showSuggestions) {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
      return;
    }

    // 自动补全右括号 - 当输入第二个 [ 时补全 ]]
    if (e.key === '[') {
      const start = e.currentTarget.selectionStart;
      const beforeCursor = content.substring(Math.max(0, start - 1), start);
      
      if (beforeCursor === '[') {
        e.preventDefault();
        const end = e.currentTarget.selectionEnd;
        // 补全 []] 而不是 []
        const newContent = content.substring(0, start) + '[]]' + content.substring(end);
        onChange(newContent);
        setTimeout(() => {
          if (textareaRef.current) {
            // 光标放在 [[ 和 ]] 之间
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
          }
        }, 0);
        return;
      }
    }
  };

  const insertSuggestion = (text: string) => {
    if (!textareaRef.current || !currentContext) return;

    const position = textareaRef.current.selectionStart;
    const before = content.substring(0, currentContext.start);
    const after = content.substring(position);

    let newContent: string;
    let newPos: number;

    if (currentContext.type === 'file') {
      // 插入文件名，不自动闭合，等待用户输入 # 或 ]]
      newContent = before + text + after;
      newPos = currentContext.start + text.length;
    } else {
      // 插入标题
      // 检查后面是否已经有 ]]
      const hasClosingBrackets = after.startsWith(']]');
      
      if (hasClosingBrackets) {
        // 如果已经有 ]]，就不添加，直接替换内容并把光标移到 ]] 后面
        newContent = before + text + after;
        newPos = currentContext.start + text.length + 2;
      } else {
        // 如果没有 ]]，添加它
        newContent = before + text + ']]' + after;
        newPos = currentContext.start + text.length + 2;
      }
    }

    onChange(newContent);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    }, 0);

    setShowSuggestions(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const newPosition = e.target.selectionStart;

    onChange(newContent);
    setCursorPosition(newPosition);

    // 检查是否在输入双链
    const wikiLink = checkForWikiLink(newContent, newPosition);

    if (wikiLink) {
      console.log('检测到双链输入:', wikiLink);
      console.log('当前 markdown 文件数量:', markdownFiles.length);
      setCurrentContext(wikiLink);
      const query = wikiLink.query.toLowerCase();

      let suggestions: Suggestion[] = [];

      if (wikiLink.type === 'file') {
        // 推荐文件名（限制最多 5 个，智能排序）
        const scored = markdownFiles
          .map((f) => {
            const filename = f.filename.toLowerCase();
            const q = query.toLowerCase();
            
            // 计算匹配分数
            let score = 0;
            if (filename === q) score = 1000; // 完全匹配
            else if (filename.startsWith(q)) score = 500; // 开头匹配
            else if (filename.includes(q)) score = 100; // 包含匹配
            else return null;
            
            // 越短的文件名分数越高（更相关）
            score -= filename.length;
            
            return { file: f, score };
          })
          .filter((item): item is { file: typeof markdownFiles[0]; score: number } => item !== null)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        
        suggestions = scored.map((item) => ({
          text: item.file.filename,
          type: 'file' as const,
          icon: '📄',
        }));
        console.log('文件推荐:', suggestions);
      } else if (wikiLink.type === 'heading' && wikiLink.filename) {
        // 推荐标题 - 使用后端搜索
        console.log('查找文件:', wikiLink.filename);
        
        // 清除之前的搜索定时器
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // 延迟搜索，避免频繁请求
        searchTimeoutRef.current = setTimeout(async () => {
          try {
            setIsLoadingSuggestions(true);
            const headings = await api.searchMarkdownHeadings(token, wikiLink.filename!, query);
            console.log('搜索到的标题:', headings);
            
            const newSuggestions = headings.map((h: string) => ({
              text: h,
              type: 'heading' as const,
              icon: '#️⃣',
            }));
            
            setFilteredSuggestions(newSuggestions);
            setSelectedIndex(0);
            setIsLoadingSuggestions(false);
            
            if (newSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          } catch (err) {
            console.error('搜索标题失败:', err);
            setIsLoadingSuggestions(false);
          }
        }, 300); // 300ms 延迟
        
        // 暂时返回，不设置 suggestions
        return;
      }

      setFilteredSuggestions(suggestions);
      setSelectedIndex(0);

      if (suggestions.length > 0) {
        // 推荐框固定显示在编辑器底部
        const textarea = textareaRef.current;
        if (textarea) {
          // 推荐框显示在编辑器底部，从下往上
          const textareaHeight = textarea.clientHeight;
          const suggestionBoxHeight = 300;
          const top = textareaHeight - suggestionBoxHeight - 10;
          const left = 20;

          setSuggestionPosition({ top, left });
          setShowSuggestions(true);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
      setCurrentContext(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.editorSection}>
        <div style={styles.editorHeader}>
          <span style={styles.editorTitle}>编辑</span>
          <span style={styles.hint}>支持 Markdown 和 [[文件名#标题]] 语法</span>
        </div>
        <div style={{ position: 'relative', flex: 1 }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            style={styles.textarea}
            placeholder="# 开始记录

在这里输入内容...

使用 [[文件名]] 创建文件链接
使用 [[文件名#标题]] 链接到特定标题
使用 **粗体** 和 *斜体*
使用 - 创建列表"
          />
          {showSuggestions && (
            <div
              style={{
                ...styles.suggestionBox,
                top: suggestionPosition.top,
                left: suggestionPosition.left,
              }}
            >
              {filteredSuggestions.length > 0 ? (
                <>
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.suggestionItem,
                        ...(index === selectedIndex ? styles.suggestionItemSelected : {}),
                      }}
                      onClick={() => insertSuggestion(suggestion.text)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span style={styles.suggestionIcon}>{suggestion.icon}</span>
                      <span style={styles.suggestionText}>{suggestion.text}</span>
                      {suggestion.type === 'file' && (
                        <span style={styles.suggestionHint}>输入 # 查看标题</span>
                      )}
                    </div>
                  ))}
                  {filteredSuggestions.length >= 5 && (
                    <div style={styles.suggestionFooter}>
                      显示前 5 个最相关结果，输入更多字符以精确搜索
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.noResults}>无匹配结果</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div style={styles.previewSection}>
        <div style={styles.previewHeader}>
          <span style={styles.previewTitle}>预览</span>
          <span style={styles.hint}>点击文本跳转到对应时间点</span>
        </div>
        <div style={styles.preview} className="obsidian-preview" onClick={handleClick}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} style={styles.wikiLink}>
                  {props.children}
                </a>
              ),
            }}
          >
            {processWikiLinks(content) || '*暂无内容*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    height: '100%',
    backgroundColor: '#e0e0e0',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  editorSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#1e1e1e',
    minWidth: 0,
    overflow: 'hidden',
  },
  previewSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#2d2d2d',
    minWidth: 0,
    overflow: 'hidden',
  },
  editorHeader: {
    padding: '12px 16px',
    backgroundColor: '#252525',
    borderBottom: '1px solid #3d3d3d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewHeader: {
    padding: '12px 16px',
    backgroundColor: '#252525',
    borderBottom: '1px solid #3d3d3d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editorTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#d4d4d4',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  previewTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#d4d4d4',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  hint: {
    fontSize: '11px',
    color: '#888',
  },
  textarea: {
    width: '100%',
    height: '100%',
    padding: '20px',
    fontSize: '15px',
    fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace",
    lineHeight: '1.6',
    border: 'none',
    resize: 'none' as const,
    outline: 'none',
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    caretColor: '#528bff',
    boxSizing: 'border-box' as const,
  },
  preview: {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
    cursor: 'pointer',
    backgroundColor: '#2d2d2d',
    color: '#d4d4d4',
    fontSize: '15px',
    lineHeight: '1.6',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  wikiLink: {
    color: '#7c3aed',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '3px',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    fontWeight: 500,
  },
  suggestionBox: {
    position: 'absolute' as const,
    backgroundColor: '#2d2d2d',
    border: '1px solid #3d3d3d',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    minWidth: '280px',
    maxWidth: '450px',
    zIndex: 1000,
    willChange: 'transform',
  },
  suggestionItem: {
    padding: '10px 14px',
    cursor: 'pointer',
    color: '#d4d4d4',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'background-color 0.1s',
    borderBottom: '1px solid #3d3d3d',
  },
  suggestionItemSelected: {
    backgroundColor: '#3d3d3d',
  },
  suggestionIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },
  suggestionText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    flex: 1,
  },
  suggestionHint: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: '#888',
    flexShrink: 0,
  },
  suggestionFooter: {
    padding: '8px 14px',
    fontSize: '11px',
    color: '#888',
    textAlign: 'center' as const,
    borderTop: '1px solid #3d3d3d',
    backgroundColor: '#252525',
  },
  noResults: {
    padding: '12px 14px',
    color: '#888',
    fontSize: '13px',
    textAlign: 'center' as const,
  },
};
