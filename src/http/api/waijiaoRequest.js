import request from '../request'
import store from '../../store'
import Qs from 'qs'
import request1 from '../request1'

// 机构详情
export function getOrgDetails (keyWords, page) {
  let uid = store.getters.userId
  return request({
    url: '/Organization/statisticslist',
    method: 'get',
    params: { uid, key_words: keyWords, page }
  })
}

// 机构充值列表
export function getChongzhi (oname, rid, butt, stime, etime, page) {
  let uid = store.getters.userId
  return request({
    // url: '/StoredValue/valuelist',
    url: '/rech/getRechList',
    method: 'get',
    params: { uid, oid: oname, rid, butt, stime, etime, page }
  })
}
// 添加机构充值
export function addChongzhi (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param['admin_id'] = uid
  param = Qs.stringify(param)
  return request({
    // url: '/StoredValue/addvalue',
    url: '/rech/addRech',
    method: 'post',
    data: param
  })
}
// 修改机构充值
export function editChongzhi (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param['admin_id'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/rech/editRech',
    method: 'post',
    data: param
  })
}
// 删除机构充值
export function deleteChongzhi (id) {
  let uid = store.getters.userId
  return request({
    url: '/rech/deleteRech',
    method: 'get',
    params: {uid, id}
  })
}
// 获取充值类型
export function getChongzhiType () {
  let uid = store.getters.userId
  return request({
    url: '/RechType/getTypeList',
    method: 'get',
    params: {uid}
  })
}
// 添加充值类型
export function addChongzhiType (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/rechType/addType',
    method: 'post',
    data: param
  })
}
// 修改充值类型
export function editChongzhiType (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/rechType/editType',
    method: 'post',
    data: param
  })
}
// 删除机构充值
export function deleteChongzhiType (id) {
  let uid = store.getters.userId
  return request({
    url: '/RechType/deleteType',
    method: 'get',
    params: {uid, id}
  })
}

// 班级列表、待审课程列表
export function getClassList (oName, cName, cType, courseType, enNme, status, page) {
  let uid = store.getters.userId
  return request({
    url: '/Classes/classlist',
    method: 'get',
    params: { uid, o_name: oName, c_name: cName, class_format: cType, c_type: courseType, en_t_name: enNme, status, page }
  })
}
//待上课程班级列表
export function getClassListOne (oName) {
  let uid = store.getters.userId
  return request({
    url: '/Classes/classall',
    method: 'get',
    params: { uid, o_name: oName}
  })
}
// 添加班级
export function addOrgClass (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Classes/createcourse',
    method: 'post',
    data: param
  })
}
// 编辑班级
export function editOrgClass (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Classes/editclass',
    method: 'post',
    data: param
  })
}
// 删除班级
export function delOrgClass (cid) {
  let uid = store.getters.userId
  return request({
    url: '/Classes/delclass',
    method: 'get',
    params: { uid, c_id: cid }
  })
}
// 班级延课
export function delayClassCourse (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/classes/timeDelay',
    method: 'post',
    data: param
  })
}
// 班级发送短信
export function sendMsm (cid) {
  let uid = store.getters.userId
  var param = {}
  param['uid'] = uid
  param['class_id'] = cid
  param = Qs.stringify(param)
  return request({
    url: '/classes/msmsend',
    method: 'post',
    data: param
  })
}

// 审核课程
export function examineCourse (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Schedule/audit',
    method: 'post',
    data: param
  })
}
// 编辑待审核课程
export function updateAuditCourse (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Schedule/editAudit',
    method: 'post',
    data: param
  })
}

// 已上，待上 课程列表
export function getCourseList (sign, oName, cName, classType, courseType, sDate, page, fName) {
  let uid = store.getters.userId
  return request({
    url: '/Schedule/schedule',
    method: 'get',
    params: { uid, sign, o_name: oName, c_name: cName, c_format: classType, c_type: courseType, s_date: sDate, page, foreign_name: fName }
  })
}
// 编辑课程录像
export function updateVideo (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Schedule/video',
    method: 'post',
    data: param
  })
}
// 修改小班学生评价
export function updateStudentCont (param) {
  return request1({
    method: 'post',
    url: '/api/feedback/addFeedback',
    data: param
  })
}
// 编辑待上课程
export function updateCourse (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Schedule/editcourse',
    method: 'post',
    data: param
  })
}
// 添加待上课程
export function addCourse (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Schedule/addclasshours',
    method: 'post',
    data: param
  })
}
// 删除待上课程
export function delCourse (id) {
  let uid = store.getters.userId
  return request({
    url: '/Schedule/delclasshours',
    method: 'get',
    params: {uid, ch_id: id}
  })
}

