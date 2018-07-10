import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'robot',
    children: [{
      path: 'robot',
      component: () => import('@/views/robot/index'),
      name: 'robot',
      meta: { title: 'robot', icon: 'component', roles: ['role_admin'], noCache: true }
    }]
  },
  {
    path: '',
    component: Layout,
    redirect: 'userManage',
    children: [{
      path: 'userManage',
      component: () => import('@/views/userManage/index'),
      name: 'userManage',
      meta: { title: 'userManage', icon: 'documentation', noCache: true }
    }]
  },
  {
    path: '*', redirect: '/404', hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'gateway',
    children: [{
      path: 'gateway',
      component: () => import('@/views/gateway/index'),
      name: 'gateway',
      meta: { title: 'gateway', icon: 'icon', noCache: true }
    }]
  },
  {
    path: '*', redirect: '/404', hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'sim',
    children: [{
      path: 'sim',
      component: () => import('@/views/sim/index'),
      name: 'sim',
      meta: { title: 'sim', icon: 'tab', noCache: true }
    }]
  },
  {
    path: '',
    component: Layout,
    redirect: 'template/index',
    alwaysShow: true,
    meta: {
      title: 'template',
      icon: 'component'
    },
    children: [{
      path: 'template/add',
      component: () => import('@/views/template/index'),
      name: 'templateAdd',
      meta: { title: 'templateAdd', icon: 'component', noCache: true }
    },
    {
      path: 'template/index',
      component: () => import('@/views/template/list'),
      name: 'templateList',
      meta: { title: 'templateList', icon: 'component', noCache: true }
    }]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/index',
    meta: {
      title: 'task',
      icon: 'component'
    },
    children: [
      {
        path: 'task/index',
        component: () => import('@/views/task/index'),
        name: 'taskList',
        meta: { title: 'taskList', icon: 'tab', noCache: true }
      },
      {
        path: 'task/addTask',
        component: () => import('@/views/task/addTask'),
        name: 'addTask',
        meta: { title: 'addTask', icon: 'component', noCache: true }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'userConfig',
    children: [{
      path: 'userConfig',
      component: () => import('@/views/userConfig/index'),
      name: 'userConfig',
      meta: { title: 'userConfig', icon: 'component', noCache: true }
    }]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

