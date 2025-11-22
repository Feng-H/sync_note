const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

// 启动后端服务器
function startServer() {
  console.log('=== Starting Server ===');
  console.log('isPackaged:', app.isPackaged);
  console.log('__dirname:', __dirname);
  console.log('process.resourcesPath:', process.resourcesPath);
  
  if (app.isPackaged) {
    // 生产环境：使用解压后的服务器（app.asar.unpacked）
    const serverPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'server', 'dist', 'index.js');
    const serverCwd = path.join(process.resourcesPath, 'app.asar.unpacked', 'server');
    
    console.log('Starting production server...');
    console.log('Server path:', serverPath);
    console.log('Server cwd:', serverCwd);
    
    // 设置数据目录到用户目录
    const userDataPath = app.getPath('userData');
    console.log('User data path:', userDataPath);
    
    // 检查文件是否存在
    const fs = require('fs');
    if (!fs.existsSync(serverPath)) {
      console.error('❌ Server file not found:', serverPath);
      return;
    }
    console.log('✅ Server file exists');
    
    serverProcess = spawn('node', [serverPath], {
      cwd: serverCwd,
      env: { 
        ...process.env, 
        NODE_ENV: 'production',
        USER_DATA_PATH: userDataPath
      }
    });
  } else {
    // 开发环境：使用 tsx 运行 TypeScript
    console.log('Starting development server...');
    const serverSrcPath = path.join(__dirname, '../server/src/index.ts');
    serverProcess = spawn('npx', ['tsx', serverSrcPath], {
      cwd: path.join(__dirname, '../server'),
      env: { ...process.env, NODE_ENV: 'development' }
    });
  }

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server] ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error] ${data}`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
  serverProcess.on('error', (err) => {
    console.error(`Server process error:`, err);
  });
}

function createWindow() {
  console.log('Creating window...');
  console.log('isPackaged:', app.isPackaged);
  console.log('__dirname:', __dirname);
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
  });

  // 开发环境：加载 Vite 开发服务器
  if (!app.isPackaged) {
    console.log('Loading dev server...');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境：加载打包后的文件
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading file:', indexPath);
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load file:', err);
    });
    // 打开开发者工具查看错误（调试用）
    mainWindow.webContents.openDevTools();
  }

  // 监听加载错误
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // 启动后端服务器
  startServer();
  
  // 等待服务器启动后创建窗口
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // 关闭服务器进程
  if (serverProcess) {
    serverProcess.kill();
  }
});
