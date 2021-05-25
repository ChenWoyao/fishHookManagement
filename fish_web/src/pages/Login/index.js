import React from 'react'
import { Input } from 'antd'

const Login = () => {
    return (
        <div>
            <h3>已注册请登录</h3>
            <Input type="text" placeholder="名字" />
            <Input type="tel" placeholder="电话" />
            <Input type="password" placeholder="密码" />

            <h3>未注册请注册</h3>
            <Input type="text" placeholder="名字" />
            <Input type="tel" placeholder="电话" />
            <Input type="password" placeholder="密码" />
        </div>
    )
}

export default Login
