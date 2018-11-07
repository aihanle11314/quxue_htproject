<template>
  <el-menu class="navbar" mode="horizontal">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <button class="btnLogout" @click="logout">退出登录</button>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    },
    logout () {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .breadcrumb-container{
    float: left;
  }
  .btnLogout {
    width: 100px;
    height: 40px;
    display: inline-block;
    position: absolute;
    right: 35px;
    outline: none;
    box-shadow: none;
    border: none;
    background-color: #ffffff;
  }
  .btnLogout:active {
    border: none;
  }
}
</style>
