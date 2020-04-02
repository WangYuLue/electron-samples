const { app, BrowserWindow } = require('electron')
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL(`http://localhost:3000`);
  } else {
    win.loadFile(path.resolve(__dirname, './dist/index.html'));
  }
}

app.whenReady().then(createWindow)