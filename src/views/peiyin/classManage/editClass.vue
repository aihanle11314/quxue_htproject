<template>
  <div class="appbanner-container">
    <div class="box-header">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="分类名称" prop="r_name">
            <el-input class="form-input" v-model="form.r_name"></el-input>
          </el-form-item>
          <el-form-item label="分类权重" prop="options">
              <el-select v-model="form.options" placeholder="请选择">
                  <el-option label="一" value="1"></el-option>
                  <el-option label="二" value="2"></el-option>
                  <el-option label="三" value="3"></el-option>
                  <el-option label="四" value="4"></el-option>
                  <el-option label="五" value="5"></el-option>
                  <el-option label="六" value="6"></el-option>
                  <el-option label="七" value="7"></el-option>
                  <el-option label="八" value="8"></el-option>
                </el-select>
          </el-form-item>
          <el-form-item label="分类描述" prop="describe">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" class="form-input" v-model="form.describe"></el-input>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'editClass',
  data () {
    return {
              addClass:'',
        addVisible: false,
        form: {
        r_name: '',
        describe: '',
        options: ''
      },
      rules: {}
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