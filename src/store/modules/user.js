import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    userInfo: null //存储登录后的用户信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, payload) => {
    state.userInfo = payload;
  }
}

const actions = {
  // user login
  userLogin({
    commit
  }, userInfo) {

    // userInfo是用户提交的数据,将数据发送到服务器
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        const {
          data
        } = res;
        if (data) {
          commit('SET_USERINFO', data)
          resolve()
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info（恢复登录状态）
  getUserInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        if (typeof res === 'string') {
          //未登录或token已经过期
          res = JSON.parse(res);
          if (res.code === 401) {
            reject(res.msg);
          }
        } else { //token正常，将用户信息存进vuex仓库
          commit('SET_USERINFO', res.data);
          resolve();
        }
      })
    })
  },

  // user logout
  userLogout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token（删除失效token）
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 如果你在模块里面开启了 namespaced: true，命名空间约束了vuex的变量全局使用，
// 那么之前我们一直常用的一种写法dispatch(‘action名’)就会报unknown action type
// 解决办法：this.$store.dispatch("user/userLogout")
// user是模块名，userLogout是actions名
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
