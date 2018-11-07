<template>
  <div class="stu-unlock-container">
    <el-form class="box-form" label-width="140px">
       <el-form-item label="是否全通" prop="qt">
         <el-radio-group v-model="qt" style="margin-left: -150px;width: 200px;">
           <el-radio :label="1">全通</el-radio>
           <el-radio :label="2">非全通</el-radio>
         </el-radio-group>
      </el-form-item>
      <el-form-item label="Starter" prop="starter">
          <el-checkbox :indeterminate="isIndeterminateStarter" v-model="checkAllStarter" @change="handleCheckAllStarter"
            style="margin-left: -270px;">全选</el-checkbox>
          <el-checkbox-group v-model="starter" @change="handleCheckedStarter" style="margin-left: -20px;width: 300px;">
            <el-checkbox v-for="item in [1, 2, 3, 4]" :key="item" :label="item">
                {{item}}
              </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Level" prop="level">
          <el-checkbox :indeterminate="isIndeterminateLevel" v-model="checkAllLevel" @change="handleCheckAllLevel"
            style="margin-left: -270px;">全选</el-checkbox>
          <el-checkbox-group v-model="level" @change="handleCheckedLevel" style="margin-left: 20px;width: 530px;">
            <el-checkbox v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]" :key="item" :label="item">
                {{item}}
              </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Phonics" prop="phonics">
          <el-checkbox :indeterminate="isIndeterminatePhonics" v-model="checkAllPhonics" @change="handleCheckAllPhonics"
            style="margin-left: -260px;">全选</el-checkbox>
          <el-checkbox-group v-model="phonics" @change="handleCheckedPhonics" style="margin-left: 20px;width: 350px;">
            <el-checkbox v-for="item in [1, 2, 3, 4, 5, 6]" :key="item" :label="item">
                {{item}}
              </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="学生账号" prop="phone">
          <el-input v-model="phone" style="margin-left: -120px;width: 200px;"></el-input>
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
  </div>
</template>

<script>
import { unlockStudent } from '@/http/api/qxappRequest'
export default {
  data () {
    return {
      submitloading: false,
      qt: '',
      starter: [],
      level: [],
      phonics: [],
      phone: '',
      validity: '',
      checkAllStarter: false,
      isIndeterminateStarter: true,
      checkAllLevel: false,
      isIndeterminateLevel: true,
      checkAllPhonics: false,
      isIndeterminatePhonics: true
    }
  },
  created () {
    this.submitloading = false
  },
  methods: {
    handleCheckAllStarter (val) {
      this.starter = val ? [1, 2, 3, 4] : []
      this.isIndeterminateStarter = false
    },
    handleCheckedStarter (value) {
      let checkedCount = value.length
      this.checkAllStarter = checkedCount === 4
      this.isIndeterminateStarter = checkedCount > 0 && checkedCount < 4
    },
    handleCheckAllLevel (val) {
      this.level = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] : []
      this.isIndeterminateLevel = false
    },
    handleCheckedLevel (value) {
      let checkedCount = value.length
      this.checkAllLevel = checkedCount === 16
      this.isIndeterminateLevel = checkedCount > 0 && checkedCount < 16
    },
    handleCheckAllPhonics (val) {
      this.phonics = val ? [1, 2, 3, 4, 5, 6] : []
      this.isIndeterminatePhonics = false
    },
    handleCheckedPhonics (value) {
      let checkedCount = value.length
      this.checkAllPhonics = checkedCount === 6
      this.isIndeterminatePhonics = checkedCount > 0 && checkedCount < 6
    },
    onSubmit () {
      // console.log(`qt: ${this.qt}`)
      let param = {
        is_all: this.qt,
        phone: this.phone,
        starter: this.starter,
        level: this.level,
        phonics: this.phonics,
        eff: this.validity
      }
      this.submitloading = true
      return new Promise((resolve, reject) => {
        unlockStudent(param).then(response => {
          if (response) {
            this.$message.success('开通成功！')
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
.stu-unlock-container {
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
