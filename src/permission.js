import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// permissiom judge
// function hasPermission (roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
//   if (!permissionRoles) return true
//   // return roles.some(role => permissionRoles.indexOf(role) >= 0)
//   return permissionRoles.indexOf(roles) >= 0
// }

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/home' })
      console.log('11111')
    } else {
      if (store.getters.roles === '') {
        store.dispatch('GetRole').then(res => { // 拉取用户信息
          const roles = store.getters.roles
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
            next({ path: '' })
            console.log('2222')
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            // Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        next()
        console.log('3333')
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
      console.log('4444')
    } else {
      next('/login')
      NProgress.done()
      console.log('5555')
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
