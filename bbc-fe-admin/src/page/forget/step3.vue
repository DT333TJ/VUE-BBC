<template>
  <div class="c-step3">
    <section class="m-step3-title">
			重置密码成功,{{time}}秒后跳转登录<br/>
      <a class="btn" @click="toLoginPage">返回登录</a>
		</section>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      time: 5
    }
  },
  // 当前路由离开的时候要清除定时器
	beforeRouteLeave: function(to, from, next) {
		clearInterval(this.invt)
    next()
	},
  created: function(){
    this.icon()
    this.inv()
  },
  methods: {
    /** 
     * 设置图标 
     */
    icon: function() {
      this.$parent.step3 = true
		  this.$parent.step1 = false
		  this.$parent.step2 = false
    },

    /** 
     * 执行跳转到login页面 
     */
    toLoginPage: function() {
      this.time = 0
      this.$router.replace('/login')
    },

    /** 
     * 设置定时器 
     */
    inv: function() {
      this.invt = setInterval( () => {
        this.time > 0 ? this.time-- : (this.time = 0)
        this.time == 0 && this.$router.replace('/login')
      }, 1000)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .c-step3
    width 300px
    height 120px
    margin 20px 0 0 310px

    .m-step3-title
      font-size 18px
      font-weight bold
      text-align center
			.btn
				display inline-block
				width 200px
				height 39px
				line-height 39px
				padding 0
				margin-top 30px
				font-size 16px
				letter-spacing 6px
				text-align center
				color #f1ce30
				text-shadow 0 0 20px #1198b5
				background-image radial-gradient(circle at center, rgb(24, 219, 190),rgb(33, 126, 156))
				border 1px solid #186d97
    
</style>

