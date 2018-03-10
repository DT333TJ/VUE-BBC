/*
 * @Author: wzy
 * @Desc: 添加机构内容组件
 */
<template>
  <div class="c-homecontent">
    <!-- 添加机构按钮 -->
    <section class="m-addBtn" @click="dialogAddVisible = true"><i></i>添加机构</section>
    <!-- 表格区域 -->
    <section class="m-table" >
      <!-- 表格 -->
      <el-table v-if="tableData.length" :data="tableData" stripe style="width: 100%">
        <!-- id -->
        <el-table-column align="center" prop="orgId" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.orgId }}</span>
          </template>
        </el-table-column>
        <!-- 机构名称 -->
        <el-table-column align="center" prop="orgName" label="机构名称" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.orgName }}</span>
          </template>
        </el-table-column>
        <!-- 服务时间 -->
        <el-table-column align="center" prop="time" label="服务时间" width="280">
          <template slot-scope="scope">
            <span>{{ (new Date(scope.row.beginTime)).toLocaleString().replace(/\//g, "-").split(' ')[0] }}</span>
            <span>/</span>
            <span>{{ (new Date(scope.row.endTime)).toLocaleString().replace(/\//g, "-").split(' ')[0] }}</span>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column align="center" prop="state" label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.stateValue == '禁用'" style="color:red">{{ scope.row.stateValue }}</span>
            <span v-else >{{ scope.row.stateValue }}</span>
          </template>
        </el-table-column>
        <!-- 联系人 -->
        <el-table-column align="center" prop="linkName" label="联系人" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.linkName }}</span>
          </template>
        </el-table-column>
        <!-- 联系电话 -->
        <el-table-column align="center" prop="phone" label="联系电话" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" prop="action" label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="_editButtonClick(scope.$index, scope.row)">编辑</el-button>
            <!-- 点击跳转管理员的界面 ，关键点在于router-link里面的span设置了点击事件 -->
            <el-button size="small"><span @click="_handleSetStaff(scope.$index, scope.row)">设置管理员</span></el-button>
            <el-button size="small" type="danger" @click="_handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 添加机构的dialog ，注意:before-close="handleClose"来设置错号关闭时候的清空函数-->
    <el-dialog title="添加机构" :visible.sync="dialogAddVisible" :before-close="_handleClose">
      <!-- 添加幼儿园的表单 -->
      <el-form ref="addForm" :model="addForm" :rules="addrules" label-width="80px" :label-position="labelPosition">
        <!-- 机构名称 -->
        <el-form-item label="机构名称" prop="orgName" :style="inputPadding">
          <el-input v-model.trim="addForm.orgName" style="width:320px;" placeholder="机构名称" required></el-input>
        </el-form-item>
        <!-- 联系人 -->
        <el-form-item label="联系人" prop="linkName" :style="inputPadding">
          <el-input v-model.trim="addForm.linkName" style="width:320px;" placeholder="联系人" required></el-input>
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话" prop="phone" :style="inputPadding">
          <el-input v-model.trim="addForm.phone" style="width:320px;" placeholder="联系电话" required></el-input>
        </el-form-item>
        <!-- 地址 -->
        <el-form-item label="地址" prop="address" :style="inputPadding">
          <el-input v-model.trim="addForm.address" style="width:320px;" placeholder="地址" required></el-input>
        </el-form-item>
        <!-- 规模 -->
        <el-form-item label="机构规模" prop="scale" :style="inputPadding">
          <el-input v-model="addForm.scale" style="width:320px" placeholder="机构规模" required></el-input>
        </el-form-item>
        <!-- 持续时间 -->
        <el-form-item label="服务时间" :style="inputPadding">    
          <!-- @change="getBeginTime" -->
          <el-date-picker v-model="addForm.beginTime" format type="date" placeholder="选择日期" @change="_getAddBeginTime"></el-date-picker>
          <span>至</span>
          <!-- @change="getEndTime" -->
          <el-date-picker v-model="addForm.endTime" format type="date" placeholder="选择日期" @change="_getAddEndTime"></el-date-picker>
        </el-form-item>
        <!-- 备注  -->
        <el-form-item label="备注" prop="remarks" :style="inputPadding">
          <el-input type="textarea" style="width:320px;" v-model="addForm.remarks"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item style="text-align:right;margin-bottom:0;margin-top:20px">
          <el-button type="primary" @click="_handleAddOrg('addForm')">提交</el-button>
          <el-button @click="_resetAddForm('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改机构的dialog ，注意:before-close="handleClose"来设置错号关闭时候的清空函数-->
    <el-dialog title="修改机构" :visible.sync="dialogEditVisible"  :before-close="_handleClose">
      <!-- 修改机构的表单 -->
      <el-form ref="editForm" :model="editForm" :rules="editrules" label-width="150px">
        <!-- 机构名称 -->
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="editForm.orgName" style="width:320px;" placeholder="机构名称"></el-input>
        </el-form-item>
        <!-- 联系人 -->
        <el-form-item label="联系人" prop="linkName">
          <el-input v-model="editForm.linkName" style="width:320px;" placeholder="联系人"></el-input>
        </el-form-item>
        <!-- 联系电话 -->
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.trim="editForm.phone" style="width:320px;" disabled="disabled"></el-input>
        </el-form-item>
        <!-- 地址 -->
        <el-form-item label="地址" prop="address">
          <el-input v-model.trim="editForm.address" style="width:320px;" placeholder="地址" ></el-input>
        </el-form-item>
        <!-- 规模 -->
        <el-form-item label="机构规模" prop="scale">
          <el-input v-model.trim="editForm.scale" style="width:320px" placeholder="所辖机构数量"></el-input>
        </el-form-item>
        <!-- 持续时间 -->
        <el-form-item label="服务时间">
          <el-date-picker v-model="editForm.beginTime" format type="date" placeholder="选择日期" @change="_getEditBeginTime"></el-date-picker>
          <span>至</span>
          <el-date-picker v-model="editForm.endTime" format type="date" placeholder="选择日期" @change="_getEditEndTime"></el-date-picker>
        </el-form-item>
        <!-- 备注  -->
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" style="width:320px;" v-model="editForm.remarks"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;margin-bottom:0;margin-top:20px">
          <el-button type="primary" @click="_handleEdit('editForm')">提交</el-button>
          <el-button @click="_resetEditForm('editForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除当前的机构 -->
    <el-dialog title="删除机构" :visible.sync="dialogDeleteVisible">
      <p style="padding-left:50px">是否删除机构：<span style="color:red">&nbsp;{{deleteForm.orgName}}&nbsp;?</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_deleteOrg">确 定</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script type="text/ecmascript-6">
import moment from 'moment'
import { requestGetOrgList, requestGetOrgInfo, requestAddOrg, requestDeleteOrg, requestPatchOrg } from 'api/org'
import { sessionStorageUtil } from 'lib/util'

export default {
  name: 'org-content',
	data: function() {
		var validateTel = (rule, value, callback) => {
			let pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ //手机验证
			if(!value) {
				callback(new Error('请填写手机号'))
			} else if(!value.match(pattern) || value.length != 11) {
				callback(new Error('手机格式不对'))
			} else {
				callback()
			}
    }
    const validateNum = (rule, value, callback) => {
      let pattern1 = /^[1-9]\d*$/ //非零正整数
      if (null == value || value == '') {
        callback(new Error('机构不能为空'))
      } else if (!value.match(pattern1)) {
        callback(new Error('必须是非零正整数'))
      } else {
        callback()
      }
    }
		return {
      //机构Id
      orgId: '',
      //用户Id
      userId: '',
      //query参数
      queryParam:{},
			//表格数据
			tableData: [],
      //label的对齐方向
      labelPosition: 'left',
      inputPadding: 'padding-left:30px;width:600px',
      //添加机构的dialog对话框flag
      dialogAddVisible: false,
      // 添加机构的表单
      addForm: {
        orgName: '',
        linkName: '',
        phone: '',
        address: '',
        scale: '',
        beginTime: '',
        endTime: '',
        remarks: ''	
      },
      // 添加的验证规则
      addrules: {
        orgName:[
          { required: true, message: '请填写名称', trigger: 'blur'}
        ],
        linkName:[
          { required: true, message: '请填写联系人名称', trigger: 'blur'}
        ],
        phone:[
          { required: true, message: '请填写联系电话', trigger: 'blur'},
          { validator: validateTel, trigger: 'blur' } 
        ],
        address:[
          { required: true, message: '请填写地址', trigger: 'blur'}
        ],
        scale:[
          { required: true, message: '请填写机构规模', trigger: 'blur'},
          { validator: validateNum, trigger: 'blur'}
        ]
      },
			 // 修改机构的flag
			dialogEditVisible: false,
			 //修改的表单
      editForm: {
				orgId: '',
        orgName: '',
				linkName: '',
				phone: '',
				address: '',
				scale: '',
				beginTime: '',
				endTime: '',
				remarks: ''
      },
      editrules: {
        orgName:[
          { required: true, message: '请填写机构名称', trigger: 'blur'}
        ],
				linkName:[
					 { required: true, message: '请填写联系人名称', trigger: 'blur'}
				],
				phone:[
					 { required: true, message: '请填写联系电话', trigger: 'blur'},
					 { validator: validateTel, trigger: 'blur' }
				 ],
				 address:[
					 { required: true, message: '请填写地址', trigger: 'blur'}
				 ],
				 scale:[
           { required: true, message: '请填写机构规模', trigger: 'blur'},
           { validator: validateNum, trigger: 'blur'}
				 ]
      },
      // 删除对话框的flag
      dialogDeleteVisible: false,
      // 删除的幼儿园数据
      deleteForm: {
        id: '',
				orgName: ''
      }
		}
  },
  mounted: function() {
    this._getQueryInfo()
  },
  methods: {
    /** 
     * 获取url中的query数据 
     */
    _getQueryInfo: function() {
      let queryParam = this.$route.query
      //存在url的query信息  
      if(queryParam.orgId && queryParam.userId) {
        this.orgId = queryParam.orgId 
        this.userId = queryParam.userId
        this._getOrgList()
        sessionStorageUtil.set('query-obj', queryParam)
      }
    },

    /** 
     * 获得机构列表数据 
     */
    _getOrgList: function() {
      // 注意使用return,否则会在添加等操作调用时候无法.then()
      return requestGetOrgList(this.orgId)
        .then( data => {
          if (data.code === 200) {
            this.tableData = data.data.list
          }
        })
    },

    /** 
     * 添加机构
     */
    _handleAddOrg: function(formName) {
      this.$refs[formName].validate((valid)=>{
        if (valid) {
          // 添加同时重新请求列表

          requestAddOrg(this.addForm).then(res => {
            if ( res.code === 200) {
              this._getOrgList().then(() => {
                // 清空addForm
                this.$refs['addForm'].resetFields()
                this.addForm.beginTime = ''
                this.addForm.endTime = ''
                this.dialogAddVisible = false
                let self = this
                setTimeout(function() {
                  self.$message({
                    message: '恭喜你，添加成功',
                    type: 'success',
                    duration: 2000
                  })
                }, 50)
              })
            }
          })
        }
      })
    },

    /** 
     * 清空重置表单
     * @param {String} formName: 清空重置的表单名称 
     */
    _resetAddForm: function(formName) {
      //清空重置并关闭
      this.$refs[formName].resetFields()
      this.dialogAddVisible = false
    },

    /**
     * 编辑按钮点击
     * @param {Number} index: 点击的下标 
     * @param {Object} row: 点击的信息对象 
     */
    _editButtonClick: function(index, row) {
     
      //通过row得到当前机构的信息赋值给修改表单中
      this.dialogEditVisible = true
      this.editForm.orgId = row.orgId
      this.editForm.orgName = row.orgName
      this.editForm.linkName = row.linkName
      this.editForm.phone = row.phone
      this.editForm.address = row.address
      this.editForm.scale = row.scale.toString()
      this.editForm.remarks = row.remarks
      //使用moment将时间戳转变为YYYY-MM-DD格式
      this.editForm.beginTime = moment(new Date(row.beginTime)).format('YYYY-MM-DD')
      this.editForm.endTime = moment(new Date(row.endTime)).format('YYYY-MM-DD')
    },

    /** 
     * 修改当前机构信息
     * @param {String} formName: 表单的名称 
     */
    _handleEdit: function(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          // return
          console.log('编辑的表单:', this.editForm)
          requestPatchOrg(this.editForm)
            .then(res => {
              if (res.code === 200) {
                this._getOrgList().then( () => {
                  // 清空editForm
                  this.$refs['editForm'].resetFields()
                  this.dialogEditVisible = false
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
        }
      })
    },

    /** 
     * 清空重置表单
     * @param {String} formName: 清空重置的表单名称 
     */
    _resetEditForm: function(formName) {
      //清空重置并关闭
      this.$refs[formName].resetFields()
      this.dialogEditVisible = false
    },

    /**
     * 编辑管理员
     * @param {Number} index: 当前事件对象的下标 
     * @param {Object} row: 当前事件对象的信息
     */     
    _handleSetStaff: function(index, row) {
      requestGetOrgInfo(row.orgId)
        .then( res => {
          if (res.code === 200) {
            // 通过路由的query参数传递当前机构的机构名称和机构ID
            let queryObj = {
              orgName: res.data.org.orgName,
              orgId: res.data.org.orgId
            }
            this.$router.push({path:`/user/${queryObj.orgId}`, query: queryObj})
          }
        })
    },

    /** 
     * 关闭弹窗点击事件 
     */
    _handleClose: function(done) {
      this.dialogAddVisible && this.$refs['addForm'].resetFields()
      this.dialogEditVisible && this.$refs['editForm'].resetFields()
      done()
    },

    /** 
     * 删除事件
     * @param {Number} index: 当前事件对象的下标 
     * @param {Object} row: 当前事件对象的信息
     */
    _handleDelete: function(index, row) {
      this.dialogDeleteVisible = true
      this.deleteForm.orgName = row.orgName
      this.deleteForm.id = row.orgId
    },

    /** 
     * 删除机构 
     */
    _deleteOrg: function() {
      requestDeleteOrg(this.deleteForm.id)
        .then( res => {
          if (res.code === 200) {
            this._getOrgList()
              .then( () => {
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
     * 获得修改表单服务的开始时间 
     */
    _getEditBeginTime: function() {
      this.editForm.beginTime = moment(this.editForm.beginTime).format('YYYY-MM-DD')
    },

    /** 
     * 获得修改表单服务的结束时间 
     */
    _getEditEndTime: function() {
      this.editForm.endTime = moment(this.editForm.endTime).format('YYYY-MM-DD')     
    },

    /** 
     * 获取添加表单的开始时间 
     */
    _getAddBeginTime: function() {
      this.addForm.beginTime = moment(this.addForm.beginTime).format('YYYY-MM-DD')
    },

    /** 
     * 获取添加表单的结束时间 
     */
    _getAddEndTime: function() {
      this.addForm.endTime = moment(this.addForm.endTime).format('YYYY-MM-DD')
    }
  }
}
</script>
 
<style lang="stylus" scoped>
	.c-homecontent
		position absolute
		top 70px
		bottom 0
		left 0
		right 0
		padding 30px
		background-color white
		/*按钮模块*/
		.m-addBtn
			width 140px
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
		/*表格模块*/
		.m-table
			position absolute
			top 105px
			left 30px
			right 30px
			bottom 30px
			border 1px solid #95c5ce
			padding 10px
			overflow-x hidden
			overflow-y auto
</style>
 
 