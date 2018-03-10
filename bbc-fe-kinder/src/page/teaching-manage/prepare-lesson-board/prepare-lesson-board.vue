/** 
 * @Desc: 备课看板子页面
 */
<template>
  <content-box>
    <div class="prepare-lesson-board">
      <!-- loading -->
      <v-loading v-show="loadingVisible"></v-loading>

      <!-- 头部的操作区域 -->
      <div class="board-header clear-float">
        <!-- 日历 -->
        <DatePicker
          :value="datePickerValue"
          :clearable="false" 
          size="large" 
          type="date" 
          placeholder="请选择日期"
          @on-change="_changeDate" 
          style="width: 220px;float:left">
        </DatePicker>

        <!-- 总体备课率 -->
        <div class="board-total-text">
          <span class="total-item total-text">备课率</span>
          <span class="total-item total-num" @click="_prepareRateClick">{{prepareRate}}</span>
        </div>

        <!-- 详细备课率 -->
        <div class="board-detail-text clear-float">
          <span>（已备课</span>
          <span class="detail-span" style="color:#7bd4a4" @click="_totalPrepareClick">{{totalPrepare}}</span>
          <span style="margin-right: 20px">节</span>
          <span>未备课</span> 
          <span class="detail-span" style="color: #ff8f79" @click="_totalUnPrepareClick">{{totalUnPrepare}}</span>
          <span>节）</span>
        </div>

        <!-- 右侧备课图标 -->
        <div class="float-right board-icon">
          <Icon type="ios-checkmark-outline" size="18" style="color:#7bd4a4"></Icon>
          <span class="icon-item" style="color:#7bd4a4;margin-right: 5px">已备课</span>
          <Icon type="ios-close-outline" size="18" style="color:#ff8f79"></Icon>
          <span class="icon-item" style="color:#ff8f79">未备课</span>
        </div>
      </div>

      <!-- 备课数据展示 -->
      <div class="board-content">
        <!-- 有数据 -->
        <ul class="content-ul clear-float" v-if="courseDatas.length> 0">
          <li 
            @click="_contentClick(courseData)"
            class="content-li" 
            v-for="(courseData, index) in courseDatas" 
            :key="index">
            <div 
              class="li-header no-wrap" 
              :class="{
                'gradeOne': courseData.gradeId === 1,
                'gradeTwo': courseData.gradeId === 2,
                'gradeThree': courseData.gradeId === 3,
                'gradeFour': courseData.gradeId === 4    
              }">
              {{courseData.className}}
            </div>
            <!-- 上午 -->
            <div class="li-item">
              <!-- 已备课 -->
              <Icon 
                v-if="courseData.morning && courseData.morning.hasPrepared === 2" 
                type="ios-checkmark-outline" 
                size="36" 
                style="color:#7bd4a4">
              </Icon>
              <!-- 未备课 -->
              <Icon 
                v-else-if="courseData.morning && courseData.morning.hasPrepared === 1" 
                type="ios-close-outline" 
                size="36" 
                style="color:#ff8f79">
              </Icon>
              <!-- 无课 -->
              <span v-else class="item-span">无课</span>
            </div>
            <div class="li-line"></div>
            <!-- 下午 -->
            <div class="li-item">
              <!-- 已备课 -->
              <Icon
                v-if="courseData.afternoon && courseData.afternoon.hasPrepared === 2" 
                type="ios-checkmark-outline" 
                size="36" 
                style="color:#7bd4a4">
              </Icon>
              <!-- 未备课 -->
              <Icon 
                v-else-if="courseData.afternoon && courseData.afternoon.hasPrepared === 1" 
                type="ios-close-outline" 
                size="36" 
                style="color: #ff8f79">
              </Icon>
              <!-- 无课 -->
              <span v-else class="item-span">无课</span>
            </div>
          </li>
        </ul>
        <!-- 没有数据 -->
        <ul class="content-ul" v-else style="color:black;text-align:center">
          {{infoText}}
        </ul>
      </div>
    </div>
  </content-box>
</template>

