import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '',
    component: Layout
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/product',
    component: Layout,
    name: 'product',
    meta: { role: ['admin'] },
    children: [
      {
        path: 'index',
        component: _import('product/index'),
        meta: { title: '产品管理', icon: 'navProduct', role: ['admin'] }
      }
    ]
  },
  {
    path: '/jigou',
    component: Layout,
    name: 'jigou',
    meta: { title: '机构管理', icon: 'navJigou', role: ['admin'] },
    children: [
      {
        path: 'list',
        name: 'jglist',
        component: _import('jigou/index'),
        meta: { title: '机构列表', role: ['admin'] }
      },
      {
        path: 'account',
        name: 'jgaccount',
        component: _import('jigou/account'),
        meta: { title: '机构账户', role: ['admin'] }
      },
      {
        path: 'roles',
        name: 'jgroles',
        component: _import('jigou/role'),
        meta: { title: '角色列表', role: ['admin'] }
      }
    ]
  },
  {
    path: '/waijiao',
    component: Layout,
    name: 'waijiao',
    meta: { title: '外教管理', icon: 'navWaijiao', role: ['admin'] },
    children: [
      {
        path: '/waijiao/jg',
        name: 'wjjg',
        component: _import('subRouter'),
        meta: { title: '机构', icon: 'subnavJigou', role: ['admin'] },
        children: [
          {
            path: 'wjdetails',
            name: 'wjmore',
            component: _import('waijiao/organization/Details'),
            meta: { title: '机构详情', role: ['admin'] }
          },
          {
            path: 'wjclass',
            name: 'wjclass',
            component: _import('waijiao/organization/Classes'),
            meta: { title: '机构班级', role: ['admin'] }
          },
          {
            path: 'wjchongzhi',
            name: 'wjchongzhi',
            component: _import('waijiao/organization/Chongzhi'),
            meta: { title: '机构储值', role: ['admin'] }
          },
          {
            path: 'wjeditClass',
            name: 'wjeditclass',
            component: _import('waijiao/organization/EditClass'),
            meta: { title: '编辑班级', role: ['admin'] },
            hidden: true
          }
        ]
      },
      {
        path: '/waijiao/course',
        name: 'wjcourse',
        component: _import('subRouter'),
        meta: { title: '课程', icon: 'subnavCourse', role: ['admin'] },
        children: [
          {
            path: 'daishang',
            name: 'wjdaishang',
            component: _import('waijiao/course/OntheCourse'),
            meta: { title: '待上课程', role: ['admin'] }
          },
          {
            path: 'yishang',
            name: 'wjyishang',
            component: _import('waijiao/course/UsedtheCourse'),
            meta: { title: '已上课程', role: ['admin'] }
          }
        ]
      },
      {
        path: '/waijiao/courseware',
        name: 'wjcourseware',
        component: _import('subRouter'),
        meta: { title: '课件', icon: 'subnavKejian', role: ['admin'] },
        children: [
          {
            path: 'kejian',
            name: 'wjkejian',
            component: _import('waijiao/courseware/CourseWare'),
            meta: { title: '课件管理', role: ['admin'] }
          },
          {
            path: 'kebao',
            name: 'wjkebao',
            component: _import('waijiao/courseware/CoursePackage'),
            meta: { title: '课包管理', role: ['admin'] }
          }
        ]
      },
      {
        path: '/waijiao/teacher',
        name: 'wjteacher',
        component: _import('subRouter'),
        meta: { title: '外教', icon: 'subnavTeacher', role: ['admin'] },
        children: [
          {
            path: 'index',
            name: 'wjteacherindex',
            component: _import('waijiao/teacher/index'),
            meta: { title: '外教老师', role: ['admin'] }
          },
          {
            path: 'shedule',
            name: 'wjteachershedule',
            component: _import('waijiao/teacher/Shedule'),
            meta: { title: '外教时间', role: ['admin'] }
          }
        ]
      },
      {
        path: '/waijiao/student',
        name: 'wjstudent',
        component: _import('subRouter'),
        meta: { title: '学生管理', role: ['admin'] },
        children: [
          {
            path: 'index',
            name: 'wjstudentindex',
            component: _import('waijiao/student/index'),
            meta: { title: '学生', icon: 'subnavStudent', role: ['admin'] }
          }
        ]
      }
    ]
  },
  {
    path: '/qxapp',
    component: Layout,
    name: 'qxapp',
    meta: { title: 'APP管理', icon: 'navApp', role: ['admin', 'kefu'] },
    children: [
      {
        path: 'appbanner',
        name: 'appbanner',
        component: _import('qxapp/banner/index'),
        meta: { title: '首页banner', role: ['admin'] }
      },
      {
        path: 'appcode',
        name: 'appcode',
        component: _import('qxapp/code/index'),
        meta: { title: '教师编码', role: ['admin'] }
      },
      {
        path: 'appstatistics',
        name: 'appstatistics',
        component: _import('qxapp/statistics/index'),
        meta: { title: '机构数据统计', role: ['admin'] }
      },
      {
        path: 'appstatismore',
        name: 'appstatismore',
        component: _import('qxapp/statistics/more'),
        hidden: true
      },
      {
        path: 'appjcjs',
        name: 'appjcjs',
        component: _import('qxapp/student/unlock'),
        meta: { title: '学生教材解锁', role: ['admin'] }
      },
      {
        path: 'appdzkh',
        name: 'appdzkh',
        component: _import('qxapp/student/cardnumber'),
        meta: { title: '学生电子卡号', role: ['admin', 'kefu'] }
      },
      {
        path: 'appmodifylevel',
        name: 'appmodifylevel',
        component: _import('qxapp/student/level'),
        meta: { title: '修改级别', role: ['admin', 'kefu'] }
      }
    ]
  },
  {
    path: '/qxcourseware',
    component: Layout,
    name: 'qxcourseware',
    meta: { title: '课件管理', icon: 'navCourse', role: ['admin'] },
    children: [
      {
        path: 'courseaddlevel',
        name: 'courseaddlevel',
        component: _import('courseware/addlevel'),
        meta: { title: '增加级别', role: ['admin'] }
      },
      {
        path: 'coursedelevel',
        name: 'coursedellevel',
        component: _import('courseware/dellevel'),
        meta: { title: '删除级别', role: ['admin'] }
      },
      {
        path: 'courseaccount',
        name: 'courseaccount',
        component: _import('courseware/account'),
        meta: { title: '账户管理', role: ['admin'] }
      }
    ]
  },
  {
    path: '/qxcourseware1',
    component: Layout,
    name: 'qxcourseware1',
    meta: { title: '课件管理', role: ['kefu'] },
    children: [
      {
        path: 'index',
        component: _import('courseware/account'),
        meta: { title: '课件账户管理', icon: 'navCourse', role: ['kefu'] }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    name: 'account',
    meta: { title: '权限管理', icon: 'navAccount', role: ['admin'] },
    children: [
      {
        path: 'list',
        name: 'aclist',
        component: _import('account/index'),
        meta: { title: '账户管理', role: ['admin'] }
      },
      {
        path: 'acrole',
        name: 'acrole',
        component: _import('account/roles'),
        meta: { title: '角色管理', role: ['admin'] }
      }
    ]
  }
]
