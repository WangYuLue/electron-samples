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

## 参考链接

[Electron 文档](https://electronjs.org/docs)
[WebPack 文档](https://www.webpackjs.com/guides/)