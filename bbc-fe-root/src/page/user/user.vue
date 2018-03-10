/*
 * @Author: wzy
 * @Desc: 添加超级管理员主页面组件
 */
<template>
	<div class="c-user">
		<v-header></v-header>
		<user-content></user-content>
	</div>
</template>
 
<script type="text/ecmascript-6">
import UserContent from './components/user-content'
export default {
  name: 'user',
  components: {
		UserContent
	}
}
</script>
 
<style lang="stylus" scoped>
  .c-user
    position relative
    width 100%
    height 100%
</style>
 
 