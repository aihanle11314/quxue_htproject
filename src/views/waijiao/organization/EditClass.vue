<template>
  <div class="editCourse-container">
		<div class="box-header">
       {{title}}
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="机构" prop="oid" v-if="type===0">
        <el-select v-model="form.oid" filterable placeholder="请选择" class="form-input">
            <el-option v-for="item in jgList" :key="item.id" :label="item.o_name" :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级名称" prop="class_name">
					<el-input class="form-input" v-model="form.class_name"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select v-model="form.grade" placeholder="请选择" class="form-input">
            <el-option v-for="item in gragelist" :key="item" :label="item" :value="item">
            </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="班级类型" prop="class_format">
        <el-select v-model="form.class_format" placeholder="请选择" class="form-input">
            <el-option :label="'双师班'" :value="1">
            </el-option>
            <el-option :label="'小班'" :value="2">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型" prop="class_type">
        <el-select v-model="form.class_type" placeholder="请选择" class="form-input">
            <el-option :label="'正式课'" :value="0">
            </el-option>
            <el-option :label="'体验课'" :value="1">
            </el-option>
        </el-select>
      </el-form-item>
      <div v-if="form.class_format===1">
      <el-form-item label="中教英文名" prop="teacher_name">
					<el-input class="form-input" v-model="form.teacher_name"></el-input>
      </el-form-item>
      <el-form-item label="中教手机号" prop="mobile">
					<el-input class="form-input" v-model="form.mobile"></el-input>
      </el-form-item>
      </div>
        <el-form-item label="学生人数" prop="student_nums">
						<el-input class="form-input" v-model="form.student_nums"></el-input>
				</el-form-item>
        <el-form-item label="学生名单" prop="s_list" v-if="form.class_format===1">
						<el-input class="form-input" placeholder="aaa,bbb,ccc" v-model="form.s_list"></el-input>
				</el-form-item>
        <div v-if="form.class_format===2">
        <el-form-item label="学生名单" prop="domains">
						<el-button @click.native="handleStudent">选择</el-button>
				</el-form-item>
        <!-- <el-tag v-for="tag in domains" :key="tag.key" closable :type="''"
            :disable-transitions="false" @close="removeDomain(tag)"
            style="margin-left:10px;margin-bottom:10px;">
            {{tag.value}}
          </el-tag> -->
        <el-form-item v-for="domain in domains" v-bind:key="domain.key">
           <el-input size="small" v-model="domain.value" disabled style="width:200px;"></el-input>
           <el-button size="small" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        </div>
        <div v-if="form.class_type === 0 && form.status !== 1">
				<el-form-item label="班级课时数" prop="c_nums">
						<el-input class="form-input" v-model="form.c_nums"></el-input>
				</el-form-item>
        <el-form-item label="上课周" prop="week">
						<el-input class="form-input" placeholder="周一,周四,周日" v-model="form.week"></el-input>
				</el-form-item>
        <el-form-item label="上课时段(正式课)" prop="s_time">
						<el-input class="form-input" placeholder="17:00:00" v-model="form.s_time"></el-input>
				</el-form-item>
        <el-form-item label="开班日期" prop="start_date" >
           <el-date-picker class="form-input" v-model="form.start_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
           </el-date-picker>
				</el-form-item>
        </div>
        <div v-if="form.class_type === 1 && form.status !== 1">
        <el-form-item label="上课时段(体验课)" prop="study_time">
						<el-input class="form-input" type="textarea" :rows="3" placeholder="2018-05-10 15:30,2018-05-11 15:30" v-model="form.study_time"></el-input>
				</el-form-item>
        </div>
				<el-form-item>
						<el-button type="primary" :loading="submitloading" @click="onSubmitForm('form')">提交</el-button>
				</el-form-item>
		</el-form>
    <el-dialog :visible.sync="dialogVisible" width="60%">
      <div slot="title" class="dialog-title">
         请选择学生
      </div>
      <div>
        <el-transfer class="transfer-box" v-model="selStudents" :data="studentShow" filterable
          :filter-method="studfilterMethod" :render-content="renderFunc"
          filter-placeholder="请输入机构名称/学生姓名/手机号" :target-order="'push'"
          :titles="['学生列表', '已选学生']">
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" icon="el-icon-plus" style="position:absolute;left:10px;"
          @click.native="handleAddStudent">添加学生</el-button>
        <el-button type="primary" size="small" @click.native="selectStudent">确 定</el-button>
        <el-button size="small" @click.native="dialogVisible=false">取 消</el-button>
      </div>
      <el-dialog title="添加学生" :visible.sync="addDialogVisible"
        append-to-body>
        <el-form ref="stuform" :inline="true" :model="stuform" :rules="sturules">
           <el-form-item>
              <el-input v-model="stuform.name" placeholder="学生姓名" style="width:140px;" ></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="stuform.en_name" placeholder="英文名" style="width:140px;"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input v-model="stuform.phone" placeholder="手机号" style="width:140px;"></el-input>
          </el-form-item>
          <el-form-item>
              <el-select v-model="stuform.grade" placeholder="请选择" style="width:110px;">
                  <el-option v-for="item in gragelist" :key="item" :label="item" :value="item">
                  </el-option>
              </el-select>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" :loading="submitloading" @click="onSubmitStuForm('stuform')">提交</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { validatPhone } from '@/utils/validate'
