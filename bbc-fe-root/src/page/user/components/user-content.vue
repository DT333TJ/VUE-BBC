/*
 * @Author: wzy
 * @Desc: 添加超级管理员内容组件
 */

<template>
	<div class="c-usercontent cl">
		<!-- 左侧的返回首页链接和当前机构的机构名称 -->
		<section class="m-usercontent-info">
			<a @click="_toHome">首页</a>
			<span>></span>
			<span style="height:30px;color:black">{{activeOrgName}}</span>
		</section>
		<!-- 右侧的添加超级管理员按钮 -->
		<section class="m-usercontent-btn fr" @click="dialogAddVisible = true">
			<i></i>添加超级管理员
		</section>

		<!-- 表格区域 -->
		 <section class="m-usercontent-table">
			 <!-- 表格 -->
			 <el-table :data="tableData"  stripe style="width: 100%">
				<!-- id -->
				<el-table-column align="center" prop="userId" label="ID">
					<template slot-scope="scope">
						<span>{{ scope.row.userId }}</span>
					</template>
				</el-table-column>
				<!-- 账号 -->
				<el-table-column align="center" prop="phone" label="账号/联系电话">
					<template slot-scope="scope">
						<span>{{ scope.row.phone}}</span>
					</template>
				</el-table-column>
				<!-- 联系人 -->
				<el-table-column align="center" prop="nickName" label="联系人">
					<template slot-scope="scope">
						<span>{{ scope.row.nickName }}</span>
					</template>
				</el-table-column>
				<!-- 状态 -->
				<el-table-column align="center" prop="status" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 'ENABLE' " style="color:green">启用</span>
						<span v-else-if="scope.row.status == 'DISABLE' " style="color:red">禁用</span>
						<span v-else-if="scope.row.status == 'PENDING' ">待激活</span>
						<span v-else style="color:blue">待确认</span>
					</template>
				</el-table-column>
				<!-- 操作 -->
				<el-table-column align="center" prop="action" label="操作" width="300px">
					<template slot-scope="scope">
						<!-- 编辑 -->
						<i class="el-icon-edit" :style="iconStyle" @click="_handleEdit(scope.$index, scope.row)"></i>
						<!-- 删除 -->
						<i class="el-icon-delete" style="color:red" :style="iconStyle" @click="_deleteButtonClick(scope.$index, scope.row)"></i>
						<!-- 发送验证信息 -->
						<i class="el-icon-message" :style="iconStyle" v-if="scope.row.status != 'ENABLE'" @click="_messageButtonClick(scope.$index, scope.row)"></i>
					</template>
				</el-table-column>
			</el-table>
		 </section>

		<!-- 添加超级管理员对话框 -->
		<el-dialog title="添加超级管理员" :visible.sync="dialogAddVisible"  :before-close="_handleClose">
      <!-- 添加幼儿园的表单 -->
      <el-form ref="addSuperForm" :model="addSuperForm" :rules="addrules" label-width="150px">
        <el-form-item label="管理员账号" prop="phone">
          <el-input v-model="addSuperForm.phone" style="width:300px;" placeholder="请填入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="linkName">
          <el-input v-model="addSuperForm.linkName" style="width:300px;" placeholder="请填入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item >
          <el-checkbox v-model="toSendValue" @change="autoSend">提交时自动发送邀请码</el-checkbox>
          <!-- <input type="checkbox" style="display:inline-block;margin-right:5px;vertical-align:middle;" id="chk" v-model="toSendValue">
					<label for="chk" style="height:36px;line-height:36px;display:inline-block;cursor:pointer">提交时发送邀请码</label> -->
				</el-form-item>
        <el-form-item style="text-align:right;margin-bottom:0;margin-top:40px;padding-right:40px">
          <el-button type="primary" @click="_submitAddForm('addSuperForm')">确定</el-button>
          <el-button @click="_resetAddForm('addSuperForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
		<!-- 修改超级管理员的dialog ，注意:before-close="handleClose"来设置错号关闭时候的清空函数-->
    <el-dialog title="修改超级管理员信息" :visible.sync="dialogEditVisible"  :before-close="_handleClose">
      <!-- 修改幼儿园的表单 -->
      <el-form ref="editSupperForm" :model="editSupperForm" :rules="editrules" label-width="150px">
				<el-form-item label="联系人姓名" prop="linkName">
          <el-input v-model="editSupperForm.linkName" style="width:300px;" placeholder="请填入联系人姓名"></el-input>
        </el-form-item>
				<el-form-item label="管理员账号" prop="phone">
          <el-input v-model="editSupperForm.phone" style="width:300px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;margin-bottom:0;margin-top:20px">
          <el-button type="primary" @click="_submitEditForm('editSupperForm')">提交</el-button>
          <el-button @click="_resetEditForm('editSupperForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
		<!-- 删除当前的超级管理员 -->
    <el-dialog title="删除超级管理员账号" :visible.sync="dialogDeleteVisible">
      <p style="padding-left:50px">是否删除管理员账号：<span style="color:red">{{deleteForm.email}}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_deleteManager">确 定</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
	</div>
