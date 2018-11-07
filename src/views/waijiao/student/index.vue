<template>
  <div class="student-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="姓名" prop="name">
              <el-input class="form-input" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="英文名" prop="en_name">
              <el-input class="form-input" v-model="form.en_name"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
              <el-input class="form-input" v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
              <el-select v-model="form.grade" placeholder="请选择" class="form-input">
                  <el-option v-for="item in gradeArray" :key="item" :label="item" :value="item">
                  </el-option>
              </el-select>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <div class="box-header">
        <el-button class="btn-add" type="primary" size="small" @click="handleAdd" icon="el-icon-plus">添加学生</el-button>
        <el-input clearable v-model="o_name" size="small" placeholder="请输入机构名称" class="handle-input mr10"
          @keydown.enter.native="search"></el-input>
        <el-input clearable v-model="c_name" size="small" placeholder="请输入班级名称" class="handle-input1 mr10"
          @keydown.enter.native="search"></el-input>
        <el-input clearable v-model="s_name" size="small" placeholder="请输入学生姓名" class="handle-input2 mr10"
          @keydown.enter.native="search"></el-input>
        <el-input clearable v-model="s_phone" size="small" placeholder="请输入手机号" class="handle-input3 mr10"
          @keydown.enter.native="search"></el-input>
        <el-select v-model="s_grade" placeholder="请选择" size="small" class="handle-input4">
            <el-option v-for="item in gradeArray" :key="item" :label="item" :value="item">
            </el-option>
        </el-select>
        <el-button class="btn-search" type="primary" size="small" icon="el-icon-search" @click.native="search">搜索</el-button>
    </div>
    <el-table :data="tableData" border size="small" class="my-table">
        <el-table-column align="center" prop="name" label="学生姓名" width="120">
        </el-table-column>
        <el-table-column align="center" prop="en_name" label="英文名" width="120">
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="手机" width="180">
        </el-table-column>
        <el-table-column align="center" prop="grade" label="年级" width="120">
        </el-table-column>
        <el-table-column align="center" prop="o_name" label="机构名称" width="120">
        </el-table-column>
        <el-table-column align="center" prop="class_name" label="班级名称" width="120">
        </el-table-column>
        <el-table-column align="center" label="课程进度" width="120">
           <template slot-scope="scope">
							<span v-if="scope.row.class_hour_nums">{{scope.row.progress}}/{{scope.row.class_hour_nums}}</span>
						</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
           <template slot-scope="scope">
             <el-button size="mini"
                 @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
             <el-button size="mini" type="danger"
                  @click="confirmDelete(scope.$index, scope.row)">删除</el-button>
           </template>
       </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @current-change ="handleCurrentChange"
        layout="prev, pager, next"
        :page-count="total_page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { validatPhone } from '@/utils/validate'
import { getStudentList, updateStudent, delStudent } from '@/http/api/waijiaoRequest'
export default {
  name: 'studentindex',
  data () {
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (value !== '') {
          if (!validatPhone(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      gradeArray: [
        '学前', '1年级', '2年级', '3年级', '4年级', '5年级', '6年级'],
      tableData: [],
      o_name: '',
      c_name: '',
      s_name: '',
      s_phone: '',
      s_grade: '',
      total_page: 1,
      curr_page: 1,
      form: {
        name: '',
        en_name: '',
        phone: '',
        grade: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        en_name: [
          { required: true, message: '请输入英文名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: ['blur', 'change'] }
        ]
      },
      dialogVisible: false,
      dialogTitle: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let self = this
      return new Promise((resolve, reject) => {
        getStudentList(this.o_name, this.c_name, this.s_name, this.s_phone, this.s_grade, this.curr_page).then(response => {
          const dataw = response.data
          self.tableData = dataw.list
          self.total_page = dataw.total_page
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleAdd () {
      this.form = {
        name: '',
        en_name: '',
        phone: '',
        grade: ''
      }
      this.dialogVisible = true
      this.dialogTitle = '添加学生'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            updateStudent(this.form).then(response => {
              if (response) {
                this.dialogVisible = false
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
    handleEdit (index, row) {
      this.form['id'] = row.id
      this.form.name = row.name
      this.form.en_name = row.en_name
      this.form.phone = row.mobile
      this.form.grade = row.grade
      this.dialogVisible = true
      this.dialogTitle = '编辑学生信息'
    },
    confirmDelete (index, row) {
      this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
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
        delStudent(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('学生已删除！')
          }
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.student-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 100px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
  }
  .btn-add {
    position: absolute;
    left: 10px;
  }
  .handle-input {
    position: absolute;
    top: 50px;
    left: 10px;
    width: 230px;
    display: inline-block;
  }
  .handle-input1 {
    position: absolute;
    top: 50px;
    left: 260px;
    width: 230px;
    display: inline-block;
  }
  .handle-input2 {
    position: absolute;
    top: 50px;
    left: 510px;
    width: 150px;
    display: inline-block;
  }
  .handle-input3 {
    position: absolute;
    top: 50px;
    left: 680px;
    width: 150px;
    display: inline-block;
  }
  .handle-input4 {
    position: absolute;
    top: 50px;
    left: 850px;
    width: 100px;
    display: inline-block;
  }
  .btn-search {
    position: absolute;
    top: 50px;
    left: 970px;
  }
  .my-table {
    width: 1100px;
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
