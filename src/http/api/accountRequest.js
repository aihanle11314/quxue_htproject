import request from '../request'
import store from '../../store'
import Qs from 'qs'

// 账户列表
export function getAccountList (username, page) {
  let uid = store.getters.userId
  return request({
    url: '/AdminUser/adminlist',
    method: 'get',
    params: {uid, username, page}
  })
}

// 添加/编辑账户
export function updateAccount (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/AdminUser/editadmin',
    method: 'post',
    data: param
  })
}

// 删除账户
export function delAccount (id) {
  let uid = store.getters.userId
  return request({
    url: '/AdminUser/deladmin',
    method: 'get',
    params: {uid, id}
  })
}

// 角色列表
export function getAcRoleList () {
  let uid = store.getters.userId
  return request({
    url: '/AdminUser/adminrole',
    method: 'get',
    params: { uid }
  })
}

// 添加/编辑角色
export function updateAcRole (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/AdminUser/addrole',
    method: 'post',
    data: param
  })
}

// 删除角色
export function delAcRole (id) {
  let uid = store.getters.userId
  return request({
    url: '/AdminUser/delrole',
    method: 'get',
    params: {uid, id}
  })
}
