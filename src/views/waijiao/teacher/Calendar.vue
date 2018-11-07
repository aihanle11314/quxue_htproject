<template>
  <div class="calendar-box">
    <!-- 年份 月份 -->
    <div class="months">
      <ul class="month-list">
        <li class="arrow prev" @click="pickPreMonth(currentYear, currentMonth)">❮</li>
        <li class="year-month">
          <span class="choose-year">
            <span>{{ currentYear }}</span>
            <span>年</span>
            <span>{{ currentMonth }}</span>
            <span>月</span>
            <!-- <span>{{ currentDay }}</span>
            <span>日</span> -->
          </span>
        </li>
        <li class="arrow next" @click="pickNextMonth(currentYear, currentMonth)">❯</li>
      </ul>
    </div>
    <!-- 星期 -->
    <!-- <ul class="weekdays clearfix">
      <li>一</li>
      <li>二</li>
      <li>三</li>
      <li>四</li>
      <li>五</li>
      <li>六</li>
      <li>日</li>
    </ul> -->
    <!-- 日期 -->
    <!-- <ul class="days clearfix">
      <li v-for="(day, index) in days" :key="index"> -->
        <!--本月-->
        <!-- <span v-if="day.getMonth() + 1 != currentMonth" class="other-month">{{ day.getDate() }}</span>
        <span v-else class="item" :class="{ 'active': day.getFullYear() === new Date().getFullYear() && day.getMonth() === new Date().getMonth() && day.getDate() === new Date().getDate() }"> -->
          <!--today-->
          <!-- <router-link :to="`/date/${ formatDate(day.getFullYear(), day.getMonth() + 1, day.getDate())}`">{{ day.getDate() }}</router-link>
        </span>
      </li>
    </ul> -->
    <div class="sheduleinfo">
      <ul class="sheduleinfo-list">
        <li class="arrow prev" @click="pickPreDays()"><svg-icon icon-class="arrowLeft" style="width:30px;height:30px;"></svg-icon></li>
        <li class="table">
          <el-table :data="tableData" border height="600">
            <el-table-column align="center" prop="time" label="">
            </el-table-column>
            <el-table-column align="center" :label="getWeekName(daysIndex)">
              <el-table-column align="center" prop="w0" :label="getWeekDayName(daysIndex)">
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="getWeekName(daysIndex+1)">
              <el-table-column align="center" prop="w1" :label="getWeekDayName(daysIndex+1)">
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="getWeekName(daysIndex+2)">
              <el-table-column align="center" prop="w2" :label="getWeekDayName(daysIndex+2)">
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="getWeekName(daysIndex+3)">
              <el-table-column align="center" prop="w3" :label="getWeekDayName(daysIndex+3)">
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="getWeekName(daysIndex+4)">
              <el-table-column align="center" prop="w4" :label="getWeekDayName(daysIndex+4)">
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="getWeekName(daysIndex+5)">
              <el-table-column align="center" prop="w5" :label="getWeekDayName(daysIndex+5)">
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" :label="getWeekName(daysIndex+6)">
              <el-table-column align="center" prop="w6" :label="getWeekDayName(daysIndex+6)">
              </el-table-column>
            </el-table-column>
          </el-table>
        </li>
        <li class="arrow next" @click="pickNextDays()"><svg-icon icon-class="arrowRight" style="width:30px;height:30px;"></svg-icon></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'calendar',
  props: {
    daysData: {
      type: Array
    },
    timesData: {
      type: Array
    }
  },
  data () {
    return {
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: [],
      daysIndex: 0
    }
  },
  computed: {
    tableData () {
      var list = []
      this.timesData.forEach((item, index) => { // 设置时间
        list.push({
          time: item
        })
      })
      var showday = this.getShowDays(this.daysIndex) // 当前表格显示日期
      let self = this
      showday.forEach((item, dindex) => { // 根据日期取数据
        let curday
        for (let d of self.daysData) {
          if (d.date === item) {
            curday = d
            break
          }
        }
        list.forEach((item, index) => { // 设置教师
          if (curday && curday.slot[item.time]) {
            item['w' + dindex] = curday.slot[item.time]
          } else {
            item['w' + dindex] = ''
          }
        })
      })
      return list
    }
  },
  created () {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const d = new Date(this.formatDate(year, month, 1))
    d.setDate(42)
    this.initData(this.formatDate(d.getFullYear(), d.getMonth(), 1))
  },
  methods: {
    initData (cur) {
      this.days = []
      const date = cur ? new Date(cur) : new Date()
      this.currentDay = date.getDate()
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
      this.currentWeek = date.getDay()
      if (this.currentWeek === 0) this.currentWeek = 7
      const str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)
      // 今天是周日，放在第一行第7个位置，前面6个
      // 本周
      for (let i = this.currentWeek - 1; i >= 0; i--) {
        const d = new Date(str)
        d.setDate(d.getDate() - i)
        // console.log("y:" + d.getDate())
        this.days.push(d)
      }
      // console.log(this.currentWeek)
      for (let i = 1; i <= 42 - this.currentWeek; i++) {
        const d = new Date(str)
        d.setDate(d.getDate() + i)
        this.days.push(d)
      }
    },
    pickPreMonth (year, month) {
      //  setDate(0); 上月最后一天
      //  setDate(-1); 上月倒数第二天
      //  setDate(dx) 参数dx为 上月最后一天的前后dx天
      const d = new Date(this.formatDate(year, month, 1))
      d.setDate(0)
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      this.daysIndex = 0
      this.getNewData()
    },
    pickNextMonth (year, month) {
      const d = new Date(this.formatDate(year, month, 1))
      d.setDate(42)
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      this.daysIndex = 0
      this.getNewData()
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate (year, month, day) {
      const y = year
      let m = month
      if (m < 10) m = '0' + m
      let d = day
      if (d < 10) d = '0' + d
      return y + '-' + m + '-' + d
    },
    // 返回 类似 2016-01 格式的字符串
    formatMonth (year, month) {
      const y = year
      let m = month
      if (m < 10) m = '0' + m
      return y + '-' + m
    },
    pickPreDays () {
      this.daysIndex -= 7
      if (this.daysIndex < 0) {
        this.daysIndex = 0
      }
    },
    pickNextDays () {
      this.daysIndex += 7
      if (this.daysIndex >= this.days.length) {
        this.daysIndex = this.days.length - 7
      }
    },
    getShowDays (index) {
      var showdays = []
      for (var i = 0; i < 7; i++) {
        if (index + i < this.days.length) {
          var year = this.days[index + i].getFullYear()
          var mon = this.days[index + i].getMonth() + 1
          var date = this.days[index + i].getDate()
          var day = this.formatDate(year, mon, date)
          showdays.push(day)
        }
      }
      return showdays
    },
    getWeekName (index) {
      if (index < this.days.length) {
        var week = '周' + '日一二三四五六'.charAt(this.days[index].getDay())
        return week
      }
    },
    getWeekDayName (index) {
      if (index < this.days.length) {
        var mon = this.days[index].getMonth() + 1
        var date = this.days[index].getDate()
        return mon + '.' + date
      }
    },
    getNewData () {
      var d = this.formatMonth(this.currentYear, this.currentMonth)
      this.$emit('changeData', d)
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-box {
  padding: 1rem;
  .months {
    margin-bottom: .5rem;
    >.month-list {
      width: 250px;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      list-style-type: none;
      outline: none;
      >li {
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        list-style-type: none;
        outline: none;
        &.year-month {
          width: 11.4rem;
        }
        &.arrow {
          width: 5rem;
          cursor: pointer;
          color: rgba(0, 0, 0, .38);
          &:hover {
            color: #24292e; // background-color: $module-hover-bg;
          }
        }
      }
    }
  }
  .sheduleinfo {
    margin-bottom: .5rem;
    >.sheduleinfo-list {
      width: 1000px;
      height: 750px;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      list-style-type: none;
      outline: none;
      >li {
        text-align: center;
        list-style-type: none;
        outline: none;
        &.arrow {
          width: 50px;
          line-height: 750px;
          font-weight: 600;
          cursor: pointer;
          color: rgba(0, 0, 0, .38);
          &:hover {
            color: #24292e; // background-color: $module-hover-bg;
          }
        }
        &.table {
          width: 950px;
        }
      }
    }
  }
  // >.days,
  // >.weekdays {
  //   margin-bottom: .5rem;
  //   >li {
  //     display: block;
  //     float: left;
  //     width: calc(100% / 7);
  //     text-align: center;
  //     border: 0.5px solid #666666;
  //   }
  // }
  // >.weekdays {
  //   height: 2rem;
  //   line-height: 2rem;
  // }
  // >.days {
  //   margin-bottom: 0;
  //   >li {
  //     line-height: 2.6rem;
  //     >.other-month {
  //       opacity: .3;
  //       cursor: initial;
  //     }
  //     >.item {
  //       display: block;
  //       border-radius: 100%;
  //       >a {
  //         display: block;
  //         color: rgba(0, 0, 0, .54);
  //       }
  //       &:hover {
  //         background-color: lighten(rgba(0, 0, 0, 0.12), 30%);
  //         a {
  //           color: #24292e;
  //         }
  //       }
  //       &.active {
  //         background-color: rgba(0, 0, 0, 0.12);
  //         a {
  //           color: #24292e;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>
