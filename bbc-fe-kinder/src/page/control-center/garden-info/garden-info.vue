/** 
 * @Desc: 园所信息
 */
<template>
  <div class="garden-info">
    <div class="garden-box">
      <Form 
        :model="gardenForm"
        :rules="gardenFormRule"
        :labelWidth="90"
        ref="gardenForm">
        <Row>
          <Col span="10">
            <FormItem prop="schName" label="学校名称">
              <Input v-model="gardenForm.schName" placeholder="请输入学校名称"/>
            </FormItem>
            <FormItem prop="pdentName" label="园长姓名">
              <Input v-model="gardenForm.pdentName" placeholder="请输入园长姓名"/>
            </FormItem>
            <FormItem prop="pdentPhone" label="园长电话">
              <Input v-model="gardenForm.pdentPhone" placeholder="请输入园长手机号码"/>
            </FormItem>
            <FormItem prop="schPhone" label="校园座机">
              <Row>
                <Col span="8">
                  <Input v-model="gardenForm.schPhoneF" placeholder="区号"/>
                </Col>
                <Col span="2" style="text-align: center"><span class="tel-line"></span></Col>
                <Col span="14">
                  <Input v-model="gardenForm.schPhoneE" placeholder="座机号"/>
                </Col>
              </Row>
            </FormItem>
            <FormItem prop="schEmail" label="电子邮箱">
              <Input v-model="gardenForm.schEmail" placeholder="请输入电子邮箱"/>
            </FormItem>
          </Col>

          <Col span="12" offset="2">
            <FormItem prop="province" label="学校地区">
              <Row>
                <Col span="8">
                  <Select v-model="gardenForm.province" clearable placeholder="省份" :label-in-value="true" @on-change="_provinceChange">
                    <Option v-for="item in provinceList" :label="item.province" :value="item.provinceId" :key="item.gradeId">{{ item.province }}</Option>
                  </Select>
                </Col>
                <Col span="7" offset="1">  
                  <Select 
                    v-model="gardenForm.city"
                    clearable placeholder="城市" 
                    :label-in-value="true" 
                    @on-change="_cityChange">
                    <Option v-for="item in cityList" :label="item.city" :value="item.cityId" :key="item.cityId">{{ item.city }}</Option>
                  </Select>
                </Col>
                <Col span="7" offset="1">
                  <Select 
                    v-model="gardenForm.country"
                    clearable placeholder="县区" 
                    :label-in-value="true" 
                    @on-change="_countryChange">
                    <Option v-for="item in countryList" :label="item.area" :value="item.areaId" :key="item.areaId">{{ item.area }}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem prop="schAdd" label="详细地址">
              <Input v-model="gardenForm.schAdd" placeholder="请输入详细地址"/>
            </FormItem>
            <FormItem prop="schFeeAmount">
              <span slot="label">学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费</span>
              <Row>
                <Col span="16">
                  <Input v-model="gardenForm.schFeeAmount" placeholder="请输入学费"/>
                </Col>
                <Col span="7" offset="1">
                  <Select v-model="gardenForm.schFeeCycle" clearable placeholder="类型" :label-in-value="true">
                    <Option v-for="item in tuitionTypeOptions" :value="item.label" :key="item.value">{{ item.value }}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem prop="schPost">
              <span slot="label">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编</span>
              <Input v-model="gardenForm.schPost" placeholder="请输入邮编"/>
            </FormItem>
            <FormItem prop="classNum" label="班级数量">
              <Input v-model="gardenForm.classNum" placeholder="请输入班级数量"/>
            </FormItem>
          </Col>
        </Row>
        <Row class="garden-intro">
          <Col span="24" >
            <label class="intro-label">学校简介</label>
            <Input v-model="gardenForm.schIntro" type="textarea" :autosize="{minRows: 4}" placeholder="请输入学校的简介"></Input>
          </Col>
        </Row>

        <Row class="garden-btn">
          <Button size="large" v-if="hasData" style="margin-left: 16px" @click="_editGardenInfo">保存</Button>
          <Button size="large" v-else style="margin-left: 16px" @click="_addGardenInfo">添加</Button>
        </Row>
      </Form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { 
    requestGetProvinceData, 
    requestGetCityData, 
    requestGetCountryData, 
    requestGetGardenInfo, 
    requestPatchGardenInfo, 
    requestAddGardenInfo 
  } from 'api/garden'
  export default {
    name: 'GardenInfo',
    data: function() {
      const validateTel = (rule, value, callback) => {
        let pattern = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ //手机验证
        // 输入值之后才校验
        if ( value != '' && !value.match(pattern) ) {
          callback(new Error('手机格式不对!'))
        } else {
          callback()
        }
      }
      return {
        hasData: false, //有没有园所信息的数据，来区分按钮
        gardenForm: {
          schName: '',
          pdentName: '',
          pdentPhone: '',
          schPhone: '',
          schPhoneF: '',
          schPhoneE: '',
          schEmail: '',
          schProvince: '',
          schCity: '',
          schDistrict: '',
          schAdd: '',
          schFeeAmount: '',
          schFeeCycle: '',
          schPost: '',
          schIntro: '',
          province: '',  //显示的值
          city: '',
          country: '',
          classNum: ''
        },
        gardenFormRule: {
          schName: [
            { required: true, message: '请输入学校名称', trigger: 'blur' },
            { max: 14, message: '最长14个字符', trigger: 'blur,change'}
          ],
          pdentName: [
            { max: 14, message: '最长14个字符', trigger: 'blur'}
          ],
          pdentPhone: [
            { min: 11, max: 11, message: '手机是11位数字', trigger: 'blur'},
            { validator: validateTel, trigger: 'blur' }
          ]        
        },
        // 学费类型选项列表
        tuitionTypeOptions: [
          {
            label: 1,
            value: '元 / 月'
          }, {
            label: 2,
            value: '元 / 季度'
          },{
            label: 3,
            value: '元 / 学期'
          }, {
            label: 4,
            value: '元 / 年'
          }
        ],
        provinceList: [], //所有的省份数据
        cityList: [], //当前省份对应的城市数据
        countryList: [], // 当前的县区数据
        ProvinceObj: { // 获取的省市区数据
          province: '',
          city: '',
          country: ''
        }
      }
    },
    mounted: function() {
      this._getProviceData()
    },
    methods: {
      /** 
       * 获取所有的省份数据 
       */
      _getProviceData: function() {
        return requestGetProvinceData()
          .then(response => {
            if (response.code == 200) {
              this.provinceList = response.data.list
            }
          })
          .then( () => {
            // 确保获取园所信息的方法在获取省份方法发生之后触发
            this._getGardenInfo()
          })
      },

      /** 
       * 省份数据改变 
       */
      _provinceChange: function(value) {
        this.cityList = []
        this.countryList = []
        // 获取城市数据
        if (value.value != '' && value.label != '') {
          this._getCityData(value.value)
          this.gardenForm.schProvince = value.label
        }
      },

      /** 
       * 获取城市数据
       * @param {string} provinceId: 省份对应的Id 
       */
      _getCityData: function(provinceId) {
        return requestGetCityData(provinceId)
          .then(response => {
            if (response.code == 200) {
              this.cityList = response.data.list
            }
          })
      },

      /** 
       * 城市数据改变 
       */
      _cityChange: function(value) {
        this.countryList = []
        if (value.value != '' && value.label != '') {
          this._getCountryData(value.value)
          this.gardenForm.schCity = value.label
        }
      },

      /** 
       * 获取县区数据
       * @param {string} cityId: 城市对应的Id  
       */
      _getCountryData: function(cityId) {
        return requestGetCountryData(cityId)
          .then(response => {
            if (response.code == 200) {
              this.countryList = response.data.list
            }
          })
      },

      /** 
       * 县区数据改变 
       */
      _countryChange: function(value) {
        if(value.label != '') {
          this.gardenForm.schDistrict = value.label
        }
      },

      /** 
       * 获取园所信息 
       */
      _getGardenInfo: function() {
        return requestGetGardenInfo()
          .then( response => {
            if (response.code == 200) {
              if(response.data.schName != '') {
                this.hasData = true
                this._showGardenInfo(response.data)
              } else {
                this.hasData = false
              }
            }
          })
      },

      /** 
       * 显示获得的园所信息 
       * @param {object} param: 获得的园所信息对象
       */
      _showGardenInfo: function(param) {
        this.gardenForm.schName = param.schName ? param.schName : ''
        this.gardenForm.pdentName = param.pdentName ? param.pdentName : ''
        this.gardenForm.pdentPhone = param.pdentPhone ? param.pdentPhone : ''
        this.gardenForm.schPhone = param.schPhone ? param.schPhone : ''
        this.gardenForm.schPhoneF = param.schPhone.split('-')[0] ? param.schPhone.split('-')[0] : ''
        this.gardenForm.schPhoneE = param.schPhone.split('-')[1] ? param.schPhone.split('-')[1] : ''
        this.gardenForm.schEmail = param.schEmail ? param.schEmail : ''
        this.gardenForm.schFeeAmount = param.schFeeAmount ? param.schFeeAmount : ''
        this.gardenForm.schFax = param.schFax ? param.schFax : ''
        this.gardenForm.schIntro = param.schIntro ? param.schIntro : ''
        this.gardenForm.schAdd = param.schAdd ? param.schAdd : ''
        this.gardenForm.schPost = param.schPost ? param.schPost : ''
        this.gardenForm.classNum = param.classNum ? param.classNum : ''
        this.gardenForm.schFeeCycle = param.schFeeCycle ? param.schFeeCycle : ''

        // 设置省市区数据对象
        this.ProvinceObj = {
          province: param.schProvince,
          city: param.schCity,
          country: param.schDistrict
        }
        // 设置省地市数据
        if (param.schProvince != '') {
          this._showProvinceData(this.ProvinceObj)
        }
      },

      /** 
       * 显示省市县的数据
       * @param {object} obj: 获取的省地市数据 
       */
      _showProvinceData: function(obj) {
        let activeProvince = this.provinceList.filter(item => {
          return item.province === obj.province
        })
        
        // 显示省份数据
        this.gardenForm.province = activeProvince[0]['provinceId']
        // 获取当前省份对应的城市数据
        this._getCityData(activeProvince[0]['provinceId'])
          .then( () => {
            let activeCity = this.cityList.filter(item => {
              return item.city == obj.city
            })
            // 显示市区数据
            this.gardenForm.city = activeCity[0]['cityId']
            // 获得县区的数据
            this._getCountryData(activeCity[0]['cityId'])
              .then( () => {
                let activeCountry = this.countryList.filter(item => {
                  return item.area == obj.country
                })
                // 显示县区数据
                this.gardenForm.country = activeCountry[0]['areaId']
              })
          }) 
      },
      
      /** 
       * 保存按钮点击 
       */
      _editGardenInfo: function() {
        this.$refs['gardenForm'].validate((valid) => {
          if (valid) {
            this.gardenForm.schPhone = this.gardenForm.schPhoneF + '-' + this.gardenForm.schPhoneE
            requestPatchGardenInfo(this.gardenForm)
              .then(response => {
                if(response.code == 200) {
                  this.$VMessage('success', '园所信息保存成功')
                  // 重新获取园所信息
                  this._getGardenInfo()
                } else {
                  this.$VMessage('error', '园所信息保存失败')
                  // 重新获取园所信息
                  this._getGardenInfo()
                }
              })
          } 
        })
      },

      /** 
       * 添加园所按钮(注意都是保存的字样，要区分) 
       */
      _addGardenInfo: function() {
        this.$refs['gardenForm'].validate((valid) => {
          if (valid) {
            if(this.gardenForm.schPhoneF != '' && this.gardenForm.schPhoneE != '') {
              this.gardenForm.schPhone = this.gardenForm.schPhoneF + '-' + this.gardenForm.schPhoneE
            } else {
              this.gardenForm.schPhone = ''
            }
            // console.log('gardenForm:', this.gardenForm)
            requestAddGardenInfo(this.gardenForm)
              .then(response => {
                if(response.code == 200) {
                  this.$VMessage('success', '园所信息保存成功')
                  // 重新获取园所信息
                  this._getGardenInfo()
                } else {
                  this.$VMessage('error', '园所信息保存失败')
                  // 重新获取园所信息
                  this._getGardenInfo()
                }
              })
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .garden-info
    position relative
    width 100%
    height 100%
    .garden-box
      position absolute
      left 10%
      top 30px
      bottom 20px
      right 0
      padding-right 10%
      overflow-y auto
    @media screen and (max-width: 1500px)
      .garden-box
        left 5%
        padding-right 5%

    .garden-box
      .tel-line
        display inline-block
        vertical-align middle
        width 11px
        height 2px
        background-color #cfbba0

    .garden-box
      .garden-intro
        margin-top 20px
      @media screen and (max-width: 1500px)
        .garden-intro  
          margin-top 0

      .garden-intro
        .intro-label
          display inline-block
          width 90px
          height 34px
          line-height 34px
          padding-right 16px
          margin-bottom 10px
          text-align right
          color #99601c

      .garden-btn
        padding-top 20px
        text-align center             
</style>
