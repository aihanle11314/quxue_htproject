import request1 from '../request1'
import request2 from '../request2'
import request from '../request'
import store from '../../store'
import Qs from 'qs'

// 首页banner列表
export function getBanner (type, keywords, page) {
  return request1({
    url: '/api/slide/index',
    method: 'get',
    params: {type, keywords, page}
  })
}

// 删除banner
export function delBanner (id) {
  return request1({
    url: '/api/slide/delete',
    method: 'get',
    params: {id}
  })
}

// 教师编码
export function getTeacherCode () {
  return request2({
    url: '/quxue/getAllTeacherNumber',
    method: 'post',
    data: {}
  })
}

// 添加教师编码
export function addTeacherCode (param) {
  param = Qs.stringify(param)
  return request2({
    url: '/quxue/addTeacherNumber',
    method: 'post',
    data: param
  })
}

// 总计数据
export function getAppStatTotal () {
  let uid = store.getters.userId
  return request({
    url: '/App/totalsinfo',
    method: 'get',
    params: {uid}
  })
}
// 机构统计数据
export function getAppStatistics (oname, page) {
  let uid = store.getters.userId
  return request({
    url: '/App/talklist',
    method: 'get',
    params: {uid, key_word: oname, page}
  })
}
// 机构班级详情
export function getAppClasses (oid, level, cname, tname, stime, etime, page) {
  let uid = store.getters.userId
  return request({
    url: '/OrganizationDetailStatistics/organizationdatadetaillist',
    method: 'get',
    params: {uid, oid, level, teacher_name: tname, class_name: cname, start_time: stime, end_time: etime, page}
  })
}

// 解锁教材
export function unlockStudent (param) {
  let starter = ''
  for (let i = 0; i < param.starter.length; i++) {
    if (i === param.starter.length - 1) {
      starter += param.starter[i]
    } else {
      starter += param.starter[i] + ','
    }
  }
  param.starter = starter
  let level = ''
  for (let i = 0; i < param.level.length; i++) {
    if (i === param.level.length - 1) {
      level += param.level[i]
    } else {
      level += param.level[i] + ','
    }
  }
  param.level = level
  let phonics = ''
  for (let i = 0; i < param.phonics.length; i++) {
    if (i === param.phonics.length - 1) {
      phonics += param.phonics[i]
    } else {
      phonics += param.phonics[i] + ','
    }
  }
  param.phonics = phonics
  param = Qs.stringify(param)
  return request({
    url: '/Generate/allAccount',
    method: 'post',
    data: param
  })
}
// 学生电子卡号
export function getStudentCard (number) {
  let uid = store.getters.userId
  return request({
    url: '/Generate/genElecCard',
    method: 'get',
    params: {uid, number}
  })
}
// 学生电子卡号查询
export function getStudentCardMore (card, mobile) {
  let uid = store.getters.userId
  let param = {
    uid,
    card,
    mobile
  }
  param = Qs.stringify(param)
  return request({
    url: '/Generate/getAccountByCard',
    method: 'post',
    data: param
  })
}
// 获取班级级别列表
export function getAppClassLevel () {
  let uid = store.getters.userId
  return request({
    url: '/Generate/getLevelList',
    method: 'get',
    params: {uid}
  })
}
// 修改班级级别
export function updateClassLevel (param) {
  param = Qs.stringify(param)
  return request({
    url: '/Generate/editClass',
    method: 'post',
    data: param
  })
}
// 修改学生级别
export function updateStudentLevel (param) {
  param = Qs.stringify(param)
  return request({
    url: '/Generate/editStuLevel',
    method: 'post',
    data: param
  })
}
