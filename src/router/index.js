import Vue from 'vue'
import Router from 'vue-router'
import userStore from '@/utils/userStore'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/main-layout'),
    meta: { requiresAuth: true } // 需要登录
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('@/views/knowledge'),
    meta: { requiresAuth: true } // 需要登录
  },
  {
    path: '/predict',
    name: 'predict',
    component: () => import('@/views/predict'),
    meta: { requiresAuth: true } // 需要登录
  },
  {
    path:'/register'
    ,name:'register'
    ,component:()=>import('@/views/register')
  },
]

const router = new Router({
  routes: routes
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  console.log('路由守卫触发:', {
    to: to.path,
    from: from.path,
    requiresAuth: to.matched.some(record => record.meta.requiresAuth),
    isLoggedIn: userStore.isLoggedIn(),
    userInfo: userStore.getCurrentUser()
  });

  // 避免无限循环：如果从登录页跳转到登录页，直接通过
  if (to.path === '/login' && from.path === '/login') {
    console.log('登录页内部跳转，直接通过');
    next();
    return;
  }

  // 检查路由是否需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录的页面
    if (!userStore.isLoggedIn()) {
      console.log('用户未登录，跳转到登录页');
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原始跳转路径
      });
    } else {
      console.log('用户已登录，继续访问');
      // 已登录，继续访问
      next();
    }
  } else {
    // 不需要登录的页面
    if (to.path === '/login' && userStore.isLoggedIn()) {
      console.log('已登录用户访问登录页，跳转到首页');
      // 如果已登录，访问登录页时跳转到首页
      // 使用replace避免历史记录问题
      next('/');
    } else {
      console.log('访问公开页面');
      next();
    }
  }
});

export default router