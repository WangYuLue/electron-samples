# 从零搭建Electron应用 的一系列简单的demo

Electron 是一个优秀的跨平台桌面应用程序开源库，目前接触 Electron 的开发者也越来越多。但是笔者发现，目前社区里缺少对初学者足够友好的入门教程，来帮助初学者用 Electron 搭建一个完整的开发框架。

为了解决这个问题，笔者将结合平时的一些 Electron 开发经验，渐近式的带领读者从零开始搭建一个完整的 Electron 应用。在这个教程中，笔者将使用 React 构建渲染进程。当然，读者也可以用其他框架来构建渲染进程，各种前端框架脚手架已经足够友好，所以这一点不用担心。

阅读完这篇教程，读者将会了解到：
  - Electron的核心知识点
  - 如何搭建一个最简单的 Electron
  - 如何将 Electron 和前端应用相结合
  - 如何配置 TypeScript 以保证代码质量
  - 如何跨平台打包 Electron 应用
  - 如何调试Electron

笔者将通过以下 8 个小 Demo 来介绍上面的知识点，为了保证学习质量，建议读者手把手跟着练习这些 Demo，读者可以[点击这里](https://github.com/WangYuLue/electron-demos)来下载项目。

- 搭建一个最简单的Electron
- 从零搭建一个React应用（TypeScript,Scss,热更新）
- 将 Electron 与 React 结合
- 打包 Electron 应用
- 实际开发一个小 Demo
- 主进程使用 TypeScript 构建
- 主进程监听文件变化并重启
- 在 vscode 中调试主进程和渲染进程

## Electron 核心概念

在 Demo 开始之前，先简单介绍一下 Electron。

### 是什么？

Electron 是一个可以用 JavaScript、HTML 和 CSS 构建桌面应用程序的库。这些应用程序能打包到 Mac、Windows 和 Linux 系统上运行，也能上架到 Mac 和 Windows 的 App Store。

### 由什么组成？

Electron 结合了 Chromium、Node.js 和用于调用操作系统本地功能的 API（如打开文件窗口、通知、图标等）。


### 一些历史

- 2013年4月Atom Shell 项目启动 。

- 2014年5月Atom Shell 被开源 。

- 2015年4月Atom Shell 被重命名为 Electron 。

- 2016年5月Electron 发布了 v1.0.0 版本 。

- 2016年5月Electron 构建的应用程序可上架 Mac App Store 。

- 2016年8月Windows Store 支持 Electron 构建的应用程序 。

### Electron 基础架构

> Electron 与 Chromium 在架构上很相似

Chromium运行时有一个 `Browser Process`，以及一个或者多个 `Renderer Process`。

`Renderer Process` 顾名思义负责渲染Web页面。`Browser Process` 则负责管理各个 `Renderer Process` 以及其他部分（比如菜单栏，收藏夹等等），如下图：

![img](./images/image02.jpg)

在 Electron中，结构仍然类似，不过这里是一个 `Main Process` 管理多个 `Renderer Process`。

![img](./images/image03.jpg)

提问：为什么要起多个渲染进程？

而且在 `Renderer Process` 可以使用 `Node.js` 的 runtime，这就赋予来 Electron 极大的能力，以下主进程以及渲染进程可以访问到的API：

![img](./images/image07.png)


### 如何将 Chromium 与 Node 整合

Electron 最让人兴奋的地方在于 Chromium 与 Node 的整合。通俗的讲，我们可以在 Chromium 的控制台上做任何 Node 可以做的事。

能够做这个整合，首先得益于 Chromium 和 Node.js 都是基于 v8 引擎来执行 js 的，所以给了一种可能，他们是可以一起工作的。

但是有一个问题，Chromium 和 Node.js 的事件循环机制不同。我们知道，Node.js 是基于 libuv 的，Chromium 也有一套自己的事件循环方式，要让他们一起工作，就必须整合这两个事件循环机制。

![img](./images/image01.png)

如上图所示，Electron 采用了这样一种方式，它起了一个新的线程轮询 libuv 中的 backend fd，从而监听 Node.js 中的事件，一旦发现有新的事件发生，就会立即把它 post 到 Chromium 的事件循环中，唤醒主线程处理这个事件。

### Electron 与 NW.js 的对比以及区别

Electron 和 NW.js 都是非常有名的跨平台桌面应用开源库。例如用Electron开发的知名应用有 vscode，用 NW.js 开发的知名应用有钉钉。

`Electron` 的原名叫 `Atom Shell`，`NW.js`  的原名叫 `node-webkit`；他们起初是同一个作者开发，而且这个这个作者是国人，先向[大佬](https://github.com/zcbenz)致敬，为我们开源这么优秀的开源工具。后来种种原因分为两个产品。一个命名为 `NW.js`(英特尔公司提供技术支持)、 另一命名为 `Electron`(Github 公司提供技术支持)。

#### 两者在GitHub上的数据对比

```
nw.js    (35.9k star,  3703 commits, 231 releases,  735 open issues,  5640 closed)
electron (77.5k star, 22613 commits, 639 releases, 1049 open issues, 10574 closed)
```
可以看出 `Electron` 更加活跃。

#### 两者程序的入口不同
在 `NW.js` 中，应用的主入口是网页或者JS脚本。 你需要在 `package.json` 中指定一个html或者js文件，一旦应用的主窗口(在html作为主入口点的情况下)或脚本被执行，应用就会在浏览器窗口打开。

在 `Electron` 中，入口是一个 `JavaScript` 脚本。 不同于直接提供一个URL，**你需要手动创建一个浏览器窗口**，然后通过 API 加载 HTML 文件。 你还可以监听窗口事件，决定何时让应用退出。

Electron 的工作方式更像 Node.js 运行时 ，Electron 的 APIs 更加底层。

#### Node 集成
在 `NW.js`，网页中的 Node 集成需要通过给 `Chromium` 打补丁来实现。但在 `Electron` 中，我们选择了另一种方式：通过各个平台的消息循环与 `libuv` 的循环集成，避免了直接在 `Chromium` 上做改动。这就意味着 `Electron` 迭代的成本更低。


## 准备工作

有了上面这些基础概念，接下来开始将下面 8 个 Demo 的学习。

在开始之前，我们先做一些基础的准备，

安装依赖:

```bash
yarn

# or

npm install
```

为了防止意外报错，我们约定 cd 到每个 demo 里来运行相应的 package 脚本。

一下 demo 都将基于 Electron 8.0.0 版本讲解。

## Demo01: 搭建一个最简单的 Electron

首先，我们会搭建一个最简单的 Electron 应用，它非常简单，只有 3 个文件。

创建 `demo01` 目录：

1、新建 `package.json` 文件

```json
{
  "name": "demo01",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "../node_modules/.bin/electron ."
  }
}
```

2、新建 `index.html` 文件

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using node <script>document.write(process.versions.node)</script>,
    Chrome <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.
  </body>
</html>
```

3、新建 `main.js` 文件

```js
const { app, BrowserWindow } = require('electron')

function createWindow () {   
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载index.html文件
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
```

运行 `yarn start`，第一个 electron 项目就轻松启动起来了。

注意 `package.json` 中的 `main` 字段，它指定了 electron 的入口文件。

在 `main.js` 中，我们注意到，`electron` 模块所提供的功能都是通过命名空间暴露出来的。 比如说： `electron.app` 负责管理 `Electron` 应用程序的生命周期， `electron.BrowserWindow` 类负责创建窗口。

细心的同学注意到，Demo01 其实是 Electorn 官方文档中的[范例](https://www.electronjs.org/docs/tutorial/first-app)；是的，官方的范例写的非常简单友好，所以用它来作为我们一系列 Demo 的开始是非常好的选择。

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

进入 Demo03 目录。

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

进入 Demo04 目录.

打包工具有 `electron-packager` 及 `electron-builder`:

```
electron-packager ( 84 releases,  13 open issues,  726 closed)
electron-builder  (688 releases, 256 open issues, 3478 closed)
```
我们可以看到 `electron-builder` 使用的更加频繁，于是我们就用 `electron-builder`来打包桌面应用。

1、在 `demo03/package.json` 中加入 `build` 字段，这个字段会告诉 `electron-builder` 如何来打包应用。
2、打包是需要考虑路径问题，开发环境走 `http://localhost:3000`，打包后走本地文件。

## Demo05: 实际开发一个小 Demo

进入 Demo05 目录。

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

进入 Demo06 目录。

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

复制 Demo06，并改名为 Demo07，进入 Demo07 目录。

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

首先，复制 Demo07，并改名为 Demo08，进入 Demo08 目录。

1、在 `webpack.main.dev.config.js` 中添加 `devtool: 'source-map'`。因为主进程是用 `typescript` 写的，为了调试 `typescript`，需要在打包时生成 Source maps 以形成映射，详情可以查看[文档](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-maps)

2、改造`webpack.renderer.config.js`，将 `devServer` 的 after 钩子删除掉。这也就意味着启动 web 服务时，不再将 elctron 拉起来。因为稍后会讲到要在 vscode 的 `launch.json` 中启动主进程。

3、运行`yarn start-main`，是给主进程打包生成 `.js` 文件和 `.map.js` 文件。

4、在当前项目目录下创建一个 `.vscode` 目录，并且在该目录下创建一个 `launch.json` 文件，在该文件里添加如下配置：

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

5、点击 vscode 自带的调试按钮，选择 `Electron: All`，就可以将 electron 启动起来了，这时候在主进程的 `.ts` 文件和渲染进程的 `.ts` 文件中打断点就可以发现都能起作用了(经测试发现需要在打包后的main的js文件中打一次断点，然后 .ts 中的断点才会起作用，目前还不太清楚什么原因)。
