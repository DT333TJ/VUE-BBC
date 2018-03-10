/*
 * @Desc: 视频全屏预览组件
 */
<template>
  <div class="viewer-video mask" v-show="visible">
    <div class="viewer-video-wrapper center" ref="wrapper">
      <close-button 
        size="36"
        class="viewer-video-close" 
        @click.native="_closeVideo">
      </close-button>
      <div style="width:100%;height:100%;" ref="playerWrapper"></div>
      <!-- S 自定义播放器全屏 -->
      <v-icon 
        class="full-screen clickable" 
        type="icon-full-screen" 
        size="38" 
        color="#8F8F8F"
        @click.native="_fullScreen">
      </v-icon>
      <!-- E 自定义播放器全屏 -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CloseButton from 'base/close-button'
  import { playerFileName } from 'config/config'
  export default {
    name: 'ViewerVideo',
    components: {
      CloseButton
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
        required: true
      },
      videoUrl: {
        type: String,
        required: true
      },
      coverUrl: {
        type: String,
        required: true
      }
    },
    data: function() {
      return {
        videoFullscreen: false,
      }
    },
    watch: {
      videoUrl: function(newValue) {
        console.log('切换:', newValue)
        // 清空视频容器
        this.$refs.playerWrapper.innerHTML = ''
        // 给视频容器赋值
        if(true) {
          let videoEle = '<video src="' + this.videoUrl.i + '" width="100%" height="100%" controls="controls"/>'
          this.$refs.playerWrapper.innerHTML = videoEle
        } 
        else {
          // 实例化viewbox
          new Viewbox({
            wrapper: this.$refs.playerWrapper,
            src: `/static/res/${playerFileName}.swf`,
            videoUrl: this.videoUrl.i + '.vs4',
            coverUrl: this.videoUrl.i + '.jpg',
            bg: '#000000'
          })
        }
      },
    },
    methods: {
      /**
       * 隐藏播放器
       */
      _closeVideo: function() {
        this.$emit('update:visible', false)
        this.videoFullscreen = false
        this.$refs.wrapper.style.width = '1067px'
        this.$refs.wrapper.style.height = '600px'
      },

      /**
       * 播放器全屏
       */
      _fullScreen: function() {
        this.videoFullscreen = !this.videoFullscreen
        if (this.videoFullscreen) {
          this.$refs.wrapper.style.width = '100%'
          this.$refs.wrapper.style.height = '100%'
        }
        else {
          this.$refs.wrapper.style.width = '1067px'
          this.$refs.wrapper.style.height = '600px'
        }
      },
    },
    mounted: function() {
      // // 实例化viewbox
      // new Viewbox({
      //   wrapper: this.$refs.playerWrapper,
      //   src: `/static/res/${playerFileName}.swf`,
      //   videoUrl: this.videoUrl,
      //   coverUrl: this.coverUrl,
      //   bg: '#000000'
      // })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .viewer-video
    .viewer-video-wrapper
      width 1067px
      height 600px
      .viewer-video-close
        position absolute
        top -40px
        right -50px
      .full-screen
        position absolute
        right -1px
        bottom -6px

  @media screen and (max-width 1600px) 
    .viewer-video
      .viewer-video-wrapper
        .viewer-video-close
          top -10px
          right -60px
</style>

