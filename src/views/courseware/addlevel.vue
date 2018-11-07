<template>
  <div class="courseware-addlevel-container">
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
        <el-form-item label="有效期" prop="valid">
          <el-select v-model="validity" placeholder="请选择" style="margin-left: -120px;width: 200px;">
            <el-option v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="item" :label="`${item}个月`" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: -100px" :loading="submitloading" @click="onSubmit">提交</el-button>
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
        <el-form-item label="有效期" prop="valid1">
          <el-select v-model="validity1" placeholder="请选择" style="margin-left: -120px;width: 200px;">
            <el-option v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="item" :label="`${item}个月`" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: -100px" :loading="submitloading" @click="onSubmitphonics">提交</el-button>
        </el-form-item>
     </el-form>
  </div>
</template>

<script>
import { addCourseLevel } from '@/http/api/coursewareRequest'
export default {
  data () {
    return {
      submitloading: false,
      stmobile: '',
      starter: [],
      talk: [],
      validity: '',
      phonicsmobile: '',
      phonics: [],
      validity1: ''
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
        phonics: '',
        eff: this.validity
      }
      this.submitloading = true
      return new Promise((resolve, reject) => {
        addCourseLevel(param).then(response => {
          if (response) {
            this.$message.success('添加成功！')
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
        phonics: this.phonics,
        eff: this.validity1
      }
      this.submitloading = true
      return new Promise((resolve, reject) => {
        addCourseLevel(param).then(response => {
          if (response) {
            this.$message.success('添加成功！')
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
.courseware-addlevel-container {
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
