/*
 * @Author: wzy
 * @Desc: 添加机构管理员的组件
 */

<template>
  <!-- 添加机构管理员页面 -->
  <div class="c-content cl">
		<!-- 添加管理员按钮 -->
		<div class="m-content-btn fr" @click="dialogAddVisible = true">
			<i></i>添加管理员
		</div>
		<!-- 显示幼儿园名称 -->
    <div class="m-content-orgname">{{activeOrgName}}</div>
		<!-- 表格区域  -->
		<div class="m-content-table">
			<table class="s-table">
				<thead>
					<tr>
						<th>姓名</th>
						<th>状态</th>
						<th>操作</th>
						<th class="bigth">手机号</th>
					</tr>
				</thead>
				<tbody v-show="managers">

					<tr v-for="(manager,index) in activeManagerList" :key="index">
						<td style="padding-left:15px">{{manager.nickName}}</td>
						<td>
							<span v-if="manager.status === 'WAITING' " style="color:blue">待确认</span>
							<span v-else-if="manager.status === 'ENABLE' " style="color:green">已确认</span> 
							<span v-else-if="manager.status === 'PENDING' " style="color:red">待激活</span>
						</td>
						<td>
							<i class="icon-operate icon-edit" @click="editInfo(manager)"></i>
							<i class="icon-operate icon-delete" @click="deleteEvent(manager)"></i>
							<i class="icon-operate icon-message" @click="sendMessage(manager)" v-show="manager.status !== 'ENABLE'"></i>
						</td>
						<td class="bigth">{{manager.phone}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- 添加管理员对话框 -->
		<el-dialog title="添加管理员" :visible.sync="dialogAddVisible"  :before-close="handleClose">
      <!-- 添加幼儿园的表单 -->
      <el-form ref="addManagerForm" :model="addManagerForm" :rules="addrules" label-width="150px" >

        <el-form-item label="姓名" prop="name">
          <el-input v-model="addManagerForm.name" style="width:300px;" placeholder="姓名" required></el-input>
        </el-form-item>

				<el-form-item label="联系电话" prop="tel">
          <el-input v-model.trim="addManagerForm.tel" :maxlength="11" style="width:300px;" placeholder="联系电话" required></el-input>
        </el-form-item>

				<el-form-item >
					<el-checkbox v-model="toSendValue" @change="autoSend">提交时自动发送邀请码</el-checkbox>
          <!-- <input type="checkbox" style="display:inline-block;margin-right:5px;vertical-align:middle;" id="chk" v-model="toSendValue" @click="toSend">
					<label for="chk" style="height:36px;line-height:36px;display:inline-block;cursor:pointer">提交时发送邀请码</label> -->
				</el-form-item>

        <el-form-item style="text-align:right;margin-bottom:0;margin-top:40px;padding-right:40px">
          <el-button type="primary" @click="submitAddForm('addManagerForm')">确定</el-button>
          <el-button @click="resetAddForm('addManagerForm')">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
		<!-- 修改管理员对话框 -->
		<el-dialog title="修改管理员" :visible.sync="dialogEditVisible"  :before-close="handleClose">
      <!-- 修改幼儿园的表单 -->
      <el-form ref="editManagerForm" :model="editManagerForm" :rules="editrules" label-width="150px" >

        <el-form-item label="姓名" prop="linkName">
          <el-input v-model="editManagerForm.nickName" style="width:300px;" placeholder="姓名" required></el-input>
        </el-form-item>

				<el-form-item label="联系电话" prop="phone">
          <el-input v-model="editManagerForm.phone" style="width:300px;"  placeholder="联系电话" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item style="text-align:right;margin-bottom:0;margin-top:40px;padding-right:40px">
          <el-button type="primary" @click="submitEditForm('editManagerForm')">确定</el-button>
          <el-button @click="resetEditForm('editManagerForm')">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
		<!-- 删除当前的管理员 -->
    <el-dialog title="删除管理员" :visible.sync="dialogDeleteVisible"  :before-close="handleClose">
      <p style="padding-left:50px">是否删除管理员账号：<span style="color:red">{{deleteForm.phone}}</span>？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteManager">确 定</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { requestGetManagers, requestAddManager, requestPatchManager, requestDeleteManager, requestSendMessage } from 'api/manager'
import { requestCheckExist } from 'api/checkExist'
import { sessionStorageUtil } from 'lib/util'

export default {
	name: 'manager-content',
	props: {
		activeOrgName: {
			type: String
		},
		activeManagerList: {
			type: Array
		}
	},
	data: function() {
		var validateTel = (rule, value, callback) => {
			var pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ 
			// 发出验证是否存在的请求
			requestCheckExist(this.addManagerForm.tel).then( data => { 
				if(!value) {
					callback(new Error('请填写手机号码'))
				} else if(!value.match(pattern)) {
					callback(new Error('请填写正确的手机号码'))
				} else if(data) {
					callback('此账号已存在')
				} else {
					callback()
				}
			})
		}
		return {
			// 计时器次数
			sendCount: 60,
			toSendValue: true,
			// 所辖管理员列表
			managers: [],
			//添加管理员表单的flag
			dialogAddVisible: false,
			//添加管理员的表单
			addManagerForm: {
				name: '',
				tel: '',
				id: '' ,//当前机构ID,
				isSend: 1
			},
			//添加管理员的验证规则
			addrules: {
				name:[
          { required: true, message: '请填写姓名', trigger: 'blur,change' }
        ],
				tel:[
					{ required: true, message: '请填写联系电话', trigger: 'blur' },
					{ validator: validateTel, trigger: 'blur' }
				]
			},
			//修改管理员表单的flag
			dialogEditVisible: false,
			//修改管理员的表单
			editManagerForm: {
				nickName: '',
				phone: '',
				userId: '',
				orgId: ''
			},
			//修改管理员的验证规则
			editrules: {
				name:[
          { required: true, message: '请填写姓名', trigger: 'blur,change' }
        ],
				phone:[
					{ required: true, message: '请填写联系电话', trigger: 'blur' },
					{ validator: validateTel, trigger: 'blur,change' }
				]
			},
			//删除管理员flag
			dialogDeleteVisible: false,
			deleteForm: {
				name: '',
				phone: '',
				userId: ''
			},
			// 发送短信的表单
			sendMsgForm: {
				sendId: '',
				orgId: '',
				phone: ''
			}
		}
	},
	mounted: function() {
		// 解决刷新
		sessionStorageUtil.get('activeOrgId') && this.$emit('getManagers')
	},
	methods: {
		/** 
		 * 设置是否自动发送短信的选框 
		 */
		autoSend: function() {
			console.log('v:', this.toSendValue)
      this.toSendValue ? this.addManagerForm.isSend = 1 : this.addManagerForm.isSend = 0 
		},

		/** 
		 * 添加管理员
		 * @param {String} formName: 表单名称 
		 */
		submitAddForm: function(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					// 避免多次点击或者由于服务器卡出现延迟
          this.sendCount--
          let self = this
          let loop = setTimeout(function(){
            self.sendCount = 60
					}, 3000)
					if( self.sendCount == 59) {
						requestAddManager(this.addManagerForm).then( res => {
							switch(res.code) {
								case 200:
									//刷新当前机构的管理员列表
									this.$emit('setManagerList')
									//清空重置
									this.$refs[formName].resetFields()
									//关闭
									this.dialogAddVisible = false
									//刷新现在所有的幼儿园之后提示成功
									this.$message({
										message: '恭喜你，添加成功',
										type: 'success',
										duration: 2000
									})
									break
								case 202:
                  this.$message.error('发送次数达上限')
									break	
								case 203:
                  this.$message.error(`${res.msg}`)
									break
								case 205:
								  this.$message.error(`${res.msg}`)
									break
								case 206:
                  this.$message.error(`${res.msg}`)
                  break		
							}
						})
					} else {
            self.$message({
              message: '很抱歉，操作的太频繁了',
              type: 'error',
              duration: 500
            })
            return false
          }
				} 
			})
		},

		/** 
		 * 添加管理员取消
		 * @param {String} formName: 表单名称 
		 */
    resetAddForm: function(formName) {
      //清空重置并关闭
      this.$refs[formName].resetFields()
      this.dialogAddVisible = false
		},
		
		/** 
		 * 修改管理员信息
		 * @param {Obkect} manager: 当前的信息对象 
		 */
		editInfo: function(manager) {
			this.dialogEditVisible = true
			this.editManagerForm.nickName = manager.nickName
			this.editManagerForm.phone = manager.phone
			this.editManagerForm.userId = manager.userId
			this.editManagerForm.orgId = manager.orgId 
		},

		/** 
		 * 修改信息确认事件
		 * @param {String} formName: 表单名称 
		 */
		submitEditForm: function(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					//调用添加管理员的请求方法,同时重新请求这个机构的管理员信息,进行刷新
					requestPatchManager(this.editManagerForm).then( res => {
						//刷新当前机构的管理员列表
						this.$emit('setManagerList')
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
				} else {
					return false
				}
			})
		},

		/** 
		 * 点击删除管理员按钮
		 * @param {Object} manager: 当前管理员对象
		 */
		deleteEvent: function(manager) {
			this.dialogDeleteVisible = true
			this.deleteForm.phone = manager.phone
			this.deleteForm.userId = manager.userId
		},

		/** 
		 * 点击删除确认
		 */
		deleteManager: function() {
			requestDeleteManager(this.deleteForm.userId)
				.then( res => {
					if (res.code === 200) {
						//刷新当前机构的管理员列表
						this.$emit('setManagerList')
						this.dialogDeleteVisible = false
						//提示
						let self = this
						setTimeout(function() {
							self.$message({
								message: '恭喜你，删除成功',
								type: 'success',
								duration: 2000
							})
						}, 50)
					}
			})
		},

		/** 
		 * 发送短信
		 * @param {Object} manager: 当前管理员对象
		 */
		sendMessage: function(manager) {
			this.sendCount--
			let self = this
			let loop = setTimeout(function(){
				self.sendCount = 60
			}, 3000)
			if(self.sendCount == 59) {
				this.sendMsgForm.phone = manager.phone
				this.sendMsgForm.sendId = manager.sendId
				this.sendMsgForm.orgId = manager.orgId
				requestSendMessage(this.sendMsgForm).then( res => {
					if( res.code === 200) {
						self.$message({
							message: '发送成功',
							type: 'success',
							duration: 500
						})
					} else if ( res.code === 202 ) {
						self.$message({
							message: '短信次数已超上限，请明天再试吧！',
							type: 'error',
							duration: 500
						})
					}
				})
			} else {
				self.$message({
					message: '很抱歉，操作的太频繁了',
					type: 'error',
					duration: 500
				})
				return false
			}
		},

		/** 
		 * 关闭弹窗
		 */
    handleClose: function(done){
      //清空重置，当dialog的flag为真时候清空对应的表单数据
      this.dialogAddVisible && this.$refs['addManagerForm'].resetFields()
      this.dialogEditVisible && this.clearForm()
      done()
		},
		
		/** 
		 * 清空表单
		 */
		clearForm: function() {
			this.editManagerForm.name = ''
			this.editManagerForm.tel = ''
		}
	}
}
</script>

