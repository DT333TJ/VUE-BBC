/** 
 * @Desc: 控制中心
 */
<template>
  <div class="control-center">
    <v-header></v-header>
    
    <!-- 侧边栏数据 -->
    <v-nav>
      <v-sub-nav title="园所信息" @click.native="$router.push('/control-center/garden-info')">
      </v-sub-nav>
    </v-nav>

    <!-- 路由 -->
    <content-box>
      <router-view></router-view>
    </content-box>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'ControlCenter',
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .control-center
    position relative
    width 100%
    height 100%
</style>
