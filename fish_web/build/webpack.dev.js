const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const path = require('path')

module.exports = merge(webpackConfig, {
    mode: 'development',
    devtool: 'eval-cheap-source-map',
    devServer: {
        host: 'localhost',
        port: 8080,
        hot: true,
        // hotOnly: true, // hmr失效的时候，不会重新刷新
        contentBase: './dist',
        open: true,
        disableHostCheck: true
    },
    optimization: {
        usedExports: true, // development配置tree shaking
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})


