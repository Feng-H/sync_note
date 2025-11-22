const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.default = async function(context) {
  const appOutDir = context.appOutDir;
  const serverDir = path.join(appOutDir, context.packager.appInfo.productFilename + '.app', 'Contents', 'Resources', 'app.asar.unpacked', 'server');
  
  console.log('Installing server dependencies...');
  console.log('Server directory:', serverDir);
  
  if (fs.existsSync(serverDir)) {
    try {
      // 安装生产依赖
      execSync('npm install --production --registry=https://registry.npmmirror.com', {
        cwd: serverDir,
        stdio: 'inherit'
      });
      console.log('✅ Server dependencies installed');
    } catch (error) {
      console.error('❌ Failed to install server dependencies:', error);
    }
  } else {
    console.error('❌ Server directory not found:', serverDir);
  }
};
