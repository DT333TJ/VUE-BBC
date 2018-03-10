/*
 * @Author: wzy
 * @Desc: 添加机构页面组件
 */
<template>
  <div class="c-home">
    <v-header></v-header>
    <org-content></org-content>
  </div>
</template>
 
<script type="text/ecmascript-6">
import OrgContent from './components/org-content'
export default {
  name: 'org',
  components: {
    OrgContent
  }
}
</script>
 
<style lang="stylus" scoped>
  .c-home
    position relative
    width 100%
    height 100%
</style>
 
 