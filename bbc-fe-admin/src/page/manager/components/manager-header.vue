/*
 * @Author: wzy
 * @Desc: 首页头部组件
 */ 

<template>
  <div class="c-header cl">
		<!-- 机构信息 -->
		<section class="m-orgInfo">
      <span>{{orgName}}</span>&nbsp;<i></i>&nbsp;<span>BBC幼儿课堂账号管理平台</span>   
    </section>
		<!-- 管理员信息 -->
		<section class="m-managerInfo fr">超级管理员&nbsp;<span></span>&nbsp;{{userName}}&nbsp;&nbsp;<a @click="logout">退出</a></section>
  </div>
</template>

<script>
import { sessionStorageUtil } from 'lib/util'

export default {
	name: 'manager-header',
	data: function() {
		return {
			orgName: '',
			userName: ''
		}
	},
	mounted: function(){
		this.getData()
	},
	methods: {
    /** 
     * sessionStorage中读取数据  
     */
		getData: function() {
			this.orgName = sessionStorageUtil.get('orgName')
			this.userName = sessionStorageUtil.get('userName')
    },
    
    /** 
     * 退出登录 
     */
		logout: function() {
			this.$router.push('/login')
			sessionStorageUtil.remove('Logined')
		}
	}
}
</script>

<style lang="stylus" scoped>
	.c-header
		width 100%
		height 70px
		background-image url(./img/YM.jpg)
		background-repeat no-repeat
		background-size 100% 100%
		/*机构信息*/
		.m-orgInfo
			display inline-block
			height 100%
			padding-left 30px
			line-height 70px
			font-size 24px
			i
				display inline-block
				width 5px
				height 5px
				border-radius 50%
				background-color white
				vertical-align middle

		/*管理员信息*/
		.m-managerInfo
			padding-right 30px
			height 100%
			line-height 70px
			font-size 16px
			-webkit-user-select none
			-moz-user-select none 
			-ms-user-select none 
			user-select none
			span
				display inline-block
				width 5px
				height 5px
				border-radius 50%
				background-color white
				vertical-align middle 
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
					top 35%
					left 5px
					width 2px
					height 20px
					background-color white
</style>

