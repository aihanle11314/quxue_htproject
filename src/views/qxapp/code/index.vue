<template>
  <div class="appcode-container">
    <div class="box-header">
      <el-button class="btn-add" type="primary" icon="el-icon-plus" @click.native="handleAdd" size="small">生成教师编码</el-button>
      <el-select v-model="key_status" placeholder="请选择" size="small" class="handle-input">
        <el-option key="" label="全部" value="">
        </el-option>
        <el-option key="0" label="未激活" value="未激活">
        </el-option>
        <el-option key="1" label="已激活" value="已激活">
        </el-option>
      </el-select>
      <el-input clearable v-model="key_word" placeholder="请输入机构名称" class="handle-input0 mr10" size="small"
        @keydown.enter.native="search"></el-input>
      <el-button class="btn-search" type="primary" icon="el-icon-search" size="small" @click.native="search">搜索</el-button>
      <el-button class="btn-export" type="primary" size="small" @click.native="handleExport">导出</el-button>
	</div>
	<el-table :data="datalist" border size="small" class="my-table" v-loading="listLoading" height="600">
      <el-table-column align="center" prop="channelName" label="机构名称">
      </el-table-column>
      <el-table-column align="center" prop="teacherNumber" label="教师编码">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="生成时间">
      </el-table-column>
      <el-table-column align="center" prop="useTime" label="激活日期">
      </el-table-column>
      <el-table-column align="center" prop="expireTime_name" label="有效期至">
      </el-table-column>
      <el-table-column align="center" prop="status_name" label="状态">
      </el-table-column>
	</el-table>
	<!-- <div class="pagination" v-show="!listLoading">
		<el-pagination
			background
			@current-change ="handleCurrentChange"
			layout="prev, pager, next"
			:page-count="total_page">
		</el-pagination>
	</div> -->
    <el-dialog title="生成教师编码" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="机构" prop="channelId">
            <el-select v-model="form.channelId" filterable placeholder="请选择" class="form-input">
              <el-option v-for="item in jgList" :key="item.id" :label="item.o_name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师编码数量" prop="num">
              <el-input v-model="form.num" placeholder="请输入需要生成的数量" class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="编码有效期" prop="expireTime">
            <el-select v-model="form.expireTime" placeholder="请选择有效期" class="form-input">
                <!-- <el-option :key="1" label="1年" :value="365">
                </el-option>
                <el-option :key="2" label="2年" :value="730">
                </el-option>
                <el-option :key="3" label="3年" :value="1095">
                </el-option> -->
                <el-option :key="0" label="永久" :value="0">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getTeacherCode, addTeacherCode } from '@/http/api/qxappRequest'
import { getJGList } from '@/http/api/jigouRequest'
export default {
  name: 'appcode',
  data () {
    return {
      listLoading: false,
      tableData: [],
      key_word: '',
      key_status: '',
      total_page: 1,
      curr_page: 1,
      jgList: [],
      form: {
        channelId: '',
        channelName: '',
        num: '',
        expireTime: 0
      },
      dialogVisible: false
    }
  },
  created () {
    this.getData()
  },
  computed: {
    datalist () {
      var cname = this.key_word
      var status = this.key_status
      var data = this.tableData.filter(function (d) {
        if (d.channelName.indexOf(cname) > -1 && d.status_name.indexOf(status) > -1) {
          return d
        }
      })
      return data
    }
  },
  methods: {
    getData () {
      this.listLoading = true
      let self = this
      return new Promise((resolve, reject) => {
        getTeacherCode().then(response => {
          const dataw = response.result
          self.tableData = dataw.teacherNumberList
          self.tableData.forEach(item => {
            if (item.expireTime) {
              item['expireTime_name'] = item.expireTime
            } else if (item.useTime) {
              item['expireTime_name'] = '永久'
            }
            if (item.status === 0) {
              item['status_name'] = '未激活'
            } else if (item.status === 1) {
              item['status_name'] = '已激活'
            }
          })
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getJgList () {
      let self = this
      return new Promise((resolve, reject) => {
        getJGList().then(response => {
          const dataw = response.data
          self.jgList = dataw
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    search () {

    },
    handleCurrentChange (val) {
      this.curr_page = val
      this.getData()
    },
    handleAdd () {
      this.getJgList()
      this.form = {
        channelId: '',
        channelName: '',
        num: '',
        expireTime: 0
      }
      this.dialogVisible = true
    },
    onSubmitForm (formName) {
      this.dialogVisible = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.num) {
            this.form.num = parseInt(this.form.num)
          } else {
            this.form.num = 0
          }
          for (var i = 0; i < this.jgList.length; i++) {
            if (this.form.channelId === this.jgList[i].id) {
              this.form.channelName = this.jgList[i].o_name
              break
            }
          }
          let self = this
          return new Promise((resolve, reject) => {
            addTeacherCode(this.form).then(response => {
              if (response) {
                self.dialogVisible = false
                this.$message.success('添加成功!')
              }
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleExport () {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/vendor/Export2Excel')
        const tHeader = ['机构名称', '教师编码', '生成时间', '激活日期', '有效期至', '状态']
        const filterVal = ['channelName', 'teacherNumber', 'createTime', 'useTime', 'expireTime_name', 'status_name']
        const list = this.datalist
        const data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, '教师编码')
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
.appcode-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
    .btn-add {
      position: absolute;
      left: 10px;
    }
    .handle-input {
      position: absolute;
      left: 230px;
      width: 100px;
      display: inline-block;
    }
    .handle-input0 {
      position: absolute;
      left: 350px;
      width: 200px;
      display: inline-block;
    }
    .btn-search {
      position: absolute;
      left: 570px;
    }
    .btn-export {
      position: absolute;
      left: 700px;
    }
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
  form {
    width: 400px;
    margin: 0 auto;
  }
  .form-input {
    width: 250px;
  }
  .upload-pic {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .pic {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

}
</style>
