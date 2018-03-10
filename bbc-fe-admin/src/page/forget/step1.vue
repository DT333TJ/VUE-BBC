<template>
  <div class="c-step1">
    <form class="m-form" >
      <div>
        <input class="tel" style="width: 275px" type="text" maxlength="11" placeholder="手机号码" v-model.trim="tel" @focus="focusTel" @blur="validateTel">
      </div>
      <div class="infoText">{{infoText}}</div>
      <div>
        <input class="tel" type="text" placeholder="验证码" maxlength="6" v-model.trim="code"  @focus="focusCode" @blur="validateCode">
        <input class="btn" :class="{show: !disabledflag}" type="button" v-model="sendValue"  @click="sendCode($event)">
      </div>

      <div class="infoText">
        {{codeText}}
        <router-link to="/login" tag="a" class="fr" style="color:white;text-shadow:none">登录</router-link>
      </div>

      <div class="btnDiv" style="margin-top:8px;text-align:center">
        <a @click="toNext">下一步</a>
      </div>
    </form>
  </div>
</template>

<script>
import { sendForgetMessage, checkSmsForModifyPassword } from '@/api/forget'
import { sessionStorageUtil } from 'lib/util'

export default {
  data: function() {
    return{
      tel: '',
      infoText: '',
      sendValue: '获取验证码',
      code: '',
      codeText: '',
      validateTelValue: false,
      validateCodeValue: false,
      disabledflag: false,
      form: {
        tel: '',
        code: ''
      }
    }
  },
  methods:{
    /** 
     * 手机号框获得焦点 
     */
    focusTel: function() {
      this.infoText = ""
    },

     /** 
     * 验证码框获得焦点 
     */
    focusCode: function() {
      this.codeText = ""
    },

     /** 
     * 验证手机号码
     */
    validateTel: function() {
      let pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//手机验证
      if(this.tel === '' || this.tel.length == 0) {
        this.infoText = "请填写手机号"
      } else if (!(this.tel).match(pattern) || this.tel.length != 11 ) {
				this.infoText = '请填写正确的手机号';
			} else {
				this.infoText = '';
				this.validateTelValue = true;
			}
    },

    /** 
     * 验证码检测
     */
    validateCode: function() {
      if(this.code === '' || this.code.length == 0) {
        this.codeText = '请填写验证码'
      } else {
        if(this.code.length != 6) {
          this.codeText = '请填写6位验证码'
        } else {
          this.codeText = ''
          this.validateCodeValue =true
        }
      }
    },

    /** 
     * 获取验证码
     */
    sendCode: function(event) {
      // 先验证手机号是否填写
      this.validateTel()
      if (this.validateTelValue) {
        //记住异步操作时候要用self替代this
        let self = this;
        this.sendValue = '60秒后重新获取'
        this.disabledflag = true
        //设置不可点击
        event.target.disabled = "disabled"
        let lopper = setInterval(function(){
          self.disabledflag = false
          event.target.disabled = false
          self.sendValue = "获取验证码"
          clearInterval(lopper)
        }, 60000)
        this._handleSend()
      }
    },

    /** 
     * 发送验证码方法 
     */
    _handleSend: function() {
      sendForgetMessage(this.tel)
        .then( res => {
          if ( res.code === 200) {
            this.infoText = '短信已发送，请查看'
          } else if ( res.code === 500) {
            this.infoText = '当天发送次数已达上限'
          } else {
            this.infoText = res.msg
          }
        })
    },

    /** 
     * 跳转到下一步
     */
    toNext: function() {
      this.validateTel()
      this.validateCode()
      if(this.validateTelValue && this.validateCodeValue) {
        this.form.tel = this.tel
        this.form.code = this.code
        checkSmsForModifyPassword(this.form).then( res => {
          if( res.code === 200) {
            sessionStorageUtil.set('phone', this.form.tel)
            sessionStorageUtil.set('code', this.form.code)
            this.$parent.step1 = false
            this.$parent.step2 = true
            this.$router.replace('/forget/step2')
          } else {
            this.codeText = res.msg
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .c-step1
    width 300px
    height 150px
    margin 0 auto

    .m-form
      /*手机号的文本信息*/
      .infoText
        height 25px
        line-height 25px
        padding-left 20px
        text-shadow #a12121 1px 0 0, #a12121 0 1px 0, #a12121 -1px 0 0, #a12121 0 -1px 0
      div
        /*验证码、手机号输入框*/
        .tel  
          width 120px
          height 34px
          margin-right 10px
          padding-left 10px 
          border none
          border-radius 21px
          // &::-webkit-input-placeholder
          //   color #178faf
          //   font-weight bold
        /*验证码请求按钮*/    
        .btn
          width 143px
          height 34px
          border none
          border-radius 21px
          color white
          font-size 16px
          font-family 'shaoer' 
          cursor pointer
          &:hover
            opacity 0.8
        .show
          background-color #1acab8
        
        /*下一步*/
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
        /*验证码的文本信息*/  
				span
          text-shadow #a12121 1px 0 0, #a12121 0 1px 0, #a12121 -1px 0 0, #a12121 0 -1px 0	
</style>

