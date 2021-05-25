import React, { useState, useCallback, useEffect } from 'react'
import './index.scss'
import { Layout } from 'antd'
import Slider from './slider'
import { debounce } from '../../utils/help'
import { renderRoutes } from 'react-router-config'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout
const log = console.log.bind(console)

const ManagementLayout = (props) => {
    const [collapsed, setCollapsed] = useState(false)
    const [showPhoneStyle, SetShowPhoneStyle] = useState(false)
    const { route } = props

    useEffect(() => {
        const CollpaseFunc = () => {
            const htmlWidth = document?.documentElement?.clientWidth || document?.body?.clientWidth
            if (htmlWidth <= 420) {
                SetShowPhoneStyle(true)
            } else {
                SetShowPhoneStyle(false)
            }
        }
        CollpaseFunc()
        const debounceCollapse = debounce(CollpaseFunc, 20, false)
        window.addEventListener('resize', debounceCollapse)
    }, [])

    const useToggle = useCallback(() => {
        setCollapsed(collapsed => !collapsed)
    }, [])

    return (
        <Layout>
            <Slider collapsed={collapsed} />
            <Layout
                className="site-layout"
                style={{
                    height: '100vh'
                }}
            >
                <Header className="header">
                    <div className="menuFold">
                        {
                            showPhoneStyle ?
                                null
                                :
                                collapsed ?
                                    <MenuUnfoldOutlined className="trigger" onClick={useToggle} />
                                    :
                                    <MenuFoldOutlined className="trigger" onClick={useToggle} />
                        }
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '10px 16px 0',
                        minHeight: 280,
                    }}
                >
                    <div className='container'>
                        {renderRoutes(route.routes)}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                    className="footer">
                    <span className="footer__item">版本:V1.0</span>
                    <span className="footer__item">版权所有者: by 小明哥</span>
                    <span className="footer__item">电话: 18569063403</span>
                </Footer>
            </Layout>
        </Layout>
    )
}

export default ManagementLayout
