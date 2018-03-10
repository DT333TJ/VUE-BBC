/** 
 * @Desc: 公共头部
 */
<template>
  <div class="header clear-float">
    <div class="header-logo float-left">
      BBC幼儿课程
    </div>

    <!-- 路由导航 -->
    <ul class="header-nav float-left clear-float">
      <router-link
        class="nav-item clickable float-left"
        tag="li"
        :key="index" 
        :to="navItem.to"
        v-for="(navItem, index) in navList">
        {{ navItem.title }}
      </router-link>
    </ul>

    <!-- 用户信息 -->
    <div class="header-user">
      <span class="user-text" style="margin-right:10px;">{{ $store.state.orgName }}</span>
      <span class="user-text" style="margin-right:10px;">{{ $store.state.userName }}</span>
      <Dropdown>
        <v-avatar 
          class="clickable"
          size="50"
          src="/static/res/img/user-avatar.png"/>
        <DropdownMenu slot="list">
            <DropdownItem @click.native="editUserDialogVisible = true">修改个人信息</DropdownItem>
            <DropdownItem @click.native="$router.push('/login')">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>

    <!-- 修改个人信息表单 -->
    <Modal 
      title="修改个人信息"
      v-model="editUserDialogVisible"
      @on-ok="_handleEditUser"
      @on-cancel="$refs['editUserForm'].resetFields()">
      <Form 
        :model="editUserForm"
        :rules="editUserFormRule"
        :labelWidth="60"
        ref="editUserForm"
        style="padding:0 80px;">
        <FormItem label="姓名" prop="name">
          <Input v-model="editUserForm.name" placeholder="请输入姓名"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input :disabled="true" v-model="editUserForm.phone"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import VAvatar from 'base/avatar'
  import { requestPatchUserInfo } from 'api/user'
  export default {
    name: 'VHeader',
    components: {
      VAvatar
    },
    data: function() {
      return {
        // 导航
        navList: [
          {
            to: '/student-manage',
            title: '学生管理'
          },
          {
            to: '/teaching-manage',
            title: '教学管理'
          },
          {
            to: '/staff-management',
            title: '职工管理'
          },
          {
            to: '/control-center',
            title: '控制中心'
          }
        ],
        userInfo: {
          orgName: '',
          nickName: '',
          phone: ''
        },
        // 修改用户对话框
        editUserDialogVisible: false,
        editUserForm: {
          phone: this.$store.state.userPhone,
          name: this.$store.state.userName,
        },
        editUserFormRule: {
          name: [
            {
              required: true,
              message: '请输入姓名'
            },
            {
              min: 2,
              max: 10,
              message: '长度在 2 至 10 个字之间'
            }
          ]
        }
      }
    },
    methods: {

      /**
       * 请求修改用户信息
       */
      _handleEditUser: function() {
        // 表单校验
        this.$refs['editUserForm'].validate((valid) => {
          if (valid) {
            // 提交修改
            requestPatchUserInfo(this.editUserForm)
              .then(res => {
                if (res.code === 200) {
                  // console.log('requestPatchUserInfo SUCCESS', res)
                  // 重新获取数据
                  this.$VMessage('success', '个人信息修改成功')
                  this.$store.dispatch('getUserInfo')
                  this.editUserDialogVisible = false
                }
                else {
                  this.$VMessage('error', '个人信息修改失败')
                }
              })
              .catch(err => {
                Promise.reject(err)
              })
            } 
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  /* 按需引入变量和方法 */
  @import '~style/variable'
  .header
    width 100%
    height 84px
    line-height 84px
    padding 0 40px 
    color #fff
    font-size 18px
    font-weight bold
    background-image url(./img/header-bg.png)
    background-repeat no-repeat
    background-size cover
    /* logo */
    .header-logo
      height 100%
      font-size 35px
    /* nav */
    .header-nav
      margin-top 22px
      margin-left 90px
      .nav-item
        width 110px
        height 42px
        line-height 42px
        border-radius 42px
        margin-right 36px
        color #d3ecdf
        text-align center
        transition .3s
        &:hover
          background-color $color-text-sub
          color #199854
          background-image linear-gradient( to bottom, #aadcc1, 30%, #d1ebdd 70%) 
      .router-active
        background-color $color-text-sub
        color #199854
        background-image linear-gradient( to bottom, #aadcc1, 30%, #d1ebdd 70%) 
    /* 用户 */       
    .header-user
      float right
      margin-top 16px
      height 50px
      line-height 50px
      .user-text
        color white
</style>
