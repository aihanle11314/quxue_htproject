<template>
  <div class="chongzhi-container">
    <div class="box-header">
          <el-button class="btn-add" type="primary" icon="el-icon-plus" size="small" @click.native="handleAdd">添加储值课时</el-button>
          <el-button class="btn-edit" type="primary" icon="el-icon-edit" size="small" @click.native="handleCZType">编辑充值类型</el-button>
          <el-button class="btn-delete" type="primary" size="small" @click.native="confirmDelete">删除</el-button>
          <el-input clearable v-model="o_name" placeholder="请输入机构名称" size="small" class="handle-input0 mr10"
              @keydown.enter.native="search"></el-input>
          <el-select v-model="c_type" placeholder="选择充值类型" size="small" class="handle-input1">
              <el-option :key="''" :label="'全部'" :value="''"></el-option>
              <el-option v-for="item in cztypeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
          <el-input clearable v-model="m_name" placeholder="请输入市场对接人" size="small" class="handle-input2 mr10"
              @keydown.enter.native="search"></el-input>
          <el-date-picker v-model="s_date" type="daterange" size="small" range-separator="-"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="handle-input3"
              style="width:250px;">
          </el-date-picker>
          <el-button class="btn-search" type="primary" icon="el-icon-search" size="small" @click.native="search">搜索</el-button>
		</div>
		<el-table :data="tableData" border size="small" class="my-table"
      @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection">
        </el-table-column>
        <el-table-column align="center" prop="oname" label="机构名称">
        </el-table-column>
        <el-table-column align="center" prop="class_hour_nums" label="充值课时">
        </el-table-column>
        <el-table-column align="center" prop="rname" label="充值类型">
        </el-table-column>
        <el-table-column align="center" prop="input_time" label="充值时间">
        </el-table-column>
        <el-table-column align="center" prop="market_name" label="市场对接人">
        </el-table-column>
        <el-table-column align="center" prop="other" label="备注">
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
						<template slot-scope="scope">
								<el-button size="mini"
										@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="机构" prop="oid">
              <el-select v-model="form.oid" filterable placeholder="请选择" class="form-input">
                <el-option v-for="item in jgList" :key="item.id" :label="item.o_name" :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="充值类型" prop="rech_id">
              <el-select v-model="form.rech_id" placeholder="请选择" class="form-input">
                <el-option v-for="item in cztypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="充值课时" prop="class_hour">
              <el-input class="form-input" v-model="form.class_hour"></el-input>
          </el-form-item>
          <el-form-item label="充值时间" prop="input_time">
              <el-date-picker v-model="form.input_time" type="date" class="form-input" placeholder="选择日期" value-format="yyyy-MM-dd">
             </el-date-picker>
          </el-form-item>
          <el-form-item label="市场对接人" prop="butt">
              <el-input class="form-input" v-model="form.butt"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="other">
              <textarea v-model="form.other" cols="32" rows="4"></textarea>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" :loading="addloading" @click="onSubmitForm('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title="编辑充值类型" :visible.sync="czDialogVisible">
        <el-form ref="cztypeform" label-width="10px" size="small">
          <el-form-item v-for="(domain, index) in domains"
             :key="domain.key" :prop="'domains.' + index + '.value'">
            <el-input v-model="domain.value" style="width:200px;" size="small"></el-input>
            <el-button icon="el-icon-check" type="success" @click.prevent="onSubmitCZType(domain)" size="small"></el-button>
            <el-button icon="el-icon-delete" type="danger" @click.prevent="confirmDeleteCZType(domain)" size="small"></el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-plus" @click="addDomain" size="small">新增类型</el-button>
            <el-button type="primary" size="small" @click="czDialogVisible=false">返回</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getJGList } from '@/http/api/jigouRequest'
