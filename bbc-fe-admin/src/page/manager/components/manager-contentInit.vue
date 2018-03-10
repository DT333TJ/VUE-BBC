/*
 * @Author: wzy
 * @Desc: 首次使用时候添加机构主内容组件
 */

<template>
  <div class="c-init">
    <!-- 机构名称内容 -->
    <header>{{orgName}}</header>
  </div>
</template>

<script>
  import { sessionStorageUtil } from 'lib/util'
  export default {
    name: 'manager-contentInit',
    data: function() {
      return {
        orgName: ''
      }
    },
    mounted: function() {
      this.orgName = sessionStorageUtil.get('orgName')
    }
  }
</script>

<style lang="stylus" scoped>
  .c-init
    position absolute
    left 220px
    top 0
    right 0
    bottom 0
    overflow hidden
    header
      position relative
      margin-top 10px
      margin-left 30px
      height 30px
      line-height 30px
      color #869fb1
      font-size 18px
      &:before
        position absolute
        top 5px
        left -5px
        content ''
        display inline-block
        width 1px
        height 20px
        background-color #869fb1
</style>