<script type="text/ecmascript-6">
  import { requestGetCoursePrepare } from 'api/prepare-lesson'
  import { sessionStorageUtil } from 'lib/util'
  import moment from 'moment'

  export default {
    name: 'PrepareLessonBoard',
    data: function() {
      return {
        // 页面文本提示信息
        infoText: '很抱歉，没有当前的数据信息',

        // loading
        loadingVisible: false,

        //日期选择器默认显示的日期
        datePickerValue: new Date(), 

        //全园备课信息
        courseDatas: [], 
        totalPrepare: '', //总的备课数量
        totalUnPrepare: '', //总的未备课数量
        prepareRate: '', //备课率
        dateValue: '', // 日期参数 

        // 路由传递数据对象
        queryParam: {    
          date: moment(new Date()).format('YYYY-MM-DD'),
          gradeId: 0,
          classId: 0,
          status: 0
        } 
      }
    },
    created: function() {
      this._getPrepareData()
    },
    methods: {
      /** 
       * 调用获取对应日期的全园备课情况
       * @param {String} curTime: 日期参数
      */
      _handleGetPrepareData: function(curTime) {
        if (!this.loadingVisible) {
          this.loadingVisible = true
        }
        return requestGetCoursePrepare(curTime)
          .then(response => {
            if(response.code == 200) {
              this.courseDatas = []
              // 处理展示数据
              if(response.data.courseData) {
                let arr = []
                arr = Array.prototype.concat.apply([], response.data.courseData)
                this.courseDatas = arr.length> 0 ? arr : []
              }
              // 获得具体数据
              if(response.data.perData) {
                let count = 0  //已备总数
                let ucount = 0 //未备总数
                for (const iterator of response.data.perData) {
                  count += iterator.gradeHasPreparedCount
                  ucount +=iterator.gradeTotalNotPrepareCount
                }
                this.totalPrepare = count
                this.totalUnPrepare = ucount
                // 设置备课率，考虑除数为0
                if (count+ucount === 0) {
                  this.prepareRate = 0 + '%'
                } else {
                  this.prepareRate = Math.round( count/(count + ucount)* 10000) / 100.00 + "%"  
                }           
              }
              // 隐藏loading
              setTimeout(() => this.loadingVisible = false, 200)
            }
          })
      },

      /** 
       * 日期改变
       */
      _changeDate: function(value) {
        // 存储值来应对刷新
        sessionStorageUtil.set('kdatevalue', value)
        // 根据日期的值来设置请求的参数，当日期为空时，调用请求当天的方法
        value = value == '' ? moment(new Date()).format('YYYY-MM-DD') : value
        this.queryParam.date = value
        // 获取当前选择的时间的全园备课情况
        this._handleGetPrepareData(value)
      },

      /** 
       * 根据日期来调用获取备课数据的方法(使用储存解决刷新数据保存)
       */
      _getPrepareData: function() {
        let dateValue =sessionStorageUtil.get('kdatevalue')
        let curTime = moment(new Date()).format('YYYY-MM-DD')
        if (dateValue) {
          this.datePickerValue = dateValue
          // 将获得的时间赋值于参数对象中
          this.queryParam.date = dateValue
          this._handleGetPrepareData(dateValue)
        } else {
          this.datePickerValue = curTime
          // 将获得的时间赋值于参数对象中
          this.queryParam.date = curTime
          this._handleGetPrepareData(curTime)
        }
      },

      /** 
       * 备课率点击 
       */
      _prepareRateClick: function() {
        this.queryParam.status = 0
        let queryObj = this.queryParam
        this.$router.push({name: 'prepare-lesson-detail', query: queryObj})
      },

      /** 
       * 已备课点击跳转
       */
      _totalPrepareClick: function() {
        this.queryParam.status = 2
        let queryObj = this.queryParam
        this.$router.push({name: 'prepare-lesson-detail', query: queryObj})
      },

      /** 
       * 未备课点击跳转 
       */
      _totalUnPrepareClick: function() {
        this.queryParam.status = 1
        let queryObj = this.queryParam
        this.$router.push({name: 'prepare-lesson-detail', query: queryObj})
      },

      /** 
       * 整个班级点击跳转
       * @param {object} courseData: 当前的数据对象 
       */
      _contentClick: function(courseItem) {
        this.queryParam.classId = courseItem.classId
        this.queryParam.gradeId = courseItem.gradeId
        let queryObj = this.queryParam
        this.$router.push({name: 'prepare-lesson-detail', query: queryObj})
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .prepare-lesson-board
    position relative
    width 100%
    height 100%
    .board-header
      padding 24px 57px 25px 60px
      /* 总的数据 */
      .board-total-text
        float left
        margin-left 52px
        .total-item
          display inline-block
          vertical-align middle
          height 38px
          line-height 38px
        .total-text
          font-size 18px
          color #b89970
          margin-right 2px
        .total-num
          color #009922
          font-size 30px
          text-shadow 0px 1px 2px rgba(111, 106, 61, .8)
          cursor pointer
      /* 详细数据 */     
      .board-detail-text      
        float left
        margin-left 32px
        font-size 14px
        color #b89970
        span
          float left
          height 38px
          line-height 38px
        .detail-span
          margin 0 5px
          font-size 24px
          cursor pointer
      /* 图标区域 */  
      .board-icon
        display inline-block
        height 38px
        line-height 38px
        vertical-align middle
        .icon-item
          display inline-block
          height 38px
          line-height 38px
          font-size 18px

    /* 备课详细数据 */
    .board-content
      position absolute
      top 88px
      left 0
      right 0
      bottom 10px
      overflow-y auto
      padding 0 57px 0 60px     
      .content-ul
        .content-li
          position relative
          float left
          width 140px
          height 160px
          margin 10px 35px 35px 15px
          border-radius 10px
          background-color #fff9eb
          border 1px solid #f7edd5
          box-shadow 0 0 1px 1px #e7d4a8 inset , -2px 2px 1px  rgba(0, 0, 0, .2), 0 -2px 1px  white, 2px 2px 1px  rgba(0, 0, 0, .2)
          cursor pointer
          .li-header
            width 90px
            height 51px
            line-height 48px
            text-align center
            font-size 14px
            margin -2px auto 0
          .gradeOne  
            background url(./img/first.png) no-repeat 100%
          .gradeTwo
            background url(./img/two.png) no-repeat 100%
          .gradeThree
            background url(./img/three.png) no-repeat 100%
          .gradeFour
            background url(./img/four.png) no-repeat 100%      
          .li-line
            width 90px
            height 1px
            margin 10px auto
            background-color #e8dab8     
          .li-item
            width 90px
            height 36px
            line-height 36px
            text-align center
            margin 0 auto
            .item-span
              display inline-block
              color #dbc7a9
              font-size 14px
</style>

