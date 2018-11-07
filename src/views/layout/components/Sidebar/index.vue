<template>
  <scroll-bar>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse"
      background-color="#ece9e9" text-color="#333333" active-text-color="#409EFF">
        <!-- <sidebar-item :routes="routes" class="nest-menu"></sidebar-item> -->
        <sidebar-item :routes="permission_routers" class="nest-menu"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar', 'permission_routers'
    ]),
    routes () {
      return this.$router.options.routes
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key + '--' + keyPath)
    }
  }
}
</script>
