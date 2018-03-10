/*
 * @Author: wzy
 * @Desc: 共同的头部组件（内容是固定不变的）
 */

<template>
  <div class="c-page cl">
  	<section class="m-left ">BBC幼儿课堂&nbsp;<span class="circle"></span>&nbsp;账号管理平台</section>
		<section class="m-right fr">根管理员&nbsp;<span class="circle"></span>&nbsp;root&nbsp;&nbsp;<a @click="_logout">退出<i></i></a></section>
  </div>
</template>
 
<script type="text/ecmascript-6">
export default {
  name: 'v-header',
  methods: {
    /** 
     * 登出 
     */
    _logout: function() {
      sessionStorage.removeItem('Logined')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .c-page
    width 100%
    height 70px
    background-repeat no-repeat
    background-image url(./img/YM.jpg)
    background-size 100% 100%
    .m-left
      display inline-block
      padding-left 30px
      height 100%
      line-height 70px
      font-size 24px
      color #fff
      .circle
        display inline-block
        width 5px
        height 5px
        background-color white
        border-radius 50%
        vertical-align middle	
    .m-right
      height 100%
      padding-right 40px
      line-height 70px
      font-size 16px
      color #fff
      -webkit-user-select none
      -moz-user-select none 
      -ms-user-select none 
      user-select none
      a
        position relative
        display inline-block
        padding-right 30px
        padding-left 20px
        color white
        /*使用伪元素制作竖线,代替图片*/
        &:before
          content ''
          position absolute
          top 32%
          left 5px
          width 2px
          height 25px
          background-color white
        i
          display inline-block
          vertical-align middle
          width 12px
          height 14px
          margin-left 10px
          background url(./img/quit.png) no-repeat 100%	
      .circle
        display inline-block
        width 5px
        height 5px
        background-color white
        border-radius 50%
        vertical-align middle	
</style>
 
 