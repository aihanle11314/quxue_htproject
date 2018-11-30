<template>
  <div class="appbanner-container">
    <div class="box-header">
      <el-form :model="form" :rules="rules" label-width="120px">
           <el-form-item label="标签名称" prop="name">
            <el-input class="form-input" v-model="form.name"></el-input>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" :loading="submitloading" @click="onSubmitForm('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import {updateLabel } from '@/http/api/peiyinRequest'
export default {
  name: 'addLabel',
  data () {
    return {
        addClass:'',
        addVisible: false,
        submitloading: false,
        form: {
        name: '',
        describe: '',
        weight: 1,
        // jgList: [],
        },
        rules: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请选择权重', trigger: 'change' }
        ],
        describe: [
          { required: true, message: '请填写描述信息', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // this.getquanzhongList()
  },
  methods: {
    // getquanzhongList () {
    //   let self = this
    //   return new Promise((resolve, reject) => {
    //     getQZList().then(response => {
    //       const dataw = response.data
    //       self.jgList = dataw
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitloading = true
          return new Promise((resolve, reject) => {
            updateLabel(this.form).then(response => {
              this.submitloading = false
              if (response) {
                  this.$message.success('添加提交成功！')
                  this.$router.push({name: 'labelManage'})
              }
              resolve()
            }).catch(error => {
              this.submitloading = false
              reject(error)
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  } 
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.appbanner-container {
  margin: 0;
  padding: 0;
  form {
    width: auto;
  }
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
    .form-input {
      position: absolute;
      left: 100px;
      width: 800px;
      display: inline-block;
    }
  }
}
</style>