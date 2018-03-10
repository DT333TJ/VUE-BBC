/*
 * @Desc: 侧边栏添加幼儿园组件
 */ 
<template>
  <div class="c-sidebar">
    <!-- 添加按钮区域 -->
    <section class="m-sidebar-btn">
      <button class="sidebarBtn" @click="dialogAddVisible = true"><i class="el-icon-plus isize"></i>添加幼儿园</button>
    </section>
    <!-- 列表区域 -->
    <section class="m-sidebar-list" v-if="hasList">
      <ul>
        <!--机构的单位集合 -->
        <li>
          <!-- 机构名称 -->
          <a class="s-list-btn cl" >
            <span @click="toggleSlide($event)">{{orgName}}</span> 
            <i v-show="orgList.length" class="el-icon-arrow-down ileft"></i>
          </a> 
          <!-- 机构的各个单位ul列表集合 -->
          <ul v-if="orgList.length" class="s-list-items" id="scrollEle" style="display:none">
            <!-- 通过router-link来控制跳转的路由 -->
            <router-link tag="li" class="itemsli" v-for="(org, index) in orgList" :key="index" :to="`/manager/${org.orgId}`" >
              <span @click="getCurOrg(org, $event)" :key="index">{{org.orgName}}</span>
              <i class="el-icon-delete fr ilist" :key="index" @click="DeleteEvent(org, $event)"></i>
              <i class="el-icon-edit fr ilist"  @click="EditEvent(org, $event)"></i>
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
    <!-- 添加幼儿园的dialog ，注意:before-close="handleClose"来设置错号关闭时候的清空函数-->
    <el-dialog title="添加幼儿园" :visible.sync="dialogAddVisible" :before-close="handleClose">
      <!-- 添加幼儿园的表单 -->
      <el-form ref="addForm" :model="addForm" :rules="addrules" label-width="150px">
        <el-form-item label="幼儿园名称" prop="name">
          <el-input v-model="addForm.name" style="width:300px;" placeholder="幼儿园名称"  required></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;margin-bottom:0;margin-top:20px">
          <el-button type="primary" @click="submitAddForm('addForm')" >提交</el-button>
          <el-button @click="resetAddForm('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改幼儿园名称的dialog ，注意:before-close="handleClose"来设置错号关闭时候的清空函数-->
    <el-dialog title="修改幼儿园" :visible.sync="dialogEditVisible"  :before-close="handleClose">
      <!-- 修改幼儿园的表单 -->
      <el-form ref="editForm" :model="editForm" :rules="editrules" label-width="150px">
        <el-form-item label="幼儿园名称" prop="name">
          <el-input v-model="editForm.name" style="width:300px;" placeholder="幼儿园名称" required></el-input>
        </el-form-item>
        <el-form-item style="text-align:right;margin-bottom:0;margin-top:20px">
          <el-button type="primary" @click="submitEditForm('editForm')">提交</el-button>
          <el-button @click="resetEditForm('editForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除当前的幼儿园 -->
    <el-dialog title="删除幼儿园" :visible.sync="dialogDeleteVisible" :before-close="handleClose">
      <p style="padding-left:50px">是否删除机构：<span style="color:red">{{deleteForm.name}}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteOrg">确 定</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { requestGetOrgList, requestAddOrg, requestPatchOrg, requestDeleteOrg } from 'api/org'
import { requestGetManagers } from 'api/manager'
import { sessionStorageUtil } from 'lib/util'

