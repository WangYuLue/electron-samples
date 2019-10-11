const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', 
          'css-loader', 
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    port: 3000
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@container": path.resolve(__dirname, 'src/container/')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}