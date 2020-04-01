const path = require('path');

module.exports = {
  target: 'electron-main',
  mode: 'development',
  devtool: 'source-map',
  entry: './main.ts',
  output: {
    filename: './main.js',
    path: path.resolve(__dirname, '')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  node: {
    __dirname: false,
    __filename: false
  },
}