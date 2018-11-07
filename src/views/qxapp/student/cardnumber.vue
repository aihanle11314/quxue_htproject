<template>
  <div class="stu-cardnum-container">
    <div class="box-form" v-if="userRoles!=='kefu'">
        <span>账号数量：</span>
        <el-input v-model="count" style="width: 150px;" size="small"></el-input>
        <el-button type="primary" size="small" :loading="submitloading" @click="onSubmit">导出</el-button>
    </div>
    <div style="position: relative;width: 800px;height: 1px;background-color: #aaa;margin-top: 10px;margin-bottom: 20px;"></div>
    <div class="box-form">
        <span>学生卡号：</span>
        <el-input v-model="card" style="width: 150px;margin-right: 20px;" size="small" @keydown.enter.native="search"></el-input>
        <span>学生手机号：</span>
        <el-input v-model="mobile" style="width: 150px;" size="small" @keydown.enter.native="search"></el-input>
        <el-button type="primary" size="small" :loading="submitloading" @click="search">查询</el-button>
    </div>
    <el-table :data="tableData" border size="mini" class="my-table">
      <el-table-column align="center" prop="card" label="学生卡号">
      </el-table-column>
      <el-table-column align="center" prop="password" label="学生卡密码">
      </el-table-column>
      <el-table-column align="center" prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column align="center" prop="name" label="学生名字">
      </el-table-column>
      <el-table-column align="center" prop="o_name" label="机构名">
      </el-table-column>
      <el-table-column align="center" prop="use_time" label="解锁时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStudentCard, getStudentCardMore } from '@/http/api/qxappRequest'
export default {
  data () {
    return {
      submitloading: false,
      count: 0,
      card: '',
      mobile: '',
      tableData: [],
      userRoles: ''
    }
  },
  created () {
    this.submitloading = false
    this.userRoles = this.$store.getters.roles
  },
  methods: {
    search () {
      return new Promise((resolve, reject) => {
        getStudentCardMore(this.card, this.mobile).then(response => {
          const dataw = response.data
          this.tableData = dataw
          resolve()
        }).catch(error => {
          this.submitloading = false
          reject(error)
        })
      })
    },
    onSubmit () {
      this.submitloading = true
      return new Promise((resolve, reject) => {
        getStudentCard(this.count).then(response => {
          const dataw = response.data
          this.handleExport(dataw)
          resolve()
        }).catch(error => {
          this.submitloading = false
          reject(error)
        })
      })
    },
    handleExport (list) {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/vendor/Export2Excel')
        const tHeader = ['账号', '密码']
        const filterVal = ['card_account', 'card_password']
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, '学生电子卡号')
        this.submitloading = false
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
.stu-cardnum-container {
  margin: 0;
  padding: 0;
  .box-form {
    position: relative;
    margin-left: 10px;
    margin-top: 10px;
    width: 700px;
    height: 40px;
  }
  .my-table {
    width: 800px;
    margin-left: 10px;
  }
}
</style>
