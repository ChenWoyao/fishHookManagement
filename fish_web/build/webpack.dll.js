/*
 * @Author: your name
 * @Date: 2020-12-25 09:56:10
 * @LastEditTime: 2020-12-30 10:18:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /woyao_cli/build/webpack.dll.js
 */
const webpack = require('webpack')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        // vendors: ['react', 'react-dom', 'lodash']
        lodash: ['lodash'],
        react: ['react', 'react-dom', 'react-router-dom'],
        axios: ['axios']
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]',
    },
    plugins: [
        new CleanWebpackPlugin(), // 此插件默认会清空，webpack的output中配置的path指定的文件夹。
        new webpack.DllPlugin({
            name: '[name]',
            path: path.resolve(__dirname, '../dll/[name].manifest.json') // 创建库的第三方的映射关系
        })
    ]
}
