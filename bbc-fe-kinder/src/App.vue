<template>
  <div id="app" class="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app
    position relative
    width 100%  
    height 100%
    background url(./image/bg.png) no-repeat
</style>

