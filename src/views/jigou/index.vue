<template>
    <div class="jg-container">
      <el-dialog :title="addTitle" :visible.sync="addVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="机构名称" prop="name">
              <el-input class="form-input" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="机构描述" prop="describe">
              <el-input class="form-input" v-model="form.describe"></el-input>
          </el-form-item>
          <el-form-item label="机构代码" prop="code">
              <el-input class="form-input" v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="产品权限" prop="project">
            <el-checkbox-group v-model="project" class="form-input">
              <el-checkbox v-for="item in projectList" :key="item.id" :label="item.id">
                {{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
            </el-form-item>
        </el-form>
       </el-dialog>
       <div class="box-header">
          <el-button class="btn-add" type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加机构</el-button>
          <el-input clearable v-model="select_name" placeholder="请输入机构名称/代码" size="small" class="handle-input mr10"></el-input>
          <el-button class="btn-search" type="primary" icon="el-icon-search" size="small" @click.native="search">搜索</el-button>
        </div>
        <el-table :data="datalist" border size="small" class="proj-table" ref="multipleTable">
            <el-table-column align="center" prop="code" label="机构代码" width="80">
            </el-table-column>
            <el-table-column align="center" prop="o_name" label="机构名称" width="260">
            </el-table-column>
            <el-table-column align="center" prop="describe" label="机构描述" width="160">
            </el-table-column>
            <el-table-column align="center" prop="project" label="产品权限" width="180">
              <template slot-scope="scope">
                {{getProductName(scope.row.project)}}
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
import { getJGList, updateJG, delJG } from '@/http/api/jigouRequest'
import { getProjectList } from '@/http/api/productRequest'
export default {
  name: 'jigou',
  data () {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入机构名称'))
      } else {
        if (value !== '') {
          if (!isNaN(value)) {
            callback(new Error('机构名称不能全为数字'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      projectList: [],
      tableData: [],
      form: {
        name: '',
        describe: '',
        code: ''
      },
      project: [],
      rules: {
        name: [
          { required: true, validator: validateName, trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '请输入机构代码', trigger: 'blur' }
        ]
      },
      addVisible: false,
      addTitle: '',
      is_search: false,
      select_name: ''
    }
  },
  created () {
    this.getProjectList()
  },
  computed: {
    datalist () {
      const self = this
      return self.tableData.filter(function (d) {
        if (d.o_name.indexOf(self.select_name) > -1 || (d.code + '').indexOf(self.select_name) > -1) {
          return d
        }
      })
    }
  },
  methods: {
    getData () {
      let self = this
      return new Promise((resolve, reject) => {
        getJGList().then(response => {
          const dataw = response.data
          self.tableData = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getProjectList () {
      let self = this
      return new Promise((resolve, reject) => {
        getProjectList().then(response => {
          const dataw = response.data
          self.projectList = dataw
          self.getData()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleAdd () {
      this.form = {
        name: '',
        describe: '',
        code: ''
      }
      this.addVisible = true
      this.addTitle = '添加机构'
    },
    handleEdit (index, row) {
      this.form['id'] = row.id
      this.form.name = row.o_name
      this.form.describe = row.describe
      this.form.code = row.code
      this.project = row.project
      this.addVisible = true
      this.addTitle = '编辑机构'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form['project'] = this.project
          return new Promise((resolve, reject) => {
            updateJG(this.form).then(response => {
              if (response) {
                this.addVisible = false
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
      this.$confirm('此操作将永久删除该机构, 是否继续?', '提示', {
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
        delJG(row.id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('机构已删除！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    search () {
      this.is_search = true
    },
    getProductName (project) {
      var proname = ''
      for (var i = 0; i < project.length; i++) {
        for (var j = 0; j < this.projectList.length; j++) {
          var item = this.projectList[j]
          if (project[i] === item.id) {
            if (i === project.length - 1) {
              proname += item.name
            } else {
              proname += item.name + ';'
            }
          }
        }
      }
      return proname
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.jg-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 50px;
    margin-left: 10px;
    margin-top: 10px;
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
