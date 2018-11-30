import request from '../request'
import store from '../../store'
import Qs from 'qs'

// 配音列表
// eslint-disable-next-line camelcase
export function getPeiyinList (order_condition, is_recommend, is_top, type_id, name, page) {
  let uid = store.getters.userId
  return request({
    url: '/Dubs/lists',
    method: 'get',
    params: { uid, order_condition, is_recommend, is_top, type_id, name, page }
  })
}
// 编辑配音列表
export function editPy (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubs/edit', // url
    method: 'post',
    data: param
  })
}
// 删除配音
// eslint-disable-next-line camelcase
export function deletepeiyin (base_id) {
  let uid = store.getters.userId
  return request({
    url: '/Dubs/deldubs', // 删除配音url
    method: 'get',
    params: {uid, base_id}
  })
}
// 获取配音类型
export function getpeiyinType () {
  let uid = store.getters.userId
  return request({
    url: '/Dubtype/getall', // 获取配音类型url
    method: 'get',
    params: {uid}
  })
}
// 获取配音标签
export function getpeiyinLabel () {
  let uid = store.getters.userId
  return request({
    url: '/Dubtags/getall', // 获取配音类型url
    method: 'get',
    params: {uid}
  })
}
// 操作置顶
// eslint-disable-next-line camelcase
export function operateTop ({base_id, is_top}) {
  let uid = store.getters.userId
  // param['uid'] = uid
  // param = Qs.stringify(param)
  return request({
    url: '/Dubs/settop', // 操作置顶url
    method: 'get',
    //   data: param
    params: {uid, base_id, is_top}
  })
}
// 操作推荐
// eslint-disable-next-line camelcase
export function operateRecommend ({base_id, is_recommend}) {
  let uid = store.getters.userId
  // param['uid'] = uid
  // param = Qs.stringify(param)
  return request({
    url: '/Dubs/sethot', // 操作置顶url
    method: 'get',
    //   data: param
    params: {uid, base_id, is_recommend}
  })
}
// 显示隐藏配音项
export function hidePeiyin (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  return request({
    url: '/Dubs/edithide', // url
    method: 'post',
    data: param
  })
}
// 权重列表
// export function getQZList () {
//   let uid = store.getters.userId
//   return request({
//     url: '',//url
//     method: 'get',
//     params: {uid: uid}
//   })
// }
//

// 提交配音分类
export function updateClass (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Dubtype/create', // url
    method: 'post',
    data: param
  })
}
// 获取配音分类列表
export function getPyclassList (page, name) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtype/lists', // url
    method: 'get',
    params: {uid, page, name}
  })
}
// 删除配音分类
// eslint-disable-next-line camelcase
export function deletepyClass (type_id) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtype/deltype', // 删除配音url
    method: 'get',
    params: {uid, type_id}
  })
}
// 隐藏/显示配音分类
export function hidepyClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubtype/edithide', // url
    method: 'post',
    data: param
  })
}
// 编辑配音分类
export function editpyClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubtype/edit', // url
    method: 'post',
    data: param
  })
}
// 获取标签分类列表
export function getLbclassList (page, name) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtags/lists', // url
    method: 'get',
    params: {uid, page, name}
  })
}
// 删除标签分类
// eslint-disable-next-line camelcase
export function deletelbClass (tags_id) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtags/deltags', // 删除配音url
    method: 'get',
    params: {uid, tags_id}
  })
}
// 隐藏/显示标签分类
export function hidelbClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubtags/edithide', // url
    method: 'post',
    data: param
  })
}
// 编辑标签分类
export function editlbClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: 'Dubtags/edit', // url
    method: 'post',
    data: param
  })
}
// 提交标签分类
export function updateLabel (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Dubtags/create', // url
    method: 'post',
    data: param
  })
}
// 获取配音素材列表
// eslint-disable-next-line camelcase
export function getPymaterialList (page, base_id, name) {
  let uid = store.getters.userId
  return request({
    url: '/Dubs/baglist', // url
    method: 'get',
    params: {uid, page, base_id, name}
  })
}editpyMate
// 编辑配音素材
export function editpyMate (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubs/editbags', // url
    method: 'post',
    data: param
  })
}
