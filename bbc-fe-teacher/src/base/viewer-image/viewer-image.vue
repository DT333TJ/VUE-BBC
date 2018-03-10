/*
 * @Desc: 图片全屏预览组件（考虑到后期添加控制按钮、扩展，没有和viewer合并）
 */
<template>
  <div class="viewer-image" ref="viewerImage" v-show="visible">
    <img class="img" :src="imgList[pageIndex]" alt="">
  </div>
</template>

<script type="text/ecmascript-6">
  import { enterFullScreen, exitFullScreen, isFullscreen } from 'lib/util'
  export default {
    name: 'ViewerImage',
    props: {
      // 图片集
      imgList: {
        type: Array,
        required: true
      }
    },
    data: function() {
      return {
        // 控制组件显示状态
        visible: false,
        // 当前页面索引
        pageIndex: 0
      }
    },
    methods: {
      /**
       * 显示组件
       */
      _show: function() {
        // 进入全屏、绑定事件 
        if (!isFullscreen()) {
          // 当前不是全屏才通过requestFullScreen开启全屏
          enterFullScreen(this.$refs.viewerImage)
        }
        this._bindEvent()
        this.visible = true
      },

      /**
       * 隐藏组件
       */
      _hide: function() {
        // 退出全屏、解绑事件
        exitFullScreen()
        this._removeEvent()
        this.visible = false
      },

      /**
       * 绑定keydown、resize事件
       */
      _bindEvent: function() {
        window.addEventListener('keydown', this._keydownEvent)
        window.addEventListener('resize', this._resizeEvent)
      },

      /**
       * 解绑keydown、resize事件
       */
      _removeEvent: function() {
        window.removeEventListener('keydown', this._keydownEvent)
        window.removeEventListener('resize', this._resizeEvent)
      },

      /**
       * resize事件（通过requestFullScreen开启的全屏，按esc默认退出全屏，会触发resize事件）
       */
      _resizeEvent: function() {
        // 当前不是全屏，才隐藏组件
        if (!isFullscreen()) {
          this._hide()
        }
      },

      /**
       * 键盘事件
       */
      _keydownEvent: function(ev) {
        ev = ev || event
        // 上一张
        if (ev.keyCode === 37) {
          this.pageIndex > 0 && this.pageIndex--
        }
        // 下一张
        if (ev.keyCode == 39) {
          this.pageIndex < this.imgList.length - 1 && this.pageIndex++
        }
        // 退出全屏，隐藏组件（f11开启的全屏能检测到esc键）
        if (ev.keyCode == 27) {
          this._hide()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-image
    position fixed
    top 0 
    right 0
    bottom 0
    left 0
    z-index 999
    .img 
      width 100%
      height 100%
</style>