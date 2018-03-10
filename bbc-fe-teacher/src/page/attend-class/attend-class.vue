/** 
 * @Desc: 开心上课页面
 */
<template>
  <div class="attend-class">
    <v-header></v-header>
    <content-box>
      <v-loading v-show="loadingVisible"></v-loading>
      <!-- S 头部 -->
      <lesson-header>
        <span v-if="curCourse.courseId">
          {{ curCourse.courseDate | dateZh }} 
          第{{ curCourse.courseOrder }}节 
          <span style="margin-left:8px;">{{ curCourse.courseName }}</span>
        </span>
        <span v-else>当前没有课程</span>
      </lesson-header>
      <!-- E 头部 -->

      <!-- S 右侧菜单 -->
      <v-menu>
        <v-menu-item @click.native="courseTable.courseTableVisible = true">
          <v-icon type="icon-course-table" size="40"/>
          <p class="menu-item-title">课程表</p>
        </v-menu-item>
        <v-menu-item @click.native="_manualClick" v-if="courseResource.manual.length">
          <v-icon type="icon-manual" size="40"/>
          <p class="menu-item-title">手册</p>
        </v-menu-item>
        <v-menu-item @click.native="_materialPackageClick" v-if="courseResource.materialPackage.length">
          <v-icon type="icon-material-package" size="40"/>
          <p class="menu-item-title">材料包</p>
        </v-menu-item>
        <v-menu-item @click.native="_showCourseware" v-if="courseResource.courseware">
          <v-icon type="icon-attend-class" size="40"/>
          <p class="menu-item-title">上课啦</p>
        </v-menu-item>
      </v-menu>
      <!-- E 右侧菜单 -->

      <!-- S 播放器 -->
      <div class="player-wrapper" ref="playerWrapper"></div>
      <!-- E 播放器 -->

      <!-- S 课程表 -->
      <full-calendar 
        :visible.sync="courseTable.courseTableVisible" 
        :year="courseTable.year"
        :month="courseTable.month"
        @prevMonth="_prevMonth"
        @nextMonth="_nextMonth"
        @courseClick="_calendarCourseClick"/>
      </full-calendar>
      <!-- E 课程表 -->

      <!-- S 手册 -->
      <viewer-image ref="manual" :imgList="courseResource.manual"></viewer-image>
      <!-- E 手册 -->

      <!-- S 材料包 -->
      <viewer-image ref="materialPackage" :imgList="courseResource.materialPackage"></viewer-image>
      <!-- E 材料包 -->

      <!-- S 课件 -->
      <viewer-pdf 
        ref="courseware" 
        :pdfUrl="courseResource.courseware"
        :videos="courseResource.coursewareVideos">
      </viewer-pdf>
      <!-- E 课件 -->
    </content-box>
  </div>
</template>

