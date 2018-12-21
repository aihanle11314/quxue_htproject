<template>
    <div class="acindex-container">
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="账号" prop="username">
              <el-input class="form-input" v-model="form.username"></el-input>
           </el-form-item>
           <el-form-item label="角色" prop="role_id">
                <el-select v-model="form.r_id" placeholder="请选择" class="form-input">
                    <el-option v-for="item in roleslist" :key="item.id" :label="item.describe" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
       </el-dialog>
       <div class="box-header">
          <el-button class="btn-add-account" type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加账号</el-button>
          <el-input clearable v-model="select_name" placeholder="请输入账户名" size="small" class="handle-input mr10"></el-input>
          <el-button class="btn-search-account" type="primary" icon="el-icon-search" size="small" @click.native="search">搜索</el-button>
        </div>
        <el-table :data="tableData" border size="small" class="proj-table">
            <el-table-column align="center" prop="username" label="账号" width="180">
            </el-table-column>
            <el-table-column align="center" prop="describe" label="角色" width="180">
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
import { getAccountList, updateAccount, delAccount, getAcRoleList } from '@/http/api/accountRequest'
export default {
  name: 'account',
  data () {
    return {
      roleList: [],
      tableData: [],
      form: {
        username: '',
        r_id: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入机构账号', trigger: 'blur' }
        ],
        r_id: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogTitle: '',
      select_name: '',
      cur_page: 1,
      total_page: 1
    }
  },
  created () {
    this.getData()
    this.getRoleList()
  },
  computed: {
    roleslist () {
      const self = this
      return self.roleList.filter(function (d) {
        // if (d.r_name.indexOf('admin') > -1) {
        return d
        // }
      })
    }
  },
  methods: {
    getData () {
      return new Promise((resolve, reject) => {
        getAccountList(this.select_name, this.cur_page).then(response => {
          const dataw = response.data
          this.tableData = dataw.list
          this.total_page = dataw.total_page
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getRoleList () {
      let self = this
      return new Promise((resolve, reject) => {
        getAcRoleList().then(response => {
          const dataw = response.data
          self.roleList = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleAdd () {
      this.form = {
        username: '',
        r_id: ''
      }
      this.dialogVisible = true
      this.dialogTitle = '添加账号'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            updateAccount(this.form).then(response => {
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
      this.form.username = row.username
      this.form.r_id = row.role
      this.dialogVisible = true
      this.dialogTitle = '编辑账号'
    },
    confirmDelete (index, row) {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
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
        delAccount(row.id).then(response => {
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
    // confirmResetPsw (index, row) {
    //   this.$confirm('此操作将重置账号密码, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.resetPassword(index, row)
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消重置'
    //     })
    //   })
    // },
    // resetPassword (index, row) {
    //   return new Promise((resolve, reject) => {
    //     resetJGAcPsw(row.id).then(response => {
    //       this.$message.success('账号密码已重置！')
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
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
.acindex-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
  }
  .btn-add-account {
    position: absolute;
    left: 10px;
  }
  .handle-input{
    position: absolute;
    left: 300px;
    width: 300px;
    display: inline-block;
  }
  .btn-search-account {
    position: absolute;
    left: 610px;
  }
  form {
    width: 420px;
    margin: 0 auto;
  }
  .form-input {
    width: 250px;
  }
  .proj-table {
    width: 700px;
    margin-left: 10px;
  }
  .pagination {
    display: block;
    margin: 0 auto;
    margin-top: 10px;
  }
}
</style>
