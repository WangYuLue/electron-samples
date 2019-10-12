以下是 从零搭建Electron应用 的一系列简单的demo

## demo 目录

- 搭建一个最简单的Electron
- 从零搭建一个React应用（TypeScript,Scss,热更新）
- 将 Electron 与 React 结合
- 打包 Electron 应用
- 实际开发一个小 Demo

## 安装依赖
```bash
npm install
```

## Demo01: 搭建一个最简单的Electron

### app
`app` 实例将应用程序的事件生命周期

### BrowserWindow

`BrowserWindow`类可以创建窗口实例， 关于`BrowserWindow`的详细配置可以查看[文档](https://electronjs.org/docs/api/browser-window)

## Demo02: 从零搭建一个React应用

> 目标： typeScript,Scss,热更新

```bash
# 安装 webpack 相关依赖
yarn add webpack webpack-cli webpack-dev-server -D
yarn add html-webpack-plugin -D 
# 安装 typescript 相关依赖
yarn add typescript ts-loader -D
# 安装 react 相关依赖
yarn add react react-dom
yarn add @types/react @types/react-dom -D
# 安装 scss 相关依赖
yarn add sass-loader node-sass -D
yarn add style-loader css-loader -D
```

## Demo03: 将 Electron 与 React 结合

1、将 demo01 与 demo02 简单结合;
2、在 `demo03/package.json` 中将 `script`改成：
```js
{
  "start-electron": "../node_modules/.bin/electron .",
  "start": "../node_modules/.bin/webpack-dev-server --config webpack.config.js"
}
```
3、在 `demo03/main.js` 中加载本地react开发环境地址：
```js
win.loadURL('http://localhost:3000');
```
4、在 `demo03/webpack.config.js` 中的 `devServer` 里添加配置，以便在运行 react项目时拉起 electron项目：
```js
{
  after() {
    console.log('start electron process');
    spawn('npm', ['run', 'start-electron'], {
      shell: true,
      env: process.env,
      stdio: 'inherit'
    })
      .on('close', code => process.exit(code))
      .on('error', spawnError => console.error(spawnError));
  }
}
```

## Demo04: 打包 Electron 应用

打包工具有 `electron-packager` 及 `electron-builder`:

```
electron-packager ( 84 releases,  13 open issues,  726 closed)
electron-builder  (688 releases, 256 open issues, 3478 closed)
```
我们可以看到 `electron-builder` 使用的更加频繁，于是我们就用 `electron-builder`来打包桌面应用。

1、在 `demo03/package.json` 中加入 `build` 字段，这个字段会告诉 `electron-builder` 如何来打包应用。
2、打包是需要考虑路径问题，开发环境走 `http://localhost:3000`，打包后走本地文件。

## Demo05: 实际开发一个小 Demo

### 渲染进程与主进程

通过 `ipcMain` 和 `ipcRenderer` 可以实现进程间的通信。

ipcMain 在主进程中使用，用来处理渲染进程（网页）发送的同步和异步的信息:
```js
const {ipcMain} = require('electron')

// 监听渲染程序发来的事件
ipcMain.on('something', (event, data) => {
  event.sender.send('something1', '我是主进程返回的值')
})
```
ipcRenderer 在渲染进程中使用，用来发送同步或异步的信息给主进程，也可以用来接收主进程的回复信息。
```js
const { ipcRenderer} = require('electron') 

// 发送事件给主进程
ipcRenderer.send('something', '传输给主进程的值')  

// 监听主进程发来的事件
ipcRenderer.on('something1', (event, data) => {
  console.log(data) // 我是主进程返回的值
})
```

> 以上代码使用的是异步传输消息，electron也提供了同步传输的API。

### remote 模块

使用 remote 模块, 你可以调用 main 进程对象的方法, 而不必显式发送进程间消息。

```js
const { dialog } = require('electron').remote
dialog.showMessageBox({type: 'info', message: '在渲染进程中直接使用主进程的模块'})
```
