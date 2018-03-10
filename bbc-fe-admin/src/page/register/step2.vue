/*
 * @Author: wzy
 * @Desc: 注册第二步组件
 */
 
<template>
  <div class="c-step2">
    <form class="m-setPwdForm">
      <!-- 新密码 -->
      <div>
        <input type="password" placeholder="请填写6-32位新密码" maxlength="32"  @focus="focusSet" v-model.trim='pass' @blur="setPassword" >
      </div>
      <!--信息区域  -->
      <div class=" fontStyle">{{pwdText}}</div>
      <!-- 确认密码 -->
      <div>
        <input type="password" placeholder="确认密码" maxlength="32" @focus="focusChk" v-model.trim="checkpass" @blur="checkPassword" >
      </div>
      <!--信息区域  -->
      <div class=" fontStyle">
        {{surePwdText}}
        <router-link to="/login" tag="a" class="fr" style="color:white;text-shadow:none;margin-right:30px">登录</router-link>
      </div>
      <!-- 下一步 -->
      <div class="btnDiv">
        <a @click="toNext">下一步</a>
      </div>
    </form>
  </div>
</template>

<script>
import { toRegister } from 'api/register'
import { Base64 } from 'js-base64'
import { sessionStorageUtil, localStorageUtil } from 'lib/util'

export default {
  data: function() {
    return{
      //密码表单
      pass: '',
      checkpass: '',
			form: {
        tel: '',
        code: '',
        password: ''
			},
      pwdText: '',
      surePwdText: '',
      validatePassValue: false,
      validateRepeatPassValue: false
    }
	},
	mounted: function() {
    this.icon()
  },
  methods:{
    /** 
     * 密码框获得焦点 
     */
    focusSet: function() {
      this.pwdText = ''
    },

    /** 
     * 核对密码框获得焦点 
     */
    focusChk: function() {
      this.surePwdText = ''
    },

    /** 
     * 设置步骤条图标 
     */
    icon: function() {
		  this.$parent.step2 = true
		  this.$parent.step1 = false
		  this.$parent.step3 = false
    },

    /** 
     * 设置密码
     */
    setPassword: function() {
      let pattern = /^.{6,20}$/
      if(this.pass === '' || this.pass.length == 0) {
        this.pwdText = '请填写密码'
      } else if(!(this.pass).match(pattern) ) {
        this.pwdText = '请填写6-32位密码'
      }	else {
        this.pwdText = ''
        this.validatePassValue = true
      }
    },

    /** 
     * 确认密码
     */
    checkPassword: function() {
      if(this.checkpass === '' || this.checkpass.length == 0) {
        this.surePwdText = "请填写密码"
        this.validateRepeatPassValue = false
      } else if(this.pass == this.checkpass) {
          this.surePwdText = ""
          this.validateRepeatPassValue = true
        } else{
        this.surePwdText = "两次密码填写不一致"
        this.validateRepeatPassValue = false
			}
    },

    /** 
     * 跳转到下一步
     */
    toNext: function() {
      this.setPassword()
      this.checkPassword()
      if(this.validateRepeatPassValue && this.validatePassValue) {
        this.form.tel = sessionStorageUtil.get('phone')
        this.form.code = sessionStorageUtil.get('code')
        this.form.password = Base64.encode(this.pass)
        toRegister(this.form).then( res => {
          if( res.code === 200 ) {
            localStorageUtil.set("mUname", this.form.tel)
			      localStorageUtil.set("mPwd", this.pass)
            this.$router.push('/register/step3')
          } else {
            this.surePwdText = res.msg
            return false
          }
        })
      } 
    }
  }
}
</script>

<style lang="stylus" scoped>
  .c-step2
    width 380px
    margin -10px auto
    .m-setPwdForm
      margin-top 20px
      .fontStyle
        padding-left 80px
        height 24px
        line-height 24px
        text-shadow #a12121 1px 0 0, #a12121 0 1px 0, #a12121 -1px 0 0, #a12121 0 -1px 0
        text-align left
      div
        text-align center
        padding-right 10px
        input
          width 226px
          height 34px
          padding-left 20px
          border 1px solid white 
          border-radius 21px
      .btnDiv    
        a    
          display inline-block
          width 200px 
          height 39px
          line-height 39px
          padding 0
          font-size 16px
          font-weight bold
          letter-spacing 6px
          text-align center
          color #f1ce30
          text-shadow 0 0 20px #1198b5
          background-image radial-gradient(circle at center, rgb(24, 219, 190),rgb(33, 126, 156))
          border 1px solid #186d97
</style>