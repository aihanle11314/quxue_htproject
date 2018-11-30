<template>
    <div class="appbanner-container">
        <div class="box-header">
            <el-button class="btn-add" type="primary" icon="el-icon-plus" size="small" @click.native="handleAdd">新增</el-button>
            <el-select v-model="type_class" placeholder="分类类型" class="handle-input0" size="small">
                <el-option :key="''" :label="'全部'" :value="''"></el-option>
                <el-option v-for="item in cztypeList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <el-input v-model="name" placeholder="配音名称" class="handle-input2 mr10" size="small"></el-input>
            <!-- <el-checkbox-group v-model="checkList" class="handle-input3"> -->
                <el-checkbox class="handle-input3" v-model="is_recommend" true-label="1" false-label="2">热门推荐</el-checkbox>
                <el-checkbox class="handle-input4" v-model="is_top" true-label="1" false-label="2">分类置顶</el-checkbox>
            <!-- </el-checkbox-group> -->
            <el-button class="btn-search" type="primary" icon="el-icon-search" @click.native="search" size="small">搜索</el-button>
            <el-button class="btn-search1" type="primary" icon="el-icon-close" @click.native="confirmDelete" size="small">删除</el-button>
        </div>
        <el-button-group>
                <el-button type="primary" plain @click.native="cancelTop">取消置顶</el-button>
                <el-button type="primary" plain @click.native="setTop">设置置顶</el-button>
                <el-button type="primary" plain @click.native="cancelRecommend">取消推荐</el-button>
                <el-button type="primary" plain @click.native="setRecommend">设置推荐</el-button>
                <!-- <el-button type="primary" plain>播放最多</el-button>
                <el-button type="primary" plain>点击最多</el-button>
                <el-button type="primary" plain>配音最多</el-button>
                <el-button type="primary" plain>分享最多</el-button>
                <el-button type="primary" plain>点赞最多</el-button> -->
        </el-button-group>
        <el-select v-model="order_condition" size="small" placeholder="条件类型" class="handle-input1">
          <el-option label="全部" value=" ">
          </el-option>
          <el-option label="播放最多" value="1">
          </el-option>
          <el-option label="点击最多" value="2">
          </el-option>
          <el-option label="配音最多" value="3">
          </el-option>
          <el-option label="分享最多" value="4">
          </el-option>
          <el-option label="点赞最多" value="5">
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
				<el-table-column align="center" prop="type_str" label="配音分类">
          <template slot-scope="scope">
                {{getProductName(scope.row.type_str)}}
              </template>
				</el-table-column>
				<el-table-column align="center" prop="tags_str" label="配音标签">
          <template slot-scope="scope">
                {{getProductName1(scope.row.tags_str)}}
              </template>
				</el-table-column>
        <!-- <el-table-column v-if="isdes" align="center" prop="describe" label="配音描述">
				</el-table-column> -->
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
								<el-button size="mini" type="danger" plain v-if="scope.row.is_hide === 2"
										@click="hideEdit(scope.$index, scope.row)">隐藏</el-button>
                <el-button size="mini"
										@click="hideEdit(scope.$index, scope.row)" v-if="scope.row.is_hide === 1">显示</el-button>
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
          <el-form-item label="配音标题" prop="title">
              <el-input class="form-input" v-model="form1.title"></el-input>
          </el-form-item>
          <el-form-item label="配音分类" prop="type_id">
              <el-checkbox-group v-model="type_id">
                <el-checkbox v-for="item in cztypeList" :key="item.id" :label="item.id">
                  {{item.name}}
                </el-checkbox>
              </el-checkbox-group>
              <el-button type="primary" @click="addPyclass">添加分类</el-button>
          </el-form-item>
          <el-form-item label="配音标签" prop="tags_id">
                <el-drag-select v-model="tags_id" style="width:550px;" multiple placeholder="请选择">
                  <el-option class="opcolor" v-for="item  in cztypeList1" :label="item.name" :value="item.id" :key="item.id" />
                </el-drag-select>
                <!-- <el-tag v-for="item of cztypeList1" :key="item.name" >{{ item.name }}</el-tag> -->
                  <!-- <el-tag v-model="tags_id" v-for="(item, index) in cztypeList1" :label="item.id" :key="item.id" closable :disable-transitions="false" :type="item.name" @close="handleClose(index)">
                    {{item.name}}
                  </el-tag> -->
              <el-button class="opcolor1" type="primary" @click="addPylabel">添加标签</el-button>
          </el-form-item>
          <el-form-item label="配音描述" prop="describe">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" class="form-input" v-model="form1.describe"></el-input>
          </el-form-item>
          <el-form-item label="点击量" prop="hits">
              <el-input class="form-input" v-model="form1.hits"></el-input>
          </el-form-item>
          <el-form-item label="播放量" prop="plays">
              <el-input class="form-input" v-model="form1.plays"></el-input>
          </el-form-item>
          <el-form-item label="配音量" prop="dubs">
              <el-input class="form-input" v-model="form1.dubs"></el-input>
          </el-form-item>
          <el-form-item label="分享量" prop="shares">
              <el-input class="form-input" v-model="form1.shares"></el-input>
          </el-form-item>
          <el-form-item label="点赞量" prop="likes">
              <el-input class="form-input" v-model="form1.likes"></el-input>
          </el-form-item>
          <el-form-item label="是否推荐" prop="is_recommend">
              <el-radio class="form-input" v-model="form1.is_recommend" :label="1">是</el-radio>
              <el-radio class="form-input" v-model="form1.is_recommend" :label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="是否置顶" prop="is_top">
              <el-radio class="form-input" v-model="form1.is_top" :label="1">是</el-radio>
              <el-radio class="form-input" v-model="form1.is_top" :label="2">否</el-radio>
          </el-form-item>
          <el-form-item>
                <el-button type="primary" @click="onSubmitForm('form1')">提交</el-button>
            </el-form-item>
        </el-form>
        <div class="dialog_in">
          <el-dialog class="dialog_in" title="添加分类" :visible.sync="addeditVisible"
        append-to-body>
          <el-form ref="adclassform" :inline="true" :model="adclassform" :rules="adclassrules" label-width="120px">
           <el-form-item label="分类名称" prop="name">
            <el-input class="form-input1" v-model="adclassform.name"></el-input>
          </el-form-item>
          <el-form-item label="分类权重" prop="weight">
              <el-select v-model="adclassform.weight" placeholder="请选择">
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
            <el-input type="textarea" :rows="2" placeholder="请输入内容" class="form-input" v-model="adclassform.describe"></el-input>
          </el-form-item>
           <el-form-item>
                <el-button class="subton" type="primary" :loading="submitloading" @click="onSubmitadclassForm('adclassform')">提交</el-button>
            </el-form-item>
        </el-form>
        </el-dialog>
        </div>
        
        <el-dialog title="添加标签" :visible.sync="addeditVisibles"
        append-to-body>
          <el-form ref="adlabelform" :model="adlabelform" :rules="adlabelrules" label-width="120px">
           <el-form-item label="标签名称" prop="name">
            <el-input class="form-input" v-model="adlabelform.name"></el-input>
          </el-form-item>
           <el-form-item>
                <el-button class="subton1" type="primary" :loading="submitloading" @click="onSubmitadlabelForm('adlabelform')">提交</el-button>
            </el-form-item>
        </el-form>
        </el-dialog>
      </el-dialog>
    </div>
