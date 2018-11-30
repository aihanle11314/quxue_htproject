<template>
    <div class="appbanner-container">
      <div class="box-header">
        <el-button class="btn-add" type="primary" icon="el-icon-plus" size="small" @click.native="handleAdd">新增</el-button>
            <el-input v-model="cl_name" placeholder="请输入类别名称" class="handle-input2 mr10" size="small"></el-input>
            <el-button class="btn-search" type="primary" icon="el-icon-search" @click.native="search" size="small">搜索</el-button>
            <el-button class="btn-search1" type="primary" icon="el-icon-close" @click.native="confirmDelete" size="small">删除</el-button>
      </div>
      		<el-table :data="tableData" border size="mini" class="my-table"
      @selection-change="handleSelectionChange" v-loading="listLoading">
        <el-table-column align="center" type="selection">
        </el-table-column>
        <el-table-column align="center" prop="id" label="序号">
				</el-table-column>
				<el-table-column align="center" prop="name" label="类别名称">
				</el-table-column>
				<el-table-column align="center" prop="weight" label="权重">
				</el-table-column>
				<el-table-column align="center" prop="describe" label="描述">
				</el-table-column>
          <el-table-column align="center" prop="is_hide" label="是否隐藏">
            <template slot-scope="scope">
            {{ scope.row.is_hide === 1 ?  '隐藏': '' }}
            {{ scope.row.is_hide === 2 ?  '显示': '' }}
          </template>
        </el-table-column>
				<el-table-column align="center" label="操作">
						<template slot-scope="scope">
								<el-button size="mini" type="danger" plain v-if="scope.row.is_hide === 2"
										@click="hideEdit(scope.$index, scope.row)">隐藏</el-button>
                <el-button size="mini"
										@click="hideEdit(scope.$index, scope.row)" v-if="scope.row.is_hide === 1">显示</el-button>
                <el-button size="mini" style="margin-top:5px;margin-left:0;"
										@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
       <el-dialog :title="editTitle" :visible.sync="editVisible">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="分类名称" prop="name">
              <el-input class="form-input" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="分类权重" prop="weight">
                <el-select v-model="form.weight" placeholder="请选择">
                    <!-- <el-option v-for="item in jgList" :key="item" :label="item" :value="item">
                  </el-option> -->
                  <el-option label="一" value="1"></el-option>
                  <el-option label="二" value="2"></el-option>
                  <el-option label="三" value="3"></el-option>
                  <el-option label="四" value="4"></el-option>
                  <el-option label="五" value="5"></el-option>
                  <el-option label="六" value="6"></el-option>
                  <el-option label="七" value="7"></el-option>
                  <el-option label="八" value="8"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类描述" prop="describe">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" class="form-input" v-model="form.describe"></el-input>
            </el-form-item>
            <el-form-item>
                  <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
              </el-form-item>
          </el-form>
         </el-dialog> 
    </div>
</template>

<script>
import {updateClass, getPyclassList, hidepyClass, deletepyClass, editpyClass} from '@/http/api/peiyinRequest'
export default {
  name: 'pyclassManage',
  data () {
    return {
      listLoading: false,
      editVisible: false,
      editTitle: '',
      tableData: [],
      cl_name: '',
      multipleSelection: [],
      page_size: 20,
      total: 1,
      page: 1,
      is_hide: '',
      form: {
        name: '',
        weight: '',
        describe: ''
      },
      jgList: [1,2,3,4,5,6,7,8],
    }
  },
  created () {
      this.getData()
  },
  computed: {
    typeArr: function() {
      let self = this
      if(this.form1.edit_pclass){
        return this.form1.edit_pclass.split(',')
          }else {
            return this.form1.edit_pclass
      }
    }
  },
  methods: {
      getData () {
      this.listLoading = true
      let self = this
      return new Promise((resolve, reject) => {//更改字段名！！
        getPyclassList(this.page, this.cl_name).then(response => {
          const dataw = response.data
          self.tableData = dataw.data
        //   self.total_page = dataw.page_total
          self.total = dataw.total
          self.page_size = dataw.every_page_number
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    search () {
      this.getData()
    },
    confirmDelete (index, row) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条记录！')
        return
      }
      this.$confirm('此操作将永久删除充值记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete () {
      var pid = ''
      var selects = this.multipleSelection
      for (var i = 0; i < selects.length; i++) {
        if (i === selects.length - 1) {
          pid += selects[i].id
        } else {
          pid += selects[i].id + ','
        }
      }
      console.log(pid,222222222222)
      return new Promise((resolve, reject) => {
        deletepyClass(pid).then(response => {
          if (response) {
            this.getData()
            this.$message.success('删除成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection[0].id)
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    },
    handleAdd () {
      this.$router.push({name: 'addClass'})
    },
    hideEdit (index, row) {
      let self = this
      if (row.is_hide === 2) {
        row.is_hide = 1
      }else {
        row.is_hide = 2
      }
      return new Promise((resolve, reject) => {
        hidepyClass({is_hide:row.is_hide, type_id:row.id}).then(response => {
          if (response) {
            this.getData()
            this.$message.success('操作成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleEdit (index, row) {
      this.form['type_id'] = row.id
      this.form.name = row.name //以下各项改成将要显示的字段名
      this.form.weight = row.weight
      this.form.describe = row.describe
      this.editVisible = true//控制显示
      this.editTitle = '编辑配音'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = true
            return new Promise((resolve, reject) => {
              editpyClass(this.form).then(response => {
                if (response) {
                  this.editVisible = false
                  this.getData()
                  this.$message.success('提交成功！')
                }
                resolve()
              }).catch(error => {
                this.addloading = false
                reject(error)
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
//实现路由页参考 机构班级页
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.appbanner-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
    .btn-add {
      position: absolute;
      left: 10px;
    }
    .handle-input0 {
      position: absolute;
      left: 100px;
      width: 140px;
      display: inline-block;
    }
    .handle-input1 {
      position: absolute;
      left: 200px;
      width: 120px;
      display: inline-block;
    }
    .handle-input2 {
      position: absolute;
      left: 255px;
      width: 200px;
      display: inline-block;
    }
    .handle-input3 {
      position: absolute;
      left: 500px;
      top: 18px;
    }
    .btn-search {
        position: absolute;
        left: 800px;
      }
    .btn-search1 {
    position: absolute;
    left: 900px;
    }
  }
}
</style>
