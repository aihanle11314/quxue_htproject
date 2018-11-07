import request from '../request'
import store from '../../store'
import Qs from 'qs'

// 机构列表
export function getJGList () {
  let uid = store.getters.userId
  return request({
    url: '/Organization/organizationlist',
    method: 'get',
    params: {uid: uid}
  })
}

// 添加/编辑机构
export function updateJG (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  var pid = ''
  var temp = param['project']
  for (var i = 0; i < temp.length; i++) {
    if (i === temp.length - 1) {
      pid += temp[i]
    } else {
      pid += temp[i] + ','
    }
  }
  param['project'] = pid
  param = Qs.stringify(param)
  return request({
    url: '/Organization/editorganization',
    method: 'post',
    data: param
  })
}

// 删除机构
export function delJG (id) {
  let uid = store.getters.userId
  return request({
    url: '/Organization/delorganization',
    method: 'get',
    params: {uid, id}
  })
}

// 机构账户列表
export function getJGAccountList (name, page) {
  let uid = store.getters.userId
  return request({
    url: '/Organization/accountlist',
    method: 'get',
    params: {uid, name, page}
  })
}

// 添加/编辑机构账户
export function updateJGAccount (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  var pid = ''
  var temp = param['project']
  for (var i = 0; i < temp.length; i++) {
    if (i === temp.length - 1) {
      pid += temp[i]
    } else {
      pid += temp[i] + ','
    }
  }
  param['project'] = pid
  param = Qs.stringify(param)
  return request({
    url: '/Organization/addaccount',
    method: 'post',
    data: param
  })
}

// 删除机构账户
export function delJGAccount (id) {
  let uid = store.getters.userId
  return request({
    url: '/Organization/delaccount',
    method: 'get',
    params: {uid, id}
  })
}

// 重置机构账户密码
export function resetJGAcPsw (id) {
  let uid = store.getters.userId
  return request({
    url: '/Organization/resetpwd',
    method: 'get',
    params: {uid, id}
  })
}

// 角色列表
export function getRoleList () {
  let uid = store.getters.userId
  return request({
    url: '/Project/rolelist',
    method: 'get',
    params: { uid }
  })
}

// 添加/编辑角色
export function updateRole (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Project/addrole',
    method: 'post',
    data: param
  })
}

// 删除角色
export function delRole (id) {
  let uid = store.getters.userId
  return request({
    url: '/Project/delrole',
    method: 'get',
    params: {uid, id}
  })
}
