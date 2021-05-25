import React from "react";
import { Redirect } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound"
import ManagementLayout from "./pages/ManagementLayout";

import AdminHome from './pages/Admin/Home'
import AdminSalerBehavior from './pages/Admin/SalerBehavior'
import AdminUserManagement from './pages/Admin/UserManagement'

import QualityInspectorHome from './pages/QualityInspector/Home'
import QualityInspectorProduction from './pages/QualityInspector/ProductionBehavior'

import SalerHome from './pages/Saler/Home'
import SalerOrder from './pages/Saler/Order'

import ProductionStaffHome from './pages/ProductionStaff'

export default [
    {
        path: '/admin',
        component: ManagementLayout,
        routes: [
            {
                path: '/admin',
                exact: true,
                render: () => {
                    return <Redirect to={'/admin/home'}></Redirect>
                }
            },
            {
                path: '/admin/home',
                component: AdminHome,
            },
            {
                path: '/admin/salerBehavior',
                component: AdminSalerBehavior,
            },
            {
                path: '/admin/userManagement',
                component: AdminUserManagement,
            }
        ]
    },
    {
        path: '/qualityInspector',
        component: ManagementLayout,
        routes: [
            {
                path: '/qualityInspector',
                exact: true,
                render: () => {
                    return <Redirect to={'/qualityInspector/home'}></Redirect>
                }
            },
            {
                path: '/qualityInspector/home',
                component: QualityInspectorHome
            },
            {
                path: '/qualityInspector/productionStaffBehavior',
                component: QualityInspectorProduction
            }
        ]
    },
    {
        path: '/saler',
        component: ManagementLayout,
        routes: [
            {
                path: '/saler',
                exact: true,
                render: () => {
                    return <Redirect to={'/saler/home'}></Redirect>
                }
            },
            {
                path: '/saler/home',
                component: SalerHome
            },
            {
                path: '/saler/order',
                component: SalerOrder
            }
        ]
    },
    {
        // 该页面需要手机版
        path: '/productionStaff',
        component: ProductionStaffHome
    },
    {
        // 手机版
        path: '/login',
        component: Login
    },
    {
        // 手机版
        path: "/",
        component: Home,
        exact: true,
    },
    {
        component: NotFound,
    }
];
