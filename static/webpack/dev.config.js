const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: './src/index',
  output: {
    path:__dirname+'/dist/',
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
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
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
