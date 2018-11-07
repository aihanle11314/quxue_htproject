<template>
    <div class="courseware-container">
       <div class="box-header">
          <el-button class="btn-delete" type="primary" size="small" @click="confirmDelete">删除</el-button>
          <el-button class="btn-add" type="primary" size="small" @click="handleAdd">添加课件</el-button>
          <!-- <el-button class="btn-addAll" type="primary" size="small" @click="handleAddAll">批量添加课件</el-button> -->
          <el-input clearable v-model="select_name" size="small" placeholder="输入课件编号/主题" class="handle-input mr10"
            @keydown.enter.native="search"></el-input>
          <el-button class="btn-search" type="primary" size="small" icon="el-icon-search" @click.native="search">搜索</el-button>
        </div>
        <el-table :data="tableData" border size="small" class="my-table" ref="multipleTable"
          @selection-change="handleSelectionChange" v-loading="listLoading">
            <el-table-column align="center" type="selection" width="50">
            </el-table-column>
            <el-table-column align="center" prop="identifier" label="课件编号">
            </el-table-column>
            <el-table-column align="center" prop="theme" label="主题">
            </el-table-column>
            <el-table-column align="center" prop="attachment" label="课件下载">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="handleDownload(scope.row.attachment)">download</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="pdf" label="PDF">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="handleDownload(scope.row.pdf)">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination">
          <el-pagination
						background
						@current-change ="handleCurrentChange"
						layout="prev, pager, next"
						:page-count="total_page">
          </el-pagination>
        </div>
        <el-dialog :title="addTitle" :visible.sync="addVisible">
         <el-form ref="form" :model="form" :rules="rules" label-width="120px">
           <el-form-item label="课件主题" prop="theme">
              <el-input class="form-input" v-model="form.theme" placeholder="请输入课件主题" ></el-input>
          </el-form-item>
           <el-form-item label="课件类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择课件类型" class="form-input">
                <el-option v-for="item in course_type" v-bind:key="item" :label="item" :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课件级别" prop="level">
            <el-select v-model="form.level" placeholder="请选择课件级别" class="form-input">
              <el-option v-for="item in course_level" v-bind:key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Unit" prop="unit">
            <el-select v-model="form.unit" placeholder="请选择unit" class="form-input">
              <el-option v-for="item in course_unit" v-bind:key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Lesson" prop="lesson">
            <el-select v-model="form.lesson" placeholder="请选择lesson" class="form-input">
              <el-option v-for="item in course_lesson" v-bind:key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传课件和PDF">
            <el-upload ref="cwupload" class="upload-demo" action="" :limit="2" accept=".pdf,.zip"
                :on-change="handleUploadFile" :auto-upload="false" :file-list="form.filelist" v-loading="uploadLoading">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传pdf/zip文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
       </el-dialog>
       <el-dialog title="批量添加课件" :visible.sync="addAllVisible">
          <el-upload class="upload-demo" ref="uploadAll" action="" :limit="1" accept=".zip"
              :on-change="handleUploadFile" :auto-upload="false">
              <div slot="tip" class="el-upload__tip">只能上传pdf/zip文件</div>
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
       </el-dialog>
    </div>
</template>

