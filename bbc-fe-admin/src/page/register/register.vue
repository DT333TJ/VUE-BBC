/*
 * @Author: wzy
 * @Desc: 注册组件
 */

<template>
  <div class="c-forget">
		<div class="m-tv">
      <div class="s-tv-line" id="imgLeft"></div>
      <div class="s-tv-line" id="imgRight"></div>
      <div id="img1"></div>
      <div id="img2"></div>
    </div>
		<!-- form模块 -->
		<div class="m-forget">
      <header class="m-forget-header">
        <!-- 步骤的图标区域 -->
        <section class="s-forget-mark">
          <div class="mark" :class="{normal: !step1, click: step1}" >1</div>
          <div class="line">
            <ul><li></li><li></li><li></li></ul>
          </div>
          <div class="mark" :class="{normal: !step2, click: step2}">2</div>
          <div class="line" >
            <ul><li></li><li></li><li></li></ul>
          </div>
          <div class="mark" :class="{normal: !step3, click: step3}">3</div>
        </section>
        <!-- 步骤的字体区域 -->
        <section class="s-forget-font">
          <div>身份验证</div>
          <div>设置密码</div>
          <div>注册成功</div>
        </section>
      </header>

      <transition name="fade">
        <router-view ></router-view>
      </transition>
    </div> 
	</div>
</template>

<script>
export default {
  data: function() {
    return{
      isRouter : false,
      step1 : true,
      step2 : false,
      step3 : false
    }
  }, 
  watch:{
    '$route': function (to,from) {
      this.isRouter = true;
    }
  }
}
</script>

<style lang="stylus" scoped>
  .c-forget
    position relative
    top 0
    bottom 0
    width 100%
    height 100%
    background url(./img/loginbg.png) no-repeat 100% 100%

    /* 电视模块*/
    .m-tv
      position absolute
      left 5%
      width 409px
      height 310px
      animation top 1.5s ease
      @keyframes top 
        from 
          top -410px
        to
          top 0px
      @keyframes rotate
        0% 
          transform rotateX(0deg)
        100%
          transform rotateX(360deg)
      div	
        position absolute
      .s-tv-line
        top 0
        // z-index 9
      /*左侧杆*/	
      #imgLeft
        left 0
        width 39px
        height 163px
        background-image url(./img/lineleft.png)
        background-repeat no-repeat
        background-size 100%
      /*右侧杆*/				
      #imgRight 
        right 0
        width 28px
        height 153px
        background-image url(./img/lineright.png)
        background-repeat no-repeat
        background-size 100%
      @media screen and (max-width:1600px)
        #imgRight
          right 72px	
      /*电视机3D翻转*/
      #img1
        top 40px
        left 35px
        width 351px
        height 249px
        background-image url(./img/tv.png)
        background-repeat no-repeat
        background-size 100%
        transform-origin 50%
        animation rotate 2s ease
      @media screen and (max-width:1600px)
        #img1
          top 65px
          left 34px
          width 280px
          height 200px
          background-image url(./img/smalltv.png)

      /*字体*/		
      #img2 
        bottom 80px
        left 90px
        width 242px
        height 102px
        background-image url(./img/font.png)
        background-repeat no-repeat
        background-size 100%
        animation show 1s ease 1s both 
        @keyframes show
          0% 
            transform scale(0)
          100%
            transform scale(1)
        @media screen and (max-width:1600px)
          // bottom 90px
          left 75px
          background-size 80%
     
    /* 表单模块*/
    .m-forget
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      margin auto
      width 940px
      height 521px
      background url(./img/loginformbg.png) no-repeat
      .m-forget-header
        height 80px
        padding-top 220px
        .s-forget-mark
          padding-left 330px
          div
            display inline-block
          .mark
            width 50px
            height 50px
            line-height 45px
            font-size 15px
            text-align center
            font-family '微软雅黑'
            background-repeat no-repeat
            background-position center 
            background-size 100%   
          .normal
            background-image url(./img/normal.png)   
          .click
            background-image url(./img/click.png) 
          /* 圆圈区域 */
          .line
            li
              display inline-block
              width 5px
              height 5px
              margin 0 5px
              border-radius 50%
              background-color #90ddd8
        .s-forget-font
          padding-left 310px
          div
            display inline-block
            width 100px
            height 20px
            line-height 20px
            text-align center
            font-size 16px      
</style>



