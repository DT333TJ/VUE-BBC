/** 
 * @Desc: 内容区包裹盒子组件
 */
<template>
  <div class="content-box">
    <div class="content-box-inner" :style="innerStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'ContentBox',
    props: {
      // 内部是否白色盒子，默认true
      whiteInner: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      innerStyle: function() {
        let style = {}
        if (this.whiteInner) {
          style = {
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.2),inset 0px 1px 2.55px 0.45px rgba(169, 159, 136, 0.65)'
          }
        }
        return style
      }
    }, 
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .content-box
    position absolute
    padding 20px
    top 114px
    right 50px
    bottom 30px
    left 310px
    border-radius 10px
    background-color rgb(255, 249, 235)
    box-shadow 0px 0px 15px 0px rgba(0, 0, 0, 0.2),inset 0px 0px 5px 0px rgba(0, 0, 0, 0.15)
    .content-box-inner
      width 100%
      height 100%
      border-radius 5px

  @media screen and (max-width: 1700px)
    .content-box
      top 84px
      right 0
      bottom 0
      left 250px
      padding 10px
</style>
