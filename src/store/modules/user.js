import { login, getRole } from '@/http/api/userRequest'
import { getToken, setToken, removeToken, getUserId, setUserId, removeUserId } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userId: parseInt(getUserId()),
    name: '',
    roles: ''
  },

  getters: {
    token: state => state.token,
    userId: state => state.userId,
    name: state => state.name,
    roles: state => state.roles
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, uid) => {
      state.userId = uid
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const dataw = response.data
          setToken(dataw.token)
          commit('SET_TOKEN', dataw.token)
          setUserId(dataw.uid)
          commit('SET_USERID', dataw.uid)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取权限
    GetRole ({ commit }) {
      return new Promise((resolve, reject) => {
        getRole().then(response => {
          const dataw = response.data
          commit('SET_ROLES', dataw.role_name)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_USERID', '')
      commit('SET_ROLES', '')
      removeToken()
      removeUserId()
    }
  }
}

export default user
