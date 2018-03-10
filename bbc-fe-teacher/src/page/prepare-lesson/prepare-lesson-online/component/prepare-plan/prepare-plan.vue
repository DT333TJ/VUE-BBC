/** 
 * @Desc: tab组件 教案内容
 */
<template>
  <div class="prepare-plan">
    <embed 
      type="application/pdf" 
      width="100%" 
      height="100%" 
      :src="preparePlanUrl">
    </embed>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'PreparePlan',
    props: {
      preparePlanUrl: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .prepare-plan
    height 100%
</style>
