const path = require('path');

module.exports = {
  target: 'electron-main',
  mode: 'development',
  entry: './main.ts',
  output: {
    filename: './main.js',
    path: path.resolve(__dirname, '')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  node: {
    __dirname: false,
    __filename: false
  },
}