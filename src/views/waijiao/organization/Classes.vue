<template>
  <div class="class-container">
    <div class="box-header">
      <div class="header-item">
        <el-input clearable v-model="o_name" size="small" placeholder="请输入机构名称" class="handle-input0 mr10"
          @keydown.enter.native="search"></el-input>
        <el-select v-model="class_type" size="small" placeholder="班级类型" class="handle-input1">
          <el-option :label="'全部班级'" :value="''">
          </el-option>
          <el-option :label="'双师班'" :value="1">
          </el-option>
          <el-option :label="'小班'" :value="2">
          </el-option>
        </el-select>
        <el-select v-model="course_type" size="small" placeholder="课程类型" class="handle-input2">
          <el-option :label="'全部课程'" :value="''">
          </el-option>
          <el-option :label="'正式课程'" :value="0">
          </el-option>
          <el-option :label="'体验课程'" :value="1">
          </el-option>
        </el-select>
        <el-input clearable v-model="c_name" size="small" placeholder="请输入班级名称" class="handle-input3 mr10"
          @keydown.enter.native="search"></el-input>
        <el-input clearable v-model="en_t_name" size="small" placeholder="请输入外教名称" class="handle-input4 mr10"
          @keydown.enter.native="search"></el-input>
        <el-select v-model="c_status" size="small" placeholder="班级状态" class="handle-input5">
          <el-option :label="'全部'" :value="''">
          </el-option>
          <el-option :label="'审核中'" :value="0">
          </el-option>
          <el-option :label="'已排课'" :value="1">
          </el-option>
          <el-option :label="'未通过'" :value="2">
          </el-option>
          <el-option :label="'已结课'" :value="4">
          </el-option>
        </el-select>
        <el-button class="btn-search" type="primary" icon="el-icon-search" @click.native="search" size="small">搜索</el-button>
      </div>
      <div class="header-item">
        <el-button class="btn-add" type="primary" size="small" @click.native="handleAdd" icon="el-icon-plus">添加班级</el-button>
        <el-button class="btn-edit" type="primary" size="small" @click.native="handleEditCourse">课程编辑</el-button>
        <el-button class="btn-pass" type="primary" size="small" @click.native="handleAuditPass">审核通过</el-button>
        <el-button class="btn-refuse" type="primary" size="small" @click.native="handleAuditRefuse">审核拒绝</el-button>
        <el-button class="btn-delay" type="primary" size="small" @click.native="handleDelay">延课</el-button>
      </div>
		</div>
		<el-table :data="tableData" border size="mini" class="my-table"
      @selection-change="handleSelectionChange" v-loading="listLoading">
        <el-table-column align="center" type="selection">
        </el-table-column>
				<el-table-column align="center" prop="o_name" label="机构名称">
				</el-table-column>
				<el-table-column align="center" prop="class_name" label="班级名称">
				</el-table-column>
        <el-table-column align="center" prop="grade" label="年级">
				</el-table-column>
				<el-table-column align="center" prop="level" label="课程级别">
				</el-table-column>
				<el-table-column align="center" prop="class_format" label="班级类型">
           <template slot-scope="scope">
							<span v-if="scope.row.class_format === 1">双师班</span>
							<span v-else-if="scope.row.class_format === 2">小班</span>
						</template>
				</el-table-column>
        <el-table-column align="center" prop="class_type" label="课程类型">
           <template slot-scope="scope">
							<span v-if="scope.row.class_type === 0">正式课程</span>
							<span v-else-if="scope.row.class_type === 1">体验课程</span>
						</template>
				</el-table-column>
				<el-table-column align="center" label="中教老师">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.teacher_name }}</p>
              <p>电话: {{ scope.row.mobile }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="mini">{{ scope.row.teacher_name }}</el-tag>
              </div>
            </el-popover>
          </template>
				</el-table-column>
				<el-table-column align="center" prop="en_teacher_name" label="外教">
				</el-table-column>
				<el-table-column align="center" prop="s_list" label="学生名单">
            <template slot-scope="scope">
								<el-button size="mini"
										@click="lookMoreStudent(scope.$index, scope.row)">查看</el-button>
						</template>
				</el-table-column>
				<el-table-column align="center" prop="c_nums" label="课程进度">
           <template slot-scope="scope">
							{{scope.row.progress}}/{{scope.row.c_nums}}
						</template>
				</el-table-column>
				<el-table-column align="center" prop="c_nums" label="课程详情">
            <template slot-scope="scope">
								<el-button size="mini"
										@click="lookMoreCourse(scope.$index, scope.row)">查看</el-button>
						</template>
				</el-table-column>
        <el-table-column align="center" prop="class_bag" label="课包名称">
				</el-table-column>
				<el-table-column align="center" label="班级状态" >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">审核中</span>
            <span v-else-if="scope.row.status === 1">已排课</span>
            <span v-else-if="scope.row.status === 2">未通过</span>
            <span v-else-if="scope.row.status === 4">已结课</span>
          </template>
				</el-table-column>
				<el-table-column align="center" label="操作">
						<template slot-scope="scope">
								<el-button size="mini"
										@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" v-if="scope.row.msm_status === 1 || scope.row.class_format === 1"
										@click="handleSendmsm(scope.$index, scope.row)"
                    style="margin-top:5px;margin-left:0;">发短信</el-button>
								<el-button size="mini" type="danger" v-if="scope.row.status === 2 || (scope.row.status === 1 && scope.row.c_nums === 0)"
										@click="confirmDelete(scope.$index, scope.row)"
                    style="margin-top:5px;margin-left:0;">删除</el-button>
						</template>
				</el-table-column>
		</el-table>
		<div v-show="!listLoading" class="pagination">
			<el-pagination
						background
						@current-change ="handleCurrentChange"
						layout="total, prev, pager, next, jumper"
						:page-size="page_size"
            :total="total">
			</el-pagination>
		</div>
		<el-dialog :title="lookMoreTitle" :visible.sync="lookMoreVisible" width="40%" center>
        <template v-for="item in lookMoreContent">
            <div style="text-align:center;height:25px;line-height:25px;" v-bind:key="item">{{item}}</div>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lookMoreVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑课程信息" :visible.sync="courseDialogVisible">
       <el-form ref="course_form" :model="course_form" :rules="course_form_rules" label-width="120px">
          <el-form-item label="课程级别" prop="level">
            <el-select v-model="course_form.level" placeholder="请选择级别" class="form-input">
                <el-option v-for="item in classlevel" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="外教姓名" prop="f_t_id">
            <el-select v-model="course_form.f_t_id" placeholder="请选择" class="form-input">
                <el-option v-for="item in teacherlist" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课包名称" prop="class_bag_id">
            <el-select v-model="course_form.class_bag_id" filterable placeholder="请选择课包" class="form-input">
              <el-option v-for="item in cpackagelist" :key="item.id" :label="item.bag_name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmitCourseForm('course_form')">提交</el-button>
          </el-form-item>
       </el-form>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="refuseDialogVisible">
      <el-form :model="audit_form">
        <el-form-item label="" label-width="10px">
          <el-input type="textarea" :rows="4" v-model="audit_form.not_pass_reason" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refuseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitRefuse()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择延课时间" :visible.sync="delayDialogVisible">
      <div style="position:relative;display:block;width:450px;height:250px;margin:0 auto;">
          <div style="width:450px;">
            <el-date-picker type="dates" v-model="delayDates" placeholder="选择一个或多个日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <div style="width:450px;margin-top:20px;">
            <el-tag v-for="tag in delayDates" :key="tag" closable :type="''"
              :disable-transitions="false" @close="handleCloseDate(tag)"
              style="margin-left:10px;margin-top:10px;">
              {{tag}}
            </el-tag>
          </div>
          <div style="position:absolute;width:450px;bottom:10px;">
            <el-button type="primary" @click="onSubmitDelayForm()">提交</el-button>
          </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTeacherList, getClassList, delOrgClass, updateAuditCourse, examineCourse, getCoursePackageList, delayClassCourse, sendMsm } from '@/http/api/waijiaoRequest'