</template>

<script>
import request from '@/http/request'
import { getToken } from '@/utils/auth'
import ElDragSelect from '@/components/DragSelect'
import {getPeiyinList, deletepeiyin, getpeiyinType, getpeiyinLabel, operateTop, hidePeiyin, editPy, operateRecommend, updateClass, updateLabel} from '@/http/api/peiyinRequest'
import { log } from 'util';
export default {
  inject: ['reload'],
  name: 'pyindex',
  components: { ElDragSelect },
  data () {
    // var checkhits = (rule, value, callback) => {
    //   if(value === 0) {
    //     return callback(new Error('请输入点击量'))
    //   } else {
    //     callback()
    //   }
    // };
    // var checkplays = (rule, value, callback) => {
    //   if(value === 0) {
    //     return callback(new Error('请输入播放量'))
    //   } else {
    //     callback()
    //   }
    // };
    // var checkdubs = (rule, value, callback) => {
    //   if(value === 0) {
    //     return callback(new Error('请输入配音量'))
    //   } else {
    //     callback()
    //   }
    // };
    // var checkshares = (rule, value, callback) => {
    //   if(value === 0) {
    //     return callback(new Error('请输入分享量'))
    //   } else {
    //     callback()
    //   }
    // };
    var checklikes= (rule, value, callback) => {
      if(value === 0) {
        return callback(new Error('请输入点赞量'))
      } else {
        callback()
      }
    };
    return {
      isdes:false,
      listLoading: false,
      uploadLoading: false,
      is_hide: '',
      type_class: [],
      type_id: [],
      tags_id: [],
      name: '',
      // checkList: '',
      cztypeList: [],
      cztypeList1: [],
      is_recommend: 2,
      is_top: 2,
      order_condition: '',
      tableData: [],
      class_id: null,
      // type_str: [],
      // tags_str: [],
      multipleSelection: [],
      page_size: 20,
      total: 1,
      page: 1,
      form: {
        filelist:[],
      },
      adclassform: {
        name: '',
        describe: '',
        weight: 1,
      },
      adlabelform: {
        name: ''
      },
      adlabelrules: {
        name: [
          { required: true, message: '请填写标签名称', trigger: 'blur' }
        ]
      },
      adclassrules: {
        name: [
          { required: true, message: '请填写分类名称', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请选择权重', trigger: 'change' }
        ],
        describe: [
          { required: false, message: '请填写描述信息', trigger: 'blur' }
        ]
      },
      rules: {
        title: [
          { required: true, message: '输入配音标题', trigger: 'blur' }
        ],
        // type_id: [
        //   {type: 'array', required: true, message: '请至少选择一个分类', trigger: 'change' }
        // ],
        // tags_id: [
        //   { required: true, message: '请选择配音标签', trigger: 'change' }
        // ],
        // hits: [
        //   { required: true, validator: checkhits, trigger: 'blur' }
        // ],
        // plays: [
        //   { required: true, message: '输入播放量', trigger: 'blur' }
        // ],
        // dubs: [
        //   { required: true, message: '输入配音量', trigger: 'blur' }
        // ],
        // shares: [
        //   { required: true, message: '输入分享量', trigger: 'blur' }
        // ],
        // likes: [
        //   { required: true, message: '输入点赞量', trigger: 'blur' }
        // ],
        // is_top: [
        //   { required: true, message: '选择是否置顶', trigger: 'change' }
        // ],
        // is_recommend: [
        //   { required: true, message: '选择是否推荐', trigger: 'change' }
        // ]
      },
      form1: {
        // tags_id: [],
        describe: '',
        title: '',
        // type_id: [],
        hits: '',
        plays: '',
        dubs: '',
        shares: '',
        likes: '',
        is_recommend: '',
        is_top: '',
      },
      dialogVisible: false,
      dialogTitle: '',
      editVisible: false,
      editTitle: '',
      addeditVisible: false,
      addeditVisibles: false,
      submitloading: false,
      fileList: [],
    }
  },
  created () {
    this.getData()
   this.getPYTypeList()
   this.getPYLabeleList()
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
  methods: {
      getData () {
      this.listLoading = true
      let self = this
      return new Promise((resolve, reject) => {//更改字段名！！
        getPeiyinList(this.order_condition, this.is_recommend, this.is_top, this.type_class, this.name, this.page).then(response => {
          const dataw = response.data
          self.tableData = dataw.data
        //   self.total_page = dataw.page_total
          self.total = dataw.total
          self.page_size = dataw.every_page_number
          this.listLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    search () {
      let that = this
      that.page = 1
      this.getData()
    },
    getProductName (project) {
      var proname = ''
      for (var i = 0; i < project.length; i++) {
        for (var j = 0; j < this.cztypeList.length; j++) {
          var item = this.cztypeList[j]
          if (project[i] === item.id) {
            if (i === project.length - 1) {
              proname += item.name
            } else {
              proname += item.name + ';'
            }
          }
        }
      }
      return proname
    },
    getProductName1 (project) {
      var proname = ''
      for (var i = 0; i < project.length; i++) {
        for (var j = 0; j < this.cztypeList1.length; j++) {
          var item = this.cztypeList1[j]
          if (project[i] === item.id) {
            if (i === project.length - 1) {
              proname += item.name
            } else {
              proname += item.name + ';'
            }
          }
        }
      }
      return proname
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
    },
    setTop (index,row) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条记录！')
        return
      }
        this.setTopone()
    },
    cancelRecommend (index,row) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条记录！')
        return
      }
        this.cancelRecommendone()
    },
    setRecommend (index,row) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择至少一条记录！')
        return
      }
        this.setRecommendone()
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
        operateTop({base_id:pid, is_top:self.is_top}).then(response => {
          if (response) {
            this.getData()
            this.$message.success('取消置顶成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    setTopone () {
      var self = this
      self.is_top = 1
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
        operateTop({base_id:pid, is_top:self.is_top}).then(response => {
          if (response) {
            this.reload()
            this.$message.success('设置置顶成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    cancelRecommendone () {
      var self = this
      self.is_recommend = 2
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
        operateRecommend({base_id:pid, is_recommend:self.is_recommend}).then(response => {
          if (response) {
            this.getData()
            this.$message.success('取消推荐成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    setRecommendone () {
      var self = this
      self.is_recommend = 1
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
        operateRecommend({base_id:pid, is_recommend:self.is_recommend}).then(response => {
          if (response) {
            this.reload()
            this.$message.success('设置推荐成功！')
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
          console.log('dataw',dataw)
          self.cztypeList = dataw.data//根据字段修改
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getPYLabeleList () {
      let self = this
      return new Promise((resolve, reject) => {
        getpeiyinLabel().then(response => {
          const dataw = response
          console.log('dataw',dataw)
          self.cztypeList1 = dataw.data//根据字段修改
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
      // console.log(this.order_condition ,11111111111)
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
        window.open('http://101.201.152.181:9011/Common/upload/moban.xls') //模板下载地址
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
            console.log('res',res)
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
      let self = this
      if (row.is_hide === 2) {
        row.is_hide = 1
      }else {
        row.is_hide = 2
      }
      return new Promise((resolve, reject) => {
        hidePeiyin({is_hide:row.is_hide, base_id:row.id}).then(response => {
          if (response) {
            this.getData()
            this.$message.success('操作成功！')
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleEdit (index, row) {
      let self = this
      console.log(self.tableData,333333333)
      this.form1['base_id'] = row.id
      console.log(row.id,4444444)
      this.form1.title = row.title //以下各项改成将要显示的字段名
      this.type_id = row.type_str
      for(let i=0; i<self.tableData.length;++i){
        if(row.id === self.tableData[i].id){
          this.form1.describe = self.tableData[i].describe
        }
      }
      // this.form1.describe = self.tableData[0].describe
      this.tags_id = row.tags_str
      this.form1.hits = row.hits.replace(/^\d*\//,'')
      this.form1.plays = row.plays.replace(/^\d*\//,'')
      this.form1.dubs = row.dubs.replace(/^\d*\//,'')
      this.form1.shares = row.shares.replace(/^\d*\//,'')
      this.form1.likes = row.likes.replace(/^\d*\//,'')
      this.form1.is_recommend = row.is_recommend
      this.form1.is_top = row.is_top
      this.editVisible = true//控制显示
      this.editTitle = '编辑配音'
      // console.log(this.type_id,1111111111111)
      // console.log(this.tags_id,22222222)
    },
    addPyclass () {
      // this.$router.push({name: 'addClass'})
      this.addeditVisible = true
      this.adclassform= {
        name: '',
        describe: '',
        weight: 1,
      }
    },
    addPylabel () {
      // this.$router.push({name: 'addLabel'})
      this.addeditVisibles = true
      this.adlabelform= {
        name: ''
      }
    },
    handleClose(index) {
      var that = this
      that.cztypeList1.splice(index, 1)
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var that = this
          this.editVisible = true
           this.form1['type_id'] = this.type_id.join(',')
           this.form1['tags_id'] = this.tags_id.join(',')
           console.log("this.form1['type_id']",this.form1['type_id'])
            return new Promise((resolve, reject) => {
              editPy(this.form1).then(response => {
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
    },
    onSubmitadclassForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitloading = true
          return new Promise((resolve, reject) => {
            updateClass(this.adclassform).then(response => {
              this.submitloading = false
              if (response) {
                
                this.addeditVisible = false
                this.getPYTypeList()
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
    },
    onSubmitadlabelForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitloading = true
          return new Promise((resolve, reject) => {
            updateLabel(this.adlabelform).then(response => {
              this.submitloading = false
              if (response) {
                
                this.addeditVisibles = false
                this.getPYLabeleList()
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
  .dialog_in{
    margin: 0;
    padding: 0; 
    text-align: center;
  }
  .opcolor{
    background-color: rgba(64,158,255,.1)!important;
  }
  .opcolor1{
    margin-top:18px!important;
  }
}
</style>
<style type="text/css">
  .subton{
    margin-left: 140px;
  }
  .subton1{
    margin-left: 200px;
  }
</style>

