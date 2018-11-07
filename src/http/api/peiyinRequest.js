import request from '../request'
import store from '../../store'
import Qs from 'qs'

//配音列表
export function getPeiyinList (order_condition, is_recommend, is_top, type_id, name, page) {
    let uid = store.getters.userId
    return request({
      url: '/Dub/index',
      method: 'get',
      params: { uid, order_condition, is_recommend, is_top, type_id, name, page }
    })
  }
//删除配音
export function deletepeiyin (id) {
    let uid = store.getters.userId
    return request({
      url: '',//删除配音url
      method: 'get',
      params: {uid, id}
    })
  }
//获取配音类型
export function getpeiyinType () {
    let uid = store.getters.userId
    return request({
      url: '',//获取配音类型url
      method: 'get',
      params: {uid}
    })
  }
//操作置顶
export function operateTop (class_id, is_top) {
    let uid = store.getters.userId
    // param['uid'] = uid
    // param = Qs.stringify(param)
    return request({
      url: '',//操作置顶url
      method: 'get',
    //   data: param
    params: {uid, class_id, is_top}
    })
  }
//隐藏配音项
export function hidePeiyin (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  return request({
    url: '',//url
    method: 'post',
    data: param
  })
}
//权重列表
// export function getQZList () {
//   let uid = store.getters.userId
//   return request({
//     url: '',//url
//     method: 'get',
//     params: {uid: uid}
//   })
// }
//

//提交配音分类
export function updateClass (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Dubtype/create',//url
    method: 'post',
    data: param
  })
}
//获取配音分类列表
export function getPyclassList (page, name) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtype/lists',//url
    method: 'get',
    params: { uid, page, name}
  })
}
//删除配音分类
export function deletepyClass (type_id) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtype/deltype',//删除配音url
    method: 'get',
    params: {uid, type_id}
  })
}
//隐藏/显示配音分类
export function hidepyClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubtype/edithide',//url
    method: 'post',
    data: param
  })
}
//编辑配音分类
export function editpyClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubtype/edit',//url
    method: 'post',
    data: param
  })
}
//获取标签分类列表
export function getLbclassList (page, name) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtags/lists',//url
    method: 'get',
    params: { uid, page, name}
  })
}
//删除标签分类
export function deletelbClass (tags_id) {
  let uid = store.getters.userId
  return request({
    url: '/Dubtags/deltags',//删除配音url
    method: 'get',
    params: {uid, tags_id}
  })
}
//隐藏/显示标签分类
export function hidelbClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: '/Dubtags/edithide',//url
    method: 'post',
    data: param
  })
}
//编辑标签分类
export function editlbClass (param) {
  let usid = store.getters.userId
  param['uid'] = usid
  param = Qs.stringify(param)
  console.log(param)
  return request({
    url: 'Dubtags/edit',//url
    method: 'post',
    data: param
  })
}
//提交标签分类
export function updateLabel (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Dubtags/create',//url
    method: 'post',
    data: param
  })
}