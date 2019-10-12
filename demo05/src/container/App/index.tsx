import React, { Component } from 'react';
import './index.scss';

const { Notification } = require('electron').remote;

class App extends Component {
  componentDidMount() {
    let myNotification = new Notification({ title: '我的通知', body: '在渲染进程中直接使用主进程的模块' })
    myNotification.show();
  }
  render() {
    return (
      <div id="main">Hello React!</div>
    )
  }
}

export default App;