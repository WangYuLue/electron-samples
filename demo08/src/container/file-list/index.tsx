import React, { Component } from 'react';
import './index.scss';
import { remote, OpenDialogReturnValue } from 'electron';
const { dialog, Notification } = remote;
const fs = require('fs');
const path = require("path");

const readDistFiles = (path: string, callBack: (data: string[]) => void) => {
  fs.readdir(path, (err: any, files: any) => {
    const data: string[] = [];
    files.forEach((file: any) => {
      console.log(file);
      data.push(file);
    });
    if (callBack) {
      callBack(data);
    }
  })
}

interface IState {
  path: string;
  data: string[];
  addFileName: string;
  addFileContent: string;
}
class FileList extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      path: '',
      data: [],
      addFileName: '',
      addFileContent: '',
    }
  }

  onChooseFile = () => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then((res: OpenDialogReturnValue) => {
      const filenames = res.filePaths;
      if (filenames && filenames.length > 0) {
        this.setState({ path: filenames[0] })
        readDistFiles(filenames[0], (data: string[]) => {
          console.log('data', data);
          this.setState({ data })
        })
      }
    });
  }

  onAppendFile = (name: string, content: string) => {
    fs.appendFile(path.resolve(this.state.path, name), content, (err: any) => {
      if (err) throw err;
      console.log('Saved!');
      let myNotification = new Notification({ title: '渲染进程通知', body: '新文件添加成功' });
      myNotification.show();
      readDistFiles(this.state.path, (data: string[]) => {
        this.setState({ data })
      })
    });
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={this.onChooseFile}>选择要展示的文件夹</button>
        <div>当前文件夹路径：{this.state.path}</div>
        <div>文件夹下文件列表：</div>
        <div className="file-list">
          {
            this.state.data.map(file => {
              return (
                <div key={file} className="file-item">
                  <span>{file}</span>
                </div>
              )
            })
          }
        </div>
        <div>
          <div>
            文件名称：<input type="text" value={this.state.addFileName} style={{ 'height': '26px' }} onChange={(e) => this.setState({ addFileName: e.target.value })} />
          </div>
          <div>
            文件内容：<input type="text" value={this.state.addFileContent} style={{ 'height': '26px' }} onChange={(e) => this.setState({ addFileContent: e.target.value })} />
          </div>
          <button onClick={() => this.onAppendFile(this.state.addFileName, this.state.addFileContent)} style={{ 'marginLeft': '10px' }}> 添加文件 </button>
        </div>

      </React.Fragment>
    )
  }
}

export default FileList;