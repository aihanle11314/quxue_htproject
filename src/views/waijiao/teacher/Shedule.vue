<template>
   <div class="shedule-container">
      <div class="tab-container">
        <el-tabs v-model="type" @tab-click="handleClick">
            <el-tab-pane label="可用时间" name="1">
                <calendar v-show="type==='1'" :daysData="days" :timesData="times" @changeData="changeData"/>
            </el-tab-pane>
            <el-tab-pane label="已排课时间" name="2">
                <calendar v-show="type==='2'" :daysData="days" :timesData="times" @changeData="changeData"/>
            </el-tab-pane>
            <el-tab-pane label="个人详情" name="0">
                <el-select v-show="type==='0'" v-model="tid" filterable placeholder="请选择外教老师">
                  <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
                <el-button v-show="type==='0'" class="btn-search" type="primary" icon="el-icon-search" @click.native="search">搜索</el-button>
                <calendar v-show="type==='0'" :daysData="days" :timesData="times" @changeData="changeData"/>
            </el-tab-pane>
        </el-tabs>
      </div>
   </div>
</template>

<script>
import { getTeacherShedule, getTeacherList } from '@/http/api/waijiaoRequest'
import calendar from './Calendar'
export default {
  name: 'teacherShedule',
  components: { calendar },
  data () {
    return {
      type: '1',
      tid: '',
      month: '',
      days: [],
      times: [],
      teachers: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      return new Promise((resolve, reject) => {
        getTeacherShedule(this.type, this.month, this.tid).then(response => {
          const res = response
          if (res.code === 0) {
            this.days = res.slot.days
            this.times = res.slot.times
          } else {
            this.$message.error(res.msg)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getTeacherData () {
      return new Promise((resolve, reject) => {
        getTeacherList('', '').then(response => {
          const dataw = response.data
          this.teachers = dataw.list
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleClick (tab, event) {
      // console.log(tab, event)
      this.month = ''
      this.tid = ''
      if (this.type === '1' || this.type === '2') {
        this.getData()
      } else {
        this.getTeacherData()
      }
    },
    changeData (month) {
      this.month = month
      this.getData()
    },
    search () {
      this.getData()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.shedule-container {
  margin: 0;
  padding: 0;
  .tab-container {
    position: relative;
    width: 90%;
    height: 80px;
    margin-left: 10px;
    margin-top: 10px;
  }
}
</style>
