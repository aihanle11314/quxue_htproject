<template>
  <div class="statis-more-container">
    <div style="position:relative;width:73px;margin-top:8px;margin-left:10px;">
      <el-button type="primary" icon="el-icon-arrow-left" @click.native="goBack" size="small">返回</el-button>
    </div>
    <div class="box-data">
      <div class="box-data-item border" style="color:#202fb8;">机构：{{jgData.o_name}}</div>
      <div class="box-data-item border">班级数量：{{jgData.class_totals}}个</div>
      <div class="box-data-item border">教师数量：{{jgData.teacher_totals}}个</div>
      <div class="box-data-item border">学生数量：{{jgData.student_totals}}个</div>
      <el-button type="primary" style="float: right;margin-top:3px;" size="small" icon="el-icon-search"
        @click.native="doExport" :loading="exportloading">导出</el-button>
    </div>
    <div class="box-header">
      <el-select v-model="c_level" placeholder="班级级别" class="handle-input0" size="small">
        <el-option :label="'全部'" :value="''">
        </el-option>
        <el-option v-for="item in clevels" :label="item.option" :value="item.option" :key="item.option">
        </el-option>
      </el-select>
      <el-input clearable v-model="c_name" size="small" placeholder="请输入班级名称" class="handle-input1 mr10"
        @keydown.enter.native="search"></el-input>
      <el-input clearable v-model="t_name" size="small" placeholder="教师姓名" class="handle-input2 mr10"
        @keydown.enter.native="search"></el-input>
      <el-date-picker v-model="s_date" type="daterange" size="small" range-separator="-" unlink-panels
        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="handle-input3">
      </el-date-picker>
      <el-button class="btn-search" type="primary" size="small" icon="el-icon-search" @click.native="search">搜索</el-button>
	</div>
	<el-table :data="tableData" border size="mini" class="my-table" v-loading="listLoading">
      <el-table-column align="center" prop="class_id" label="班级ID">
      </el-table-column>
      <el-table-column align="center" prop="class_name" label="班级名称">
      </el-table-column>
      <el-table-column align="center" prop="u_name" label="教师名称">
      </el-table-column>
      <el-table-column align="center" prop="studentnumber" label="学生数量">
      </el-table-column>
      <el-table-column align="center" prop="level_name" label="班级级别">
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间">
      </el-table-column>
		</el-table>
		<div class="pagination" v-show="!listLoading">
			<el-pagination
				background
				@current-change ="handleCurrentChange"
				layout="total, prev, pager, next, jumper"
				:page-size="page_size"
        :total="total">
			</el-pagination>
		</div>
  </div>
</template>

<script>
import { getAppClassLevel, getAppClasses } from '@/http/api/qxappRequest'
export default {
  name: 'appStatisClass',
  data () {
    return {
      jgData: '',
      listLoading: false,
      exportloading: false,
      clevels: [], // 班级级别列表
      tableData: [],
      c_level: '',
      c_name: '',
      t_name: '',
      s_date: '',
      total: 0,
      total_page: 1,
      curr_page: 1,
      page_size: 20
    }
  },
  created () {
    this.jgData = this.$route.params.data
    // console.log(this.$route.params.data)
    this.getClassLevel()
    this.getData()
  },
  methods: {
    getData () {
      this.listLoading = true
      let oid = this.jgData.channel_id
      let stime = ''
      let etime = ''
      if (this.s_date && this.s_date.length === 2) {
        stime = this.s_date[0]
        etime = this.s_date[1]
      }
      return new Promise((resolve, reject) => {
        getAppClasses(oid, this.c_level, this.c_name, this.t_name, stime, etime, this.curr_page).then(response => {
          const dataw = response.data
          this.tableData = dataw.list
          this.total_page = dataw.total_page
          this.total = dataw.total_record
          this.page_size = dataw.every_page_number
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getClassLevel () {
      return new Promise((resolve, reject) => {
        getAppClassLevel().then(response => {
          const dataw = response.data
          this.clevels = dataw
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
    goBack () {
      this.$router.push({name: 'appstatistics'})
    },
    doExport () {
      this.exportloading = true
      let oid = this.jgData.channel_id
      return new Promise((resolve, reject) => {
        getAppClasses(oid, '', '', '', '', '', '').then(response => {
          const dataw = response.data
          let list = dataw.list
          this.handleExport(list)
          this.exportloading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleExport (list) {
      let oname = this.jgData.o_name
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/vendor/Export2Excel')
        const tHeader = ['班级ID', '班级名称', '教师姓名', '学生数量', '班级级别', '创建时间']
        const filterVal = ['class_id', 'class_name', 'u_name', 'studentnumber', 'level_name', 'create_time']
        // const list = this.tableData
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, oname)
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.statis-more-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    margin-top: 10px;
    font-size: 18px;
    .handle-input0 {
      position: absolute;
      left: 10px;
      width: 120px;
      display: inline-block;
    }
    .handle-input1 {
      position: absolute;
      left: 150px;
      width: 150px;
      display: inline-block;
    }
    .handle-input2 {
      position: absolute;
      left: 320px;
      width: 120px;
      display: inline-block;
    }
    .handle-input3 {
      position: absolute;
      left: 460px;
      width: 280px;
    }
    .btn-search {
      position: absolute;
      left: 750px;
    }
  }
  .box-data {
    position: relative;
    width: 773px;
    height: 40px;
    margin-left: 10px;
    margin-top: 5px;
    border: 1px solid #eee;
    .box-data-item {
      float: left;
      width: 174.5px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
    }
    .border {
      border-right: 1px solid #eeeeee;
    }
  }
  .my-table {
    width: 900px;
    margin-left: 10px;
  }
  .pagination {
    width: 900px;
    margin-top: 10px;
    margin-left: 10px;
  }
}
</style>
