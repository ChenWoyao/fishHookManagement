import React from 'react';
// 这个插件通过快捷键: ctr + shift + command + c 激活
// 激活后可以看到自己浏览器中使用的组件对应本地哪里的代码
import { Inspector } from 'react-dev-inspector';
const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const Layout = ({ children }) => {
  return <InspectorWrapper>{children}</InspectorWrapper>;
};

export default Layout;