// 课件列表
export function getCourseWareList (name, page) {
  let uid = store.getters.userId
  return request({
    url: '/Courseware/coursewarelist',
    method: 'get',
    params: { uid, name, page }
  })
}
// 删除课件
export function delCourseWare (id) {
  let uid = store.getters.userId
  return request({
    url: '/Courseware/delcourseware',
    method: 'get',
    params: { uid, id }
  })
}

// 课包列表
export function getCoursePackageList (name, page) {
  let uid = store.getters.userId
  return request({
    url: '/ClassBag/classbaglist',
    method: 'get',
    params: { uid, name, page }
  })
}
// 课包中课件详情
export function getCoursePackageMore (id) {
  let uid = store.getters.userId
  return request({
    url: '/ClassBag/singleclassbaginfo',
    method: 'get',
    params: { uid, id }
  })
}
// 添加课包
export function addCoursePackage (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  let cwid = ''
  let temp = param.cw_id
  for (let i = 0; i < temp.length; i++) {
    if (i === temp.length - 1) {
      cwid += temp[i]
    } else {
      cwid += temp[i] + ','
    }
  }
  param.courseware_id = cwid
  param = Qs.stringify(param)
  return request({
    url: '/ClassBag/addclassbag',
    method: 'post',
    data: param
  })
}
// 编辑课包
export function updateCoursePackage (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  var cwid = ''
  var temp = param.cw_id
  for (var i = 0; i < temp.length; i++) {
    if (i === temp.length - 1) {
      cwid += temp[i]
    } else {
      cwid += temp[i] + ','
    }
  }
  param.courseware_id = cwid
  param = Qs.stringify(param)
  return request({
    url: '/ClassBag/editclassbag',
    method: 'post',
    data: param
  })
}
// 删除课包
export function delCoursePackage (id) {
  let uid = store.getters.userId
  return request({
    url: '/ClassBag/delclassbag',
    method: 'get',
    params: { uid, id }
  })
}

// 外教老师列表
export function getTeacherList (name, page) {
  let uid = store.getters.userId
  return request({
    url: '/ForeignTeachers/foreignlist',
    method: 'get',
    params: { uid, name, page }
  })
}
// 编辑外教老师
export function updateTeacher (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/ForeignTeachers/addforeign',
    method: 'post',
    data: param
  })
}
// 删除外教
export function delTeacher (id) {
  let uid = store.getters.userId
  return request({
    url: '/ForeignTeachers/delforeign',
    method: 'get',
    params: { uid, id }
  })
}
// 外教时间统计
export function getTeacherShedule (type, month, tid) {
  return request1({
    method: 'post',
    url: '/api/slot/getStatistics',
    data: {type: type, month: month, tid: tid}
  })
}

// 学生列表
export function getStudentList (oName, cName, sName, phone, grade, page) {
  let uid = store.getters.userId
  return request({
    url: '/Student/studentlist',
    method: 'get',
    params: { uid, o_name: oName, c_name: cName, s_name: sName, phone, grade, page }
  })
}
// 学生基础信息列表
export function getStudentInfoList () {
  let uid = store.getters.userId
  return request({
    url: '/Student/studentbasicinfo',
    method: 'get',
    params: { uid }
  })
}
// 编辑学生
export function updateStudent (param) {
  let uid = store.getters.userId
  param['uid'] = uid
  param = Qs.stringify(param)
  return request({
    url: '/Student/editstudent',
    method: 'post',
    data: param
  })
}
// 删除学生
export function delStudent (id) {
  let uid = store.getters.userId
  return request({
    url: '/Student/delstudent',
    method: 'get',
    params: { uid, id }
  })
}
