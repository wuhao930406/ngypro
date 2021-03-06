// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const { pwa, primaryColor } = defaultSettings;
const { NODE_ENV, APP_TYPE, TEST,npm_config_argv } = process.env;


let allOk = JSON.parse(npm_config_argv).original,
    allStr = allOk[allOk.length-1];

let IpAndPort = allStr.indexOf("4399")!=-1?'http://172.21.3.137:8080/':
  allStr.indexOf("8002")!=-1?'http://172.21.3.124:8080/':
  allStr.indexOf("8500")!=-1?'http://101.132.66.226:8500/':
  allStr.indexOf("3600")!=-1?'http://172.21.3.180:8080/':
  allStr.indexOf("3700")!=-1?'http://172.21.3.102:8080/':
  allStr.indexOf("8888")!=-1?'http://172.21.3.74:8080/':
  allStr.indexOf("8448")!=-1?'http://172.21.3.134:8080/':
  "http://101.132.66.226:8400/",
  AsdPort = 'http://172.21.3.180:8604/';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : {},
      ...(!TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
if (APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: APP_TYPE || '',
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  // externals: {
  //   '@antv/data-set': 'DataSet',
  //   bizcharts: 'BizCharts',
  // },
  proxy: {
     '/ngy/': {
       'target':IpAndPort,
       changeOrigin: true,
       pathRewrite: { '^/ngy': '' },
     },
     '/ps/':{
       'target':"http://172.21.3.2",
       changeOrigin: true,
       pathRewrite: { '^/ps': '' },
     },
     '/asd/':{//设备数据采集ip+端口
       'target':AsdPort,
       changeOrigin: true,
       pathRewrite: { '^/asd': '' },
     },
     
   },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ){
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  publicPath:"./",
  history: 'hash',
  manifest: {
    basePath: './',
  },
  chainWebpack: webpackPlugin,
};
