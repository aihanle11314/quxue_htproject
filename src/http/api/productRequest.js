import request from '../request'
import store from '../../store'
import Qs from 'qs'

// 产品(项目)列表
export function getProjectList () {
  let uid = store.getters.userId
  return request({
    url: '/Project/projectlist',
    method: 'get',
    params: { uid }
  })
}

// 添加/编辑产品(项目)
export function updateProject (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Project/addproject',
    method: 'post',
    data: param
  })
}

// 删除产品(项目)
export function delProject (id) {
  let uid = store.getters.userId
  return request({
    url: '/Project/delproject',
    method: 'get',
    params: {uid, id}
  })
}
