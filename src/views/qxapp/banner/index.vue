<template>
  <div class="appbanner-container">
    <div class="box-header">
        <el-button class="btn-add" type="primary" icon="el-icon-plus" size="small" @click.native="handleAdd">新增</el-button>
		<el-select v-model="url_type" placeholder="跳转类型" class="handle-input0" size="small">
			<el-option :label="'全部'" :value="0">
			</el-option>
            <!-- <el-option :label="'网页链接'" :value="1">
			</el-option> -->
		</el-select>
        <el-select v-model="status" placeholder="状态" class="handle-input1" size="small">
			<el-option :label="'全部'" :value="1">
			</el-option>
			<el-option :label="'在线'" :value="2">
			</el-option>
            <el-option :label="'等待上线'" :value="3">
			</el-option>
            <el-option :label="'已下线'" :value="4">
			</el-option>
		</el-select>
		<el-input clearable v-model="key_word" placeholder="请输入关键词" class="handle-input2 mr10"
          @keydown.enter.native="search" size="small"></el-input>
		<el-button class="btn-search" type="primary" icon="el-icon-search" @click.native="search" size="small">搜索</el-button>
	</div>
	<el-table :data="tableData" border size="small" class="my-table" v-loading="listLoading">
    <el-table-column align="center" prop="slide_id" label="ID">
		</el-table-column>
		<el-table-column align="center" label="应用">
      <template slot-scope="scope">
				<span v-if="scope.row.appid === '1001'">学生端</span>
				<span v-else-if="scope.row.device === '1002'">教师端</span>
			</template>
		</el-table-column>
		<el-table-column align="center" prop="slide_name" label="标题">
		</el-table-column>
		<el-table-column align="center" label="图片">
            <template slot-scope="scope">
				<img :src="scope.row.slide_pic" alt="" style="width:120px;height:60px;"/>
			</template>
		</el-table-column>
        <el-table-column align="center" prop="listorder" label="排序">
		</el-table-column>
        <el-table-column align="center" prop="start_time" label="上线时间">
		</el-table-column>
		<el-table-column align="center" prop="end_time" label="下线时间">
		</el-table-column>
        <el-table-column align="center" prop="online" label="状态">
		</el-table-column>
    <el-table-column align="center" label="设备">
      <template slot-scope="scope">
				<span v-if="scope.row.device === '1'">全部</span>
				<span v-else-if="scope.row.device === '2'">ios</span>
        <span v-else-if="scope.row.device === '3'">Android</span>
			</template>
		</el-table-column>
		<el-table-column align="center" label="操作"  width="180">
			<template slot-scope="scope">
				<el-button size="mini"
					@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				<el-button size="mini"
					@click="confirmDelete(scope.$index, scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="pagination" v-show="!listLoading">
		<el-pagination
			background
			@current-change ="handleCurrentChange"
			layout="prev, pager, next"
			:page-count="total_page">
		</el-pagination>
	</div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" label-width="120px">
           <el-form-item label="标题" prop="title">
              <el-input class="form-input" v-model="form.title" placeholder="首页banner标题"></el-input>
          </el-form-item>
          <el-form-item label="跳转" prop="url_type">
              <el-radio-group v-model="form.url_type">
                <el-radio :label="1">网页链接</el-radio>
              </el-radio-group>
              <el-input class="form-input" v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="图片">
              <el-upload ref="picupload" class="upload-pic" action="" accept="image/*" :show-file-list="false"
                 :auto-upload="false" v-loading="uploadLoading" :on-change="handleUploadPic">
                <img v-if="imageUrl" :src="imageUrl" class="pic">
                <i v-else class="el-icon-plus pic-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="排序" prop="order">
              <el-input class="form-input" v-model="form.order"></el-input>
          </el-form-item>
          <el-form-item label="在线时间" prop="time">
              <el-date-picker v-model="form.time" type="daterange" value-format="yyyy-MM-dd"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="设备定向" prop="device">
              <el-radio-group v-model="form.device">
                <el-radio :label="1">全部</el-radio>
                <el-radio :label="3">Android</el-radio>
                <el-radio :label="2">ios</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="应用" prop="device">
            <el-select v-model="form.appId" placeholder="请选择应用" class="form-input">
                <el-option :key="1001" label="学生端" :value="1001">
                </el-option>
                <el-option :key="1002" label="教师端" :value="1002">
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
import request from '@/http/request1'
import { getBanner, delBanner } from '@/http/api/qxappRequest'
export default {
  name: 'appbanner',
  data () {
    return {
      listLoading: false,
      uploadLoading: false,
      tableData: [],
      url_type: '',
      status: '',
      key_word: '',
      total_page: 1,
      curr_page: 1,
      form: {
        title: '',
        url_type: 1,
        url: '',
        order: 0,
        time: '',
        device: 1,
        appId: 0
      },
      imageUrl: '',
      dialogTitle: '',
      dialogVisible: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.listLoading = true
      let self = this
      return new Promise((resolve, reject) => {
        getBanner(this.status, this.key_word, this.curr_page).then(response => {
          const dataw = response.data
          self.tableData = dataw.list
          self.total_page = dataw.totalPage
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    search () {
      this.getData()
    },
    handleCurrentChange (val) {
      this.curr_page = val
      this.getData()
    },
    handleUploadPic (file, fileList) {
      this.form.file = file.raw
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleAdd () {
      this.form = {
        title: '',
        url_type: 1,
        url: '',
        order: 0,
        time: '',
        device: 1,
        appId: 0
      }
      this.dialogTitle = '添加banner图片'
      this.dialogVisible = true
      if (this.$refs.picupload) {
        this.$refs.picupload.clearFiles()
      }
    },
    handleEdit (index, row) {
      this.form.slide_id = row.slide_id
      this.form.title = row.slide_name
      // this.form.url_type = parseInt(row.slide_cid)
      this.form.url = row.slide_url
      this.form.order = row.listorder
      this.form.device = parseInt(row.device)
      if (row.appid) {
        this.form.appId = parseInt(row.appid)
      } else {
        this.form.appId = ''
      }
      var time = []
      if (row.start_time && row.end_time) {
        time[0] = row.start_time
        time[1] = row.end_time
      } else {
        time = ''
      }
      this.form.time = time
      this.imageUrl = row.slide_pic
      this.dialogTitle = '编辑banner图片'
      this.dialogVisible = true
      if (this.$refs.picupload) {
        this.$refs.picupload.clearFiles()
      }
    },
    onSubmitForm (formName) {
      this.dialogVisible = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          var fd = new FormData()
          let uid = this.$store.getters.userId
          fd.append('uid', uid)
          let posturl = ''
          if (this.form.slide_id) {
            fd.append('slide_id', this.form.slide_id)
            posturl += '/api/slide/edit_post'
          } else {
            posturl += '/api/slide/add_post'
          }
          fd.append('slide_name', this.form.title)
          fd.append('slide_url', this.form.url)
          fd.append('listorder', this.form.order)
          fd.append('start_time', this.form.time[0])
          fd.append('end_time', this.form.time[1])
          fd.append('device', this.form.device)
          fd.append('appid', this.form.appId)
          fd.append('image', this.form.file)
          request({
            method: 'post',
            url: posturl,
            headers: {'Content-Type': 'multipart/form-data'},
            data: fd
          }).then(response => {
            const res = response
            if (res.code === 0) {
              this.addVisible = false
              this.getData()
              this.$message.success('提交成功！')
            } else {
              this.$message.error(res.msg)
            }
            this.uploadLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmDelete (index, row) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(index, row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete (index, row) {
      return new Promise((resolve, reject) => {
        delBanner(row.slide_id).then(response => {
          if (response) {
            this.getData()
            this.$message.success('删除成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
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
    .btn-add {
      position: absolute;
      left: 10px;
    }
    .handle-input0{
      position: absolute;
      left: 280px;
      width: 140px;
      display: inline-block;
    }
    .handle-input1 {
      position: absolute;
      left: 450px;
      width: 120px;
      display: inline-block;
    }
    .handle-input2 {
      position: absolute;
      left: 650px;
      width: 200px;
      display: inline-block;
    }
    .btn-search {
      position: absolute;
      left: 870px;
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
