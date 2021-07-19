const Koa = require('koa')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const staticFiles = require('koa-static')
const Router = require('koa-router')
const fs = require('fs')

const app = new Koa()
const router = new Router()
const JSON_MIME = 'application/json'

const cors = require('@koa/cors')

app.use(cors({
    origin: '*'
}))

app.use(bodyParser({
    multipart: true
}))
/**
 * 强制缓存: Cache-Control > expires(一般不用了)
 * 协商缓存: Etag/If-None-Match > Last-Modified/If-Modified-Since
 *
 * max-age 是 caceh-control设置的，如果过期，资源带有Etag标识，发送If-None-Match
 * 优先根据Etag的值判断被请求的文件有没有做修改，Etag值一致则没有修改，命中协商缓存，返回304；
 * 如果不一致则有改动，直接返回新的资源文件带上新的Etag值并返回200；；
 *
 * 如果服务器收到的请求没有Etag值，则将If-Modified-Since和被请求文件的最后修改时间做比对，
 * 一致则命中协商缓存，返回304；不一致则返回新的last-modified和文件并返回200；
 */
app.use(staticFiles(path.resolve(__dirname, './upload'), {
    maxage: 30 * 24 * 60 * 60 * 1000
}))

// app.use(async (context, next) => {
//     context.type = JSON_MIME
//     await next()
// })

function render(page) {
    return new Promise((resolve, reject) => {
        let viewUrl = `./upload/${page}`
        fs.readFile(viewUrl, "binary", (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}


router.get('/', async function (ctx, next) {
    let html = await render('index.html')
    console.log('html', html)
    ctx.body = html
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8081)
console.log('app service start at 8080')
