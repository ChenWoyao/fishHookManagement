/*
 * @Author: your name
 * @Date: 2020-12-25 09:55:45
 * @LastEditTime: 2020-12-29 16:55:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /woyao_cli/build/webpack.prod.js
 */
const path = require('path')
const webpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')
// 拷贝静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// 压缩js
const TerserPlugin = require("terser-webpack-plugin")

module.exports = merge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, '../public'),
                to: path.resolve(__dirname, '../dist')
            }]
        })
    ],
    optimization: {
        minimize: true,
        // 压缩工具
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin()
        ],
    }
})