import { getJGList } from '@/http/api/jigouRequest'
import { addOrgClass, editOrgClass, getStudentInfoList, updateStudent } from '@/http/api/waijiaoRequest'
export default {
  name: 'editClass',
  data () {
    let self = this
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (self.form.mobile !== '') {
          if (!validatPhone(self.form.mobile)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }
      }
    }
    const validateDomains = (rule, value, callback) => {
      if (self.domains.length < 1) {
        callback(new Error('请选择学生'))
      } else if (self.domains.length > 4) {
        callback(new Error('学生人数不能超过4'))
      } else {
        callback()
      }
    }
    return {
      type: 0, // 0-添加，1-编辑
      title: '',
      form: {
        oid: '',
        class_name: '',
        grade: '',
        class_format: 1,
        class_type: 0,
        teacher_name: '',
        mobile: null,
        student_nums: null,
        s_list: '',
        c_nums: null,
        week: '',
        s_time: '',
        study_time: '',
        start_date: '',
        status: 0
      },
      domains: [], // 选中学生展示
      jgList: [],
      gragelist: ['学前', '1年级', '2年级', '3年级', '4年级', '5年级', '6年级'],
      rules: {
        oid: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        class_name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        class_format: [
          { required: true, message: '请选择班级类型', trigger: 'change' }
        ],
        class_type: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        teacher_name: [
          { required: true, message: '请输入中教英文姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        student_nums: [
          { required: true, message: '请输入学生人数', trigger: 'blur' }
        ],
        domains: [
          { required: true, validator: validateDomains, trigger: ['change'] }
        ]
      },
      submitloading: false,
      dialogVisible: false,
      addDialogVisible: false,
      studentList: [], // 学生列表
      selStudents: [], // 选中的学生
      renderFunc (h, option) {
        return <div class="render-cb"><div class="render-cbitem">{ option.label }</div><div class="render-cbitem">{ option.mobile }</div></div>
      },
      studfilterMethod (query, item) {
        if (item) {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.mobile.indexOf(query) > -1
        } else {
          return false
        }
      },
      stuform: { // 添加学生表单
        name: '',
        en_name: '',
        phone: '',
        grade: ''
      },
      sturules: {
        name: [
          { required: true, message: '请输入学生名称', trigger: 'blur' }
        ],
        en_name: [
          { required: true, message: '请输入英文名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请输入年级', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.type = this.$route.params.type
    if (this.type === 0) {
      this.title = '添加班级信息'
      this.getJgList()
    } else {
      this.title = '编辑班级信息'
      this.form = this.$route.params.item
      this.domains = []
      if (this.form.class_format === 2) { // 小班
        if (this.form.students) {
          this.form.students.forEach(item => {
            this.domains.push({
              value: item.name + ' ' + item.mobile,
              key: item.s_id
            })
          })
        }
      }
      var index
      if (this.form.class_type === 0) { // 正式课
        index = this.form.study_time.lastIndexOf(':')
        this.form['s_time'] = this.form.study_time.substr(0, index)
      } else if (this.form.class_type === 1) { // 体验课
        let str = ''
        let course = this.form.course
        for (var i = 0; i < course.length; i++) {
          index = course[i].study_time.lastIndexOf(':')
          if (i === course.length - 1) {
            str += course[i].study_time.substr(0, index)
          } else {
            str += course[i].study_time.substr(0, index) + ','
          }
        }
        this.form['study_time'] = str
      }
    }
  },
  computed: {
    studentShow () {
      var data = []
      this.studentList.forEach((item, index) => {
        data.push({
          key: item.id,
          label: item.name + '-' + item.en_name,
          mobile: item.mobile + '-' + (item.o_name ? item.o_name : '')
        })
      })
      return data
    }
  },
  methods: {
    getJgList () {
      let self = this
      return new Promise((resolve, reject) => {
        getJGList().then(response => {
          const dataw = response.data
          self.jgList = dataw
          // self.jgList = dataw.filter(function (d) { // 返回有外教权限的机构
          //   if (d.project.some(item => { return item === 1 })) {
          //     return d
          //   }
          // })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getStudentList () {
      let self = this
      return new Promise((resolve, reject) => {
        getStudentInfoList().then(response => {
          const dataw = response.data
          self.studentList = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitloading = true
          this.form['course'] = {}
          this.form['students'] = {}
          if (this.form.class_format === 2) {
            var slist = ''
            this.domains.forEach((item, index) => {
              if (index === this.domains.length - 1) {
                slist += item.key
              } else {
                slist += item.key + ','
              }
            })
            this.form['s_list'] = slist
          }
          if (this.type === 0) {
            return new Promise((resolve, reject) => {
              addOrgClass(this.form).then(response => {
                this.submitloading = false
                if (response) {
                  this.$message.success('添加提交成功！')
                  this.$router.push({name: 'wjclass'})
                }
                resolve()
              }).catch(error => {
                this.submitloading = false
                reject(error)
              })
            })
          } else {
            return new Promise((resolve, reject) => {
              editOrgClass(this.form).then(response => {
                this.submitloading = false
                if (response) {
                  this.$message.success('编辑提交成功！')
                  this.$router.push({name: 'wjclass'})
                }
                resolve()
              }).catch(error => {
                this.submitloading = false
                reject(error)
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleStudent () {
      this.getStudentList()
      this.dialogVisible = true
      this.selStudents = []
      this.domains.forEach(item => {
        this.selStudents.push(item.key)
      })
    },
    selectStudent () {
      this.dialogVisible = false
      this.domains = []
      this.selStudents.forEach(id => {
        var item = this.studentList.find((element) => (element.id === id))
        this.domains.push({
          value: item.name + ' ' + item.mobile,
          key: id
        })
      })
    },
    removeDomain (item) {
      var index = this.domains.indexOf(item)
      if (index !== -1) {
        this.domains.splice(index, 1)
      }
    },
    handleAddStudent () {
      this.addDialogVisible = true
      this.stuform = {
        name: '',
        en_name: '',
        phone: '',
        grade: ''
      }
    },
    onSubmitStuForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitloading = true
          return new Promise((resolve, reject) => {
            updateStudent(this.stuform).then(response => {
              this.submitloading = false
              if (response) {
                this.addDialogVisible = false
                this.getStudentList()
              }
              resolve()
            }).catch(error => {
              this.submitloading = false
              reject(error)
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.editCourse-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 80px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
		text-align: center;
  }
  form {
    width: 450px;
    margin: 0 auto;
  }
  .form-input {
    width: 300px;
  }
  .dialog-title {
    border-bottom: 1px solid #aaaaaa;
    text-align: left;
    padding-bottom: 5px;
  }
  .dialog-footer {
    border-top: 1px solid #aaaaaa;
    padding-top: 10px;
    position: relative;
  }
  .transfer-box {
    text-align: left;
    width: 80%;
    height: 420px;
    margin: 0 auto;
    .el-transfer-panel {
      width: 45%;
      height: 420px;
    }
    .el-transfer-panel__body {
      height: 300px;
    }
    .el-transfer__buttons {
      display: inline-block;
      vertical-align: middle;
      padding: 0 10px;
    }
    .el-transfer-panel__list.is-filterable {
      height: 300px;
    }
    .el-transfer-panel__item {
      height: 50px;
      line-height: 50px;
    }
  }
  .render-cb {
    border: 0.1px solid #eeeeee;
    .render-cbitem {
    height: 20px;
    line-height: 20px;
  }
  }
}
</style>