<script>
import request from '@/http/request'
import { getToken } from '@/utils/auth'
import { getCourseWareList, delCourseWare } from '@/http/api/waijiaoRequest'
const cType = ['R', 'D']
const cLevel = ['S01', 'S02', 'S03', 'S04', 'L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08', 'L09', 'L010', 'L011', 'L012']
const cUnit = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
const cLesson = ['A', 'B', 'R', 'T']
export default {
  name: 'courseware',
  data () {
    return {
      listLoading: false,
      uploadLoading: false,
      tableData: [],
      multipleSelection: [],
      course_type: cType,
      course_level: cLevel,
      course_unit: cUnit,
      course_lesson: cLesson,
      form: {
        theme: '',
        type: '',
        level: '',
        unit: '',
        lesson: ''
      },
      uploadfileList: [],
      rules: {
        theme: [
          { required: true, message: '请输入课件主题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择课件类型', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择课件级别', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请选择课件unit', trigger: 'blur' }
        ],
        lesson: [
          { required: true, message: '请选择课件lesson', trigger: 'blur' }
        ]
      },
      addVisible: false,
      addTitle: '',
      addAllVisible: false,
      select_name: '',
      total_page: 1,
      curr_page: 1
    }
  },
  computed: {
    multipleSelecIds () {
      var pid = ''
      var selects = this.multipleSelection
      for (var i = 0; i < selects.length; i++) {
        if (i === selects.length - 1) {
          pid += selects[i].id
        } else {
          pid += selects[i].id + ','
        }
      }
      return pid
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let self = this
      this.listLoading = true
      return new Promise((resolve, reject) => {
        getCourseWareList(this.select_name, this.curr_page).then(response => {
          const dataw = response.data
          self.tableData = dataw.list
          self.total_page = dataw.total_page
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAddAll () {
      this.addAllVisible = true
    },
    handleAdd () {
      this.form = {
        theme: '',
        type: '',
        level: '',
        unit: '',
        lesson: ''
      }
      this.addVisible = true
      this.addTitle = '添加课件'
      if (this.$refs.cwupload) {
        this.$refs.cwupload.clearFiles()
      }
      this.uploadLoading = false
    },
    handleEdit (index, row) {
      this.form['id'] = row.id
      this.form.theme = row.theme
      this.form.type = row.type
      this.form.level = row.level
      if (row.unit < 10) {
        this.form.unit = '0' + row.unit
      } else {
        this.form.unit = '' + row.unit
      }
      this.form.lesson = row.lesson
      var url1 = row.attachment.split('/')
      var url2 = row.pdf.split('/')
      var fileList = [{name: url1[url1.length - 1], url: row.attachment}, {name: url2[url2.length - 1], url: row.pdf}]
      this.form.filelist = fileList
      this.addVisible = true
      this.addTitle = '编辑课件'
      if (this.$refs.cwupload) {
        this.$refs.cwupload.clearFiles()
      }
      this.uploadLoading = false
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.uploadLoading = true
          var fd = new FormData()
          let uid = this.$store.getters.userId
          fd.append('uid', uid)
          this.uploadfileList.forEach(function (element) {
            var file = element.raw
            if (file && file.name.indexOf('.zip') > -1) {
              fd.append('attachment', file)
            } else if (file && file.name.indexOf('.pdf') > -1) {
              fd.append('pdf', file)
            }
          })

          let posturl = ''
          if (this.form.id) {
            fd.append('id', this.form.id)
            posturl += '/Courseware/editcourseware'
          } else {
            posturl += '/Courseware/addcourseware'
          }
          fd.append('theme', this.form.theme)
          fd.append('type', this.form.type)
          fd.append('level', this.form.level)
          fd.append('unit', this.form.unit)
          fd.append('lesson', this.form.lesson)
          request({
            method: 'post',
            url: posturl,
            headers: {'Content-Type': 'multipart/form-data', 'Access-Token': getToken()},
            data: fd
          }).then(response => {
            const res = response
            if (res.code === 1000) {
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
    confirmDelete () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条需要删除的信息！')
        return
      }
      this.$confirm('此操作将永久删除课件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDelete () {
      return new Promise((resolve, reject) => {
        delCourseWare(this.multipleSelecIds).then(response => {
          if (response) {
            this.getData()
            this.$message.success('课件已删除！')
          }
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
    handleUploadFile (file, fileList) {
      this.uploadfileList = fileList
    },
    handleDownload (download) {
      if (download) {
        window.open(download)
      } else {
        this.$message.info('您还没有提供课件地址哦！')
      }
    },
    submitUpload () {
      this.$refs.upload.submit()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.courseware-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 50px;
    margin-left: 10px;
    margin-top: 10px;
    font-size: 18px;
    .btn-delete {
      position: absolute;
      left: 10px;
    }
    .btn-add {
      position: absolute;
      left: 130px;
    }
    .btn-addAll {
      position: absolute;
      left: 220px;
    }
    .handle-input{
      position: absolute;
      left: 380px;
      width: 250px;
      display: inline-block;
    }
    .btn-search {
      position: absolute;
      left: 640px;
    }
  }
  .my-table {
    width: 860px;
    margin-left: 10px;
  }
  form {
    width: 420px;
    margin: 0 auto;
  }
  .form-input {
    width: 250px;
  }
}
</style>
