以下是 从零搭建Electron应用 的一系列简单的demo

## demo 目录

- 搭建一个最简单的Electron
- 从零搭建一个React应用（TypeScript,Scss,热更新）
- 将 Electron 与 React 结合
- 实际开发一个小 Demo
- 如何打包 Electron 应用

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

> 目标： ypeScript,Scss,热更新

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


## 参考链接

[Electron 文档](https://electronjs.org/docs)
[WebPack 文档](https://www.webpackjs.com/guides/)