import { getChongzhi, addChongzhi, editChongzhi, deleteChongzhi, getChongzhiType, addChongzhiType, editChongzhiType, deleteChongzhiType } from '@/http/api/waijiaoRequest'
export default {
  name: 'Chongzhi',
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      o_name: '',
      c_type: '',
      m_name: '',
      s_date: '',
      total_page: 1,
      curr_page: 1,
      form: {
        oid: '',
        rech_id: '',
        class_hour: '',
        input_time: '',
        buff: '',
        other: ''
      },
      jgList: [],
      cztypeList: [],
      rules: {
        oid: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        rech_id: [
          { required: true, message: '请输入充值类型', trigger: 'blur' }
        ],
        class_hour: [
          { required: true, message: '请输入充值课时', trigger: 'blur' }
        ],
        input_time: [
          { required: true, message: '请输入充值时间', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogTitle: '',
      addloading: false,
      czDialogVisible: false,
      domains: [{
        value: ''
      }]
    }
  },
  created () {
    this.getData()
    this.getCZTypeList()
    this.getJgList()
  },
  methods: {
    getData () {
      let self = this
      var stime = ''
      var etime = ''
      if (this.s_date && this.s_date.length === 2) {
        stime = this.s_date[0]
        etime = this.s_date[1]
      }
      return new Promise((resolve, reject) => {
        getChongzhi(this.o_name, this.c_type, this.m_name, stime, etime, this.curr_page).then(response => {
          const dataw = response
          self.tableData = dataw.list.dataList
          self.total_page = dataw.totalPage
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getJgList () {
      let self = this
      return new Promise((resolve, reject) => {
        getJGList().then(response => {
          const dataw = response.data
          self.jgList = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCZTypeList () {
      let self = this
      return new Promise((resolve, reject) => {
        getChongzhiType().then(response => {
          const dataw = response
          self.cztypeList = dataw.list
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
    handleAdd () {
      this.form = {
        oid: '',
        rech_id: '',
        class_hour: '',
        input_time: '',
        buff: '',
        other: ''
      }
      this.dialogTitle = '增加储值课时'
      this.dialogVisible = true
    },
    handleEdit (index, row) {
      this.form['id'] = row.id
      // this.jgList.forEach(item => {
      //   if (item.o_name === row.name) {
      //     this.form.oid = item.id
      //   }
      // })
      this.form.oid = parseInt(row.o_id)
      this.form.rech_id = row.rech_id
      this.form.class_hour = row.class_hour_nums
      this.form.input_time = row.input_time
      this.form.butt = row.market_name
      this.form.other = row.other
      this.dialogVisible = true
      this.dialogTitle = '编辑储值课时'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addloading = true
          if (this.form.id) {
            return new Promise((resolve, reject) => {
              editChongzhi(this.form).then(response => {
                this.addloading = false
                if (response) {
                  this.dialogVisible = false
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
            return new Promise((resolve, reject) => {
              addChongzhi(this.form).then(response => {
                this.addloading = false
                if (response) {
                  this.dialogVisible = false
                  this.getData()
                  this.$message.success('提交成功！')
                }
                resolve()
              }).catch(error => {
                this.addloading = false
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
    handleSelectionChange (val) {
      this.multipleSelection = val
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
      return new Promise((resolve, reject) => {
        deleteChongzhi(pid).then(response => {
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
    handleCZType () {
      this.domains = []
      if (this.cztypeList) {
        this.cztypeList.forEach(item => {
          this.domains.push({
            value: item.name,
            key: item.id
          })
        })
      }
      this.czDialogVisible = true
    },
    removeDomain (item) {
      var index = this.domains.indexOf(item)
      if (index !== -1) {
        this.domains.splice(index, 1)
      }
    },
    addDomain () {
      this.domains.push({
        value: '',
        key: 'key' + Date.now()
      })
    },
    onSubmitCZType (domain) {
      domain['name'] = domain.value
      if (domain.key.indexOf('key') > -1) {
        return new Promise((resolve, reject) => {
          addChongzhiType(domain).then(response => {
            if (response) {
              this.getCZTypeList()
              this.$message.success('添加成功！')
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      } else {
        domain['id'] = domain.key
        return new Promise((resolve, reject) => {
          editChongzhiType(domain).then(response => {
            if (response) {
              this.getCZTypeList()
              this.$message.success('编辑成功！')
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    },
    confirmDeleteCZType (domain) {
      if (domain.key.indexOf('key') > -1) {
        this.removeDomain(domain)
        return
      }
      this.$confirm('此操作将永久删除充值类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCZType(domain)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteCZType (domain) {
      return new Promise((resolve, reject) => {
        deleteChongzhiType(domain.key).then(response => {
          if (response) {
            this.removeDomain(domain)
            this.getCZTypeList()
            this.$message.success('删除成功！')
          }
          resolve()
        }).catch(error => {
          this.addloading = false
          reject(error)
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.chongzhi-container {
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
  .btn-edit {
    position: absolute;
    left: 150px;
  }
  .btn-delete {
    position: absolute;
    left: 10px;
    top: 60px;
  }
  .handle-input0 {
    position: absolute;
    left: 100px;
    top: 60px;
    width: 200px;
  }
  .handle-input1 {
    position: absolute;
    left: 320px;
    top: 60px;
    width: 130px;
  }
  .handle-input2 {
    position: absolute;
    left: 490px;
    top: 60px;
    width: 150px;
  }
  .handle-input3 {
    position: absolute;
    left: 660px;
    top: 60px;
    width: 250px;
  }
  .btn-search {
    position: absolute;
    left: 920px;
    top: 60px;
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
