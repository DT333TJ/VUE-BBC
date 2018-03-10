/*
 * @Desc: 页面上下翻页组件
 */
<template>
  <div class="page-switch">
    <Button 
      size="small"
      :disabled="disabledPrev"
      @click.native="$emit('goPrev')">上一页
    </Button>
    &nbsp;
    <Button 
      size="small"
      :disabled="disabledNext"
      @click.native="$emit('goNext')">下一页
    </Button>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'PageSwitch',
    props: {
      // 禁止上一页
      disabledPrev: {
        type: Boolean,
        default: false
      },
      // 禁止下一页
      disabledNext: {
        type: Boolean,
        default: false
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .page-switch
    position absolute
    right 20px
    bottom 12px
    z-index 99
</style>

