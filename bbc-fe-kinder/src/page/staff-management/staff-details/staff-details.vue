/** 
 * @Desc: 收藏列表
 */
<template>
  <div class="staff-details">
    <!-- 按钮 -->
    <div class="staff-header">
      <Button size="large" style="margin-left: 16px;" @click="_handleAdd">
        <v-icon type="icon-add-person" :size="16"></v-icon>  
        添加职工
      </Button>
    </div>

    <!-- 数据头部 -->
    <div class="list-header clear-float">
      <Col span="14">姓名</Col>
      <Col span="4">班级</Col>
      <Col span="6">手机号</Col>
    </div>

    <!-- 数据内容 -->
    <div class="list-content">
      <ul v-if="staffListVisible">
        <li class="list-item list-padding clear-float" v-for="(staff, index) in staffList" :key="index">
          <Col span="14" class="clear-float">
            <Col span="6" class="no-wrap" v-text="staff.emp_name ? staff.emp_name : '--'"></Col>
            <Col span="6">
              <span v-if="staff.status === 'PENDING'" class="list-status status-unsend">未发送邀请码</span>
              <span v-else-if="staff.status === 'WAITING'" class="list-status status-waite">等待职工确认</span>
              <span v-else-if="staff.status === 'EXPIRED'" class="list-status status-expired">邀请码失效</span>
              <span v-else-if="staff.status === 'JOB'" class="list-status status-job">在职</span>
              <span v-else-if="staff.status === 'QUIT'" class="list-status status-quit">离职</span>
            </Col>
            <Col span="12">
              <Icon 
                type="edit"
                v-if="staff.status === 'JOB' || staff.status === 'QUIT'" 
                class="clickable list-icon"
                @click.native="_handleEdit(staff)"/>

              <Icon 
                type="email" 
                class="clickable list-icon"
                v-if="staff.status != 'JOB' && staff.status != 'QUIT'" 
                @click.native="_handleSendMessage(staff)"/>

              <Icon 
                type="trash-a" 
                class="clickable list-icon" 
                v-if="staff.status != 'JOB'"
                @click.native="_handleRemove(staff)"/>
            </Col>
          </Col>
          <Col span="4" v-text="staff.class_name ? staff.class_name : '--'"></Col>
          <Col span="6" v-text="staff.phone ? staff.phone : '--'"></Col>
        </li>

      </ul>
        <!-- 没有展示的数据 -->
      <ul v-else> 
        <li class="list-item-nodata" style="text-align:center; color: #851">暂无数据</li>
      </ul>
    </div>

    <!-- 添加职工 -->
    <Modal
      v-model="staffAddVisible"
      @on-ok="_handleAddStaff"
      @on-cancel="$refs['addStaffForm'].resetFields()"
      title="添加职工">
      <Form 
        :model="addStaffForm"
        :rules="addStaffFormRule"
        :labelWidth="90"
        style="padding:0 50px;"
        ref="addStaffForm">
        <FormItem prop="empName" label="职工姓名">
          <Input v-model="addStaffForm.empName" placeholder="请输入职工姓名"/>
        </FormItem>
        <FormItem prop="gender">
          <span slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
          <RadioGroup v-model="addStaffForm.gender">
            <Radio label="male">男</Radio>
            <Radio label="female">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="任教年级" prop="gradeName">
          <Select v-model="addStaffForm.gradeName" clearable placeholder="请选择任教年级" @on-change="_gradeChange" :label-in-value="true">
            <Option v-for="item in gradeList" :label="item.gradeName" :value="item.gradeId" :key="item.gradeId">{{ item.gradeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="任教班级" prop="className">
          <Select v-model="addStaffForm.className" clearable placeholder="请先选择任教年级" @on-change="_classChange" :label-in-value="true">
            <Option v-for="item in classList" :label="item.className" :value="item.classId" :key="item.classId">{{ item.className }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="phone" label="手机号码">
          <Input v-model="addStaffForm.phone" placeholder="请输入手机号码"/>
        </FormItem>
        <FormItem label="备注信息" prop="textarea">
          <Input v-model="addStaffForm.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 6}" placeholder="请输入备注信息"></Input>
        </FormItem>
        <div style="padding-left: 10px">
          <Checkbox v-model="SendValue" @on-change="_changeSendValue">提交时发送邀请码</Checkbox>
        </div>
      </Form>
    </Modal>

    <!-- 修改职工 -->
    <Modal
      class="addmodel"
      v-model="staffEditVisible"
      @on-ok="_handleEditStaff"
      @on-cancel="$refs['editStaffForm'].resetFields()"
      title="修改职工">
      <Form 
        :model="editStaffForm"
        :rules="editStaffFormRule"
        :labelWidth="90"
        ref="editStaffForm"
        style="padding:0 50px;">
        <FormItem label="职工姓名" prop="empName">
          <Input v-model="editStaffForm.empName" placeholder="请输入职工姓名"/>
        </FormItem>

        <FormItem prop="gender">
          <span slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
          <RadioGroup v-model="editStaffForm.gender">
            <Radio label="male">男</Radio>
            <Radio label="female">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="任教年级" prop="gradeName">
          <Select v-model="editStaffForm.gradeName" clearable placeholder="请选择任教年级" @on-change="_gradeChange" :label-in-value="true">
            <Option v-for="item in gradeList" :label="item.gradeName" :value="item.gradeId" :key="item.gradeId">{{ item.gradeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="任教班级" prop="className">
          <Select v-model="editStaffForm.className" clearable placeholder="请先选择任教年级" @on-change="_classChange" :label-in-value="true">
            <Option v-for="item in classList" :label="item.className" :value="item.classId" :key="item.classId">{{ item.className }}</Option>
          </Select>
        </FormItem>
        <FormItem label="在职状态" prop="status" v-if="editStaffForm.status == 'JOB' || editStaffForm.status == 'QUIT' ">
          <Select v-model="editStaffForm.status" clearable placeholder="请选择在职状态" @on-change="_statusChange" :label-in-value="true">
            <Option v-for="item in statusList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="手机号码" prop="phone">
          <Input :disabled="true" v-model="editStaffForm.phone"/>
        </FormItem>
        <FormItem label="备注信息" prop="textarea">
          <Input v-model="editStaffForm.textarea" type="textarea" :autosize="{minRows: 2,maxRows: 6}" placeholder="请输入备注信息"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 删除职工 -->
    <Modal
      v-model="staffRemoveVisible"
      @on-ok="_handleRemoveStaff"
      title="删除职工">
      <p>确定要删除职工 <span style="color: red">{{removeStaffForm.empName}}</span>吗?</p>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import VAvatar from 'base/avatar'
  import { 
    requestGetStaffs, 
    requestAddStaff, 
    requestPatchStaff, 
    requestDeleteStaff, 
    requestSendMessage 
  } from 'api/staff'
  import { requestCheckExist } from 'api/garden'
  export default {
    name: 'StaffDetails',
    components: {
      VAvatar
    },
    data: function() {
      const validateTel = (rule, value, callback) => {
        let pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ //手机验证
        // 调用检查账号是否唯一方法
        requestCheckExist(this.addStaffForm.phone)
          .then(data => {
            if (!value) {
              callback(new Error('请输入手机号'));
            } else if( !value.match(pattern) || value.length != 11){
              callback(new Error('请输入正确的手机号'))
            } else if(data.data) {
              callback('此账号已存在')
            } else {
              callback()
            }
          })
      }
      return {
        staffAddVisible: false, // 添加dialog显示标识
        staffEditVisible: false, // 修改dialog标识
        staffRemoveVisible: false, // 删除dialog标识
        staffListVisible: false, // 职工列表标识
        staffList: [], // 职工列表
        SendValue: true, //短信发送值
        // 添加职工表单
        addStaffForm: { 
          empName: '',
          phone: '',
          empHead: '',
          gradeName: '',
          className: '',
          gradeId: '',
          classId: '',
          gender: 'male',
          remarks: '',
          isSend: 1,
          textarea: ''
        }, 
        // 添加职工表单校验 ,谨记gradeName和className的类型
        addStaffFormRule: { 
          empName: [
            { required: true, message: '请输入职工姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { validator: validateTel, trigger: 'blur' }
          ],
          gradeName: [
            { required: true,  type: 'number',  message: '请选择年级', trigger: 'change' }
            
          ],
          className: [
            { required: true,  type: 'number',  message: '请选择班级', trigger: 'change' }
          ]
        },

        // 修改职工表单
        editStaffForm: { 
          gender: ''
        },
        // 修改职工表单校验
        editStaffFormRule: {  
          empName: [
            { required: true, message: '请输入职工姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          gradeName: [
            { required: true, type: 'number', message: '请选择年级', trigger: 'change' }
          ],
          className: [
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择在职状态', trigger: 'change' }
          ]
        },
        // 在离职状态数据
        statusList: [
          {
            value: '在职',
            label: 'JOB'
          }, {
            value: '离职',
            label: 'QUIT'
          }
        ],
        removeStaffForm: {}, // 删除职工表单
        gradeList: this.$store.state.gradeList, // 所有的年级数据
        allClassList: this.$store.state.gradeList, // 所有的班级数据
        classList: [], // 当前年级对应的班级数据
      }
    },
    mounted: function() {
      this._getAllStaffsData()
    },
    methods: {
      /** 
       * 获得当前所有的职工信息
       */
      _getAllStaffsData: function() {
        return requestGetStaffs()
          .then( response => {
            if (response.code == 200) {
              this.staffListVisible = true
              this.staffList = response.data.list
            }
          })
      },

      /** 
       * 获得发送短信的标识
       */
      _changeSendValue: function() {
        this.SendValue ? (this.addStaffForm.isSend = 1) : (this.addStaffForm.isSend = 0)
      },

      /** 
       * 添加职工点击
       * @param {object} item: 当前的职工信息对象
       */
      _handleAdd: function(staff) {
        this.$refs['addStaffForm'].resetFields()
        this.staffAddVisible = true
      },

      /** 
       * 年级选择联动班级数据的变动
       */
      _gradeChange: function(value) {
        this.addStaffForm.gradeId = value.value
        this.editStaffForm.gradeId = value.value

        let key = value.value
        let list = []
        // 对象的循环
        for (let i in this.allClassList) {
          if(this.allClassList[i].gradeId === value.value ) {
            list = this.allClassList[i].classes
          }
        }
        this.classList = list
      },

      /**
       * 班级选择 
       */
      _classChange: function(value) {
        this.addStaffForm.classId = value.value
        this.editStaffForm.classId = value.value
      },

      /** 
       * 在职状态选择 
       */
      _statusChange: function(value) {
        this.editStaffForm.status = value.value
      },


      /** 
       * 添加职工确定
       */
      _handleAddStaff: function() {
        this.$refs['addStaffForm'].validate((valid) => {
          if (valid) {
            this._addStaff()
          } 
        })
      },
      
      /** 
       * 添加职工请求 
       */
      _addStaff: function() {
        requestAddStaff(this.addStaffForm)
          .then(response => {
            if(response.code === 200) {
              this.$VMessage('success', '职工添加成功')
              this.staffAddVisible = false
              // 重新获取数据
              this._getAllStaffsData()
            } else {
              this.$VMessage('error', '职工添加失败')
              this.staffAddVisible = false
              // 重新获取数据
              this._getAllStaffsData()
            }
          })
      },

      /** 
       * 修改员工图标点击
       * @param {object} staff: 当前的职工信息对象
       */
      _handleEdit: function(staff) {
        this.$refs['editStaffForm'].resetFields()
        this.staffEditVisible = true
        this.editStaffForm.empName = staff.emp_name
        this.editStaffForm.employeeId = staff.employee_id
        this.editStaffForm.phone = staff.phone
        this.editStaffForm.gender = staff.gender
        this.editStaffForm.gradeId = staff.grade_id
        this.editStaffForm.classId = staff.class_id
        this.editStaffForm.remarks = staff.remarks ? staff.remarks : ''
        this.editStaffForm.status = staff.status
        this.editStaffForm.sendId = staff.send_id
        this.editStaffForm.gradeName = staff.grade_id
        this.editStaffForm.className = staff.class_id
      },

      /** 
       * 修改表单确定
       */
      _handleEditStaff: function() {
        this.$refs['editStaffForm'].validate((valid) => {
          if (valid) {
            this._editStaff()
          } 
        })
      },

      /** 
       * 修改职工请求 
       */
      _editStaff: function() {
        requestPatchStaff(this.editStaffForm)
          .then( response => {
            if(response.code === 200) {
              this.$VMessage('success', '职工修改成功')
              this.staffEditVisible = false
              // 重新获取数据
              this._getAllStaffsData()
            } else {
              this.$VMessage('error', '职工修改失败')
              this.staffEditVisible = false
              // 重新获取数据
              this._getAllStaffsData()
            }
          })
      },

      /** 
       * 发送短信点击
       * @param {object} staff: 当前的职工信息对象     
       */
      _handleSendMessage: function(staff) {
        const param= {
          phone: staff.phone,
          sendId: staff.send_id
        }
        this._sendMessage(param)
      },

      /** 
       * 请求发送短信
       * @param {object}  
       */
      _sendMessage: function(param) {
        return requestSendMessage(param)
          .then(response => {
            let code = response.code
            switch(code) {
              case 200:
                this.$VMessage('success', '短信发送成功')
                // 重新获取数据
                this._getAllStaffsData()
                break
              case 202:
                this.$VMessage('warn', '发送次数已达上限')
                // 重新获取数据
                this._getAllStaffsData()
              default: 
                this.$VMessage('error', '短信发送失败')
                // 重新获取数据
                this._getAllStaffsData()  
            }
          })
      },

      /** 
       * 删除当前职工
       * @param {object} staff: 当前的职工信息对象     
       */
      _handleRemove: function(staff) {
        this.staffRemoveVisible = true
        this.removeStaffForm.phone = staff.phone
        this.removeStaffForm.empName = staff.emp_name
      },

      /** 
       * 确定删除 
       */
      _handleRemoveStaff: function() {
        return requestDeleteStaff(this.removeStaffForm.phone)
          .then( response => {
            if(response.code == 200) {
              this.$VMessage('success', '职工删除成功')
              this.staffRemoveVisible = false
              // 重新获取数据
              this._getAllStaffsData()
            } else {
              this.$VMessage('error', '职工删除失败')
              this.staffEditVisible = false
              // 重新获取数据
              this._getAllStaffsData()
            }
          })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'

  .staff-details
    position relative
    width 100%
    height 100%
    color #885511
    .staff-header
      padding 30px 43px 10px 37px

    /* 数据列表头部 */
    .list-header
      margin 10px 37px 0 43px
      height 30px
      line-height 20px
      font-size 16px
      text-indent 10px
      border-bottom 1px solid #ddd9c6

    /* 数据列表内容 */
    .list-content
      position absolute
      top 118px
      left 0
      right 0
      bottom 10px
      overflow-y auto
      .list-padding 
        padding 0 43px 0 37px
      .list-item-nodata
        height 40px
        line-height 40px
        font-size 14px
      .list-item
        height 40px
        line-height 40px
        font-size 14px
        text-indent 16px
        &:hover
          background-color #c9efd9
        &:hover .list-icon  
          display inline-block

      .list-item    
        /* 操作图标 */
        .list-icon
          display none
          color #125016
          font-size 18px
          vertical-align middle

        /* 职工状态样式 */
        .list-status
          box-sizing content-box
          display inline-block  
          width 100px
          height 24px
          line-height 24px
          border-radius 5px
          text-indent 0
          text-align center
          font-size 12px
          border 1px solid
          color white
        .status-unsend
          color #9e9e9e
          border-color #888888
        .status-waite
          border-color #69c8ff
          background-color #69c8ff
        .status-expired
          border-color #ffa25e
          background-color #ffa25e 
        .status-job
          border-color #67cd96
          background-color #67cd96
        .status-quit
          border-color #ff8d77
          background-color #ff8d77
</style>
