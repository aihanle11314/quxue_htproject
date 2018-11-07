<template>
  <div class="course-account-container">
    <div class="box-form">
        <span>课件账号：</span>
        <el-input v-model="card1" style="width: 150px;" size="small"></el-input>
        <el-button type="primary" size="small" :loading="submitloading" @click="onReset">重置</el-button>
    </div>
    <div class="box-form">
        <span>课件账号：</span>
        <el-input v-model="card2" style="width: 150px;margin-right: 20px;" size="small"></el-input>
        <el-select v-model="validity" placeholder="请选择" size="small" style="width: 200px;">
            <el-option v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="item" :label="`${item}个月`" :value="item">
            </el-option>
          </el-select>
        <el-button type="primary" size="small" :loading="submitloading" @click="onDelay">延期</el-button>
    </div>
  </div>
</template>

<script>
import { accountReset, accountDelay } from '@/http/api/coursewareRequest'
export default {
  name: 'courseaccount',
  data () {
    return {
      submitloading: false,
      card1: '',
      card2: '',
      validity: ''
    }
  },
  created () {
  },
  methods: {
    onReset () {
      return new Promise((resolve, reject) => {
        accountReset(this.card1).then(response => {
          if (response) {
            this.$message.success('重置成功！')
          }
          this.submitloading = false
          resolve()
        }).catch(error => {
          this.submitloading = false
          reject(error)
        })
      })
    },
    onDelay () {
      return new Promise((resolve, reject) => {
        accountDelay(this.card2, this.validity).then(response => {
          if (response) {
            this.$message.success('延期成功！')
          }
          this.submitloading = false
          resolve()
        }).catch(error => {
          this.submitloading = false
          reject(error)
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.course-account-container {
  margin: 0;
  padding: 0;
  .box-form {
    position: relative;
    margin-left: 10px;
    margin-top: 10px;
    width: 700px;
    height: 40px;
  }
}
</style>
