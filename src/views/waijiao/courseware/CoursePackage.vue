<template>
    <div class="coursepack-container">
       <div class="box-header">
          <el-button class="btn-delete" type="primary" size="small" @click="confirmDelete">删除</el-button>
          <el-button class="btn-add" type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新建课包</el-button>
          <el-input clearable v-model="select_name" size="small" placeholder="输入课包名" class="handle-input mr10"
             @keydown.enter.native="search">></el-input>
          <el-button class="btn-search" type="primary" size="small" icon="el-icon-search" @click.native="search">搜索</el-button>
        </div>
        <el-table :data="tableData" border size="small" class="my-table" ref="multipleTable"
          @selection-change="handleSelectionChange" v-loading="listLoading">
            <el-table-column align="center" type="selection" width="50">
            </el-table-column>
            <el-table-column align="center" prop="bag_name" label="课包名称">
            </el-table-column>
            <el-table-column align="center" prop="nums" label="课时数量">
            </el-table-column>
            <el-table-column align="center" prop="bag_level" label="课包级别">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini"
                  @click="handleLook(scope.$index, scope.row)">查看</el-button>
                <el-button size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination">
          <el-pagination
            background
            @current-change ="handleCurrentChange"
            layout="prev, pager, next"
            :page-count="total_page">
          </el-pagination>
        </div>
        <el-dialog :title="addTitle" :visible.sync="addVisible">
         <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="课包名称" prop="bag_name">
              <el-input class="form-input" v-model="form.bag_name" placeholder="请输入课包名称" ></el-input>
          </el-form-item>
          <el-form-item label="课包级别" prop="bag_level">
            <el-select v-model="form.bag_level" placeholder="请选择课包级别" class="form-input">
              <el-option v-for="item in cp_level" v-bind:key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课件选择">
            <!-- <el-select v-model="curr_cw_level" placeholder="课件级别" class="form-input">
              <el-option v-for="item in cw_level" v-bind:key="item" :label="item" :value="item">
              </el-option>
            </el-select> -->
            <el-transfer v-model="form.cw_id" :data="selCWareList" filterable
              :filter-method="cwarefilterMethod" filter-placeholder="请输入课件级别/编号" :target-order="'push'"
              :titles="['课件列表', '已选课件']"
              style="text-align:left;display:inline-block;width:600px;height:300px;margin-left:-100px;margin-top:40px;">
            </el-transfer>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
       </el-dialog>
       <el-dialog title="课包详情" :visible.sync="moreVisible">
          <el-table :data="tableMoreData" height="500">
            <el-table-column align="center" prop="identifier" label="课件编号">
            </el-table-column>
            <el-table-column align="center" prop="theme" label="主题">
            </el-table-column>
            <el-table-column align="center" prop="attachment" label="课件下载">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="handleDownload(scope.row.attachment)">download</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="pdf" label="PDF">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="handleDownload(scope.row.pdf)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
       </el-dialog>
    </div>
</template>

