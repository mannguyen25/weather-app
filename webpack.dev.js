const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'main.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 9000,
    static: './dist'
  }
})
