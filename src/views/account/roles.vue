<template>
    <div class="acrole-container">
      <el-dialog :title="addTitle" :visible.sync="addVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="角色名称" prop="r_name">
            <el-input class="form-input" v-model="form.role_name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="describe">
            <el-input class="form-input" v-model="form.describe"></el-input>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
       </el-dialog>
       <div class="box-header">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加角色</el-button>
        </div>
        <el-table :data="tableData" border size="small" class="proj-table" ref="multipleTable">
            <el-table-column align="center" prop="id" label="角色编号" width="80">
            </el-table-column>
            <el-table-column align="center" prop="role_name" label="角色名称" width="260">
            </el-table-column>
            <el-table-column align="center" prop="describe" label="角色描述" width="160">
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
    </div>
</template>

<script>
import { getAcRoleList, updateAcRole, delAcRole } from '@/http/api/accountRequest'
export default {
  name: 'acrole',
  data () {
    return {
      tableData: [],
      form: {
        role_name: '',
        describe: ''
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      addVisible: false,
      addTitle: ''
    }
  },
  created () {
    this.getData()
  },
  computed: {

  },
  methods: {
    getData () {
      let self = this
      return new Promise((resolve, reject) => {
        getAcRoleList().then(response => {
          const dataw = response.data
          self.tableData = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleAdd () {
      this.form = {
        role_name: '',
        describe: ''
      }
      this.addVisible = true
      this.addTitle = '添加机构角色'
    },
    handleEdit (index, row) {
      this.form['id'] = row.id
      this.form.role_name = row.role_name
      this.form.describe = row.describe
      this.addVisible = true
      this.addTitle = '编辑机构角色'
    },
    onSubmitForm (formName) {
      this.addVisible = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            updateAcRole(this.form).then(response => {
              if (response) {
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
    confirmDelete (index, row) {
      let self = this
      self.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.handleDelete(index, row)
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete (index, row) {
      return new Promise((resolve, reject) => {
        delAcRole(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('角色已删除！')
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
.acrole-container {
  margin: 0;
  padding: 0;
  .box-header {
    width: 100px;
    height: 50px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .proj-table {
    width: 700px;
    margin-left: 10px;
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
