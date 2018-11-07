<template>
  <div class="details-container">
    <div class="box-header">
      <el-input clearable v-model="key_words" placeholder="请输入机构名称" size="small" class="handle-input mr10"
        @keydown.enter.native="search"></el-input>
      <el-button class="btn-search" type="primary" icon="el-icon-search" size="small" @click.native="search">搜索</el-button>
    </div>
    <el-table :data="tableData" border size="small" class="my-table">
      <el-table-column align="center" prop="o_name" label="机构名称" width="200">
      </el-table-column>
      <el-table-column align="center" prop="username" label="账号" width="150">
      </el-table-column>
      <el-table-column align="center" prop="course_total" label="总充值课时">
      </el-table-column>
      <el-table-column align="center" prop="plan_nums" label="消耗课时">
      </el-table-column>
      <el-table-column align="center" prop="class_total" label="班级数量">
      </el-table-column>
      <el-table-column align="center" prop="over_course" label="已上课程">
      </el-table-column>
      <el-table-column align="center" prop="not_course" label="待上课程">
      </el-table-column>
      <el-table-column align="center" prop="reservations" label="待审课程">
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
import { getOrgDetails } from '@/http/api/waijiaoRequest'
export default {
  name: 'Details',
  data () {
    return {
      tableData: [],
      key_words: '',
      total_page: 1,
      curr_page: 1
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let self = this
      return new Promise((resolve, reject) => {
        getOrgDetails(this.key_words, this.curr_page).then(response => {
          const dataw = response.data
          self.tableData = dataw.data
          self.total_page = dataw.page_total
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.details-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
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
    width: 100%;
    margin-left: 10px;
  }
  .pagination {
    display: block;
    margin: 0 auto;
    margin-top: 10px;
  }
}
</style>
