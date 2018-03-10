/*
 * @Author: wzy
 * @Desc: home主页面组件
 */
<template>
	<!--home页面  -->
	<div class="c-home">
		<manager-header></manager-header>
		<!-- 主要内容 -->
		<div class="m-main">
			<!-- 菜单 通过事件的监听来获得子组件的数据  -->
			<manager-sidebar @setActiveOrgInfo="setActiveOrgInfo" @showInitVue="showInitVue"></manager-sidebar>
			<!-- 初始化时候的主内容区域 -->
			<manager-content-init v-if="hasList"></manager-content-init>
			<!-- 机构数据存在时候的路由切换   -->
			<router-view v-else :activeOrgName="activeOrgName" :activeManagerList="activeManagerList" @setManagerList="setManagerList"></router-view>
		</div>
	</div>
</template>

<script>
import ManagerHeader from './components/manager-header'
import ManagerSidebar from './components/manager-sidebar'
import ManagerContentInit from './components/manager-contentInit'
import ManagerContent from './components/manager-content'
import { requestGetManagers } from 'api/manager'
import { sessionStorageUtil } from 'lib/util'

export default {
	name: 'manager',
  components: {
    ManagerHeader,
    ManagerSidebar,
    ManagerContentInit,
    ManagerContent
  },
	data: function() {
		return {
			hasName: false,
			hasList: false,
			activeOrgName: '',
			activeManagerList: []
		}
	},
	mounted: function() {
    // 查看是否有所辖的机构数据。有数据就不显示init组件
		this.checkData()
	},
	methods: {
		checkData: function() {
      // 如果存在orgList有数据
			(!sessionStorageUtil.get('orgList').length) && (this.hasList = true)
		},

		/** 
		 * sidebar触发的事件 
		 */
		setActiveOrgInfo: function(org) {
			this.activeOrgName = org.orgName
			// 设置当前选中的Id
			sessionStorageUtil.set('activeOrgId', org.orgId) 
			this.getManagers()
		},

		/**
		 * router-view触发的事件 
		 */
		setManagerList: function() {
			this.getManagers()
		},

		
		// 获取所辖的管理员列表
		getManagers: function() {
			return requestGetManagers(sessionStorageUtil.get('activeOrgId'))
				.then( res => {
				if (res.code === 200) {
					this.activeManagerList = res.data.data
				}
			})
		},
		// 通过组件的emit方法来使initVue显示
		showInitVue: function(data) {
			this.hasList = data
		}
	}
}
</script>

<style lang="stylus" scoped>
	.c-home
		position relative
		width 100%
		height 100%
		background-color #f0f3f4
		.m-main
			position absolute
			top 70px
			bottom 0
			left 0
			right 0
</style>

