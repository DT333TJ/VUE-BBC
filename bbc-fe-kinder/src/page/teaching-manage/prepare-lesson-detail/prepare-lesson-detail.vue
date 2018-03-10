/** 
 * @Desc: 备课明细子页面
 */
<template>
  <content-box>
    <div class="prepare-lesson-detail">
      <!-- loading -->
      <v-loading v-show="loadingVisible"></v-loading>

      <!-- 头部操作 -->
      <div class="detail-header">
        <DatePicker
          :value="datePickerValue"  
          :clearable="false" 
          type="daterange" 
          placeholder="选择日期范围"
          @on-change="_changeDateValue"
          style="width: 240px;margin-right: 20px">
        </DatePicker>

        <!-- 年级数据 -->
        <Select 
          v-model="queryParam.gradeId" 
          placeholder="全部年级" 
          @on-change="_gradeChange" 
          :label-in-value="true" 
          style="width: 130px;margin-right: 20px">
          <Option 
            v-for="item in gradeOptions" 
            :label="item.gradeName" 
            :value="item.gradeId" 
            :key="item.gradeId">
          </Option>
        </Select>

        <!-- 班级数据 -->
        <Select 
          v-model="queryParam.classId" 
          placeholder="全部班级" 
          :label-in-value="true" 
          style="width: 130px;margin-right: 20px">
          <Option 
            v-for="item in classOptions" 
            :label="item.className" 
            :value="item.classId" 
            :key="item.classId">
          </Option>
        </Select>

        <!-- 备课状态 -->
        <Select 
          v-model="queryParam.status" 
          placeholder="全部状态" 
          :label-in-value="true" 
          style="width: 130px">
          <Option 
            v-for="item in statusOptions" 
            :label="item.label" 
            :value="item.value" 
            :key="item.value">
          </Option>
        </Select>
      </div>

      <!-- 数据展示头部 -->
      <div class="detail-content-header">
        <Row>
          <Col span="3">姓名</Col>
          <Col span="3">班级</Col>
          <Col span="5">课程名称</Col>
          <Col span="5">上课时间</Col>
          <Col span="4">状态</Col>
          <Col span="2">教案</Col>
          <Col span="2">课件</Col>
        </Row>
      </div>

      <!-- 数据展示内容 -->
      <div class="detail-content-content">
        <ul v-if="dataFlag">
          <li class="content-item" v-for="(listItem ,index) in prepareList" :key="index">
            <Row>
              <Col 
                span="3" 
                class="no-wrap" 
                v-text="listItem.employeeName ? listItem.employeeName : '--'">
              </Col>
              <Col 
                span="3" 
                class="no-wrap" 
                v-text="listItem.className ? listItem.className : '--'"></Col>
              <Col 
                span="5" 
                class="no-wrap" 
                v-text="listItem.courseName ? listItem.courseName : '--'"></Col>
              <Col 
                span="5" 
                class="no-wrap" 
                v-text="listItem.courseTime ? listItem.courseTime : '--'"></Col>
              <Col span="4" class="no-wrap">
                <span v-if="listItem.hasPrepared === 1" class="col-span prepare-span">已备课</span>
                <span v-if="listItem.hasPrepared === 0" class="col-span unprepare-span">未备课</span>
              </Col>
              <Col span="2" class="no-wrap">
                <Icon
                  @click.native="_planDetailClick(listItem)" 
                  type="ios-compose-outline" 
                  class="clickable" 
                  size="20"></Icon>
              </Col>
              <Col span="2" class="no-wrap">
                <Icon 
                  @click.native="_wareDetailClick(listItem)"
                  type="ios-compose-outline" 
                  class="clickable" 
                  size="20">
                </Icon>
              </Col>
            </Row>
          </li>
        </ul>
        <ul v-else style="text-align:center;margin-top: 20px">
          {{InfoText}}  
        </ul>
      </div>

      <!-- 分页 -->
      <div class="detail-page" v-if="dataFlag">
        <Page 
          :total="pageTotal" 
          :page-size="queryParam.pageSize"
          :current="queryParam.pageNum"
          :page-size-opts="[15,30,50]"
          @on-change="_pageNumChange"
          @on-page-size-change="_pageSizeChange" 
          size="small"
          placement="top"
          show-sizer>
        </Page>
      </div>
    </div>

    <viewer-pdf 
      ref="coursewareViewer"
      :videos="courseResource.coursewareVideos"
      :pdfUrl="courseResource.courseware">
    </viewer-pdf> 
  
    <viewer-pdf-document
      ref="teachingPlanViewer"
      :pdfUrl="courseResource.prepareplan">
    </viewer-pdf-document>
  </content-box>
