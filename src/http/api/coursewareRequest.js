import request from '../request'
import store from '../../store'
import Qs from 'qs'

// 添加级别
export function addCourseLevel (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/TalkCouware/addCouLevel',
    method: 'post',
    data: param
  })
}
// 删除级别
export function delCourseLevel (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/TalkCouware/delCouLevel',
    method: 'post',
    data: param
  })
}
// 重置账号
export function accountReset (account) {
  let param = {
    account
  }
  param = Qs.stringify(param)
  return request({
    url: '/TalkCouware/resetAccount',
    method: 'post',
    data: param
  })
}
// 账号延期
export function accountDelay (account, eff) {
  let param = {
    account,
    eff
  }
  param = Qs.stringify(param)
  return request({
    url: '/TalkCouware/delayAccount',
    method: 'post',
    data: param
  })
}
