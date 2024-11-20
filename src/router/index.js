import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/main-layout')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('@/views/knowledge')
  },
  {
    path: '/predict',
    name: 'predict',
    component: () => import('@/views/predict')
  },
  {
    path:'/register'
    ,name:'register'
    ,component:()=>import('@/views/register')
  }
]

const router = new Router({
  routes: routes
})

export default router