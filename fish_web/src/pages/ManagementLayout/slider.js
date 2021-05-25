import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
    UserOutlined,
} from '@ant-design/icons'

const Sider = Layout.Sider
const { SubMenu } = Menu
const log = console.log.bind(console)

const Slider = (props) => {
    const { collapsed } = props

    return (
        <Sider breakpoint="lg" collapsedWidth="0" className="siderLarge" style={{
            display: collapsed ? 'none' : 'initial'
        }}>
            {
                collapsed ?
                    null
                    :
                    <div className="logo">
                        外野飞蝇产能管理系统
                    </div>
            }
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <SubMenu key="admin" icon={<UserOutlined />} title="管理员相关页面">
                    <Menu.Item key="AdminHome">
                        <Link to="/admin/home">产品信息管理页面</Link>
                    </Menu.Item>
                    <Menu.Item key="AdminSalerBehavior">
                        <Link to="/admin/salerBehavior">销售人员行为管理页面</Link>
                    </Menu.Item>
                    <Menu.Item key="AdminUserManagement">
                        <Link to="/admin/userManagement">用户管理页面</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="qualityInspector" icon={<UserOutlined />} title="质检员相关页面">
                    <Menu.Item key="QualityInspectorHome">
                        <Link to="/qualityInspector/home">产品信息管理页面</Link>
                    </Menu.Item>
                    <Menu.Item key="QualityInspectorProduction">
                        <Link to="/qualityInspector/productionStaffBehavior">
                            生产人员管理页面
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="saler" icon={<UserOutlined />} title="销售人员相关页面">
                    <Menu.Item key="SalerHome">
                        <Link to="/saler/home">产品信息管理页面</Link>
                    </Menu.Item>
                    <Menu.Item key="SalerOrder">
                        <Link to="/saler/order">订单状态页面</Link>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    )
}

export default React.memo(Slider)
