<template>
    <div class="project-container">
      <el-dialog :title="addTitle" :visible.sync="addVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="产品名称" prop="name">
              <el-input class="form-input" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="产品描述" prop="describe">
              <el-input class="form-input" v-model="form.describe"></el-input>
          </el-form-item>
          <el-form-item label="产品开关">
              <el-switch v-model="proSwitch"
                active-text=打开产品 inactive-text="关闭产品">
              </el-switch>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
        </el-form>
       </el-dialog>
       <div class="box-header">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加产品</el-button>
        </div>
        <el-table :data="tableData" border size="small" class="proj-table" ref="multipleTable">
            <el-table-column align="center" prop="id" label="产品编号" width="80">
            </el-table-column>
            <el-table-column align="center" prop="name" label="产品名称" width="260">
            </el-table-column>
            <el-table-column align="center" prop="describe" label="产品描述" width="160">
            </el-table-column>
            <el-table-column align="center" prop="status" label="产品状态" width="160">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1">正常</span>
                <span v-else-if="scope.row.status === -1">关闭</span>
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
    </div>
</template>

<script>
import { getProjectList, updateProject, delProject } from '@/http/api/productRequest'
export default {
  name: 'project',
  data () {
    return {
      tableData: [],
      form: {
        name: '',
        describe: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ]
      },
      addVisible: false,
      addTitle: '',
      proSwitch: true
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
        getProjectList().then(response => {
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
        name: '',
        describe: ''
      }
      this.addVisible = true
      this.addTitle = '添加产品'
    },
    handleEdit (index, row) {
      this.form['id'] = row.id
      this.form.name = row.name
      this.form.describe = row.describe
      if (row.status === -1) {
        this.proSwitch = false
      } else {
        this.proSwitch = true
      }
      this.addVisible = true
      this.addTitle = '编辑产品'
    },
    onSubmitForm (formName) {
      this.addVisible = false
      if (!this.proSwitch) {
        this.form['status'] = -1
      } else {
        this.form['status'] = ''
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            updateProject(this.form).then(response => {
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
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
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
        delProject(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('产品已删除！')
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
.project-container {
  margin: 0;
  padding: 0;
  .box-header {
    width: 100px;
    height: 50px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .proj-table {
    width: 860px;
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
