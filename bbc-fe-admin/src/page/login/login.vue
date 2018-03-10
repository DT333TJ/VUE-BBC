/*
 * @Author: wzy
 * @Desc: 登陆页面
 */
<template>
	<div class="c-login">
		<!-- tv模块-->
		<div class="m-tv">
			<div class="s-tv-line" id="imgLeft"></div>
			<div class="s-tv-line" id="imgRight"></div>
			<div id="img1"></div>
			<div id="img2"></div>
		</div>
		<!-- form模块 -->
		<div class="m-loginform">
			<form>
				<!-- 用户 -->
				<div class="s-input">
					<i class="loginuser"></i>
          <input 
            type="text" 
            maxlength="11" 
            :class="{focus:isfocus1}" 
            v-model.trim="username" 
            placeholder="手机号"  
            @focus="focus(1)" 
            @blur="checkValue(1)" 
            required />
					<span class="messageSpan">{{userText}}</span>
				</div>
				<!-- 密码 -->
				<div class="s-input">
					<i class="loginpwd"></i>
					<!-- 使用@keyup.enter实现在密码输入完全后的回车键登录 password-->
					<input 
						type="password" 
						:class="{focus:isfocus2}" 
						v-model.trim="password" 
						maxlength="32" 
						placeholder="密码" 
						@focus="focus(2)" 
						@blur="checkValue(2)" 
						required />
					<span class="messageSpan">{{pwdText}}</span>
				</div>
				<!-- 记住密码 -->
				<div class="s-check cl">
					<div class="fl" @click="rememberPwd">
						<i :class="{checked:ischecked}"></i>
						<span>记住登录密码</span>
					</div>
					<router-link to="/forget" tag="div" class="fr" style="margin-right:5px;font-size:16px">忘记密码?</router-link>
					<router-link to="/register" tag="div" class="fr" style="margin-right:5px;font-size:16px">注册</router-link>
				</div>
				<!-- 提交 -->
				<div class="s-submit">
					<a @click="_handleLogin">确定</a>
				</div>
			</form>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { requestGetToken, requestRefreshToken } from 'api/token'
import { requestGetUserId, requestGetUserInfo } from 'api/user'
import { requestGetOrgInfo, requestGetOrgList } from 'api/org'
import { cookieUtil, sessionStorageUtil, localStorageUtil } from 'lib/util'
import { Base64 } from 'js-base64'

