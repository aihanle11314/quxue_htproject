<template>
  <div class="courseware-dellevel-container">
    <el-form class="box-form" label-width="140px">
       <el-form-item label="starter、talk账号：" prop="stmobile">
         <el-input v-model="stmobile" style="margin-left:-100px;;width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="starter" prop="starter">
          <el-checkbox-group v-model="starter" style="margin-left: -20px;width: 300px;">
            <el-checkbox v-for="item in [1, 2, 3, 4]" :key="item" :label="item">
                {{item}}
              </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="talk" prop="talk">
          <el-checkbox-group v-model="talk" style="margin-left: -10px;width: 400px;">
            <el-checkbox v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="item" :label="item">
                {{item}}
              </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: -100px" :loading="submitloading" @click="onSubmit">删除</el-button>
        </el-form-item>
    </el-form>
    <el-form class="box-form" label-width="140px">
       <el-form-item label="phonics账号：" prop="phonicsmobile">
         <el-input v-model="phonicsmobile" style="margin-left:-120px;width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="phonics" prop="phonics">
          <el-checkbox-group v-model="phonics" style="margin-left: -20px;width: 400px;">
            <el-checkbox v-for="item in [1, 2, 3, 4, 5, 6]" :key="item" :label="item">
                {{item}}
              </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: -100px" :loading="submitloading" @click="onSubmitphonics">删除</el-button>
        </el-form-item>
     </el-form>
  </div>
</template>

<script>
import { delCourseLevel } from '@/http/api/coursewareRequest'
export default {
  data () {
    return {
      submitloading: false,
      stmobile: '',
      starter: [],
      talk: [],
      phonicsmobile: '',
      phonics: []
    }
  },
  created () {
    this.submitloading = false
  },
  methods: {
    onSubmit () {
      let param = {
        account: this.stmobile,
        starter: this.starter,
        talk: this.talk,
        phonics: ''
      }
      this.submitloading = true
      return new Promise((resolve, reject) => {
        delCourseLevel(param).then(response => {
          if (response) {
            this.$message.success('删除成功！')
          }
          this.submitloading = false
          resolve()
        }).catch(error => {
          this.submitloading = false
          reject(error)
        })
      })
    },
    onSubmitphonics () {
      let param = {
        account: this.phonicsmobile,
        starter: '',
        talk: '',
        phonics: this.phonics
      }
      this.submitloading = true
      return new Promise((resolve, reject) => {
        delCourseLevel(param).then(response => {
          if (response) {
            this.$message.success('删除成功！')
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
.courseware-dellevel-container {
  margin: 0;
  padding: 0;
  .box-form {
    position: relative;
    margin-left: 10px;
    margin-top: 10px;
    width: 500px;
  }
  .el-form-item__content {
    text-align: center;
  }
}
</style>