<script>
import { getCourseWareList, getCoursePackageList, getCoursePackageMore, addCoursePackage, updateCoursePackage, delCoursePackage } from '@/http/api/waijiaoRequest'
// const cwLevel = ['全部', 'S01', 'S02', 'S03', 'S04', 'L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08', 'L09', 'L010', 'L011', 'L012']
const cpLevel = ['Starter', 'Level1', 'Level2', 'Level3', 'Level4', 'Level5', 'Level6']
export default {
  name: 'courseware',
  data () {
    return {
      listLoading: false,
      tableData: [], // 课包列表
      tableMoreData: [], // 课包查看课件列表
      multipleSelection: [], // 多选列表
      // cw_level: cwLevel,
      cp_level: cpLevel,
      cwareData: [], // 课件列表
      // curr_cw_level: '',
      cwarefilterMethod (query, item) {
        if (item) {
          return item.search.indexOf(query) > -1
        } else {
          return false
        }
      },
      form: {
        bag_name: '',
        bag_level: '',
        cw_id: []
      },
      rules: {
        bag_name: [
          { required: true, message: '请输入课件主题', trigger: 'blur' }
        ],
        bag_level: [
          { required: true, message: '请选择课件级别', trigger: 'change' }
        ]
      },
      addVisible: false,
      addTitle: '',
      moreVisible: false,
      select_name: '',
      total_page: 1,
      curr_page: 1
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
    },
    selCWareList () {
      // var keyword = this.curr_cw_level
      // if (keyword === '全部') {
      //   keyword = ''
      // }
      // var sellist = this.cwareData.filter(function (d) {
      //   if (d.level.indexOf(keyword) > -1) {
      //     return d
      //   }
      // })
      var data = []
      this.cwareData.forEach((item, index) => {
        data.push({
          label: item.identifier + '_' + item.theme,
          key: item.id,
          search: item.level + '_' + item.identifier
        })
      })
      return data
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let self = this
      this.listLoading = true
      return new Promise((resolve, reject) => {
        getCoursePackageList(this.select_name, this.curr_page).then(response => {
          const dataw = response.data
          self.tableData = dataw.list
          self.total_page = dataw.total_page
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getCWareData () {
      let self = this
      return new Promise((resolve, reject) => {
        getCourseWareList('', 0).then(response => {
          const dataw = response.data
          self.cwareData = dataw.list
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getMoreData (id) {
      let self = this
      return new Promise((resolve, reject) => {
        getCoursePackageMore(id).then(response => {
          const dataw = response.data
          self.tableMoreData = dataw
          self.form.cw_id = []
          self.tableMoreData.forEach((item, index) => {
            self.form.cw_id[index] = item.id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.getCWareData()
      this.form = {
        bag_name: '',
        bag_level: '',
        cw_id: []
      }
      this.addVisible = true
      this.addTitle = '添加课包'
    },
    handleEdit (index, row) {
      this.getCWareData()
      this.getMoreData(row.id)
      this.form['id'] = row.id
      this.form.bag_name = row.bag_name
      this.form.bag_level = row.bag_level
      this.addVisible = true
      this.addTitle = '编辑课包'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            return new Promise((resolve, reject) => {
              updateCoursePackage(this.form).then(response => {
                if (response) {
                  this.addVisible = false
                  this.getData()
                  this.$message.success('编辑成功！')
                }
                resolve()
              }).catch(error => {
                reject(error)
              })
            })
          } else {
            return new Promise((resolve, reject) => {
              addCoursePackage(this.form).then(response => {
                if (response) {
                  this.addVisible = false
                  this.getData()
                  this.$message.success('添加成功！')
                }
                resolve()
              }).catch(error => {
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
    confirmDelete () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条需要删除的信息！')
        return
      }
      this.$confirm('此操作将永久删除课包, 是否继续?', '提示', {
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
      return new Promise((resolve, reject) => {
        delCoursePackage(this.multipleSelecIds).then(response => {
          if (response) {
            this.getData()
            this.$message.success('课包已删除！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleLook (index, row) {
      this.getMoreData(row.id)
      this.moreVisible = true
    },
    search () {
      this.getData()
    },
    handleCurrentChange (val) {
      this.curr_page = val
      this.getData()
    },
    handleDownload (download) {
      if (download) {
        window.open(download)
      } else {
        this.$message.info('您还没有提供课件地址哦！')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.coursepack-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 50px;
    margin-left: 10px;
    margin-top: 10px;
    font-size: 18px;
    .btn-delete {
      position: absolute;
      left: 10px;
    }
    .btn-add {
      position: absolute;
      left: 130px;
    }
    .btn-addAll {
      position: absolute;
      left: 220px;
    }
    .handle-input{
      position: absolute;
      left: 380px;
      width: 250px;
      display: inline-block;
    }
    .btn-search {
      position: absolute;
      left: 640px;
    }
  }
  .my-table {
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
