/** 
 * @Desc: 左侧导航
 */
<template>
  <div class="nav-wrapper" ref="wrapper">
    <ul class="nav">
      <slot></slot>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import IScroll from 'iscroll'
  export default {
    name: 'VNav',
    methods: {
      _initIScroll: function() {
        setTimeout(() => {
          this.scroll = new IScroll(this.$refs.wrapper, {
            mouseWheel: true,
            scrollbars: true
          })
        }, 200)
      }
    },
    mounted: function() {
      this._initIScroll()
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .nav-wrapper
    width 260px
    position absolute
    top 84px
    bottom 0
    left 0
    color #fff
    background-image url(./img/nav-bg.png) 
    background-repeat no-repeat 
    background-size cover
    overflow hidden
    .nav
      padding 50px 25px
</style>

