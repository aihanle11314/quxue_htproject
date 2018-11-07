<template>
  <div class="onthe-container">
    <div class="box-header">
      <el-button class="btn-add" type="primary" @click.native="handleAdd" size="small" icon="el-icon-plus">待上课程</el-button>
      <el-select v-model="class_type" placeholder="班级类型" class="handle-input0" size="small">
          <el-option :label="'全部班级'" :value="''">
          </el-option>
					<el-option :label="'双师班'" :value="1">
					</el-option>
					<el-option :label="'小班'" :value="2">
					</el-option>
			</el-select>
			<el-select v-model="course_type" placeholder="课程类型" class="handle-input1" size="small">
          <el-option :label="'全部课程'" :value="''">
          </el-option>
					<el-option :label="'正式课程'" :value="0">
					</el-option>
					<el-option :label="'体验课程'" :value="1">
					</el-option>
			</el-select>
			<el-input clearable v-model="o_name" placeholder="请输入机构名称" class="handle-input2 mr10"
        @keydown.enter.native="search" size="small"></el-input>
      <el-input clearable v-model="c_name" placeholder="请输入班级名称" class="handle-input3 mr10"
        @keydown.enter.native="search" size="small"></el-input>
      <el-input clearable v-model="en_teacher_name" size="small" placeholder="请输入外教姓名" class="handle-input4 mr10"
        @keydown.enter.native="search"></el-input>
      <el-date-picker v-model="s_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" class="handle-input5" size="small"
        style="width:170px;">
      </el-date-picker>
			<el-button class="btn-search" type="primary" icon="el-icon-search" @click.native="search" size="small">搜索</el-button>
		</div>
		<el-table :data="tableData" border size="mini" class="my-table" v-loading="listLoading">
				<el-table-column align="center" prop="o_name" label="机构名称">
				</el-table-column>
				<el-table-column align="center" prop="c_name" label="班级名称">
				</el-table-column>
        <el-table-column align="center" label="班级类型" >
            <template slot-scope="scope">
							<span v-if="scope.row.class_format === 1">双师班</span>
							<span v-else-if="scope.row.class_format === 2">小班</span>
						</template>
				</el-table-column>
				<el-table-column align="center" label="课程类型" >
            <template slot-scope="scope">
							<span v-if="scope.row.c_type === 0">正式课程</span>
							<span v-else-if="scope.row.c_type === 1">体验课程</span>
						</template>
				</el-table-column>
				<el-table-column align="center" prop="c_level" label="课程级别">
				</el-table-column>
				<el-table-column align="center" prop="t_name" label="中教老师">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.t_name }}</p>
              <p>电话: {{ scope.row.mobile }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="mini">{{ scope.row.t_name }}</el-tag>
              </div>
            </el-popover>
          </template>
				</el-table-column>
        <el-table-column align="center" prop="en_t_name" label="外教">
				</el-table-column>
				<el-table-column align="center" prop="en_teacher" label="本次课外教">
				</el-table-column>
				<el-table-column align="center" prop="s_list" label="学生名单" width="80">
            <template slot-scope="scope">
								<el-button size="mini"
										@click="lookMoreStudent(scope.$index, scope.row)">查看</el-button>
						</template>
				</el-table-column>
				<el-table-column align="center" prop="time" label="上课时间">
				</el-table-column>
				<el-table-column align="center" prop="c_url" label="所用课件" width="90">
          <template slot-scope="scope">
            <el-button size="mini" type="text"
                @click="lookMoreKejian(scope.row.c_pdf_url)">PDF</el-button>
            <el-button size="mini" type="text"
                @click="lookMoreKejian(scope.row.c_url)">课件</el-button>
						</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button size="mini"
								@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini"  type="danger"
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
    <el-dialog title="编辑待上课程信息" :visible.sync="dialogVisible">
       <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="课程级别" prop="level">
            <el-select v-model="form.level" placeholder="请选择级别" class="form-input">
                <el-option v-for="item in classlevel" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="外教姓名" prop="f_t_id">
            <el-select v-model="form.f_t_id" placeholder="请选择" class="form-input">
                <el-option v-for="item in teacherlist" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="本次课外教姓名" prop="f_id">
            <el-select v-model="form.f_id" placeholder="请选择" class="form-input">
                <el-option v-for="item in teacherlist" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课时间" prop="study_time">
              <el-input class="form-input" v-model="form.study_time"></el-input>
          </el-form-item>
          <el-form-item label="课件" prop="cw_id">
              <el-select v-model="form.cw_id" filterable placeholder="请选择">
                <el-option v-for="item in cwarelist" :key="item.id" :label="item.identifier" :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title="添加待上课程" :visible.sync="addDialogVisible">
       <el-form ref="add_form" :model="add_form" :rules="add_rules" label-width="120px">
          <el-form-item label="机构名称" prop="o_id">
            <el-select v-model="add_form.o_id" filterable placeholder="请选择机构" class="form-input" @change="getClassByJG">
                <el-option v-for="item in jigoulist" :key="item.id" :label="item.o_name" :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="c_id">
            <el-select v-model="add_form.c_id" placeholder="请选择班级" class="form-input">
                <el-option v-for="item in classlist" :key="item.id" :label="item.class_name" :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmitAddForm('add_form')">提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseList, updateCourse, delCourse, addCourse, getClassList, getTeacherList, getCourseWareList } from '@/http/api/waijiaoRequest'
import { getJGList } from '@/http/api/jigouRequest'
export default {
  name: 'OntheCourse',
  data () {
    return {
      listLoading: false,
      tableData: [],
      o_name: '',
      c_name: '',
      class_type: '',
      course_type: '',
      en_teacher_name: '',
      s_date: '',
      total: 0,
      total_page: 1,
      curr_page: 1,
      page_size: 20,
      lookMoreTitle: '',
      lookMoreVisible: false,
      lookMoreContent: [],
      form: {
        level: null,
        f_id: null,
        // f_t_id: null,
        cw_id: null
      },
      add_form: {
        o_id: null,
        c_id: null
      },
      jigoulist: [],
      classlist: [],
      teacherlist: [],
      cwarelist: [],
      classlevel: [
        'Starter1', 'Starter2', 'Starter3', 'Starter4', 'Level1', 'Level2', 'Level3',
        'Level4', 'Level5', 'Level6', 'Level7', 'Level8', 'Level9', 'Level10', 'Level11', 'Level12'
      ],
      rules: {
        level: [
          { required: true, message: '请选择级别', trigger: 'change' }
        ],
        // f_t_id: [
        //   { required: true, message: '请选择外教', trigger: 'change' }
        // ],
        study_time: [
          { required: true, message: '请输入上课时间', trigger: 'blur' }
        ]
      },
      add_rules: {
        o_id: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        c_id: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      addDialogVisible: false,
      selectJigou: ''
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
        getCourseList(3, this.o_name, this.c_name, this.class_type, this.course_type, this.s_date, this.curr_page, this.en_teacher_name).then(response => {
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
    getJigous () {
      let self = this
      return new Promise((resolve, reject) => {
        getJGList().then(response => {
          const dataw = response.data
          self.jigoulist = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getClasses (oName) {
      let self = this
      return new Promise((resolve, reject) => {
        getClassList(oName, '', '', '', '', 1, '').then(response => {
          const dataw = response.data
          self.classlist = dataw.data
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
    getCWares () {
      let self = this
      return new Promise((resolve, reject) => {
        getCourseWareList().then(response => {
          const dataw = response.data
          self.cwarelist = dataw.list
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
    lookMoreKejian (download) {
      if (download) {
        window.open(download)
      } else {
        this.$message.info('您还没有提供课件地址哦！')
      }
    },
    handleEdit (index, row) {
      this.form['c_id'] = row.id
      this.form['level'] = row.c_level
      if (row.f_id) {
        this.form['f_id'] = row.f_id
      } else {
        this.form['f_id'] = null
      }
      // if (row.f_t_id) {
      //   this.form['f_t_id'] = row.f_t_id
      // } else {
      //   this.form['f_t_id'] = null
      // }
      this.form['study_time'] = row.time
      if (row.cw_id) {
        this.form['cw_id'] = row.cw_id
      } else {
        this.form['cw_id'] = null
      }
      this.getTeachers()
      this.getCWares()
      this.dialogVisible = true
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form['en_teacher'] = ''
          var fid = this.form.f_id
          for (var i = 0; i < this.teacherlist.length; i++) {
            if (fid === this.teacherlist[i].id) {
              this.form['en_teacher'] = this.teacherlist[i].name
              break
            }
          }
          // this.form['en_t_name'] = ''
          // var ftid = this.form.f_t_id
          // for (var j = 0; j < this.teacherlist.length; j++) {
          //   if (ftid === this.teacherlist[j].id) {
          //     this.form['en_t_name'] = this.teacherlist[j].name
          //     break
          //   }
          // }
          return new Promise((resolve, reject) => {
            updateCourse(this.form).then(response => {
              if (response) {
                this.dialogVisible = false
                this.getData()
                this.$message.success('编辑成功！')
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
    getClassByJG (val) {
      var currJigou = this.jigoulist.filter(function (d) {
        if (d.id === parseInt(val)) {
          return d
        }
      })
      this.getClasses(currJigou[0].o_name)
    },
    handleAdd () {
      this.add_form = {
        o_id: '',
        c_id: ''
      }
      this.getJigous()
      this.addDialogVisible = true
    },
    onSubmitAddForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            addCourse(this.add_form).then(response => {
              if (response) {
                this.addDialogVisible = false
                this.getData()
                this.$message.success('添加成功！')
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
    confirmDelete (index, row) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
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
        delCourse(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('课程已删除！')
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
.onthe-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
  }
  .btn-add {
    position: absolute;
    left: 20px;
  }
  .handle-input0 {
    position: absolute;
    left: 130px;
    width: 120px;
    display: inline-block;
  }
  .handle-input1 {
    position: absolute;
    left: 270px;
    width: 120px;
    display: inline-block;
  }
	.handle-input2 {
    position: absolute;
    left: 410px;
    width: 170px;
    display: inline-block;
  }
	.handle-input3 {
    position: absolute;
    left: 600px;
    width: 170px;
    display: inline-block;
  }
  .handle-input4 {
    position: absolute;
    left: 790px;
    width: 170px;
    display: inline-block;
  }
  .handle-input5 {
    position: absolute;
    left: 980px;
    width: 170px;
    display: inline-block;
  }
  .btn-search {
    position: absolute;
    left: 1170px;
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