<style lang="stylus" scoped>
	.c-content
		position absolute
		left 220px
		top 0
		bottom 0
		right 0
		
		/*按钮区域*/
		.m-content-btn
			width 162px
			height 45px
			line-height 45px
			margin-right 50px
			margin-top 20px
			text-align center
			font-size 18px
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
		
		/*机构名称区域*/		 
		.m-content-orgname
			position relative
			margin-top 80px
			margin-left 40px
			padding-left 10px
			height 30px
			line-height 30px
			font-size 16px
			color #3f687c
			&:before
				content ''
				position absolute
				top 6px
				left 0
				width 1px
				height 16px
				background-color #3f687c
		/*表格区域*/
		.m-content-table
			position absolute
			top 120px
			left 50px
			bottom 40px
			right 20px
			overflow-x hidden
			overflow-y auto
			.s-table
				width 100%
				border-collapse collapse
				thead
					th
						width 20%
						height 35px
						line-height 35px
						color black
					.bigth
						width 40%
				tbody
					border-bottom 1px solid #ddd
					tr
						cursor pointer 
						&:hover
							background-color #F0F8FD
						td
							width 20%
							height 35px
							line-height 35px
							color black
							border-top 1px solid #ddd		
							i
								display inline-block
								vertical-align middle
								width 30px
								height 30px
							.icon-edit
								background url(./img/icon-edit.png) no-repeat center
							.icon-delete
								background url(./img/icon-delete.png) no-repeat center
							.icon-message
								background url(./img/icon-email.png) no-repeat center	
						.bigth
							width 40%
</style>

