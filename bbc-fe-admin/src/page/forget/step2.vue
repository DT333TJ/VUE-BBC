<template>
  <div class="c-step2">
    <form class="m-setPwdForm">
      <!-- 新密码 -->
      <div>
        <input type="password" placeholder="请填写6-32位新密码" maxlength="32" v-model.trim='pass' @focus="focusSet" @blur="setPassword">
      </div>
      <!--信息区域  -->
      <div class=" fontStyle">{{pwdText}}</div>
      <!-- 确认密码 -->
      <div>
        <input type="password" placeholder="确认密码" v-model.trim="checkpass" @focus="focusChk" @blur="checkPassword">
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
import { Base64 } from 'js-base64'
import { modifyPassword } from 'api/forget'
import { sessionStorageUtil, localStorageUtil } from 'lib/util'

export default {
  data: function() {
    return{
      pass: '',
      checkpass: '',
      pwdText: '',
      surePwdText: '',
      validatePassValue: false,
      validateRepeatPassValue: false,
      form: {
        phone: '',
        code: '',
        password: ''
      }
    }
  },
  mounted: function() {
    this.icon()
  },
  methods:{
    /** 
     * 设置密码获得焦点 
     */
    focusSet: function() {
      this.pwdText = ""
    },

    /** 
     * 核对密码获得焦点 
     */
    focusChk: function() {
      this.surePwdText = ""
    },

    /** 
     * 字体样式 
     */
    icon: function() {
      this.$parent.step2 = true
		  this.$parent.step1 = false
		  this.$parent.step3 = false
    },
    
    /** 
     * 设置新的密码 
     */
    setPassword: function() {
      let pattern = /^.{6,32}$/ //密码长度3到32位字符
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
      } else if(this.pass != this.checkpass) {
        this.surePwdText = "两次密码填写不一致"
        this.validateRepeatPassValue = false
      } else {
        this.surePwdText = ''
        this.validateRepeatPassValue = true
      }
    },

    /** 
     * 跳转下一步
     */
    toNext: function() {
      //验证
      this.setPassword()
      this.checkPassword()
      if(this.validateRepeatPassValue && this.validatePassValue) {
        sessionStorageUtil.get('phone') && (this.form.phone = sessionStorageUtil.get('phone'))
        sessionStorageUtil.get('code') && (this.form.code = sessionStorageUtil.get('code'))
        this.form.password =  Base64.encode(this.pass)
        modifyPassword(this.form)
          .then( res => {
            if ( res.code === 200) {
              localStorageUtil.set("mUname", this.form.phone)
              localStorageUtil.set("mPwd", this.pass)
              this.$parent.step2 = false
              this.$router.replace('/forget/step3')
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
    margin 0 auto

    .m-setPwdForm
      .fontStyle
        padding-left 80px
        height 30px
        line-height 30px
        text-shadow #a12121 1px 0 0, #a12121 0 1px 0, #a12121 -1px 0 0, #a12121 0 -1px 0
        text-align left
      div
        text-align center
        input
          width 226px
          height 30px
          padding-left 20px
          border 1px solid white 
          border-radius 21px
          // &::-webkit-input-placeholder
          //   color #178faf
          //   font-weight bold
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