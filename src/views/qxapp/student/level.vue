<template>
  <div class="class-level-container">
    <el-form class="box-form" label-width="140px">
      <el-form-item label="班级ID" prop="id">
        <el-input v-model="id" style="margin-left:0;width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="选择级别" prop="level">
        <el-select v-model="level" placeholder="班级级别">
          <el-option v-for="item in clevels" :label="item.option" :value="item.val" :key="item.val">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitloading" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
    <div style="position: relative;width: 800px;height: 1px;background-color: #aaa;margin-top: 10px;margin-bottom: 20px;"></div>
    <el-form class="box-form" label-width="140px">
      <el-form-item label="学生手机号" prop="mobile">
        <el-input v-model="mobile" style="margin-left:0;width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="需要修改的级别" prop="oldlevel">
        <el-select v-model="oldlevel" placeholder="级别">
          <el-option v-for="item in clevels" :label="item.option" :value="item.val" :key="item.val">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修改后的级别" prop="newlevel">
        <el-select v-model="newlevel" placeholder="级别">
          <el-option v-for="item in clevels" :label="item.option" :value="item.val" :key="item.val">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitloading" @click="onSubmitStudent">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateClassLevel, getAppClassLevel, updateStudentLevel } from '@/http/api/qxappRequest'
export default {
  name: 'appClasslevel',
  data () {
    return {
      submitloading: false,
      clevels: [], // 班级级别列表
      id: '',
      level: '',
      mobile: '',
      oldlevel: '',
      newlevel: ''
    }
  },
  created () {
    this.getClassLevel()
    this.submitloading = false
  },
  methods: {
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
    onSubmit () {
      this.submitloading = true
      let param = {
        class_id: this.id,
        level: this.level
      }
      return new Promise((resolve, reject) => {
        updateClassLevel(param).then(response => {
          if (response) {
            this.$message.success('修改成功！')
          }
          this.submitloading = false
          resolve()
        }).catch(error => {
          this.submitloading = false
          reject(error)
        })
      })
    },
    onSubmitStudent () {
      this.submitloading = true
      let param = {
        mobile: this.mobile,
        oldlevel: this.oldlevel,
        newlevel: this.newlevel
      }
      return new Promise((resolve, reject) => {
        updateStudentLevel(param).then(response => {
          if (response) {
            this.$message.success('修改成功！')
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
.class-level-container {
  margin: 0;
  padding: 0;
  .box-form {
    position: relative;
    margin-left: 10px;
    margin-top: 10px;
    width: 300px;
  }
}
</style>
