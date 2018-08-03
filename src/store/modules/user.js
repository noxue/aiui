import { loginByUsername, getUserInfo } from '@/api/login'
import { setToken, removeToken, setAppId } from '@/utils/auth'

const user = {
  state: {
    name: '',
    roles: []
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data.data
          setToken(data.jwt)
          setAppId(username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          const username = response.data.data.account.appId
          localStorage.setItem('username', username)
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          window.localStorage.setItem('role', window.JSON.stringify(data.data.roles))
          if (data.data.roles && data.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }

          commit('SET_NAME', data.data.account.appId)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      commit('SET_ROLES', [])
      localStorage.removeItem('role')
      localStorage.removeItem('username')
      localStorage.removeItem('taskId')
      localStorage.removeItem('appId')
      removeToken()
    },
    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_NAME', data.name)
          resolve()
        })
      })
    }
  }
}

export default user
