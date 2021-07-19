export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user/login',
        name: 'login',
        component: './User/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/User/register',
        component: './User/register',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/User/register-result',
        component: './User/register-result',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/',
    // 判断当前用户是否登录，没有登录走login页面
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            icon: 'dashboard',
            name: '首页',
            component: './Home',
          },
          {
            path: '/admin',
            icon: 'profile',
            name: '管理员菜单栏',
            authority: ['admin', 'superadmin'],
            routes: [
              {
                path: '/',
                redirect: '/admin/product-information-query',
                authority: ['admin', 'superadmin']
              },
              {
                name: '产品信息查询管理',
                icon: 'smile',
                path: '/admin/product-information-query',
                component: './admin/product-information-query',
                authority: ['admin', 'superadmin']
              },
              {
                name: '生产订单信息查询管理',
                icon: 'smile',
                path: '/admin/production-order-status-query',
                component: './admin/production-order-status-query',
                authority: ['admin', 'superadmin']
              },
              {
                name: '用户信息查询管理',
                icon: 'smile',
                path: '/admin/user-management',
                component: './admin/user-management',
                authority: ['admin', 'superadmin']
              },
              {
                name: '客户信息查询管理',
                icon: 'smile',
                path: '/admin/client-management',
                component: './admin/client-management',
                authority: ['admin', 'superadmin']
              },
              {
                name: '销售订单信息查询管理',
                icon: 'smile',
                path: '/admin/sales-order-status-query',
                component: './admin/sales-order-status-query',
                authority: ['admin', 'superadmin']
              },
            ],
          },
          {
            path: '/inspector',
            name: '质检员菜单栏',
            icon: 'profile',
            authority: ['inspector'],
            routes: [
              {
                path: '/',
                redirect: '/inspector/product-information-query',
                authority: ['inspector'],
              },
              {
                name: '产品信息查询',
                icon: 'smile',
                path: '/inspector/product-information-query',
                component: './inspector/product-information-query',
                authority: ['inspector'],
              },
              {
                name: '收货质检审批',
                icon: 'smile',
                path: '/inspector/production-order-status-query',
                component: './inspector/production-order-status-query',
                authority: ['inspector'],
              },
            ],
          },
          {
            path: '/operator',
            name: '生产员菜单栏',
            icon: 'profile',
            authority: ['operator'],
            routes: [
              {
                path: '/',
                redirect: '/operator/product-information-query',
                authority: ['operator'],
              },
              {
                name: '交货',
                icon: 'smile',
                path: '/operator/production-order-status-query',
                component: './operator/production-order-status-query',
                authority: ['operator'],
              },
            ],
          },
          {
            component: '404',
          },
        ],
      }
    ]
  },
]
