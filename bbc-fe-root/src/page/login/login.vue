/*
 * @Author: wzy
 * @Desc: 登陆页面
 */
<template>
	<div class="c-login">
		<!-- 登录的表单模块 -->
		<div class="m-login-form">
			<el-form :model="rootForm" ref="rootForm" class="s-form" label-width="100px">
				<!-- 账号 -->
				<el-form-item >
					<el-input style="width:300px" type="text" v-model="rootForm.username" placeholder="账号"></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item style="height:72px">
					<el-input style="width:300px" type="password" v-model="rootForm.password" placeholder="密码"></el-input>
					<span v-show="true" style="color:red">{{errorText}}</span>
				</el-form-item>
				<!-- 提交按钮 -->
				<el-form-item style="margin-top:20px">
					<a class="btn" @click="_handleLogin">确定</a>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
 
<script>
import { requestGetToken, requestRefreshToken } from 'api/token'
import { requestGetUserId } from 'api/user'
import { cookieUtil, sessionStorageUtil } from 'lib/util'
import { commonParams } from 'config/constant'
import { Base64 } from 'js-base64'

export default {
  name: 'login',
	data: function() {
		return {
			rootForm: {
			  username: 'root',
				password: '123456',
				usertype: 'ROOT_ADMIN'
			},
      errorText: '',
      password: ''
		}
	},
	methods: {
		/** 
		 * 登录 
		 */
		_handleLogin: function() {
      // 将未加密的密码存储后在进行加密
			const param = {
				username: this.rootForm.username,
				password: Base64.encode(this.rootForm.password),
				usertype: this.rootForm.usertype
			}
      // this.password = this.rootForm.password
      // this.rootForm.password = Base64.encode(this.rootForm.password)
      // 获取token
      this._getToken(param)
        .then( () => {
          // 为了排除base64编码的影响
          this._getUserId()
        })
				.catch( error => {
					this.errorText = error
					return
				})
    },
    
    /** 
     * 获取token 
		 * @param {object} param: 请求的参数
     */
    _getToken: function(param) {
      return requestGetToken(param)
        .then(res=> {
          // 存储token
          cookieUtil.set('token', res, res.expires_in - 60)
          return Promise.resolve(res.refresh_token)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },

    /**
     * 刷新token
     * @param {string} refresh_token：刷新token
     */
    _refreshToken: function(refresh_token) {
      return requestRefreshToken(refresh_token)
        .then(res => {
          // 缓存token
          cookieUtil.set('token', res, res.expires_in - 60)
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },

    /** 
     * 获取用户信息 
     */
    _getUserId: function() {
      return requestGetUserId(this.rootForm)
        .then(data => {
          // 设置登录状态
          sessionStorageUtil.set('Logined', true)
          sessionStorageUtil.set('orgId', data.orgId)
          sessionStorageUtil.set('userId', data.userId)
          // 通过url的参数传递当前机构的名称
          let queryObj = {
            orgId: data.orgId,
            userId: data.userId
					}
					commonParams.orgId = data.orgId
          // 跳转到org,传递orgId和userId参数
          this.$router.push({path: '/org', query: queryObj})
        })
    }
	}
}
</script>
 
<style lang="stylus" scoped>
 .c-login
		position relative
		width 100%
		height 100%
		overflow hidden
		background-image url(./img/rootBg.png)
		background-size 100% 100%

		.m-login-form
			position absolute
			top -30px
			left 50px
			bottom 0
			right 0
			width 940px
			height 521px
			margin auto
			background url(./img/loginformbg.png) no-repeat
			background-size 100% 100%
			@media screen and (max-width:1600px)
				top 30px
				left 80px
				background-size 95%
			.s-form
				position absolute
				top 260px
				left 190px
				width 320px
				@media screen and (max-width:1600px)
					top 240px
					left 160px
				.btn
					display inline-block
					width 200px 
					height 39px
					line-height 39px
					padding 0	
					margin-left 50px
					font-size 16px
					font-weight bold
					letter-spacing 6px
					text-align center
					color #f1ce30
					text-shadow 0 0 20px #1198b5
					background-image radial-gradient(circle at center, rgb(24, 219, 190),rgb(33, 126, 156))
					border 1px solid #186d97			 
</style>
