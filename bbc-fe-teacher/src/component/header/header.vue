/** 
 * @Desc: 头部组件
 */
<template>
  <div class="header">
    <!-- S 用户 -->
    <div class="user">
      <span class="school-name">{{ $store.state.orgName }}</span>
      <span class="emp-name">{{ $store.state.userName }}</span>
      <Dropdown>
        <v-avatar 
          class="clickable"
          size="50"
          src="/static/res/img/user-avatar.png"/>
        <DropdownMenu slot="list">
            <DropdownItem @click.native="_editUserClick">修改个人信息</DropdownItem>
            <DropdownItem @click.native="$router.push('/login')">退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <!-- E 幼儿园名称 -->

    <!-- S 导航区 -->
    <div class="nav">
      <ul class="nav-list">
        <router-link 
          class="nav-item clickable" 
          tag="li" 
          :to="navItem.to"  
          v-for="(navItem, index) in navList" 
          :key="index">
          {{ navItem.title }}
        </router-link>
      </ul>
    </div>
    <!-- E 导航区 -->

    <!-- S 修改用户信息对话框 -->
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
          <Input size="large" v-model="editUserForm.name" placeholder="请输入姓名"/>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input size="large" :disabled="true" v-model="editUserForm.phone"/>
        </FormItem>
      </Form>
    </Modal>
    <!-- E 修改用户信息对话框 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import VAvatar from 'base/avatar'
  import { requestPatchUserInfo } from 'api/user'
  export default {
    name: 'VHeader',
    components: {
      VAvatar,
    },
    data: function() {
      return {
        // 导航
        navList: [
          {
            to: '/home',
            title: '首页'
          },
          {
            to: '/attend-class',
            title: '开心上课'
          },
          {
            to: '/prepare-lesson',
            title: '轻松备课'
          },
          {
            to: '/class-manage',
            title: '班级管理'
          },
          {
            to: '/my-collection',
            title: '我的收藏'
          }
        ],
        // 修改用户对话框
        editUserDialogVisible: false,
        editUserForm: {
          phone: '',
          name: ''
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
       * 修改用户信息点击
       */
      _editUserClick: function() {
        this.editUserForm.name = this.$store.state.userName
        this.editUserForm.phone = this.$store.state.userPhone
        this.editUserDialogVisible = true
      },

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
                  this.$VMessage('success', '个人信息修改成功')
                  this.editUserDialogVisible = false
                  this.$store.dispatch('getUserInfo')
                }
                else {
                  // console.log('requestPatchUserInfo FAIL', res)
                  this.$VMessage('error', '个人信息修改失败')
                }
              })
              .catch(err => {
                // console.log('requestPatchUserInfo FAIL', err)
              })
            } 
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  @import '~style/mixin'

  /* 路由激活、悬停样式 */
  .router-active, .nav-list .nav-item:hover
    background-color $color-text-sub
    color $color-text
    background-image linear-gradient( -90deg, #D29D5F, 1%, rgb(169,104,29) 100%)
    opacity .8

  /* 头部组件样式 */
  .header
    height 46px
    line-height 46px
    padding 25px 0 30px
    box-sizing content-box
    font-size $font-size-large
    font-weight bold
    color $color-text-sub
    /* 名称和头像 */
    .user
      float right
      margin-right 30px
      .emp-name
        margin 0 10px
    /* 导航区 */
    .nav
      width 58%
      margin 0 auto
      .nav-list 
        clear-float()
        .nav-item
          float left
          width 120px
          margin-left 10px
          text-align center
          border-radius 50px
          transition .3s

  @media screen and (max-width 1600px) 
    .header
      height 40px
      line-height 40px
      font-size 16px
      padding 15px 0 20px
      .nav
        .nav-list
          .nav-item
            width 100px
</style>
