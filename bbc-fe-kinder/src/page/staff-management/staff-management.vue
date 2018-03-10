/** 
 * @Desc: 职工管理
 */
<template>
  <div class="staff-management">
    <v-header></v-header>
    <!-- 侧边栏数据 -->
    <v-nav>
      <v-sub-nav title="职工明细">
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
    name: 'StaffManagement'
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .staff-management
    position relative
    width 100%
    height 100%
    
</style>
