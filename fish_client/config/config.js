// https://umijs.org/config/
import { defineConfig } from 'umi';
// 默认布局配置，可以通过抽屉生成想要的配置，放到这里
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  // 配置是否让生成的文件包含 hash 后缀
  hash: true,
  // 使用antd
  antd: {},
  // dva的热更新--dva=react-router+redux+redux-gux
  dva: {
    hmr: true,
  },
  // 哈希路由模式，默认是浏览器模式
  history: {
    type: 'hash',
    // type: 'browser'
  },
  // 支持多语言
  // locale: {
  //   // default zh-CN
  //   default: 'zh-CN',
  //   antd: true,
  //   // default true, when it is true, will use `navigator.language` overwrite default
  //   baseNavigator: true,
  // },
  // 支持按需导入
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      // 这个布局用了一个不错的插件
      component: '../layouts/BlankLayout',
      routes
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  // umi build的时候，给所有文件路径加前缀
  // publicPath: './',
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
