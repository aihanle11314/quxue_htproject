<template>
      <div class="appbanner-container">
      <div class="box-header">
            <el-input v-model="a_name" placeholder="请输入配音包名称" class="handle-input1 mr10" size="small"></el-input>
            <el-input v-model="a_id" placeholder="请输入配音ID" class="handle-input2 mr10" size="small"></el-input>
            <el-button class="btn-search" type="primary" icon="el-icon-search" @click.native="search" size="small">搜索</el-button>
      </div>
      		<el-table :data="tableData" border size="mini" class="my-table"
      @selection-change="handleSelectionChange" v-loading="listLoading">
        <el-table-column align="center" type="selection">
        </el-table-column>
        <el-table-column align="center" prop="id" label="配音ID">
				</el-table-column>
				<el-table-column align="center" prop="name" label="配音包名称">
				</el-table-column>
				<el-table-column align="center" prop="weight" label="配音封面">
          <template slot-scope="scope">
                <el-button size="mini" 
										@click="See(url0)">查看</el-button>
						</template>
				</el-table-column>
				<el-table-column align="center" prop="describe" label="配音视频">
          <template slot-scope="scope">
                <el-button size="mini" 
										@click="See(url1)">查看</el-button>
						</template>
				</el-table-column>
        <el-table-column align="center" prop="is_hide" label="配音字幕">
          <template slot-scope="scope">
                <el-button size="mini" 
										@click="See(url2)">查看</el-button>
						</template>
        </el-table-column>
        <el-table-column align="center" prop="is_hide" label="配音音轨">
          <template slot-scope="scope">
                <el-button size="mini" 
										@click="See(url3)">查看</el-button>
						</template>
        </el-table-column>
				<el-table-column align="center" label="操作">
						<template slot-scope="scope">
                <el-button size="mini" 
										@click="See(url3)">查看</el-button>
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
       <el-dialog :title="editTitle" :visible.sync="editVisible">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="配音包名称" prop="name">
              <el-input class="form-input" placeholder="http://" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="配音封面URL" prop="name">
              <el-input class="form-input" placeholder="http://" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="配音视频URL" prop="name">
              <el-input class="form-input" placeholder="http://" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="配音字幕URL" prop="name">
              <el-input class="form-input" placeholder="http://" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="配音音轨URL" prop="name">
              <el-input class="form-input" placeholder="http://" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
                  <el-button type="primary" @click="onSubmitForm('form')">提交</el-button>
              </el-form-item>
          </el-form>
         </el-dialog> 
    </div>
</template>

<script>

export default {
  name: 'pymaterialManage',
  data () {
    return {
      listLoading: false,
      editVisible: false,
      editTitle: '',
      tableData: [],
      a_name: '',
      a_id: '',
      multipleSelection: [],
      page_size: 20,
      total: 1,
      page: 1,
      is_hide: '',
      form: {
        name: '',
        weight: '',
        describe: ''
      },
    }
  },
  // created () {
  //     this.getData()
  // },
  methods: {
    getData () {
      this.listLoading = true
      let self = this
      return new Promise((resolve, reject) => {//更改字段名！！
        getPyclassList(this.page, this.cl_name).then(response => {
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
      this.getData()
    },
    See (e) {
        window.location.href = e
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection[0].id)
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    },
    handleEdit (index, row) {
      this.form['type_id'] = row.id
      this.form.name = row.name //以下各项改成将要显示的字段名
      this.form.weight = row.weight
      this.form.describe = row.describe
      this.editVisible = true//控制显示
      this.editTitle = '编辑配音'
    },
    onSubmitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editVisible = true
            return new Promise((resolve, reject) => {
              editpyClass(this.form).then(response => {
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
      left: 50px;
      width: 200px;
      display: inline-block;
    }
    .handle-input2 {
      position: absolute;
      left: 320px;
      width: 200px;
      display: inline-block;
    }
    .handle-input3 {
      position: absolute;
      left: 500px;
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
