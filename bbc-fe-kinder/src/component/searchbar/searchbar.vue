/** 
 * @Desc: 搜索框
 */
<template>
  <div class="searchbar" :style="{ width: width + 'px' }">
    <input 
      class="searchbar-input" 
      type="text"
      v-model.trim="keyword"
      :placeholder="placeholder"
      @keydown.enter="_searchClick"/> 
    <v-icon 
      class="searchbar-search-btn clickable" 
      type="icon-search" 
      size="16"
      @click.native="_searchClick"/>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Searchbar',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      width: {
        type: Number
      }
    },
    data: function(){
      return {
        keyword: ''
      }
    },
    methods: {
      /**
       * 搜索点击
       */    
      _searchClick: function() {
        if (this.keyword) {
          this.$emit('search', this.keyword)
        }
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .searchbar
    position relative
    height 30px
    display inline-block
    vertical-align middle
    .searchbar-input
      width 100%
      height 30px
      padding 0 40px 0 16px
      vertical-align top
      border-radius 15px
      border 1px solid rgb(209, 133, 48)
      font-size 14px
      background-color #F8EDE0
      box-shadow 0px 1px 3px 0px rgba(148, 140, 98, 0.72),inset 0px 2px 2px 0px rgba(0, 0, 0, 0.25),inset 0px -2px 0px 0px rgba(255, 255, 255, 0.28)
      &:hover
        opacity .7
      &:focus
        opacity 1
    .searchbar-search-btn
      position absolute
      top 7px 
      right 12px
      &:hover
        opacity .7
</style>

