import request from '../request'
import store from '../../store'
import Qs from 'qs'

// 用户登录
export function login (param) {
  param = Qs.stringify(param)
  return request({
    url: '/AdminUser/login',
    method: 'post',
    data: param
  })
}
// 获取用户权限
export function getRole () {
  let uid = store.getters.userId
  return request({
    url: '/AdminUser/getrole',
    method: 'get',
    params: {uid}
  })
}
// 修改密码
export function changePass (param) {
  return request({
    url: '',
    method: 'post',
    data: param
  })
}