</template>
 
<script type="text/ecmascript-6">
import { requestGetManagerList, requestAddManager, requestDeleteManager, requestPatchManager, requestSendMessage } from 'api/manager'
import { requestCheckPhone } from 'api/checkExist'
import { sessionStorageUtil } from 'lib/util'

export default {
	name: 'user-content',
	data: function() {
		var validateTel = (rule, value, callback) => {
			let pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ //手机验证
			// 发出验证是否存在的请求
			requestCheckPhone(this.addSuperForm.phone).then( data => { 
        if(!value) {
          callback(new Error('请填写手机号'))
        } else if(!value.match(pattern)) {
          callback(new Error('请填写正确的手机号'))
        } else if(data){
          callback('此账号已存在')
        } else{  
          callback()
        }
			})
		}
		return {
			// 当前机构的名称
			activeOrgName: '',
			// 当前机构的ID
			activeOrgId: '',
			toSendValue: true,
			//icon的样式
			iconStyle: 'font-size:16px;cursor:pointer;padding:5px',
			//表格数据的数组集合
			tableData: [],
			// 添加超级管理员flag,表单,验证规则
			dialogAddVisible: false,
			addSuperForm: {
				linkName: '',
        phone: '',
				isSend: 1,
				activeOrgId: ''
			},
			addrules: {
				linkName: [
					{ required: true, message: '请填写联系人名称', trigger: 'blur'}
				],
				phone: [
					{ required: true, message: '请填写联系电话', trigger: 'blur' },
					{ validator: validateTel, trigger: 'blur' }
				]
			},
			// 修改的相关数据
			dialogEditVisible: false,
			editSupperForm: {
				email: '',
				linkName: '',
				phone: '',
				orgId: '',
				userId: ''
			},
			editrules: {
				linkName: [
					{ required: true, message: '请输入联系人名称', trigger: 'blur'}
				]
			},
			//删除相关的数据
			dialogDeleteVisible: false,
			deleteForm: {
				userId: '',
				email: '',
				orgId: ''
      },
      sendMessageForm: {}
		}
	},
	// 生命周期中尽量使用方法名来调用
	mounted: function() {
		this._getQueryInfo()
	},
	methods: {
    /** 
     * 自动发送短信 
     */
    autoSend: function() {
      this.toSendValue ? this.addSuperForm.isSend = 1 : this.addSuperForm.isSend = 0 
    },

		/** 
     * 获取query的数据 
     */
		_getQueryInfo: function() {
      let queryParam = this.$route.query
			if(queryParam) {
				this.activeOrgName = queryParam.orgName
				this.activeOrgId = queryParam.orgId
				this._getManagerList()
			}
		},

		/** 
		 * 返回首页
		 */
		_toHome: function() {
			let queryObj = sessionStorageUtil.get('query-obj')
			this.$router.push({path:'/org', query: queryObj})
		},

		/** 
		 * 获取所辖管理员列表
		 */
		_getManagerList: function() {
			return requestGetManagerList(this.activeOrgId)
				.then( res => {
					if (res.code === 200) {
						this.tableData = res.data.data
					}
				})
		},

		/** 
		 * 添加超级管理员
		 * @param {String} formName: 表单名称
		 */
		_submitAddForm: function(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					//调用添加管理员的请求方法,同时重新请求这个机构的管理员信息,进行刷新
          this.addSuperForm.activeOrgId = this.activeOrgId
					requestAddManager(this.addSuperForm).then( res => {
						switch(res.code) {
							case 200:
								this._getManagerList().then( () => {
									//清空重置
									this.$refs[formName].resetFields()
									//关闭
									this.dialogAddVisible = false
									//刷新现在所有的幼儿园之后提示成功
									let self = this
									setTimeout(function() {
										self.$message({
											message: '恭喜你，添加成功',
											type: 'success',
											duration: 2000
										})
									}, 50)
								})
								break
							case 206:
								let self = this
								setTimeout(function() {
									self.$message.error(`${res.msg}`)
								}, 50)
								break
							default:
								let _that = this
								setTimeout(function() {
									_that.$message.error(`${res.msg}`)
								}, 50)
						}
					})
				} else {
					return false
				}
			})
		},

		/** 
		 * 超级管理员取消按钮
		 * @param {String} formName: 表单名称 
		 */
    _resetAddForm: function(formName) {
      //清空重置并关闭
      this.$refs[formName].resetFields()
      this.dialogAddVisible = false
		},
		
		/**
     * 编辑按钮点击
     * @param {Object} scope: 数据的作用域（element-ui要求添加） 
     * @param {Object} row: 点击的信息对象 
     */
		_handleEdit: function(scope,row) {
			this.editSupperForm.email = row.userName
			this.editSupperForm.userId = row.userId
			this.editSupperForm.linkName = row.nickName
			this.editSupperForm.phone = row.phone
			this.editSupperForm.orgId = row.orgId
			this.dialogEditVisible = true
		},

		/** 
		 * 修改按钮
		 * @param {String} formName: 表单名称 
		 */
		_submitEditForm: function(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					//调用修改管理员的请求方法,同时重新请求这个机构的管理员信息,进行刷新
					requestPatchManager(this.editSupperForm).then( res => {
						if (res.code === 200) {
							this._getManagerList()
								.then( () => {
									//清空重置
									this.$refs[formName].resetFields()
									//关闭
									this.dialogEditVisible = false
									//刷新现在所有的幼儿园之后提示成功
									let self = this
									setTimeout(function() {
										self.$message({
											message: '恭喜你，修改成功',
											type: 'success',
											duration: 2000
										})
									}, 50)
								})
						}
					})
				} else {
					return false
				}
			})
		},

		/** 
		 * 修改取消按钮
		 * @param {String} formName: 表单名称 
		 */
		_resetEditForm: function(formName) {
			this.$refs[formName].resetFields()
			this.dialogEditVisible = false
		},

		/**
     * 删除点击
     * @param {Object} scope: 数据的作用域（element-ui要求添加） 
     * @param {Object} row: 点击的信息对象 
     */
		_deleteButtonClick: function(scope, row) {
			this.deleteForm.email = row.phone
			this.deleteForm.userId = row.userId
			this.dialogDeleteVisible = true
		},

		/**
     * 删除确定
     */
		_deleteManager: function() {
			requestDeleteManager(this.deleteForm.userId)
				.then( res => {
					if (res.code === 200) {
						this._getManagerList().then( () => {
							this.dialogDeleteVisible = false
							let self = this
							setTimeout(function() {
								self.$message({
									message: '恭喜你，删除成功',
									type: 'success',
									duration: 2000
								})
							}, 50)
						})
					}
			})
		},

		/**
     * 发送信息点击
     * @param {Object} scope: 数据的作用域（element-ui要求添加） 
     * @param {Object} row: 点击的信息对象 
     */
		_messageButtonClick: function(scope, row) {
			this.sendMessageForm = {
        phone: row.phone,
        orgId: row.orgId
      }
			requestSendMessage(this.sendMessageForm)
				.then( res => {
					if (res.code === 200) {
						this._getManagerList().then( () => {
							let self = this
							setTimeout(function() {
								self.$message({
									message: '短信验证已发送',
									type: 'success',
									duration: 2000
								})
							}, 50)
						})
					}
      })
		},

		/**
     * 关闭弹窗
     */
    _handleClose: function(done){
      //清空重置，当dialog的flag为真时候清空对应的表单数据
      this.dialogAddVisible && this.$refs['addSuperForm'].resetFields()
      this.dialogEditVisible && this.$refs['editSupperForm'].resetFields()
      done()
		}
	}
}
</script>
 
<style lang="stylus" scoped>
	.c-usercontent
		position absolute
		top 70px
		left 0
		right 0
		bottom 0
		padding 30px
		.m-usercontent-info
			display inline-block
			height 30px
			line-height 30px
		.m-usercontent-btn
			width 200px
			height 45px
			line-height 45px
			margin-right 50px
			text-align center
			font-size 18px
			color white
			border-radius 6px
			background-color #337ab7
			cursor pointer
			&:hover
				background-color #2e6da4
			i
				display inline-block
				vertical-align middle
				width 24px
				height 26px
				margin-right 5px
				background url(./img/TJ.png) no-repeat 100% 100%
		.m-usercontent-table
			position absolute
			top 105px
			left 30px
			right 30px
			bottom 30px
			border 1px solid #95c5ce
			padding 10px
			overflow-x hidden
			overflow-y auto
			//发送信息的图标隐藏的类
			.messageIconHide
				visibility hidden!important			
</style>
 
 