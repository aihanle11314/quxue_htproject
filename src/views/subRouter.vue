<template>
  <transition name="fade" mode="out-in">
    <!-- <keep-alive :include='cachedViews'> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
  </transition>
</template>

<script>
export default {
  name: 'subRouter',
  computed: {
    cachedViews () {
      // return this.$store.state.tagsView.cachedViews
      return ''
    }
  }
}
</script>
