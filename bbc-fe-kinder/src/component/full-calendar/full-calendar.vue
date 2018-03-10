/*
 * @Desc: 全日历组件
 */
<template>
  <div class="full-calendar">
    <!-- S 日历头部 -->
    <div class="full-calenda-header">
      <!-- S 课程领域数量汇总 -->
      <ul class="domain-count">
        <li class="domain-item-wrapper theme-healthy">
          <div class="domain-item course-title">
            <p class="count">{{ courseCount.healthy }}</p>健康
          </div>
        </li>
        <li class="domain-item-wrapper theme-language">
          <div class="domain-item course-title">
            <p class="count">{{ courseCount.language }}</p>语言
          </div>
        </li>
        <li class="domain-item-wrapper theme-sociology">
          <div class="domain-item course-title">
            <p class="count">{{ courseCount.sociology }}</p>社会
          </div>
        </li>
        <li class="domain-item-wrapper theme-art">
          <div class="domain-item course-title">
            <p class="count">{{ courseCount.art }}</p>艺术
          </div>
        </li>
        <li class="domain-item-wrapper theme-science">
          <div class="domain-item course-title">
            <p class="count">{{ courseCount.science }}</p>科学
          </div>
        </li>
      </ul>
      <!-- E 课程领域数量汇总 -->
      
      <!-- S 月份 -->
      <div class="month">
        <v-icon 
          class="month-btn" 
          type="icon-arrow-left" 
          size="16"
          @click.native="_prevMonth">
        </v-icon>
        <span style="padding:0 8px;">{{ year }}年{{ month }}月</span>
        <v-icon 
          class="month-btn" 
          type="icon-arrow-right" 
          size="16"
          @click.native="_nextMonth">
        </v-icon>
      </div>
      <!-- E 月份 -->
    </div>
    <!-- E 日历头部 -->

    <!-- S 日历体 -->
    <div class="full-calenda-body">
      <!-- S 星期 -->
      <ul class="week-no">
        <li>星期日</li>
        <li>星期一</li>
        <li>星期二</li>
        <li>星期三</li>
        <li>星期四</li>
        <li>星期五</li>
        <li>星期六</li>
      </ul>
      <!-- E 星期 -->
      <!-- 提示S -->
      <Modal
          v-model="modal"
          title="提示信息" @on-ok="ok()">
          <p style="text-align:center;">删除—{{this.couseName}}课程？</p>
      </Modal>
      <!-- 提示E -->
      <!-- S 内容 -->
      <ul class="week" v-for="(week, index) in courseTable.weeks" :key="index">
        <li class="day" v-for="(day, index) in week" :key="index">
          <div class="course-wrapper">
            <!-- S 日期 -->
            <p class="course-date" :class="{'not-current-month': Number(day.month) !== month }">
              {{ day.date }}
            </p>
            <!-- E 日期 -->
        
            <!-- S 上午课程 -->
            <div 
              class="course-item"
              @dragover.prevent
              @dragenter.prevent="_courseDragEnter($event, Number(day.month))"
              @dragleave.prevent="$event.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'"
              @drop.prevent="_courseDrop($event, day.morningCourse, day.courseTime, 1, Number(day.month))">
              <div 
                class="course-title-wrapper clickable" 
                :class="{
                  'theme-healthy': day.morningCourse.courseType === '健康',
                  'theme-language': day.morningCourse.courseType === '语言',
                  'theme-sociology': day.morningCourse.courseType === '社会',
                  'theme-art': day.morningCourse.courseType === '艺术',
                  'theme-science': day.morningCourse.courseType === '科学',
                }"
                v-if="day.morningCourse" 
                @mouseenter="$event.currentTarget.lastChild.style.display = 'block'"
                @mouseleave="$event.currentTarget.lastChild.style.display = 'none'">
                <!-- S 课程title -->
                <p class="course-title no-wrap">
                  {{ day.morningCourse.courseName }}
                </p> 
                <!-- E 课程title -->

                <!-- S 删除icon -->
                 <p 
                  class="course-remove" 
                  style="display:none;" 
                  @click="modalShow(day.morningCourse.courseId,day.morningCourse.courseName)">
                  <v-icon type="icon-remove" :size="14" color="#fff"></v-icon>
                </p>
                <!-- E 删除icon -->
              </div>
            </div>
            <!-- S 上午课程 -->

            <!-- S 下午课程 -->
            <div class="course-item"
              @dragover.prevent
              @dragenter.prevent="_courseDragEnter($event, Number(day.month))"
              @dragleave.prevent="$event.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'"
              @drop.prevent="_courseDrop($event, day.afternoonCourse, day.courseTime, 2, Number(day.month))">
              <div 
                class="course-title-wrapper clickable"  
                :class="{
                  'theme-healthy': day.afternoonCourse.courseType === '健康',
                  'theme-language': day.afternoonCourse.courseType === '语言',
                  'theme-sociology': day.afternoonCourse.courseType === '社会',
                  'theme-art': day.afternoonCourse.courseType === '艺术',
                  'theme-science': day.afternoonCourse.courseType === '科学',
                }"
                v-if="day.afternoonCourse"
                @mouseenter="$event.currentTarget.lastChild.style.display = 'block'"
                @mouseleave="$event.currentTarget.lastChild.style.display = 'none'">
                <!-- S 课程title -->
                <p class="course-title no-wrap">
                  {{ day.afternoonCourse.courseName }}
                </p> 
                <!-- E 课程title -->

                <!-- S 删除icon -->
                 <p 
                  class="course-remove" 
                  style="display:none;"
                  @click="modalShow(day.afternoonCourse.courseId,day.afternoonCourse.courseName)">
                  <v-icon type="icon-remove" :size="14" color="#fff"></v-icon>
                </p>
                <!-- E 删除icon -->
              </div>
            </div>
            <!-- E 下午课程 -->
          </div>
        </li>
      </ul>
      <!-- E 内容 -->
    </div>
    <!-- E 日历体 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { 
    requestGetCourseTable, 
    requestAddCourse, 
    requestDeleteCourse 
  } from 'api/course-table-manage'
  export default {
    name: 'FullCalendar',
    props: {
      gradeId: {
        type: [Number, String],
        required: true
      }
    },
    data: function() {
      return {
        year: '',
        month: '',
        courseTable: {},
        courseCount: {
          healthy: 0,
          language: 0,
          sociology: 0,
          art: 0,
          science: 0,
        },
        modal:false,
        couseId:"",
        couseName:""
      }
    },
    watch: {
      /**
       * 监视年级
       */
      gradeId: function(value) {
        this.year = ''
        this.month = ''
        this._getCourseTable()
      }
    },
    methods: {
      /**
       * 拖拽元素进入
       */
      _courseDragEnter: function(event, month) {
        if (month === this.month) {
          event.currentTarget.style.backgroundColor = '#36a16f'
        }
      },

      /**
       * 拖拽元素放下
       */
      _courseDrop: function(event, course, date, order, month) {
        if (month !== this.month) {
          return 
        }
        event.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'

        // 已有课程 
        if (course) {
          return this.$VMessage('info', '请先删除原有课程')
        }

        // 取出携带的课程数据 添加课程
        const courseData = JSON.parse(event.dataTransfer.getData("course"))
        const param = {
          gradeId: this.gradeId,
          courseOrder: order,
          courseId: courseData.courseId,
          courseDate: date
        } 
        this._addCourse(param)
      },

      /**
       * 上月
       */
      _prevMonth: function() {
        if (this.month === 1) {
          this.year--
          this.month = 12
        } else {
          this.month--
        }
        this._getCourseTable()
      },

      /**
       * 下月
       */
      _nextMonth: function() {
        if (this.month === 12) {
          this.year++
          this.month = 1
        } else {
          this.month++
        }
        this._getCourseTable()
      },

      /**
       * 添加课程
       */
      _addCourse: function(param) {
        requestAddCourse(param)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestAddCourse SUCCESS', res)
              this.$VMessage('success', '课程添加成功')
              this._getCourseTable()
              this.$emit('getCourseList')
            }
            else {
              // console.log('requestAddCourse FAIL', res)
              this.$VMessage('error', '课程添加失败')
            }
          })
          .catch(err => {
            // console.log('requestAddCourse FAIL', err)
            this.$VMessage('error', '课程添加失败')
          })
      },

      /**
       * 删除课程
       */
      _removeCourse: function(courseId) {
        requestDeleteCourse(courseId)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestDeleteCourse SUCCESS', res)
              this.$VMessage('success', '课程删除成功')
              this._getCourseTable()
              this.$emit('getCourseList')
            }
            else {
              // console.log('requestDeleteCourse FAIL', res)
              this.$VMessage('error', '课程删除失败')
            }
          })
          .catch(err => {
            // console.log('requestDeleteCourse FAIL', err)
            this.$VMessage('error', '课程删除失败')
          })
      },

      /**
       * 请求课程表
       */
      _getCourseTable: function() {
        requestGetCourseTable(this.gradeId, this.year, this.month)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestGetCourseTable SUCCESS', res)
              this.courseTable = res.data
              // 设置年月
              const fullDate = res.data.fullDate.split('-')
              this.year = fullDate[0]
              this.month = parseInt(fullDate[1])
              // 课程领域统计
              const courseCount = res.data.courseTypeCount
              this.courseCount.healthy = courseCount['健康']
              this.courseCount.language = courseCount['语言']
              this.courseCount.sociology = courseCount['社会']
              this.courseCount.art = courseCount['艺术']
              this.courseCount.science = courseCount['科学']
            }
            else {
              // console.log('requestGetCourseTable FAIL', res)
            }
          })
          .catch(err => {
            // console.log('requestGetCourseTable FAIL', err)
          })
      },

      // 提示框的显示
      modalShow: function(couseId,couseName) {
        this.modal=true;
        this.couseId=couseId;
        this.couseName=couseName;
      },

      // 确认删除事件
      ok: function(couseId) {
        this.modal=false;
        this._removeCourse(this.couseId);
      },
    },
    mounted: function() {
      this._getCourseTable()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .full-calendar
    position absolute
    top 15px
    right 10px
    bottom 10px
    left 10px
    color #57311b
    /* 头部 */
    .full-calenda-header
      height 50px
      text-align center
      position relative
      .domain-count
        position absolute
        top 0
        left 20px
        font-size 12px
        .domain-item-wrapper
          float left
          padding 1px 
          margin-right 10px
          width 38px
          height 38px
          border-radius 5px
          box-shadow 0px 1px 2px 0px rgba(144, 135, 115, 0.69)
          .domain-item
            height 100%
            border-radius 5px
            padding 2px
            line-height 15px
            box-shadow inset 0px -1px 2px 0px rgba(0, 0, 0, 0.18),inset 0px 1px 2px 0px rgba(255, 255, 255, 0.41)
      .month    
        display inline-block
        height 38px
        line-height 38px
        font-size 24px
        margin-right -40px
        user-select none
        .month-btn
          width 26px
          height 26px
          line-height 26px
          margin-top 6px
          cursor pointer
          border-radius 50%
          vertical-align top
          background-color rgb(245, 233, 207)
          box-shadow 0px 0px 2px 0px rgba(208, 196, 171, 0.004),inset 0px 1px 1px 0px rgba(0, 0, 0, 0.26)
          &:hover
            opacity .7
      .right-btns
        position absolute
        top 0
        right 20px
    /* 主体 */
    .full-calenda-body
      position absolute
      top 50px
      right 0
      bottom 0
      left 0
      display flex
      flex-direction column
      font-size 12px
      .week-no
        display flex
        justify-content space-around
        height 30px
      .week
        flex 1
        display flex
        .day
          flex 1
          text-align center
          .course-wrapper
            height 82px
            background url(./img/day-bg.png) no-repeat center
            .course-date
              height 18px
              line-height 20px
              color #907843
              &.not-current-month
                color #B4B4B4
            .course-item
              width 92px
              height 28px
              line-height 28px
              margin 0 auto 4px
              border-radius 5px
              &.active
                background-color #bfa
              .course-title-wrapper
                position relative
                padding 1px
                box-shadow content-box
                border-radius 5px
                box-shadow 0px 1px 2px 0px rgba(144, 135, 115, 0.69)
                .course-title
                  border-radius 5px
                  box-shadow inset 0px -1px 2px 0px rgba(0, 0, 0, 0.18),inset 0px 1px 2px 0px rgba(255, 255, 255, 0.41)
                .course-remove
                  position absolute
                  top 1px
                  right 1px
                  bottom 1px
                  left 1px
                  border-radius 4px

  /* 不同领域主题 */
  .theme-healthy
    background-image linear-gradient( -90deg, rgb(125,219,164) 1%, rgb(85,153,103) 100%)
    .course-title
      color rgb(90, 178, 112)
      text-shadow 0px 1px 0px rgba(198, 245, 210, 0.7)
      background-color rgb(161, 220, 176)
    .course-remove
      background-color rgb(92, 191, 117)
  .theme-language
    background-image linear-gradient( -90deg, rgb(225,135,144) 1%, rgb(171,42,62) 100%)
    .course-title
      color rgb(195, 83, 86)
      text-shadow 0px 1px 0px rgba(255, 188, 189, 0.7)
      background-color rgb(235, 146, 147)
    .course-remove
      background-color rgb(225, 112, 113)
  .theme-sociology    
    background-image linear-gradient( -90deg, rgb(99,187,184) 1%, rgb(76,120,146) 100%)
    .course-title
      color rgb(92, 160, 184)
      text-shadow 0px 1px 0px rgba(222, 246, 254, 0.7)
      background-color rgb(157, 210, 225)
    .course-remove
      background-color rgb(93, 182, 207)
  .theme-art    
    background-image linear-gradient( -90deg, rgb(238,199,151) 1%, rgb(200,150,90) 100%)
    .course-title
      color rgb(196, 164, 91)
      text-shadow 0px 1px 0px rgba(255, 244, 220, 0.69)
      background-color rgb(248, 225, 174)
    .course-remove
      background-color rgb(237, 202, 125)
  .theme-science    
    background-image linear-gradient( -90deg, rgb(175,175,255) 1%, rgb(127,127,218) 100%)
    .course-title
      color rgb(128, 128, 219)
      text-shadow 0px 1px 0px rgba(208, 208, 255, 0.69)
      background-color rgb(190, 190, 250)
    .course-remove
      background-color rgb(147, 147, 235)
  @media (max-height: 750px) 
    .full-calendar
      .full-calenda-body
        .week
          .day
            .course-wrapper
              height 64px
              background url(./img/day-bg-small.png) no-repeat center
              .course-item
                width 78px
                height 22px
                line-height 20px
                margin -2px auto 3px
</style>