</template>

<script type="text/ecmascript-6">
  import ViewerPdf from 'base/viewer-pdf'
  import ViewerPdfDocument from 'base/viewer-pdf-document'
  import { playerFileName } from 'config/config'
  import { sessionStorageUtil } from 'lib/util'
  import { requestGetPrepareList, requestGetPrepareDetail } from 'api/prepare-lesson'
  import moment from 'moment'
  export default {
    name: 'PrepareLessonDetail',
    components: {
      ViewerPdf,
      ViewerPdfDocument
    },
    data: function() {
      return {
        // 是否有数据
        dataFlag: false,

        // loading
        loadingVisible: false,

        // 页面文字描述
        InfoText: '正在加载数据',

        // 日期选择器默认数组
        datePickerValue: [new Date(), new Date()], 

        // 查询的参数
        queryParam: { 
          gradeId: 0,
          classId: 0,
          status: 0,
          courseTimeStart: moment(new Date()).format('YYYY-MM-DD'),
          courseTimeEnd: moment(new Date()).format('YYYY-MM-DD'),
          pageNum: 1,
          pageSize: 15
        },

        // 下拉数据
        statusOptions: [
          {
            value: 0,
            label: '全部状态'
          },
          {
            value: 1,
            label: '未备课'
          },
          {
            value: 2,
            label: '已备课'
          }
        ],
        gradeOptions: [],
        classOptions: [],
        allClassOptions: [],  //全部的班级数据

        // 查询的结果
        prepareList: [],

        // 分页
        pageTotal: 0,

        // 资源数据
        courseResource: {
          courseware: '',
          coursewareVideos: {},
          prepareplan: ''
        }
      }
    },
    watch: {
      queryParam: {
        deep: true,
        handler(newValue) {
          sessionStorageUtil.set('prepare-lesson-queryParam', newValue)
          // 监听到数据改变就重新获取
          this._handleRequestGetPrepareList(newValue)
        }
      }
    },
    created: function() {
      this._setGradeList()
      this._setClassList()
      this._getDataFromQueryOrStorage()
    },
    methods: {
      /** 
       * 从路由query和Storage中获取数据 
       */
      _getDataFromQueryOrStorage: function() {
        let query = this.$route.query
        // 存在路由传参，修改默认的参数
        if(query.date) {
          this.queryParam = {
            gradeId: Number(query.gradeId),
            classId: Number(query.classId),
            status: Number(query.status),
            courseTimeStart: query.date,
            courseTimeEnd: query.date,
            pageNum: 1,
            pageSize: 15
          }
          // 给日期选择器赋值
          this.datePickerValue =[query.date, query.date]
          // 通过获取到了年级Id来获取班级Id
          this._getClassByGradeId(this.queryParam.gradeId)
        } else {  
          //路由没有参数，页面刷新从Storage中获取数据，要考虑只有数据改变时候才有storage,否则是平常的初始化
          let storageData = sessionStorageUtil.get('prepare-lesson-queryParam')
          if (storageData) {
            this.queryParam = {
              gradeId: storageData.gradeId,
              classId: storageData.classId,
              status: storageData.status,
              courseTimeStart: storageData.courseTimeStart,
              courseTimeEnd: storageData.courseTimeEnd,
              pageNum: storageData.pageNum,
              pageSize: storageData.pageSize
            }
            // 给日期选择器赋值
            this.datePickerValue =[storageData.courseTimeStart, storageData.courseTimeEnd]
            // 通过获取到了年级Id来获取班级Id
            this._getClassByGradeId(this.queryParam.gradeId)
          }
        }
        // 请求本页数据
        this._handleRequestGetPrepareList(this.queryParam)
      },

      /** 
       * 请求获取查询的事件 
       */
      _handleRequestGetPrepareList: function(param) {
        if (!this.loadingVisible) {
          this.loadingVisible = true
        }
        this.InfoText = '正在加载数据...'
        return requestGetPrepareList(param)
          .then(response => {
            if(response.code === 200) {
              // 有无数据的判断
              if (response.data.totalCount > 0) {
                this.dataFlag = true
                this.pageTotal = response.data.totalCount
                this.prepareList = response.data.datas
              } else {
                this.InfoText = '很抱歉，目前没有找到相关的数据'
                this.dataFlag = false
              }
              // 隐藏loading
              setTimeout(() => this.loadingVisible = false, 200)
            }
          })
      },

      /** 
       * 设置年级数据 
       */
      _setGradeList: function() {
        const gradeList = this.$store.state.gradeList
        this.gradeOptions = [{ gradeId: 0, gradeName: '全部年级'}].concat(gradeList)
      },

      /** 
       * 设置班级数据
      */
      _setClassList: function() {
        let classOptions = [{ classId: 0, className: '全部班级'}]
        const allClassList = this.$store.state.gradeList
        let classList = []
        for (let i in allClassList) {
          if (allClassList[i].classes.length> 0) {
            classList = classList.concat(allClassList[i].classes)
          }
        }
        classOptions = classOptions.concat(classList)
        // 将班级数据赋值
        this.allClassOptions = classOptions
        this.classOptions = classOptions
      },

      /** 
       * 日历日期改变
      */
      _changeDateValue: function(value) {
        // 改变了
        if(value[0]) {
          this.queryParam.courseTimeStart = value[0]
          this.queryParam.courseTimeEnd = value[1]
        }
      },

      /** 
       * 年级数据改变 
       */
      _gradeChange: function(value) {
        this.queryParam.gradeId = value.value
        // 通过Id获取班级数据
        this._getClassByGradeId(this.queryParam.gradeId)
        // 默认选中全部班级
        this.queryParam.classId = 0
      },

      /** 
       * 根据年级的Id获取班级
       * @param {String} gradeId: 选中的年级Id 
       */
      _getClassByGradeId: function(gradeId) {
        // 是全部年级
        if(gradeId === 0) {
          this.classOptions = this.allClassOptions
        } else {
          let defList = [{ classId: 0, className: '全部班级' }]
          let list = [] 
          const allClassList = this.$store.state.gradeList
          for (let i in allClassList) {
            if(allClassList[i].gradeId === gradeId ) {
              list = allClassList[i].classes
            }
          }
          defList = defList.concat(list)
          this.classOptions = defList
        }
      },

      /** 
       * 页码改变
       */
      _pageNumChange: function(value) {
        this.queryParam.pageNum = value
      },

      /** 
       * 每页条数改变
       */
      _pageSizeChange: function(value) {
        this.queryParam.pageSize = value
      },

      /** 
       * 教案预览点击 
       * @param {object} item: 当前的数据对象
       */
      _planDetailClick: function(item) {
        // 清空之前的数据
        this.courseResource.prepareplan = ''
        let param = {
          classId: item.classId,
          courseId: item.courseId
        }
        this._handleRequestGetPrepareDetail(param)
        setTimeout( () => {
          if (this.courseResource.prepareplan != '') {
            this.$refs.teachingPlanViewer._show()
          }
        }, 300)
      },

      /** 
       * 课件预览点击
       * @param {object} item: 当前的数据对象 
       */
      _wareDetailClick: function(item) {
        // 清空之前的数据
        this.courseResource.courseware = ''
        this.courseResource.coursewareVideos = {}
        let param = {
          classId: item.classId,
          courseId: item.courseId
        }
        this._handleRequestGetPrepareDetail(param)
        setTimeout( () => {
          if (this.courseResource.courseware != '') {
            this.$refs.coursewareViewer._show()
          }      
        }, 300)
      },

      /** 
       * 通过班级Id和课程Id获取对应的资源预览
       * @param {object} param: 获取的参数对象 
       */
      _handleRequestGetPrepareDetail: function(param) {
        return requestGetPrepareDetail(param)
          .then(response => {
            if (response.code === 200) {
              console.log(response.data.pdfJson.page1[0].i)
              this.courseResource = {
                prepareplan: response.data.configJson.tb,
                courseware: response.data.configJson.cw,
                coursewareVideos: response.data.pdfJson,
                // coursewareVideos: response.data.pdfJson.pages,
              }
            }
          })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .prepare-lesson-detail
    position relative
    width 100%
    height 100%
    .detail-header
      padding 30px 57px 20px 54px

    /* 内容区域的头部 */
    .detail-content-header
      height 30px
      line-height 30px
      margin 0 40px 0 54px
      font-size 16px
      text-indent 10px
      color #ab8858
      border-bottom 1px solid #ddd9c6

     /* 内容区域主要部分 */
    .detail-content-content
      position absolute
      top 114px
      left 0
      bottom 40px
      right 0 
      overflow-y auto
      ul
        .content-item
          height 40px
          line-height 40px
          padding 0 40px 0 54px
          font-size 13px
          color #ab8858
          text-indent 10px
          &:hover
            background-color #c9efd9
        .content-item
          .col-span
            display inline-block
            width 60px
            height 24px
            line-height 24px
            border-radius 5px
            color #ffffff
            font-size 12px
          .prepare-span
            background-color #67cd96
          .unprepare-span
            background-color #ff8d77         

    /* 分页 */        
    .detail-page
      position absolute
      left 0
      right 0
      bottom 8px
      text-align center 
</style>

