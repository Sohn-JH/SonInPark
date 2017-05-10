const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: './src/index',
  output: {
    path: path.join(__dirname, '../', './dist/'),
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    port: 7070,
    contentBase: './',
    historyApiFallback: true,
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loaders: ['react-hot-loader', 'babel-loader?' + JSON.stringify({
          cacheDirectory: true,
          presets: ['es2015', 'react']
        })],
        exclude: /node_modules/
      },{
        test: /\.css$/,
        loader: 'style-loader'
      },{
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }]
  }
};
