# 从零搭建Electron应用 的一系列简单的demo

## demo 目录

- 搭建一个最简单的Electron
- 从零搭建一个React应用（TypeScript,Scss,热更新）
- 将 Electron 与 React 结合
- 打包 Electron 应用
- 实际开发一个小 Demo
- 主进程使用 TypeScript 构建
- 主进程监听文件变化并重启
- 在 vscode 中调试主进程和渲染进程

## 安装依赖
```bash
npm install
```

## Demo01: 搭建一个最简单的Electron

### app
`app` 会控制你的应用程序的事件生命周期。

### BrowserWindow

`BrowserWindow`类可以创建窗口实例， 关于`BrowserWindow`的详细配置可以查看[文档](https://electronjs.org/docs/api/browser-window)

## Demo02: 从零搭建一个React应用

搭建目标： 支持 typeScript,Scss,热更新

### 安装相关依赖

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

1、在 `demo05/webpack.config.js` 中的里添加如下配置，以便在 react项目里可以使用 `electron` 对象：
```js
{
  target: 'electron-renderer'
}
```

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

使用 [remote](https://electronjs.org/docs/api/remote) 模块, 你可以调用 main 进程对象的方法, 而不必显式发送进程间消息。

```js
const { dialog } = require('electron').remote
dialog.showMessageBox({type: 'info', message: '在渲染进程中直接使用主进程的模块'})
```


## Demo06: 在主进程中使用typescript

1、写两个 webpack 以区分生产环境和开发环境，他们两唯一的区别是 一个是 `mode: 'development'`，另外一个是 `mode: 'production'`，那么在代码里 `process.env.NODE_ENV` 就能得到不同的值。


2、需要注意 说明为什么webpack中，需要额外配置 
```js
node: {
  __dirname: false,
  __filename: false
}
```
要不然 `__dirname` 和 `__filename` 都是 `/`;

---

> 一下是进阶用法，感兴趣的同学可以继续往下看

## Demo07: 主进程监听文件变化并重启

通过 `nodemon` ，我们可以轻松实现主进程监听文件变化并重启；

复制 Demo06，并改名为 Demo07；

1、安装 `nodemon`:

```bash
yarn add nodemon -D
```

2、在 `demo07/package.json` 添加一行脚本：
```js
{
  "start-electron-with-nodemon": "nodemon --watch main.ts --exec 'npm run start-electron'",
}
```
3、将 `webpack.renderer.config.js` 中 `devServer` 的 after 钩子中的 `start-electron` 改为 `start-electron-with-nodemon`

## Demo08: 在 vscode 中调试主进程和渲染进程

我们可以用 vscode 自带的调试工具来调试 electron 的主进程和渲染进程；

关于 vscode 的调试方法，可以参考[官方文档](https://code.visualstudio.com/docs/nodejs/nodejs-debugging),或者 github 上的[实际案例](https://github.com/Microsoft/vscode-recipes/tree/master/Electron)

本文的配置与上面提到的[实际案例](https://github.com/Microsoft/vscode-recipes/tree/master/Electron)有一些差异，因为本文的开发环境的 render 进程是用一个 web server 启动的。

首先，复制 Demo07，并改名为 Demo08；

1、在 `webpack.main.dev.config.js` 中添加 `devtool: 'source-map'`。因为主进程是用 `typescript` 写的，为了调试 `typescript`，需要在打包时生成 Source maps 以形成映射，详情可以查看[文档](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-maps)

2、改造`webpack.renderer.config.js`，将 `devServer` 的 after 钩子中的 `start-electron` 改为 `start-main`。这也就意味着启动 web 服务时，不再将 elctron 拉起来，而仅仅是给主进程打个包。因为稍后会讲到要在 vscode 的 `launch.json` 中启动主进程。

3、在当前项目目录下创建一个 `.vscode` 目录，并且在该目录下创建一个 `launch.json` 文件，在该文件里添加如下配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Electron: Main",
      "protocol": "inspector",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "runtimeArgs": [
        "--remote-debugging-port=9233",
        "./demo08/main.js"
      ]
    },
    {
      "type": "chrome",
      "request": "attach",
      "name": "Electron: Renderer",
      "port": 9233,
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/demo08",
    },
  ],
  "compounds": [
    {
      "name": "Electron: All",
      "configurations": [
        "Electron: Main",
        "Electron: Renderer"
      ]
    }
  ]
}
```

然后点击 vscode 自带的调试按钮，选择 `Electron: All`，就可以将 electron 启动起来了，这时候在主进程和渲染进程中打断点就可以发现都能抓到。