export default {
  name: 'login',
	data: function() {
		return {
			username: '',
			password: '',
			//登录表单
			loginForm: {
				username: '',
				password: ''
			},
			userText: '',
			pwdText: '',
			isfocus1: false, //通过isfocus1来实现对placeholder文字的颜色控制
			isfocus2: false,
			ischecked: false,
			isLogin: false,
			validateUserValue: false,
			validatePwdValue: false,
			patternPwdValue: false
		}
	},
	created: function() {
		//如果存在localStorage存储username,就提取存储
		(localStorageUtil.get('mUname')) && (this.username = localStorageUtil.get('mUname'));
		(localStorageUtil.get('mPwd')) && (this.password = localStorageUtil.get('mPwd'));
		(localStorageUtil.get('isChk')) && (this.ischecked = localStorageUtil.get('isChk'));
	},
	methods: {
    /** 
     * 获得焦点 
     */
		focus: function(n) {
      switch (n) {
        case 1:
          this.userText = ''
          break
        case 2:
          this.pwdText = ''  
      }
    },
    
    /** 
     * 失去焦点事件
     */
		checkValue: function(n) {
			//n==1 用户
			if (n == 1) {
				this.isfocus1 = false;
				this.validateUser();
			}
			// n==2 密码
			if (n == 2) {
				this.isfocus2 = false;
				this.validatePwd();
			}
    },
    
    /** 
     * 记住密码
     */
		rememberPwd: function() {
			this.ischecked = !this.ischecked
    },
    
    /** 
     * 验证用户
     */
		validateUser: function() {
			let patternTel = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/  
			// console.log(this.username.match(pattern))
			if (this.username === '' || this.username.length == 0) {
				this.userText = '请填写手机号'
			} else if ( patternTel.test(this.username) && this.username.length === 11) {
				this.userText = ''
				this.validateUserValue = true
			} else {
				this.userText = '请填写正确的手机号'
				this.validateUserValue = false
			}
    },
    
    /** 
     * 验证密码
     */
		validatePwd: function() {	
			let pattern = /^.{6,32}$/; //密码长度6到32位字符			
			if (this.password === '' || this.password.length == 0) {
				this.pwdText = '请填写密码'
				this.validatePwdValue = false
			} else if (!pattern.test(this.password)){
				this.pwdText = '请填写6-32位密码'
				this.patternPwdValue = false
			} else {
				this.pwdText = ''
				this.validatePwdValue = true
			}
    },
    
    /** 
     * 设置localStorage
     */
		setLocalStorage: function() {
			localStorageUtil.set("mUname", this.username)
			localStorageUtil.set("mPwd", this.password)
			localStorageUtil.set('isChk', this.ischecked)
    },
    
    /** 
     * 登入 
     */
		_handleLogin: function() {
			this.validateUser()
			this.validatePwd()
			if (this.validateUserValue && this.validatePwdValue) {
				// 登陆时候保存正确的帐号和密码
        this.ischecked && this.setLocalStorage()
				this.loginForm.username = this.username
				this.loginForm.password = Base64.encode(this.password)
				this._getToken()
					.then( () => {
            this.loginForm.password = this.password
						// 获取用户Id
						this._getUserId()
							.then( () => {
								// 请求获得账号信息
								this._getUserInfo()
									.then( () => {
										// 请求获得机构信息
										this._getOrgInfo()
											.then( () => {
												// 通过orgId获取机构列表
												this._getOrgList()
													.then( () => {
														//跳转到index
														this.$router.push('/manager')	
													})
											})
									})
							})
					})
					
			} 
		},

		/** 
		 * 获取token 
		 */
		_getToken: function() {
			return requestGetToken(this.loginForm)
				.then( res => {
					cookieUtil.set('token', res, res.expires_in - 60)
					return Promise.resolve(res.refresh_token)
					})
				.catch( error => {
					this.pwdText = '手机号或密码错误'
					return Promise.reject(error)
				})
		},

		/**
     * 刷新token
     * @param {string} refresh_token：刷新token
     */
    _refreshToken: function(refresh_token) {
      return requestRefreshToken(refresh_token)
        .then(res => {
          // cookie缓存token
          cookieUtil.set('token', res, res.expires_in - 60)
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },

		/** 
		 * 获取用户Id
		 */
		_getUserId: function() {
			return requestGetUserId(this.loginForm)
				.then(res => {
					if (res.code === 200) {
						sessionStorageUtil.set('orgId', res.orgId)
						sessionStorageUtil.set('userId', res.userId)
					}
				})
				.catch(err => {
					return Promise.reject(err)
				})
		},

		/** 
		 * 请求获得账号信息 
		 */
		_getUserInfo: function() {
			return requestGetUserInfo(sessionStorageUtil.get('userId'))
				.then( res => {
					if (res.code === 200) {
						sessionStorageUtil.set('userInfo', res.data.admin)
						sessionStorageUtil.set('userName', res.data.admin.nickName)
					}
				})
				.catch(err => {
					return Promise.reject(err)
				})
		},

		/** 
		 * 请求获得机构信息 
		 */
		_getOrgInfo: function() {
			// 通过orgId获取组织的信息
			return requestGetOrgInfo(sessionStorage.getItem('orgId'))
				.then( res => {
					sessionStorageUtil.set('orgInfo', res.data.org)
					sessionStorageUtil.set('orgName', res.data.org.orgName)
					sessionStorageUtil.set('Logined', true)
				})
				.catch(err => {
					return Promise.reject(err)
				})
		},

		/** 
		 * 请求获得机构列表
		 */
		_getOrgList: function() {
			return requestGetOrgList(sessionStorageUtil.get('orgId'))
				.then( res => {
					if (res.code === 200) {
						sessionStorageUtil.set('orgList', res.data.list)
					}
				})
				.catch(err => {
					return Promise.reject(err)
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
	background url(./img/loginbg.png) no-repeat 100% 100%
	/*电视模块*/
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
			bottom 76px
			left 90px
			width 242px
			height 110px
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
				bottom 70px
				left 75px
				background-size 80%


	/* 表单模块*/
	.m-loginform
		position absolute
		top 0
		left 0
		bottom 0
		right 0
		width 940px
		height 521px
		margin auto
		background url(./img/loginformbg.png) no-repeat
		background-size 100% 100%
		animation shake 20s infinite linear both
		@media screen and (max-width:1600px)
			top 30px
			left 80px
			background-size 95%
		&:hover
		/*移上去动画停止 */
			animation-play-state paused
			@keyframes shake
				0%, 100%
					transform translateY(0)
				10%, 30%, 50%, 70%, 90%
					transform translateY(-15px)
				20%, 40%, 60%, 80%
					transform translateY(15px)
		form
			position absolute
			top 230px
			left 310px
			width 320px
			@media screen and (max-width:1600px)
				left 290px
				top 220px
			/* 记住密码区域*/
			.s-check
				height 30px
				line-height 30px
				padding-left 10px
				margin-top 3px
				div
					cursor pointer
					i 
						display inline-block
						width 26px
						height 26px
						vertical-align middle
						margin-top -6px
						margin-right 4px
						background-size 100%
						background url(./img/bordericon.png) no-repeat
					i.checked
						background-image url(./img/chkicon.png)
            background-repeat no-repeat
						background-size 100%
					span
						font-size 16px

			/*输入框的区域*/
			.s-input
				position relative
				margin-bottom 9px
				height 64px
				span.messageSpan
					display block
					height 20px
					width 100%
					line-height 20px
					padding-left 10px
					text-shadow #a12121 1px 0 0, #a12121 0 1px 0, #a12121 -1px 0 0, #a12121 0 -1px 0 //文字描边
				i
					position absolute
					top 8px
					left 16px
					display inline-block
					width 28px
					height 28px
				i.loginuser
					background url(./img/loginusericon.svg) no-repeat
				i.loginpwd
					background url(./img/loginpwdicon.svg) no-repeat
				input
					display inline-block
					width 263px
					height 42px
					padding-left 55px
					border 1px solid #ffffff
					border-radius 21px
					transition borderColor .5s ease 
					&:focus
						border-color #a9d0db
				.focus::-webkit-input-placeholder
					color #178faf

			/*提交按钮的区域*/
			.s-submit
				width 100% 
				height 40px
				margin-top 10px
				text-align center
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

