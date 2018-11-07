<template>
  <div class="usedthe-container">
    <div class="box-header">
      <el-select v-model="class_type" size="small" placeholder="班级类型" class="handle-input0">
          <el-option :label="'全部班级'" :value="''">
          </el-option>
					<el-option :label="'双师班'" :value="1" :key="1">
					</el-option>
					<el-option :label="'小班'" :value="2" :key="2">
					</el-option>
			</el-select>
			<el-select v-model="course_type" size="small" placeholder="课程类型" class="handle-input1">
          <el-option :label="'全部课程'" :value="''">
          </el-option>
					<el-option :label="'正式课程'" :value="0" :key="0">
					</el-option>
					<el-option :label="'体验课程'" :value="1" :key="1">
					</el-option>
			</el-select>
			<el-input clearable v-model="o_name" size="small" placeholder="请输入机构名称" class="handle-input2 mr10"
        @keydown.enter.native="search"></el-input>
      <el-input clearable v-model="c_name" size="small" placeholder="请输入班级名称" class="handle-input3 mr10"
        @keydown.enter.native="search"></el-input>
      <el-input clearable v-model="en_teacher_name" size="small" placeholder="请输入外教姓名" class="handle-input4 mr10"
        @keydown.enter.native="search"></el-input>
      <el-date-picker v-model="s_date" type="date" size="small" placeholder="选择日期" value-format="yyyy-MM-dd" class="handle-input5"
        style="width:170px;">
      </el-date-picker>
			<el-button class="btn-search" type="primary" size="small" icon="el-icon-search" @click.native="search">搜索</el-button>
		</div>
		<el-table :data="tableData" border size="mini" class="my-table" v-loading="listLoading">
				<el-table-column align="center" prop="o_name" label="机构名称">
				</el-table-column>
				<el-table-column align="center" prop="c_name" label="班级名称">
				</el-table-column>
        <el-table-column align="center" label="班级类型">
            <template slot-scope="scope">
							<span v-if="scope.row.class_format === 1">双师班</span>
							<span v-else-if="scope.row.class_format === 2">小班</span>
						</template>
				</el-table-column>
				<el-table-column align="center" label="课程类型">
            <template slot-scope="scope">
							<span v-if="scope.row.c_type === 0">正式课程</span>
							<span v-else-if="scope.row.c_type === 1">体验课程</span>
						</template>
				</el-table-column>
				<el-table-column align="center" prop="c_level" label="课程级别">
				</el-table-column>
				<el-table-column align="center" prop="t_name" label="中教老师">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.t_name }}</p>
              <p>电话: {{ scope.row.mobile }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="mini">{{ scope.row.t_name }}</el-tag>
              </div>
            </el-popover>
          </template>
				</el-table-column>
				<el-table-column align="center" label="外教">
          <template slot-scope="scope">
               <span v-if="scope.row.en_teacher">{{scope.row.en_teacher}}</span>
               <span v-else>{{scope.row.en_t_name}}</span>
            </template>
				</el-table-column>
				<el-table-column align="center" prop="s_list" label="学生名单">
            <template slot-scope="scope">
								<el-button size="mini"
										@click="lookMoreStudent(scope.$index, scope.row)">查看</el-button>
						</template>
				</el-table-column>
				<el-table-column align="center" prop="time" label="上课时间">
				</el-table-column>
				<el-table-column align="center" prop="c_url" label="所用课件" width="90">
           <template slot-scope="scope">
							<el-button size="mini" type="text"
                @click="lookMoreKejian(scope.row.c_pdf_url)">PDF</el-button>
              <el-button size="mini" type="text"
                @click="lookMoreKejian(scope.row.c_url)">课件</el-button>
						</template>
				</el-table-column>
				<el-table-column align="center" label="课程录像">
						<template slot-scope="scope">
								<el-button size="mini"
										@click="lookVideo(scope.$index, scope.row)">查看</el-button>
								<el-button size="mini"
										@click="editVideo(scope.$index, scope.row)"
                    style="margin-top:5px;margin-left:0;">编辑</el-button>
						</template>
				</el-table-column>
		</el-table>
		<div class="pagination" v-show="!listLoading">
			<el-pagination
						background
						@current-change ="handleCurrentChange"
						layout="total, prev, pager, next, jumper"
            :page-size="page_size"
            :total="total">
			</el-pagination>
		</div>
		<el-dialog :title="lookMoreTitle" :visible.sync="lookMoreVisible" width="40%" center>
        <template v-for="item in lookMoreContent">
            <div style="text-align:center;height:25px;line-height:25px;" v-bind:key="item">{{item}}</div>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="lookMoreVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="学生名单" :visible.sync="lookMoreStuVisible" center>
        <el-table :data="studentList" border fit size="small">
          <el-table-column align="center" prop="name" label="姓名">
          </el-table-column>
          <el-table-column align="center" prop="en_name" label="英文名">
          </el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号" width="100">
          </el-table-column>
          <el-table-column min-width="330px" label="评语" prop="content">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input class="edit-input" size="small" v-model="scope.row.content" style="width:250px;"></el-input>
                <el-button class='cancel-btn' size="mini" icon="el-icon-refresh" type="warning" @click="cancelEditCont(scope.row)"></el-button>
              </template>
              <span v-else>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="编辑">
            <template slot-scope="scope">
              <el-button v-if="scope.row.edit" type="success" @click="confirmEditCont(scope.row)" size="small" icon="el-icon-circle-check-outline"></el-button>
              <el-button v-else type="primary" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="lookMoreStuVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="录像地址" :visible.sync="dialogVisible">
        <el-form ref="form" :model="form" label-width="120px">
           <el-form-item label="录像地址" prop="video_url">
              <el-input class="form-input" v-model="form.video_url" placeholder="http://"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseList, updateVideo, updateStudentCont } from '@/http/api/waijiaoRequest'
