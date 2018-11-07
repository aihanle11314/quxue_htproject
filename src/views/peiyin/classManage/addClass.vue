<template>
  <div class="appbanner-container">
    <div class="box-header">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="分类名称" prop="name">
            <el-input class="form-input" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="分类权重" prop="weight">
              <el-select v-model="form.weight" placeholder="请选择">
                  <!-- <el-option v-for="item in jgList" :key="item.id" :label="item.o_name" :value="item.id">
                  </el-option> -->
                  <el-option label="1" value="1"></el-option>
                  <el-option label="2" value="2"></el-option>
                  <el-option label="3" value="3"></el-option>
                  <el-option label="4" value="4"></el-option>
                  <el-option label="5" value="5"></el-option>
                  <el-option label="6" value="6"></el-option>
                  <el-option label="7" value="7"></el-option>
                  <el-option label="8" value="8"></el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="分类描述" prop="describe">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" class="form-input" v-model="form.describe"></el-input>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" :loading="submitloading" @click="onSubmitForm('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>

    
</template>

<script>
import {updateClass } from '@/http/api/peiyinRequest'
export default {
  name: 'addClass',
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
            updateClass(this.form).then(response => {
              this.submitloading = false
              if (response) {
                  this.$message.success('添加提交成功！')
                  this.$router.push({name: 'classManage'})
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
<style rel="stylesheet/scss" lang="scss">
.appbanner-container {
  margin: 0;
  padding: 0;
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