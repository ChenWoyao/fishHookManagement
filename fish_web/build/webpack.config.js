const webpack = require('webpack')
const path = require('path')
// 把css拆分出来用外链的形式引入css文件，该插件会将所有的css样式合并为一个css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 使用HappyPack开启多进程Loader转换
// const HappyPack = require('happypack')
const HtmlWepbackPlugin = require('html-webpack-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const os = require('os')
// const happyThreadPool = HappyPack.ThreadPool({
//     size: os.cpus().length
// })
const fs = require('fs')


const isProdMode = process.argv.indexOf('--mode=production') !== -1
const isDevMode = process.argv.indexOf('--mode=development') !== -1
const isAnalyze = process.argv.indexOf('--profile') !== -1

const getStyleLoaders = (cssOptions, preProcessors) => {
    const loaders = [
        isDevMode && 'style-loader',
        isProdMode && MiniCssExtractPlugin.loader, // development环境用style-loader, production环境用MiniCssExtractPlugin.loader
        {
            loader: require.resolve('css-loader'),
            options: cssOptions
        }, // @import, url(), import styles from 'xx.css'
        {
            loader: require.resolve('postcss-loader'),
            options: {
                postcssOptions: {
                    plugins: [
                        // require('postcss-flexbugs-fixes'),
                        require('postcss-preset-env')({
                            autoprefixer: {
                                overrideBrowderslist: 'andoroid >= 4.3'
                            }, // // 添加webkit, mozilla前缀
                            stage: 3,
                        }),
                        require('postcss-plugin-px2rem')({
                            rootValue: 75, // 根据index.html 的doucment fontsize设置
                            minPixelValue: 2 // 设置要替换的最小像素值
                        }),
                    ],
                }
            }
        }
    ].filter(Boolean)

    if (preProcessors) {
        loaders.push({
            loader: require.resolve(preProcessors)
        })
    }
    return loaders
}

const getFileLoader = (limit, name) => {
    return {
        loader: 'url-loader',
        options: {
            limit,
            fallback: {
                loader: 'file-loader',
                options: {
                    name
                }
            }
        }
    }
}

const plugins = [
    new CleanWebpackPlugin(), // 此插件默认会清空，webpack的output中配置的path指定的文件夹。
    // new HappyPack({
    //     id: 'happyBabel', // 与loader对应的id标识
    //     // 这里是loaders不是loader
    //     loaders: [{
    //         loader: 'babel-loader',
    //         options: {
    //             presets: [
    //                 ['@babel/preset-env']
    //             ],
    //             cacheDirectory: true,
    //             cacheCompression: false
    //         }
    //     }],
    //     threadPool: happyThreadPool //共享进程池
    // }),
    new webpack.ProvidePlugin({
        // $: 'jquery', //如果一个模块中使用了$这个字符串我就会在模块里自动引入jquery这个模块，这就解决了node_modules下你想在某个包里面引用某个模块。者需要引入$这个变量。
        _: 'lodash'
    }),
    new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
        chunkFilename: "[name].[contenthash:8].chunk.css"
    })
]

isAnalyze && plugins.unshift(new BundleAnalyzerPlugin({
    analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
    generateStatsFile: true, // 是否生成stats.json文件
}))

const makePlugins = (configs, plugins) => {
    Object.keys(configs.entry).forEach(item => {
        plugins.push(
            new HtmlWepbackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: `${item}.html`,
                script: {
                    ERUDA: isDevMode ? '<script src="//cdn.bootcdn.net/ajax/libs/eruda/2.3.3/eruda.js"></script><script>eruda.init();</script>' : '',
                },
                chunks: ['runtime', 'vendors', item]
            })
        )
    })
    return plugins
}

const config = {
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../assets')
        }
    },
    performance: {
        maxEntrypointSize: 1000000,
        maxAssetSize: 200000,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    plugins: [
                        ["@babel/plugin-transform-runtime", {
                            "corejs": "3",
                            "helpers": true,
                            "regenerator": true,
                            "useESModule": false
                        }], // @babel/plugin-transform-runtime & @babel/runtime-corejs2 解决使用babel/polyfill, babel-preset-env 会将promise, map等es6的函数定义在全局，当时用第三方库的时候，第三方库可能会被污染的问题
                        'dynamic-import-webpack' // @babel/plugin-syntax-dynamic-import  支持异步js的写法 import('xx.js').then(({default: file}) => {})
                    ],
                    presets: [
                        ['@babel/preset-env']
                    ],
                    cacheDirectory: true,
                    cacheCompression: false
                },
            },
                // {
                //     // 把js文件粗粒交给id为happyBabel的HappyPack的实例执行
                //     loader: "happypack/loader?id=happyBabel"
                // }
            ]
        },
        {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.css$/,
            use: getStyleLoaders({
                importLoaders: 1,
            })
        },
        {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: getStyleLoaders({
                importLoaders: 2,
            }, 'sass-loader')
        },
        {
            test: /\.module\.(scss|sass)$/,
            use: getStyleLoaders({
                importLoaders: 2,
                sourceMap: isProdMode,
                modules: {
                    localIdentName: '[local]_[hash:base64:6]'
                },
            }, 'sass-loader')
        },
        {
            test: /\.(jpe?g|png|gif)$/i,
            use: getFileLoader(10240, 'img/[name].[hash:8].[ext]')
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            use: getFileLoader(10240, 'media/[name].[hash:8].[ext]')
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
            use: getFileLoader(10240, 'font/[name].[hash:8].[ext]')
        }
        ]
    },
    optimization: {
        // 把runtime部分的代码抽离出来单独打包
        // runtime部分的代码是管理各个模块的连接(模块之间的引用关系)
        // mainfest代码是每个模块的详细要点，runtime根据mainfest来解析和加载模块
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: {
            chunks: 'all', // 如果是async那就是只对异步代码做代码分割
            minSize: 20000, // 打包的引入的模块大于20000字节，就做模块分割
            minRemainingSize: 0,
            maxSize: 50000,
            minChunks: 1, // 引入的模块最少引入次数，超过才打包
            maxAsyncRequests: 30, // 同时加载的模块树
            maxInitialRequests: 30,
            automaticNameDelimiter: '~', // 组和文件名的连接符
            enforceSizeThreshold: 50000,
            // name: true, // 打包起什么名字
            cacheGroups: {
                // vendors组, 不过我将再线上环境使用dll,第三方引用
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/, // 打包的文件来自node_modules
                    priority: -10, // 不同组的优先级
                    filename: 'vendors.js',
                    /*对这种打包文件放到vendors.js中*/
                    reuseExistingChunk: true //
                },
                // 默认组
                default: {
                    minChunks: 2,
                    priority: -20, // 同时满足多个组条件，谁的优先级高就用谁
                    reuseExistingChunk: true // 如果一个模块已经被打包了，就用之前打包的模块做引用
                }
            }
        }
    },
}

config.plugins = makePlugins(config, plugins)

module.exports = config
