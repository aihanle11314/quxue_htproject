import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import rolePermission from './modules/rolePermission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    rolePermission
  }
})

export default store
