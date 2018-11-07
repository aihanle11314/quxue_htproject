<template>
  <div class="teacher-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="姓名" prop="name">
              <el-input class="form-input" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="国籍" prop="nation">
              <el-input class="form-input" v-model="form.nation"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input class="form-input" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="skype" prop="skype">
              <el-input class="form-input" v-model="form.skype"></el-input>
          </el-form-item>
          <el-form-item label="classin" prop="classin">
              <el-input class="form-input" v-model="form.classin"></el-input>
          </el-form-item>
          <el-form-item label="时区" prop="time_zone">
              <el-select v-model="form.time_zone" placeholder="请选择" class="form-input">
                  <el-option v-for="item in timeZoneArray" :key="item" :label="item" :value="item">
                  </el-option>
              </el-select>
           </el-form-item>
           <el-form-item label="账号" prop="account">
              <el-input class="form-input" v-model="form.account"></el-input>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <div class="box-header">
        <el-button class="btn-add" type="primary" @click="handleAdd" size="small" icon="el-icon-plus">添加外教</el-button>
        <el-input clearable v-model="key_words" placeholder="请输入外教姓名" class="handle-input mr10" size="small"
          @keydown.enter.native="search"></el-input>
        <el-button class="btn-search" type="primary" size="small" icon="el-icon-search" @click.native="search">搜索</el-button>
    </div>
    <el-table :data="tableData" border size="small" class="my-table">
        <el-table-column align="center" prop="name" label="外教姓名" width="120">
        </el-table-column>
        <el-table-column align="center" prop="nation" label="国籍" width="120">
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column align="center" prop="skype" label="skype" width="120">
        </el-table-column>
        <el-table-column align="center" prop="classin" label="Classin账号" width="120">
        </el-table-column>
        <el-table-column align="center" prop="time_zone" label="时区" width="120">
        </el-table-column>
        <el-table-column align="center" prop="account" label="账号" width="120">
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
import { getTeacherList, updateTeacher, delTeacher } from '@/http/api/waijiaoRequest'
export default {
  name: 'teacherindex',
  data () {
    return {
      timeZoneArray: [
        'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12',
        'GMT-1', 'GMT-2', 'GMT-3', 'GMT-4', 'GMT-5', 'GMT-6', 'GMT-7', 'GMT-8', 'GMT-9', 'GMT-10', 'GMT-11', 'GMT-12'
      ],
      tableData: [],
      key_words: '',
      total_page: 1,
      curr_page: 1,
      form: {
        name: '',
        nation: '',
        email: '',
        skype: '',
        classin: '',
        time_zone: '',
        account: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        nation: [
          { required: true, message: '请输入国籍', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        skype: [
          { required: true, message: '请输入skype', trigger: 'blur' }
        ],
        classin: [
          { required: true, message: '请输入classin', trigger: 'blur' }
        ],
        time_zone: [
          { required: true, message: '请选择时区', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
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
        getTeacherList(this.key_words, this.curr_page).then(response => {
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
        nation: '',
        email: '',
        skype: '',
        classin: '',
        time_zone: '',
        account: ''
      }
      this.dialogVisible = true
      this.dialogTitle = '添加外教'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            updateTeacher(this.form).then(response => {
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleEdit (index, row) {
      this.form['id'] = row.id
      this.form.name = row.name
      this.form.nation = row.nation
      this.form.email = row.email
      this.form.skype = row.skype
      this.form.classin = row.classin
      this.form.time_zone = row.time_zone
      this.form.account = row.account
      this.dialogVisible = true
      this.dialogTitle = '编辑外教信息'
    },
    confirmDelete (index, row) {
      this.$confirm('此操作将永久删除该外教, 是否继续?', '提示', {
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
        delTeacher(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('账号已删除！')
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
      this.cur_page = val
      this.getData()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.teacher-container {
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
    left: 10px;
  }
  .handle-input{
    position: absolute;
    left: 300px;
    width: 300px;
    display: inline-block;
  }
  .btn-search {
    position: absolute;
    left: 610px;
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
