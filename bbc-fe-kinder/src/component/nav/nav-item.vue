/** 
 * @Desc: 二级导航
 */
<template>
  <li 
    class="nav-item clickable" 
    :class="{'active': active}"
    @mouseover="editVisible = true" 
    @mouseout="editVisible = false">
    <slot></slot>
    <template v-if="edit">
      <!-- S 下拉菜单 -->
      <Dropdown trigger="click" class="edit-dropdown">
        <v-icon 
          v-show="editVisible"
          class="edit-button clickable hover-light" 
          type="icon-edit" 
          size="14">
        </v-icon>
        <DropdownMenu slot="list">
          <DropdownItem @click.native.stop="$emit('editClass')">修改班级信息</DropdownItem>
          <DropdownItem @click.native.stop="$emit('removeClass')">删除班级</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <!-- E 下拉菜单 -->
    </template>
  </li>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'VNavItem',
    props: {
      active: {
        type: Boolean,
        default: false
      },
      edit: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        editVisible: false,
        dropdownVisible: false,
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .nav-item
    position relative
    height 40px
    line-height 38px
    width 190px
    margin 10px auto 0
    font-size 16px
    color rgb(254, 251, 229)
    border-radius 10px
    border 1px solid rgba(141,92,44,.3)
    background-image linear-gradient( 0deg, rgba(141,92,44,.6) 0%, rgba(162,116,52,.6) 50%, rgba(141,92,44,.6) 99%)
    &:hover,
    &.active
      background-image linear-gradient( 0deg, rgba(141,92,44,.8) 0%, rgba(162,116,52,.8) 50%, rgba(141,92,44,.8) 99%)
      border-color rgba(251, 241, 176,.6)
    .edit-dropdown
      position absolute
      top 38px
      right 10px
      .edit-button
        position absolute
        top -25px
        right 0px
</style>