export default {
  name: 'Classes',
  data () {
    return {
      listLoading: false,
      tableData: [],
      multipleSelection: [],
      o_name: '',
      c_name: '',
      class_type: '',
      course_type: '',
      en_t_name: '',
      c_status: '',
      total: 0,
      total_page: 1,
      curr_page: 1,
      page_size: 20,
      lookMoreTitle: '',
      lookMoreVisible: false,
      lookMoreContent: [],
      course_form: {
        level: null,
        f_t_id: null,
        class_bag_id: ''
      },
      teacherlist: [],
      cpackagelist: [],
      classlevel: [
        'Starter1', 'Starter2', 'Starter3', 'Starter4', 'Level1', 'Level2', 'Level3',
        'Level4', 'Level5', 'Level6', 'Level7', 'Level8', 'Level9', 'Level10', 'Level11', 'Level12'
      ],
      course_form_rules: {
        level: [
          { required: true, message: '请选择级别', trigger: 'change' }
        ],
        f_t_id: [
          { required: true, message: '请选择外教', trigger: 'change' }
        ],
        class_bag_id: [
          { required: true, message: '请选择课包名称', trigger: 'change' }
        ]
      },
      courseDialogVisible: false,
      audit_form: {
        class_id: null,
        status: null,
        not_pass_reason: ''
      },
      refuseDialogVisible: false,
      delayDialogVisible: false,
      delayDates: []
    }
  },
  computed: {
    multipleSelecIds () {
      var pid = ''
      var selects = this.multipleSelection
      for (var i = 0; i < selects.length; i++) {
        if (i === selects.length - 1) {
          pid += selects[i].id
        } else {
          pid += selects[i].id + ','
        }
      }
      return pid
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.listLoading = true
      let self = this
      return new Promise((resolve, reject) => {
        getClassList(this.o_name, this.c_name, this.class_type, this.course_type, this.en_t_name, this.c_status, this.curr_page).then(response => {
          const dataw = response.data
          self.tableData = dataw.data
          self.total_page = dataw.page_total
          self.total = dataw.total
          self.page_size = dataw.every_page_number
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getTeachers () {
      let self = this
      return new Promise((resolve, reject) => {
        getTeacherList('', 0).then(response => {
          const dataw = response.data
          self.teacherlist = dataw.list
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCPackages () {
      let self = this
      return new Promise((resolve, reject) => {
        getCoursePackageList('', '').then(response => {
          const dataw = response.data
          self.cpackagelist = dataw.list
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    search () {
      this.getData()
    },
    handleCurrentChange (val) {
      this.curr_page = val
      this.getData()
    },
    lookMoreStudent (index, row) {
      this.lookMoreTitle = '学生名单'
      this.lookMoreContent = []
      if (row.class_format === 1) { // 双师
        this.lookMoreContent = [row.s_list]
      } else if (row.class_format === 2) { // 小班
        row.students.forEach(item => {
          this.lookMoreContent.push(item.name + '-' + item.en_name + '-' + item.mobile)
        })
      }
      this.lookMoreVisible = true
    },
    lookMoreCourse (index, row) {
      this.lookMoreTitle = '上课时间详情'
      this.lookMoreVisible = true
      this.lookMoreContent = []
      let course = row.course
      if (row.class_type === 0) {
        this.lookMoreContent.push('开班日期: ' + row.start_date)
        this.lookMoreContent.push('上课频次: ' + row.week)
        this.lookMoreContent.push('上课时段: ' + row.study_time)
        this.lookMoreContent.push('开课时间: ' + course[0].study_time)
        this.lookMoreContent.push('结课时间: ' + course[course.length - 1].study_time)
      } else if (row.class_type === 1) {
        let str = ''
        for (var i = 0; i < course.length; i++) {
          str += course[i].study_time + ', '
          if (i % 2 !== 0) {
            this.lookMoreContent.push(str)
            str = ''
          }
        }
        this.lookMoreContent.push(str)
      }
    },
    handleEdit (index, row) {
      this.$router.push({name: 'wjeditclass', params: {type: 1, item: row}})
    },
    handleSendmsm (index, row) {
      return new Promise((resolve, reject) => {
        sendMsm(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('短信发送成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    confirmDelete (index, row) {
      this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(index, row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete (index, row) {
      return new Promise((resolve, reject) => {
        delOrgClass(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('班级已删除！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleAdd () {
      this.$router.push({name: 'wjeditclass', params: {type: 0}})
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleEditCourse () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择一条需要编辑的信息！')
        return
      } else if (this.multipleSelection.length >= 2) {
        this.$message.warning('只能选择一条需要编辑的信息！')
        return
      }
      let currclass = this.multipleSelection[0]
      if (currclass.status !== 1) {
        this.$message.warning('只能编辑已经审核通过的班级！')
        return
      }
      this.getTeachers()
      this.getCPackages()
      this.course_form.level = currclass.level
      if (currclass.f_id) {
        this.course_form.f_t_id = currclass.f_id
      } else {
        this.course_form.f_t_id = null
      }
      this.course_form.class_bag_id = currclass.class_bag_id
      this.course_form['class_name'] = currclass.class_name
      this.courseDialogVisible = true
    },
    onSubmitCourseForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var fid = this.course_form.f_t_id
          for (var i = 0; i < this.teacherlist.length; i++) {
            if (fid === this.teacherlist[i].id) {
              this.course_form['en_t_name'] = this.teacherlist[i].name
              break
            }
          }
          var cpid = this.course_form.class_bag_id
          for (var j = 0; j < this.cpackagelist.length; j++) {
            if (cpid === this.cpackagelist[j].id) {
              this.course_form['class_bag'] = this.cpackagelist[j].bag_name
              break
            }
          }
          this.course_form['class_id'] = this.multipleSelecIds
          return new Promise((resolve, reject) => {
            updateAuditCourse(this.course_form).then(response => {
              if (response) {
                this.courseDialogVisible = false
                var conflict = response.data.conflict
                var noProvided = response.data.noProvided
                if (conflict.length > 0 || noProvided.length > 0) {
                  this.lookMoreTitle = this.course_form.class_name
                  this.lookMoreContent = []
                  if (conflict.length > 0) {
                    this.lookMoreContent.push('时间冲突教师')
                    conflict.forEach(item => {
                      this.lookMoreContent.push(item.foreign_name + '-' + item.stime)
                    })
                  }
                  if (noProvided.length > 0) {
                    this.lookMoreContent.push('未提供时间教师')
                    noProvided.forEach(item => {
                      this.lookMoreContent.push(item.foreign_name + '-' + item.stime)
                    })
                  }
                  this.lookMoreVisible = true
                }
                this.getData()
                this.$message.success('提交成功！')
              }
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAuditPass () {
      this.audit_form.class_id = this.multipleSelecIds
      this.audit_form.status = 1
      return new Promise((resolve, reject) => {
        examineCourse(this.audit_form).then(response => {
          if (response) {
            this.getData()
            this.$message.success('审核通过提交成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleAuditRefuse () {
      var canRefuse = true
      this.multipleSelection.forEach(item => {
        if (item.status === 1 || item.status === 4) {
          this.$message.warning('所选班级中有已排课或者已结课的，不能进行此操作！')
          canRefuse = false
        }
      })
      if (canRefuse) {
        this.audit_form.class_id = this.multipleSelecIds
        this.audit_form.status = 2
        this.refuseDialogVisible = true
      }
    },
    onSubmitRefuse () {
      return new Promise((resolve, reject) => {
        examineCourse(this.audit_form).then(response => {
          if (response) {
            this.refuseDialogVisible = false
            this.getData()
            this.$message.success('审核拒绝提交成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleDelay () {
      this.delayDates = []
      this.delayDialogVisible = true
    },
    handleCloseDate (tag) {
      this.delayDates.splice(this.delayDates.indexOf(tag), 1)
    },
    onSubmitDelayForm () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择一条班级信息！')
        return
      } else if (this.multipleSelection.length >= 2) {
        this.$message.warning('只能选择一条班级信息！')
        return
      }
      var currclass = this.multipleSelection[0]
      var timedelay = ''
      for (var i = 0; i < this.delayDates.length; i++) {
        if (i === this.delayDates.length - 1) {
          timedelay += this.delayDates[i]
        } else {
          timedelay += this.delayDates[i] + ','
        }
      }
      var delayform = {
        class_id: currclass.id,
        time_delay: timedelay
      }
      return new Promise((resolve, reject) => {
        delayClassCourse(delayform).then(response => {
          if (response) {
            this.delayDialogVisible = false
            var oldTeacher = response.data.old_teacher
            var noTeacher = response.data.no_teacher
            if (oldTeacher.length > 0 || noTeacher.length > 0) {
              this.lookMoreTitle = '延课结果'
              this.lookMoreContent = []
              if (oldTeacher.length > 0) {
                this.lookMoreContent.push('原有排课老师')
                oldTeacher.forEach(item => {
                  this.lookMoreContent.push(item.en_teacher_name + '-' + item.study_time)
                })
              }
              if (noTeacher.length > 0) {
                this.lookMoreContent.push('未匹配上老师')
                noTeacher.forEach(item => {
                  this.lookMoreContent.push(item.en_teacher_name + '-' + item.study_time)
                })
              }
              this.lookMoreVisible = true
            }
            this.$message.success('延课成功！')
            this.getData()
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.class-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 110px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
    .header-item {
      position: relative;
      height: 50px;
      .btn-add {
        position: absolute;
        left: 20px;
      }
      .btn-edit {
        position: absolute;
        left: 120px;
      }
      .btn-pass {
        position: absolute;
        left: 210px;
      }
      .btn-refuse {
        position: absolute;
        left: 300px;
      }
      .btn-delay {
        position: absolute;
        left: 390px;
      }
      .handle-input0{
        position: absolute;
        left: 20px;
        width: 150px;
        display: inline-block;
      }
      .handle-input1{
        position: absolute;
        left: 180px;
        width: 120px;
        display: inline-block;
      }
      .handle-input2{
        position: absolute;
        left: 310px;
        width: 120px;
        display: inline-block;
      }
      .handle-input3{
        position: absolute;
        left: 440px;
        width: 150px;
        display: inline-block;
      }
      .handle-input4{
        position: absolute;
        left: 600px;
        width: 150px;
        display: inline-block;
      }
      .handle-input5{
        position: absolute;
        left: 760px;
        width: 120px;
        display: inline-block;
      }
      .btn-search {
        position: absolute;
        left: 900px;
      }
    }
  }
  .my-table {
    width: 100%;
    margin-left: 10px;
  }
  .pagination {
    display: block;
    margin: 0 auto;
    margin-top: 10px;
  }
  form {
    width: 420px;
    margin: 0 auto;
  }
  .form-input {
    width: 250px;
  }
}
</style>
