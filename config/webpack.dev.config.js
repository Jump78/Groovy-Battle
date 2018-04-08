const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'option.html',
      template: 'option.html',
      chunks: ['option'],
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'locale.html',
      template: 'locale.html',
      chunks: ['locale'],
      inject: false
    }),  ]
});