<script type="text/ecmascript-6">
  import VMenu from 'component/menu'
  import VMenuItem from 'component/menu-item'
  import ContentBox from 'component/content-box'
  import ViewerPdf from 'base/viewer-pdf'
  import ViewerImage from 'base/viewer-image'
  import FullCalendar from 'component/full-calendar'
  import LessonHeader from 'component/lesson-header'
  import { playerFileName } from 'config/config'
  import { requestGetDefaultCourse, requestGetCourseResource } from 'api/attend-class'
  import moment from 'moment'
  export default {
    name: 'AttendClass',
    components: {
      VMenu,
      VMenuItem,
      ContentBox,
      ViewerPdf,
      ViewerImage,
      FullCalendar,
      LessonHeader
    },
    data: function() {
      return {
        // 课程表
        courseTable: {
          courseTableVisible: false,
          year: '',
          month: '',
        },
        // 当前选中课程
        curCourse: {
          courseId: '',
          courseName: '',
          courseOrder: '',
          courseDate: '2018-1-1',
        },
        // 课程资源
        defaultVideo: '',
        videoCover: '',
        courseResource: {
          courseware: '',
          coursewareVideos: {},
          manual: [],
          materialPackage: []
        },
        // 播放器实例
        viewBox: {},
        // loading状态
        loadingVisible: false,
      }
    },
    watch: {
      /**
       * 监视视频，实例化播放器
       */
      defaultVideo: function(newValue) {
        this.viewBox = new Viewbox({
          wrapper: this.$refs.playerWrapper,
          src: `/static/res/${playerFileName}.swf`,
          videoUrl: `${newValue}.vs4`,
          coverUrl: `${this.videoCover}`,
          bg: '#000000'
        })
      }
    },
    methods: {
      /**
       * 材料包点击
       */
      _materialPackageClick: function() {
        if (!this.courseResource.materialPackage.length) {
          this.$VMessage('info', '当前课程没有材料包')
          return 
        }
        // 如果有默认的视频就调用视频的关闭方法
        if (this.defaultVideo != ''){
          this.viewBox.pause()
        }
        this.$refs.materialPackage._show()
      },

      /**
       * 手册按钮点击
       */
      _manualClick: function() {
        if (!this.courseResource.manual.length) {
          this.$VMessage('info', '当前课程没有手册')
          return 
        }
        // 如果有默认的视频就调用视频的关闭方法
        if (this.defaultVideo != ''){
          this.viewBox.pause()
        }
        this.$refs.manual._show()
      },

      /**
       * 显示课件
       */
      _showCourseware: function() {
        if (this.defaultVideo != ''){
          this.viewBox.pause()
        }
        this.$refs.courseware._show()
      },

      /**
       * 课程表上个月
       */
      _prevMonth: function() {
        if (this.courseTable.month === 1) {
          this.courseTable.year--
          this.courseTable.month = 12
        }
        else {
          this.courseTable.month--
        }
      },

      /**
       * 课程表下个月
       */
      _nextMonth: function() {
        if (this.courseTable.month === 12) {
          this.courseTable.year++
          this.courseTable.month = 1
        }
        else {
          this.courseTable.month++
        }
      },
      
      /**
       * 全日历课程点击事件
       * @param (Object)course：当前点击课程
       * @param (Number)corder：第几节
       */
      _calendarCourseClick: function(course, order) {
        this.courseTable.courseTableVisible = false
        // 设置选中课程id
        this.curCourse.courseId = course.courseId
        this._getCourseResource()
      },

      /**
       * 设置课程表年月
       */
      _setCourseTableDate: function() {
        const courseTimeArray = this.curCourse.courseDate.split('-')
        this.courseTable.year = courseTimeArray[0]
        this.courseTable.month = parseInt(courseTimeArray[1])
      },
      
      /**
       * 获取默认课程
       */
      _getDefaultCourse: function() {
        this.loadingVisible = true
        requestGetDefaultCourse()
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetDefaultCourse SUCCESS', res)
              if (!res.data.courseId) {
                // console.log('no default course')
                this.curCourse.courseId = ''
                this.curCourse.courseDate = moment().format('YYYY-MM-DD')
                // 设置课程表年月
                this._setCourseTableDate()
                return
              }
              this.curCourse.courseId = res.data.courseId
              this.curCourse.courseDate = res.data.courseTime
              // 设置课程表年月
              this._setCourseTableDate()
              // 获取课程资源
              this._getCourseResource()
            }
            else {
              // console.log('requestGetDefaultCourse FAIL', res)
            }
          })
          .catch(err => {
            // console.log('requestGetDefaultCourse FAIL', err)
          })
      },

      /**
       * 请求课程资源
       */
      _getCourseResource: function() {
        this.loadingVisible = true
        sessionStorage.setItem('attendClassId', this.curCourse.courseId)
        requestGetCourseResource(this.curCourse.courseId)
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)
            if (res.code === 200) {
              // console.log('requestGetCourseResource SUCCESS', res)
              // 设置课程信息
              this.curCourse.courseId = res.data.course.courseId
              this.curCourse.courseName = res.data.course.courseName
              this.curCourse.courseOrder = res.data.course.courseOrder
              this.curCourse.courseDate = res.data.course.courseTime
              // 设置课程表年月
              this._setCourseTableDate()
              // 设置课程资源
              this.videoCover = res.data.defaultVideoCover
              this.defaultVideo = res.data.defaultVideo
              this.courseResource.manual = res.data.manual ? res.data.manual : []
              this.courseResource.materialPackage = res.data.materialPackage ? res.data.materialPackage : []
              this.courseResource.coursewareVideos = res.data.courseware.videos
              this.courseResource.courseware = 
                res.data.coursePrepareCoursewareType === 'DEFAULT' 
                ? res.data.courseware.defaultUrl 
                : res.data.courseware.customUrl
            }
            else {
              // console.log('requestGetCourseResource FAIL', res)
            }
          })
          .catch(err => {
            // console.log('requestGetCourseResource FAIL', err)
          })
      },
    },
    mounted: function() {
      // 判断是否有路由参数courseId
      const courseId = this.$route.query.courseId
      if (courseId) {
        this.curCourse.courseId = courseId
        this._getCourseResource()
        return 
      }
      // 缓存课程id
      const cacheCourseId = sessionStorage.getItem('attendClassId')
      if (cacheCourseId) {
        this.curCourse.courseId = cacheCourseId
        this._getCourseResource()
      }
      else {
        // 获取默认课程
        this._getDefaultCourse()
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~style/variable'
  .attend-class
    position relative
    height 100%
    background url(../../image/bottom-bg1.png) no-repeat 0 bottom, url(../../image/top-bg3.png) no-repeat 0 top 
    /* 菜单标题 */
    .menu-item-title
      line-height 1.2
      font-size $font-size-small
    /* 播放器包裹 */
    .player-wrapper
      position absolute
      top 60px
      right 0
      bottom 0
      left 0

  @media screen and (max-width: 1600px)
    .attend-class
      background url(../../image/bottom-grassland.png) no-repeat 0 bottom, url(../../image/top-bg2.png) no-repeat 0 top 
</style>

