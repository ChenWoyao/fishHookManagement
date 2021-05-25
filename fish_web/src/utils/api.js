import axios from 'axios'
import { serialize } from './help'

export const source = axios.CancelToken.source()

const baseConfig = {
    timeout: '2000',
    baseURL: 'http://121.5.231.10/api/',
    // 上传处理进度事件
    onUploadProgress: function (progressEvent) {
        console.log(`上传进度${progressEvent.loaded / progressEvent.total * 100}%`)
    },
    // 下载处理进度事件
    onDownloadProgress: function (progressEvent) {
        console.log(`下载进度${progressEvent.loaded / progressEvent.total * 100}%`)
    },
    cancelToken: source.token
}

// const options = {
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencode'
//     },
//     url: '/user/all',
//     method: 'post',
//     withCredentials: false, // 跨域请求时是否需要使用凭证(Cookie)
//     data: {
//         username: 'woyao'
//     },
// }

export const createRequest = (options) => {
    const instance = axios.create(baseConfig)

    instance.interceptors.request.use(config => {
        switch (config.headers && config.headers['Content-Type']) {
            case 'application/x-www-form-urlencoded':
                config.data = serialize(config.data)
                break
            case 'multipart/form-data':
                if (data instanceof HTMLFormElement) {
                    data = new FormData(data)
                } else {
                    Promise.reject('data type is not valid of your ContentType defined')
                }
                break
            case 'application/json':
                break
            default:
                break
        }
        return config
    }, error => {
        return Promise.reject(error)
    })
    instance.interceptors.response.use((response) => {
        return response
    }, (error) => {
        return Promise.reject(error)
    })
    return instance(options)
}


// 手动取消请求
// source.cancel('Operation canceled by the user.')
