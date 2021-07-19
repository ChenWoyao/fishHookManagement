import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, connect, history } from 'umi';
import { Result, Button } from 'antd'; // 导入Authorized，并在window上注入一个reloadAuthorized

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent'; // import { getMatchMenu } from '@umijs/route-utils';

import logo from '../assets/logo.svg';
import permissionRoute from './permissionRoute';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/** Use Authorized check all menu item */
// 这里的menuList会由ProLayout这组件做处理获得
// 处理的规则是将ProLayout组件的children进行深度遍历处理

const menuDataRender = (menuList) => {
  const menuData = menuList.map((item) => {
    // console.log('item:', item)
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  }); // console.log('menuData', menuData)

  return menuData;
};

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 小明哥出品`}
    links={[
      {
        key: '版本',
        title: '版本:V1.0',
        // href: '#',
        blankTarget: true,
      },
      {
        key: '电话:',
        title: '电话: 18569063403',
        // href: '#',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(() => {
    const { pathname } = location;

    const getMatchMenu = (pathname, routeList) => {
      let result = {
        authority: undefined,
      };

      for (let i = 0; i < routeList.length; i++) {
        const routeItem = routeList[i];

        if (pathname === routeItem.path) {
          result = {
            authority: routeItem.authority,
          };
        }
      }

      return result;
    };

    const result = getMatchMenu(pathname, permissionRoute);
    return result;
  }, [location.pathname]);
  return (
    <>
      <ProLayout
        logo={logo}
        title="外野飞蝇产能管理系统"
        {...props}
        {...settings}
        onCollapse={handleMenuCollapse} // menu 菜单的头部点击事件
        onMenuHeaderClick={() => history.push('/')} // 自定义菜单项的 render 方法
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }} // 自定义面包屑的数据
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: '/',
        //     breadcrumbName: formatMessage({
        //       id: 'menu.home',
        //     }),
        //   },
        //   ...routers,
        // ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }} // 自定义页脚的 render 方法
        footerRender={() => {
          if (settings.footerRender || settings.footerRender === undefined) {
            return defaultFooterDom;
          }

          return null;
        }} // menuData 的 render 方法，用来自定义 menuData
        menuDataRender={menuDataRender} // 自定义头右部的 render 方法
        rightContentRender={() => <RightContent />} // 在显示前对菜单数据进行查看，修改不会触发重新渲染
        postMenuData={(menuData) => {
          menuDataRef.current = menuData || [];
          return menuData || [];
        }}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
