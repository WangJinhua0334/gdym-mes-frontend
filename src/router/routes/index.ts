import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';

const modules = import.meta.glob('./modules/**/*.ts', { eager: true });

const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.CUSTOM_HOME, //PageEnum.BASE_HOME,
  meta: {
    //title: 'Root',
    title: t('首页'),
  },
};

// 自定义首页
export const CustomIndex: AppRouteRecordRaw = {
  path: PageEnum.CUSTOM_HOME,
  name: 'Home',
  component: () => import('/@/views/dashboard/AnalysisCustom/index.vue'),
  meta: {
    title: t('首页'),
  },
};

// 自定义首页
export const BiIndex: AppRouteRecordRaw = {
  path: '/bi/prodBoard',
  name: 'prodBoard',
  component: () => import('/@/views/bi/prodBoard/prodBoard.vue'),
  meta: {
    title: t('产线看板'),
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  //新版后台登录，如果想要使用旧版登录放开即可
  // component: () => import('/@/views/sys/login/Login.vue'),
  component: () => import('/@/views/system/loginmini/MiniLogin.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

//update-begin---author:wangshuai ---date:20220629  for：auth2登录页面路由------------
export const Oauth2LoginRoute: AppRouteRecordRaw = {
  path: '/oauth2-app/login',
  name: 'oauth2-app-login',
  //新版钉钉免登录，如果想要使用旧版放开即可
  // component: () => import('/@/views/sys/login/OAuth2Login.vue'),
  component: () => import('/@/views/system/loginmini/OAuth2Login.vue'),
  meta: {
    title: t('routes.oauth2.login'),
  },
};
//update-end---author:wangshuai ---date:20220629  for：auth2登录页面路由------------

/**
 * 【通过token直接静默登录】流程办理登录页面 中转跳转
 */
export const TokenLoginRoute: AppRouteRecordRaw = {
  path: '/tokenLogin',
  name: 'TokenLoginRoute',
  component: () => import('/@/views/sys/login/TokenLoginPage.vue'),
  meta: {
    title: '带token登录页面',
    ignoreAuth: true,
  },
};
// Basic routing without permission
export const basicRoutes = [
  LoginRoute,
  CustomIndex,
  RootRoute,
  ...mainOutRoutes,
  REDIRECT_ROUTE,
  TokenLoginRoute,
  Oauth2LoginRoute,
  BiIndex,
];