export default {
  name: 'manager-sidebar',
  data: function() {
    return {
      hasList: false,
      // 计时器次数
			sendCount: 60,
      // 数据
      orgName: '',
      orgList: [],
      //添加对话框的flag
      dialogAddVisible: false,
      //添加的表单
      addForm: {
        name: '',
        id: ''
      },
      //添加幼儿园的验证规则
      addrules: {
        name:[
          { required: true, message: '请输入名称', trigger: 'blur,change' }
        ]
      },
      //修改对话框的flag
      dialogEditVisible: false,
      //修改的表单
      editForm: {
        name: '',
        id: ''
      },
      editrules: {
        name:[
          { required: true, message: '请输入名称', trigger: 'blur,change' }
        ]
      },
      // 删除对话框的flag
      dialogDeleteVisible: false,
      // 删除的幼儿园数据
      deleteForm: {
        name: '',
        id: ''
      }
    }
  },
  mounted: function() {
    this.getOrgName()
    // 解决刷新问题
    sessionStorageUtil.get('orgList') ? (this.orgList = sessionStorageUtil.get('orgList')) : this.getOrgList()
    this.checkData()
    this.openFirstOrg()
	},
	methods: {
    /** 
     * 查看storage中是否有数据，解决刷新的问题
     */
    checkData: function() {
      sessionStorageUtil.get('orgList') && (this.hasList = true)
    },

    /** 
     * 获取机构名称
     */
    getOrgName: function() {
      this.orgName = sessionStorageUtil.get('orgName')
    },

    /** 
     * 获取机构列表的数据
     */
    getOrgList: function() {
      return requestGetOrgList(sessionStorageUtil.get('orgId'))
        .then( res => {
          if(res.code === 200){
            sessionStorageUtil.set('orgList', res.data.list)
            this.scrollInit()
            this.orgList = res.data.list
          }
        }) 
    },

    /** 
     * 滚动条初始化
     */
		scrollInit: function() {
      $('#scrollEle').slimScroll({
        height: '700px',
        width: '220px',
        size: '2px',
        borderRadius: '4px',
        alwaysVisible: true,
        color: '#4D4D4D',
        railVisible: false,
        railColor: '#E8E8E8',
        railOpacity: 1
      })
    },

    /** 
     * 当含有机构下面的幼儿园数据的时候，默认加载出来的时候要点击第一个机构,同时也要使ul打开
     */
    openFirstOrg: function() {
      setTimeout(function() {
        $('.itemsli')[0] && $($('.itemsli')[0]).children('span')[0].click()
        $('.itemsli')[0] && $('.s-list-btn').children('span').click()
      }, 50)
    },

    /** 
     * 点击显示ul列表 ,同时也要使ul打开
     */
    toggleSlide: function(event) {
      $(event.target.parentNode).children('i').filter('.ileft').toggleClass('click')
      $('#scrollEle').slideToggle('fast')
    },

    /** 
     * 点击获得当前的机构名称，传递给父组件
     * @param {Object} org: 当前的机构对象
     * @param {Object} event: 当前的事件
     */
    getCurOrg: function(org, event) {
      $(event.target.parentNode).css({'background':'#478DE4', 'color':'white'}).siblings().css({'background':'', 'color':''})
      this.$emit('setActiveOrgInfo', org) 
    },

    /** 
     * 删除幼儿园按钮
     * @param {Object} org: 当前的机构对象
     * @param {Object} event: 当前的事件
     */
    DeleteEvent: function(org, event) {
      // 设置临时的下标数字
      sessionStorageUtil.set('tempIndex', $('.itemsli').index($(event.target.parentNode)))
      this.deleteForm.name = org.orgName
      this.deleteForm.id = org.orgId
      this.dialogDeleteVisible = true
    },

    /** 
     * 编辑幼儿园按钮
     * @param {Object} org: 当前的机构对象
     * @param {Object} event: 当前的事件
     */
    EditEvent: function(org, event) {
      //将org.id的值赋给修改表单的name属性
      sessionStorageUtil.set('tempEditIndex', $('.itemsli').index($(event.target.parentNode)))
      this.editForm.name = org.orgName
      this.editForm.id = org.orgId
      this.dialogEditVisible = true
    },
    
    /** 
     * 添加幼儿园
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
            // 添加机构
            this._addOrg(formName)
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
     * 添加机构的请求
     * @param {string} formName: 表单的名称
     */
    _addOrg: function(formName) {
      requestAddOrg(this.addForm)
        .then( res => {
          if (res.code === 200) {
            this.getOrgList()
              .then( () => {
                //  添加第一个的时候让列表下拉并且点击
                if($('.itemsli').size() == 1) {
                  $($('.itemsli')[0]).children('span')[0].click()
                  $('.s-list-btn').children('span').click()
                  // 发送到父组件，使得initvue隐藏
                  this.$emit('showInitVue', false)
                }
                // 添加的不是第一个，添加之后自动点击
                if(this.orgList.length>1){
                  $($('.itemsli')[this.orgList.length-1]).children('span')[0].click()
                }
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
                    duration: 1000
                  })
                }, 50)
              })
          }
        })
    },
    
    /** 
     * 添加幼儿园取消按钮
     * @param {String} formName: 表单名称
     */
    resetAddForm: function(formName) {
      //清空重置
      this.$refs[formName].resetFields()
      this.dialogAddVisible = false
    },

    /** 
     * 修改幼儿园
     * @param {String} formName: 表单名称
     */
    submitEditForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 请求修改幼儿园名称并且重新获取现在所有的幼儿园
          requestPatchOrg(this.editForm).then( res => {
            // 重新获取机构列表
            this.getOrgList().then( () => {
              //清空重置
              this.$refs[formName].resetFields()
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
              // 修改成功之后模拟点击
              $($('.itemsli')[sessionStorageUtil.get('tempEditIndex')]).children('span')[0].click()
            })
          })
        } else return false
      })
    },

    /** 
     * 修改幼儿园取消
     * @param {String} formName: 表单名称
     */
    resetEditForm: function(formName) {
      this.$refs[formName].resetFields()
      this.dialogEditVisible = false
    },

    /** 
     * 关闭弹窗
     */
    handleClose: function(done){
      //清空重置，当dialog的flag为真时候清空对应的表单数据
      this.dialogAddVisible && this.$refs['addForm'].resetFields()
      this.dialogEditVisible && this.$refs['editForm'].resetFields()
      done()
    },

    /** 
     * 调用删除幼儿园的请求方法,先请求下面的管理员列表，看看是否有管理员，没有才真正的删除,成功之后提示删除成功
     */
    deleteOrg: function() {
      requestGetManagers(this.deleteForm.id).then( data => {
        if (!data.length) {
          requestDeleteOrg(this.deleteForm.id).then( res =>{
            if (res.code === 200) {
              // 删除之后重新获取管理员列表
              this.getOrgList().then( () => {
                this.dialogDeleteVisible = false
                //刷新现在所有的幼儿园之后提示成功
                let self = this
                setTimeout(function() {
                  self.$message({
                    message: '恭喜你，删除成功',
                    type: 'success',
                    duration: 1000
                  })
                }, 50)
                // 删除之后点击上一下列表,注意区分是不是删除第一个，通过临时的变量index
                if ((sessionStorageUtil.get('tempIndex'))>0) {
                  $($('.itemsli')[sessionStorageUtil.get('tempIndex')-1]).children('span')[0].click()
                } else {
                  // 如果此时的列表数据为空那就让页面返回最初始化的状态，就是让HomeContentInit显示
                  if(!sessionStorageUtil.get('orgList').length) {
                    this.$emit('showInitVue', true)
                  } else {
                    // 如果还有数据就让第一个自动出现
                    $($('.itemsli')[0]).children('span')[0].click()
                  }
                }
              })
            }
          })
        } else {  // 含有园长管理员的列表
          this.dialogDeleteVisible = false
          //刷新现在所有的幼儿园之后提示成功
          let self = this
          setTimeout(function() {
            self.$message({
              message: '请先删除管理员在删除机构',
              type: 'warning',
              duration: 2000
            })
          }, 50)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .c-sidebar
    position absolute
    top 0
    left 0
    bottom 0
    width 220px
    background-color #F5F5F5
    overflow hidden

    /*按钮区域*/
    .m-sidebar-btn
      height 60px
      line-height 60px
      text-align center
      .sidebarBtn
        width 180px
        height 40px
        line-height 40px
        border-radius 5px
        border 1px solid black
        font-size 18px
        &:hover
          background-color #478DE4
          color white
          border-color #478DE4
        .isize
          width 30px
         
    /*列表区域*/
    .m-sidebar-list
      position absolute
      top 60px
      left 0
      bottom 20px
      width 220px
      overflow hidden

      /*列表区域的按钮*/
      .s-list-btn
        position relative
        display block
        width 210px
        height 49px
        padding-left 10px
        line-height 49px
        color #869fb1
        font-size 16px
        span
          display inline-block
          width 200px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          text-align center
        i 
          position absolute
          top 18px
          right 10px
          display inline-block
          vertical-align middle
          width 16px
          height 16px  
        .click /*点击之后箭头的样式*/
          transition transform 500ms
          transform rotate(180deg)  

      /*列表区域的所有列表选项*/
      .s-list-items
        li
          width 213px
          height 48px
          line-height 48px
          padding-right 10px
          text-align center
          color black
          cursor pointer
          &:hover
            background-color #478DE4
            color white
          &:hover span
            color white  
          &:hover .ilist
            visibility visible
          span
            display inline-block
            width 140px
            white-space nowrap
            overflow hidden
            text-overflow ellipsis    
          .ilist /*图标的位置*/
            visibility hidden
            width 30px
            height 48px
            line-height 48px      
</style>

