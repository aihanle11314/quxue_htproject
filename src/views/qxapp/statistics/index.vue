<template>
  <div class="statistics-container">
    <div class="box-data">
      <div class="box-data-item border">机构数量：{{totalData.channel}}个</div>
      <div class="box-data-item border">班级数量：{{totalData.class}}个</div>
      <div class="box-data-item border">教师数量：{{totalData.teacher}}个</div>
      <div class="box-data-item">学生数量：{{totalData.student}}个</div>
    </div>
    <div class="box-header">
      <el-input clearable v-model="o_name" size="small" placeholder="请输入机构名称" class="handle-input0 mr10"
        @keydown.enter.native="search"></el-input>
      <!-- <el-date-picker v-model="s_date" type="daterange" size="small" range-separator="-" unlink-panels
        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="handle-input1">
      </el-date-picker> -->
      <el-button class="btn-search" type="primary" size="small" icon="el-icon-search" @click.native="search">搜索</el-button>
	</div>
	<el-table :data="tableData" border size="mini" class="my-table" v-loading="listLoading">
		<el-table-column align="center" prop="o_name" label="机构名称">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                @click="handleLookMore(scope.$index, scope.row)">{{scope.row.o_name}}</el-button>
            </template>
		</el-table-column>
		<el-table-column align="center" prop="class_totals" label="班级数量">
		</el-table-column>
        <el-table-column align="center" prop="teacher_totals" label="教师数量">
		</el-table-column>
        <el-table-column align="center" prop="student_totals" label="学生数量">
		</el-table-column>
		</el-table>
		<div class="pagination" v-show="!listLoading">
			<el-pagination
				background
				@current-change ="handleCurrentChange"
				layout="total, prev, pager, next, jumper"
				:page-size="20"
        :total="total">
			</el-pagination>
		</div>
  </div>
</template>

<script>
import { getAppStatTotal, getAppStatistics } from '@/http/api/qxappRequest'
export default {
  name: 'appStatistics',
  data () {
    return {
      listLoading: false,
      totalData: {},
      tableData: [{o_name: 'test', c_number: 10, t_number: 10, s_number: 10}],
      o_name: '',
      s_date: '',
      total: 0,
      total_page: 1,
      curr_page: 1
    }
  },
  created () {
    this.getTotalData()
    this.getData()
  },
  methods: {
    getTotalData () {
      return new Promise((resolve, reject) => {
        getAppStatTotal().then(response => {
          const dataw = response.data
          this.totalData = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getData () {
      this.listLoading = true
      // let stime = ''
      // let etime = ''
      // if (this.s_date && this.s_date.length === 2) {
      //   stime = this.s_date[0]
      //   etime = this.s_date[1]
      // }
      return new Promise((resolve, reject) => {
        getAppStatistics(this.o_name, this.curr_page).then(response => {
          const dataw = response.data
          this.tableData = dataw.data
          this.total_page = dataw.page_total
          this.total = dataw.total
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
    handleCurrentChange (val) {
      this.curr_page = val
      this.getData()
    },
    handleLookMore (index, row) {
      this.$router.push({name: 'appstatismore', params: {data: row}})
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.statistics-container {
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
      left: 60px;
      width: 200px;
      display: inline-block;
    }
    .handle-input1 {
      position: absolute;
      left: 280px;
      width: 280px;
    }
    .btn-search {
      position: absolute;
      left: 280px;
    }
  }
  .box-data {
    position: relative;
    width: 700px;
    height: 40px;
    margin-left: 10px;
    margin-top: 5px;
    border: 1px solid #eeeeee;
    .box-data-item {
      float: left;
      width: 174.5px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .border {
      border-right: 1px solid #eeeeee;
    }
  }
  .my-table {
    width: 700px;
    margin-left: 10px;
  }
  .pagination {
    width: 700px;
    margin-top: 10px;
    margin-left: 10px;
  }
}
</style>
