import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import nProgress from 'nprogress'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 获取本地用户信息(store.getters.user)
  const hasGetUserInfo = store.getters.user;

  if (to.meta.auth) { //页面需要鉴权(判断router中meta.auth属性)
    if (hasGetUserInfo) { //有用户信息,放行
      next();
    } else { //没有用户信息,检查token
      const hasToken = localStorage.getItem('adminToken');
      if (hasToken) { //有token,验证token有效性
        try { //获取仓库中的用户信息(whoami)
          await store.dispatch('user/getUserInfo')
          next();
        } catch (error) { //无效token,删除token
          await store.dispatch('user/resetToken')
          Message.error('登录过期,请重新登录');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else { //没有token,进入登录页
        next(`/login?redirect=${to.path}`);
        nProgress.done();
      }
    }
  } else { //页面不需要鉴权
    if (to.path === '/login' && hasGetUserInfo) {
      next({ //登录状态下前往login,导航到主页
        path: "/"
      });
    } else { //未登录
      next();
    }
    nProgress.done();
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