export default {
  name: 'UsedtheCourse',
  data () {
    return {
      listLoading: false,
      tableData: [],
      o_name: '',
      c_name: '',
      class_type: '',
      course_type: '',
      en_teacher_name: '',
      s_date: '',
      total: 0,
      total_page: 1,
      curr_page: 1,
      page_size: 20,
      lookMoreTitle: '',
      lookMoreVisible: false,
      lookMoreStuVisible: false,
      lookMoreContent: [],
      studentList: [],
      form: {
        video_url: ''
      },
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
        getCourseList(2, this.o_name, this.c_name, this.class_type, this.course_type, this.s_date, this.curr_page, this.en_teacher_name).then(response => {
          const dataw = response.data
          self.tableData = dataw.data
          self.total_page = dataw.page_total
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
      this.getData()
    },
    handleCurrentChange (val) {
      this.curr_page = val
      this.getData()
    },
    lookMoreStudent (index, row) {
      if (row.class_format === 1) {
        this.lookMoreTitle = '学生名单'
        this.lookMoreContent = [row.s_list]
        this.lookMoreVisible = true
      } else if (row.class_format === 2) {
        this.studentList = row.students.map(v => {
          this.$set(v, 'edit', false)
          v.originalContent = v.content
          v.course_id = row.id
          return v
        })
        this.lookMoreStuVisible = true
      }
    },
    lookMoreKejian (download) {
      if (download) {
        window.open(download)
      } else {
        this.$message.info('您还没有提供课件地址哦！')
      }
    },
    lookVideo (index, row) {
      // this.lookMoreTitle = '录像地址'
      // this.lookMoreContent = [row.video_url]
      // this.lookMoreVisible = true
      if (row.video_url) {
        window.open(row.video_url)
      } else {
        this.$message.info('您还没有提供录像地址哦！')
      }
    },
    editVideo (index, row) {
      this.form['c_id'] = row.id
      this.form.video_url = row.video_url
      this.dialogVisible = true
    },
    onSubmitForm (formName) {
      this.dialogVisible = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            updateVideo(this.form).then(response => {
              if (response) {
                this.getData()
                this.$message.success('提交成功！')
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
    cancelEditCont (row) {
      row.content = row.originalContent
      row.edit = false
    },
    confirmEditCont (row) {
      var contForm = {
        cid: row.class_id,
        tid: row.course_id,
        sid: row.s_id,
        content: row.content
      }
      return new Promise((resolve, reject) => {
        updateStudentCont(contForm).then(response => {
          if (response) {
            row.edit = false
            row.originalContent = row.content
            this.$message.success('提交成功！')
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
.usedthe-container {
  margin: 0;
  padding: 0;
  .box-header {
    position: relative;
    height: 60px;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 18px;
  }
  .handle-input0 {
    position: absolute;
    left: 20px;
    width: 120px;
    display: inline-block;
  }
  .handle-input1 {
    position: absolute;
    left: 160px;
    width: 120px;
    display: inline-block;
  }
	.handle-input2 {
    position: absolute;
    left: 300px;
    width: 170px;
    display: inline-block;
  }
	.handle-input3 {
    position: absolute;
    left: 490px;
    width: 170px;
    display: inline-block;
  }
  .handle-input4 {
    position: absolute;
    left: 680px;
    width: 170px;
    display: inline-block;
  }
  .handle-input5 {
    position: absolute;
    left: 870px;
    width: 170px;
    display: inline-block;
  }
  .btn-search {
    position: absolute;
    left: 1050px;
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
    width: 520px;
    margin: 0 auto;
  }
  .form-input {
    width: 400px;
  }
}
</style>
