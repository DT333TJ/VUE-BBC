/*
 * @Author: wzy
 * @Desc: 注册第一步组件
 */

<template>
  <div class="c-step1">
    <form class="m-form" >
      <div>
        <input class="tel" type="text" placeholder="手机号" maxlength="11" v-model.trim="tel" @blur="validateTel" @focus="focusTel">
      </div>
      <div class="infoText">{{infoText}}</div>
      <div>
        <input class="tel" type="text" maxlength="6" placeholder="邀请码" v-model.trim="code" @blur="validateCode" @focus="focusCode">
      </div>
      <div class="infoText">
        <span class="fl" style="display:inline-block;height:30px; line-height: 30px;margin-right:30px;width:130px">{{codeText}}</span>
        <a class="fl"  style="margin-right:10px" @click="dialogVisible = true">如何获取邀请码？</a>
        <router-link to="/login" tag="a" class="fl" >登录</router-link>
      </div>
      <div class="btn">
        <a @click="toNext">下一步</a>
      </div>  
    </form>
    <el-dialog  :visible.sync="dialogVisible" size="tiny" >
      <span style="color:black;text-shadow:none;font-size:16px">请联系管理员，获取邀请码</span>
      <span slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkSmsForRegistration } from 'api/register'
import { sessionStorageUtil } from 'lib/util'

export default {
  data: function() {
    return{
      tel: '',
      code: '',
      //提交的表单
      form: {
        tel: '',
        code: '',
      },
      infoText: '',
      sendValue: '获取验证码',
      codeText: '',
      validateTelValue: false,
      validateCodeValue: false,
      disabledflag: false,
      dialogVisible: false
    }
  },
  methods:{
    /** 
     * 手机号框获得焦点 
     */
    focusTel: function() {
      this.infoText = ''
    },

    /** 
     * 验证码框获得焦点 
     */
    focusCode: function() {
      this.codeText = ''
    },

    /** 
     * 验证手机 
     */
    validateTel: function() {
      let pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if(this.tel === '' || this.tel.length == 0) {
        this.infoText = "请填写手机号"
      } else {
        if (!(this.tel).match(pattern) || this.tel.length != 11 ) {
					this.infoText = '请填写正确的手机号';
				} else {
					this.infoText = '';
					this.validateTelValue = true;
				}
      }
    },
    
    /** 
     * 验证码检测 
     */
    validateCode: function() {
      if(this.code === '' || this.code.length == 0) {
        this.codeText = '请填写邀请码'
        this.validateCodeValue =false
      } else {
        if(this.code.length != 6) {
          this.codeText = '请填写6位邀请码'
          this.validateCodeValue =false
        } else {
          this.codeText = ''
          this.validateCodeValue =true
        }
      }
    },
    
    /** 
     * 跳转到下一步
     */
    toNext: function() {
      this.validateTel()
      this.validateCode()
      // 赋值给提交的表单
      this.form.tel = this.tel
      this.form.code = this.code
      if(this.validateTelValue && this.validateCodeValue) {
        checkSmsForRegistration(this.form).then( res => {
          switch (res.code){
            case 200:
              sessionStorageUtil.set('phone', this.form.tel)
              sessionStorageUtil.set('code', this.form.code)
              this.$parent.step1 = false
              this.$router.replace('/register/step2')
              break
            case 202:
              this.codeText = res.msg
              break
            case 203:
              this.codeText = res.msg
              break
            case 206:
              this.codeText = res.msg
              break
            default:
              this.codeText = '手机号或邀请码错误'
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .c-step1
    width 450px
    height 150px
    margin 0 auto

    .m-form
      /*手机号的文本信息*/
      .infoText
        height 30px
        line-height 30px
        text-align left
        padding-left 100px
        text-shadow #a12121 1px 0 0, #a12121 0 1px 0, #a12121 -1px 0 0, #a12121 0 -1px 0
        a
          color white
          text-shadow none
      div
        text-align center
        /*验证码、手机号输入框*/
        .tel  
          width 226px
          height 34px
          margin-right 20px
          padding-left 20px 
          border none
          border-radius 21px
      .btn  
        a
          display inline-block
          width 200px 
          height 39px
          line-height 39px
          padding 0
          margin-left -20px	
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

