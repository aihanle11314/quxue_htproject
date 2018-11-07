<template>
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="index">
        <!-- <span v-if="index===levelList.length-1 || item.path === ''" class="no-redirect">{{item.meta.title}}</span>
        <router-link class="redirect" v-else :to="item.path">{{item.meta.title}}</router-link> -->
        <span class="no-redirect">{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    // levelList: {
    //   type: Array,
    //   default: null
    // }
  },
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      // const first = matched[0]
      // if (first && first.name !== 'home') {
      //   matched = [{path: '/home', meta: { title: '首页' }}].concat(matched)
      // }
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 30px;
    margin-left: 10px;
    margin-top: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    .redirect {
      color: #fdb730;
    }
  }
</style>
