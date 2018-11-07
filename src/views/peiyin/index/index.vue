<template>
    <div class="appbanner-container">
        <div class="box-header">
            <el-button class="btn-add" type="primary" icon="el-icon-plus" size="small" @click.native="handleAdd">新增</el-button>
            <el-select v-model="type_id" placeholder="分类类型" class="handle-input0" size="small">
                <el-option :key="''" :label="'全部'" :value="''"></el-option>
                <el-option v-for="item in cztypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-input v-model="name" placeholder="配音名称" class="handle-input2 mr10"
            @keydown.enter.native="search" size="small"></el-input>
            <!-- <el-checkbox-group v-model="checkList" class="handle-input3"> -->
                <el-checkbox class="handle-input3" v-model="is_recommend" true-label="1" false-label="2">热门推荐</el-checkbox>
                <el-checkbox class="handle-input4" v-model="is_top" true-label="1" false-label="2">分类置顶</el-checkbox>
            <!-- </el-checkbox-group> -->
            <el-button class="btn-search" type="primary" icon="el-icon-search" @click.native="search" size="small">搜索</el-button>
            <el-button class="btn-search1" type="primary" icon="el-icon-close" @click.native="confirmDelete" size="small">删除</el-button>
        </div>
        <el-button-group>
                <el-button type="primary" plain @click.native="cancelTop">取消置顶</el-button>
                <el-button type="primary" plain @click.native="confirmDelete">设置置顶</el-button>
                <el-button type="primary" plain @click.native="confirmDelete">取消推荐</el-button>
                <el-button type="primary" plain @click.native="confirmDelete">设置推荐</el-button>
                <!-- <el-button type="primary" plain>播放最多</el-button>
                <el-button type="primary" plain>点击最多</el-button>
                <el-button type="primary" plain>配音最多</el-button>
                <el-button type="primary" plain>分享最多</el-button>
                <el-button type="primary" plain>点赞最多</el-button> -->
        </el-button-group>
        <el-select v-model="order_condition" size="small" placeholder="条件类型" class="handle-input1">
          <el-option :label="'全部'" :value="''">
          </el-option>
          <el-option :label="'播放最多'" :value="1">
          </el-option>
          <el-option :label="'点击最多'" :value="2">
          </el-option>
          <el-option :label="'配音最多'" :value="3">
          </el-option>
          <el-option :label="'分享最多'" :value="4">
          </el-option>
          <el-option :label="'点赞最多'" :value="5">
          </el-option>
        </el-select>
		<el-table :data="tableData" border size="mini" class="my-table"
      @selection-change="handleSelectionChange" v-loading="listLoading">
        <el-table-column align="center" type="selection">
        </el-table-column>
				<el-table-column align="center" prop="id" label="配音ID">
				</el-table-column>
				<el-table-column align="center" prop="title" label="配音名称">
				</el-table-column>
                <el-table-column align="center" prop="hits" label="点击量">
				</el-table-column>
				<el-table-column align="center" prop="plays" label="播放量">
				</el-table-column>
				<el-table-column align="center" prop="dubs" label="配音量">
				</el-table-column>
                <el-table-column align="center" prop="shares" label="分享量">
				</el-table-column>
				<el-table-column align="center" prop="likes" label="点赞量">
				</el-table-column>
				<el-table-column align="center" prop="types" label="配音分类">
				</el-table-column>
				<el-table-column align="center" prop="tags" label="配音标签">
				</el-table-column>
				<!-- <el-table-column align="center" prop="reco" label="推荐">
				</el-table-column> -->
        <el-table-column align="center" prop="is_recommend" label="推荐">
           <template slot-scope="scope">
							<span v-if="scope.row.is_recommend === 1">推荐</span>
							<span v-else-if="scope.row.is_recommend === 2"></span>
						</template>
				</el-table-column>
				<!-- <el-table-column align="center" prop="topp" label="置顶">
				</el-table-column> -->
        <el-table-column align="center" prop="is_top" label="置顶">
           <template slot-scope="scope">
							<span v-if="scope.row.is_top === 1">置顶</span>
							<span v-else-if="scope.row.is_top === 2"></span>
						</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
						<template slot-scope="scope">
								<el-button class="hideone" size="mini"
										@click="hideEdit(scope.$index, scope.row)">隐藏</el-button>
                <el-button class="handleone" size="mini" style="margin-top:5px;margin-left:0;"
										@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						</template>
				</el-table-column>
		</el-table>
        <div v-show="!listLoading" class="pagination">
			<el-pagination
						background
						@current-change ="handleCurrentChange"
						layout="total, prev, pager, next, jumper"
						:page-size="page_size"
            :total="total">
			</el-pagination>
		</div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="上传配置文件" prop="updatefile">
            <el-upload ref="cwupload" class="upload-demo" action="" :limit="1" accept=".xls,.xlsx"
                :on-change="handleUploadFile" :auto-upload="false" :file-list="form.filelist" v-loading="uploadLoading">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="模板文件" prop="uploadfile">
            <el-button size="mini" type="text"
                @click="lookMoreKejian">下载</el-button>
          </el-form-item>
           <el-form-item>
                <el-button type="primary" @click="onSubmitform('form')">提交</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog :title="editTitle" :visible.sync="editVisible">
        <el-form ref="form1" :model="form1" :rules="rules" label-width="120px">
          <el-form-item label="配音标题" prop="edit_pname">
              <el-input class="form-input" v-model="form1.edit_pname"></el-input>
          </el-form-item>

          <!-- <el-select v-model="type_id" placeholder="分类类型" class="handle-input0" size="small">
                <el-option :key="''" :label="'全部'" :value="''"></el-option>
                <el-option v-for="item in cztypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select> -->

          <el-form-item label="配音分类" prop="edit_pclass">
              <el-checkbox-group v-model="form1.edit_pclass">
                <el-checkbox v-for="item in typeArr" :key="item.id" :label="item.name" :value="item.id"></el-checkbox>
              </el-checkbox-group>
              <el-button type="primary" @click="addPyclass">添加分类</el-button>
          </el-form-item>
          <el-form-item label="配音标签" prop="tags">
                  <el-tag v-model="form1.tags" v-for="(tag , index) in form1.tags" :key="tag.name" closable :disable-transitions="false" :type="tag.type" @close="handleClose(index)">
                    {{tag.name}}
                  </el-tag>
              <el-button type="primary" @click="addPylabel">添加标签</el-button>
          </el-form-item>
          <el-form-item label="配音描述" prop="describe">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" class="form-input" v-model="form.describe"></el-input>
          </el-form-item>
          <el-form-item label="点击量" prop="dianjil">
              <el-input class="form-input" v-model="form1.dianjil"></el-input>
          </el-form-item>
          <el-form-item label="播放量" prop="bofangl">
              <el-input class="form-input" v-model="form1.bofangl"></el-input>
          </el-form-item>
          <el-form-item label="配音量" prop="peiyinl">
              <el-input class="form-input" v-model="form1.peiyinl"></el-input>
          </el-form-item>
          <el-form-item label="分享量" prop="fenxiangl">
              <el-input class="form-input" v-model="form1.fenxiangl"></el-input>
          </el-form-item>
          <el-form-item label="点赞量" prop="dianzanl">
              <el-input class="form-input" v-model="form1.dianzanl"></el-input>
          </el-form-item>
          <el-form-item label="是否推荐" prop="istuijian">
              <el-input class="form-input" v-model="form1.istuijian"></el-input>
          </el-form-item>
          <el-form-item label="是否置顶" prop="iszhiding">
              <el-input class="form-input" v-model="form1.iszhiding"></el-input>
          </el-form-item>
          <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form1')">提交</el-button>
            </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
import request from '@/http/request'
import { getToken } from '@/utils/auth'
import {getPeiyinList, deletepeiyin, getpeiyinType, operateTop, hidePeiyin} from '@/http/api/peiyinRequest'
export default {
  name: 'pyindex',
  data () {
    return {
      listLoading: false,
      uploadLoading: false,
      is_hide: 1,
      type_id: '',
      tiaojian_type: '',
      name: '',
      // checkList: '',
      cztypeList: [],
      is_recommend: 2,
      is_top: 2,
      order_condition: '',
      tableData: [],
      class_id: null,
      multipleSelection: [],
      page_size: 20,
      total: 1,
      page: 1,
      form: {
        filelist:[],
      },
      rules: {
        oid: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        rech_id: [
          { required: true, message: '请输入充值类型', trigger: 'blur' }
        ],
        class_hour: [
          { required: true, message: '请输入充值课时', trigger: 'blur' }
        ],
        input_time: [
          { required: true, message: '请输入充值时间', trigger: 'change' }
        ]
      },
      form1: {
        tags: [],
        describe: '',
        edit_pname: '',
        edit_pclass: '',
        dianjil: '',
        bofangl: '',
        peiyinl: '',
        fenxiangl: '',
        dianzanl: '',
        istuijian: '',
        iszhiding: '',
      },
      dialogVisible: false,
      dialogTitle: '',
      editVisible: false,
      editTitle: '',
      fileList: [],
    }
  },
  // created () {
  //   this.getData()
  //  this.getPYTypeList()
  // },
  computed: {
    typeArr: function() {
      let self = this
      if(this.form1.edit_pclass){
        return this.form1.edit_pclass.split(',')
          }else {
            return this.form1.edit_pclass
          }
      }
  },
  methods: {
      getData () {
      this.listLoading = true
      let self = this
      return new Promise((resolve, reject) => {//更改字段名！！
        getPeiyinList(this.order_condition, this.is_recommend, this.is_top, this.type_id, this.name, this.page).then(response => {
          const dataw = response.data
          self.tableData = dataw.data
        //   self.total_page = dataw.page_total
          self.total = dataw.totals
          self.page_size = dataw.every_page_number
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
    confirmDelete (index, row) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条记录！')
        return
      }
      this.$confirm('此操作将永久删除充值记录, 是否继续?', '提示', {
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
    cancelTop (index,row) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条记录！')
        return
      }
        this.cancelTopone()

      //     var self = this
      // self.class_id = this.multipleSelecIds
      // self.is_top = 2
      // return new Promise((resolve, reject) => {
      //   operateTop(self.class_id,self.is_top).then(response => {
      //     if (response) {
      //       this.getData()
      //       this.$message.success('审核通过提交成功！')
      //     }
      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })

    },
    cancelTopone () {
      var self = this
      self.is_top = 2
      var pid = ''
      var selects = this.multipleSelection
      for (var i = 0; i < selects.length; i++) {
        if (i === selects.length - 1) {
          pid += selects[i].id
        } else {
          pid += selects[i].id + ','
        }
      }
      return new Promise((resolve, reject) => {
        operateTop(pid,self.is_top).then(response => {
          if (response) {
            this.getData()
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
      getPYTypeList () {
      let self = this
      return new Promise((resolve, reject) => {
        getpeiyinType().then(response => {
          const dataw = response
          self.cztypeList = dataw.type//根据字段修改
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleDelete () {
      var pid = ''
      var selects = this.multipleSelection
      for (var i = 0; i < selects.length; i++) {
        if (i === selects.length - 1) {
          pid += selects[i].id
        } else {
          pid += selects[i].id + ','
        }
      }
      return new Promise((resolve, reject) => {
        deletepeiyin(pid).then(response => {
          if (response) {
            this.getData()
            this.$message.success('删除成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    },
    handleAdd () {
      console.log(this.order_condition ,11111111111)
      this.form = {
        oid: '',
        rech_id: '',
        class_hour: '',
        input_time: '',
        buff: '',
        other: ''
      }
      this.dialogTitle = '添加配置文件'
      this.dialogVisible = true
    },
    handleUploadFile (file, fileList) {
      this.uploadfileList = fileList
    },
        lookMoreKejian () {
        window.open(url) //模板下载地址
    },
    onSubmitform(formName) {
          this.uploadLoading = true
          var fd = new FormData()
          let uid = this.$store.getters.userId
          fd.append('uid', uid)
          var file = this.uploadfileList[0].raw
          fd.append('dubconfig', file)//上传文件参数名
          //发送请求
          request({
            method: 'post',
            url: '/Dubs/create', //上传文件接口
            headers: {'Content-Type': 'multipart/form-data', 'Access-Token': getToken()},
            data: fd
          }).then(response => {
            const res = response
            if (res.code === 1000) {
              this.dialogVisible = false
              this.getData()
              this.$message.success('提交成功！')
            } else {
              this.$message.error(res.msg)
            }
            this.uploadLoading = false
          })
    },
    hideEdit (index, row) {
      console.log(this.$store.getters.userId,7888888888)
      console.log(row.id,700000)
      let is_hide = 2
      return new Promise((resolve, reject) => {
        hidePeiyin([is_hide, row.id]).then(response => {
          if (response) {
            this.getData()
            this.$message.success('配音项已隐藏！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleEdit (index, row) {
      this.form1['id'] = row.id
      this.form1.edit_pname = row.name //以下各项改成将要显示的字段名
      this.form1.edit_pclass = row.type
      this.form1.describe = row.describe
      this.form1.tags = row.tags
      this.form1.dianjil = row.hits
      this.form1.bofangl = row.plays
      this.form1.peiyinl = row.dubs
      this.form1.fenxiangl = row.shares
      this.form1.dianzanl = row.likes
      this.form1.istuijian = row.is_recommend
      this.form1.iszhiding = row.is_top
      this.editVisible = true//控制显示
      this.editTitle = '编辑配音'
    },
    addPyclass () {
      this.$router.push({name: 'addClass'})
    },
    addPylabel () {
      this.$router.push({name: 'addLabel'})
    },
    handleClose(index) {
      var that = this
      that.form1.tags.splice(index, 1)
      console.log(index)
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = true
            return new Promise((resolve, reject) => {
              editlbClass(this.form).then(response => {
                if (response) {
                  this.editVisible = false
                  this.getData()
                  this.$message.success('提交成功！')
                }
                resolve()
              }).catch(error => {
                this.addloading = false
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
    .btn-add {
      position: absolute;
      left: 10px;
    }
    .handle-input0 {
      position: absolute;
      left: 100px;
      width: 140px;
      display: inline-block;
    }
    .handle-input1 {
      position: absolute;
      left: 200px;
      width: 120px;
      display: inline-block;
    }
    .handle-input2 {
      position: absolute;
      left: 255px;
      width: 200px;
      display: inline-block;
    }
    .handle-input3 {
      position: absolute;
      left: 500px;
      top: 18px;
    }
    .handle-input4 {
      position: absolute;
      left: 580px;
      top: 18px;
    }
    .btn-search {
        position: absolute;
        left: 800px;
      }
    .btn-search1 {
    position: absolute;
    left: 900px;
    }
  }
}
</style>
