/** 
 * @Desc: 学生管理内容区
 */
<template>
  <div class="student-manage-content">
    <!-- loading -->
    <v-loading v-show="loadingVisible"></v-loading>

    <!-- S 头部 -->
    <div class="header" v-show="classId !== 0">
      <Button size="large" @click.native="_addStudentClick">
        <v-icon type="icon-add-person" size="14"></v-icon>
        新生入园
      </Button>
      <div class="count-wrapper">
        <span class="count-item sex-male">
          <v-icon 
            type="icon-sex-male" 
            size="38"
            style="vertical-align:bottom;">
          </v-icon>{{ countData.male }}
        </span>
        <span class="count-item sex-female">
          <v-icon 
            type="icon-sex-female" 
            size="38"
            style="vertical-align:bottom;">
          </v-icon>{{ countData.female }}
        </span>
        <span class="total">
          （班级人数：{{ countData.total }}人）
        </span>
      </div>
    </div>
    <!-- E 头部 -->

    <!-- S 学生列表 -->
    <div class="student-list-wrapper">
      <ul class="student-list">
        <student-item 
          v-for="student in studentList" 
          :key="student.stu_id" 
          :student="student"
          :remove="true"
          @removeStudent="_removeStudentClick"
          @editStudent="_editStudentClick">
        </student-item>
      </ul>
    </div>
    <!-- E 学生列表 -->

    <!-- S 添加学生/修改学生 对话框  -->
    <Modal 
      :title="isAddStudent ? '添加学生' : '修改学生'"
      v-model="studentOperationDialogVisible"
      @on-ok="_handleStudentOperation"
      @on-cancel="$refs['studentOperationForm'].resetFields()">
      <Form 
        :model="studentOperationForm"
        :rules="studentOperationFormRule"
        :labelWidth="90"
        ref="studentOperationForm"
        style="padding:0 50px;">
        <FormItem label="学生姓名" prop="name">
          <Input 
            size="large"
            v-model="studentOperationForm.name" 
            placeholder="请输入学生姓名"/>
        </FormItem>
        <FormItem label="所属年级" prop="gradeId">
          <Select
          size="large" 
          v-model="studentOperationForm.gradeId" 
          placeholder="请选择年级">
            <Option
              v-for="grade in $store.state.gradeList"
              :key="grade.gradeId"
              :value="grade.gradeId">
              {{ grade.gradeName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem 
          size="large"
          label="所属班级" 
          prop="classId">
          <Select 
            size="large" 
            v-model="studentOperationForm.classId" 
            placeholder="请选择班级">
            <Option
              v-for="classItem in classList"
              :key="classItem.classId"
              :value="classItem.classId">
              {{ classItem.className }}
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="birthday">
          <span slot="label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</span>
          <DatePicker 
            type="date"
            size="large"
            placeholder="请选择生日"
            :value="studentOperationForm.birthday"
            :options="studentOperationBirthdayOptions"
            @on-change="(value) => { studentOperationForm.birthday = value }"
            style="width:260px;">
          </DatePicker>
        </FormItem>
        <FormItem prop="sex">
          <span slot="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</span>
          <RadioGroup v-model="studentOperationForm.gender">
            <Radio :label="1">男</Radio>
            <Radio :label="0">女</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
    <!-- E 添加学生对话框 -->

    <!-- S 删除学生对话框 -->
    <Modal
      title="删除学生"
      v-model="removeStudentDialogVisible"
      :confirm="true"
      @on-ok="_removeStudent">
      <p style="text-align:center;">
        确定要删除学生 
        <span style="color:#ed3f14;font-weight:bold;">
          {{ removeStudent.name }}
        </span>
        吗？
      </p>
    </Modal>
    <!-- E 删除学生对话框 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { 
    requestGetStudents,
    requestAddStudent,
    requestPatchStudent,
    requestDeleteStudent
  } from 'api/student-manage'
  import StudentItem from 'base/student-item'
  export default {
    name: 'StudentManageContent',
    components: {
      StudentItem,
    },
    data: function() {
      return {
        // 学生数据
        studentList: [],
        countData: {
          male: '',
          female: '',
          total: ''
        },
        // 添加学生表单
        isAddStudent: true,
        studentOperationDialogVisible: false,
        studentOperationForm: {
          id: '',
          name: '',
          gradeId: '',
          classId: '',
          birthday: '',
          gender: '1'
        },
        studentOperationFormRule: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { min: 2, max: 10, message: '2 至 10 个字符之间', trigger: 'blur' }
          ],
          gradeId: [
            { required: true, type: 'number', message: '请选择年级', trigger: 'change' }
          ],
          classId: [
            { required: true, type: 'number', message: '请选择班级', trigger: 'change' }
          ],
          birthday: [
            { required: true, message: '请选择生日', trigger: 'change' }
          ],
        },
        // 禁止选择的日期条件（true为禁止选择）
        studentOperationBirthdayOptions: {
          disabledDate(date) {
            return date.getTime() > ( Date.now() - 24 * 60 * 60 * 1000 )
          }
        },
        // 删除学生对话框
        removeStudentDialogVisible: false,
        removeStudent: {
          id: '',
          name:''
        },
        // loading状态
        loadingVisible: false,
      }
    },
    computed: {
      /**
       * 年级id
       */
      gradeId: function() {
        return Number(this.$route.params.gradeId)
      },

      /**
       * 班级id
       */
      classId: function() {
        return Number(this.$route.params.classId)
      },
      
      /**
       * 添加/修改学生 当前年级下的班级
       */
      classList: function() {
        var res = []
        this.$store.state.gradeList.forEach(grade => {
          if (grade.gradeId === this.studentOperationForm.gradeId) {
            res = grade.classes
          }
        })
        return res
      },
    },
    watch: {
      /**
       * 监视班级id
       */
      classId: function(value) {
        if (value === 0) {
          this.studentList = []
          this.$VMessage('info', '当前没有班级，请先创建班级', 3000)
        }
        else {
          this.loadingVisible = true
          this._getStudents()
        }
      }
    },
    methods: {
      /**
       * 删除学生按钮点击
       */
      _removeStudentClick: function(student) {
        this.removeStudent.id = student.stu_id
        this.removeStudent.name = student.stu_name
        this.removeStudentDialogVisible = true
      },

      /**
       * 学生添加按钮点击
       */
      _addStudentClick: function() {
        this.isAddStudent = true
        this.studentOperationForm.gradeId = this.gradeId
        this.studentOperationForm.classId = this.classId
        this.studentOperationDialogVisible = true
      },

      /**
       * 修改学生按钮点击
       */
      _editStudentClick: function(student) {
        this.isAddStudent = false
        this.studentOperationForm.id = student.stu_id
        this.studentOperationForm.name = student.stu_name
        this.studentOperationForm.gradeId = student.grade_id
        this.studentOperationForm.classId = student.class_id
        this.studentOperationForm.gender = student.gender
        this.studentOperationForm.birthday = student.birthday
        this.studentOperationDialogVisible = true
      },

      /**
       * 确认 添加/修改 学生
       */
      _handleStudentOperation: function() {
        // 表单校验
        this.$refs['studentOperationForm'].validate((valid) => {
          if (valid) {
            this.isAddStudent ? this._addStudent() : this._eidtStudent()
          }
        })
      },

      /**
       * 删除学生
       */
      _removeStudent: function() {
        requestDeleteStudent(this.removeStudent.id)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestDeleteStudent SUCCESS', res)
              this.removeStudentDialogVisible = false
              this.$VMessage('success', '删除成功')
              this._getStudents()
            }
            else {
              // console.log('requestDeleteStudent FAIL', res)
              this.$VMessage('error', '删除失败')
            }
          })
          .catch(err => {
            // console.log('requestDeleteStudent FAIL', err)
            this.$VMessage('error', '删除失败')
          })       
      },

      /**
       * 修改学生
       */
      _eidtStudent: function() {
        requestPatchStudent(this.studentOperationForm)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestPatchStudent SUCCESS', res)
              this.studentOperationDialogVisible = false
              this.$VMessage('success', '修改成功')
              this._getStudents()
            }
            else {
              // console.log('requestPatchStudent FAIL', res)
              this.$VMessage('error', '修改失败')
            }
          })
          .catch(err => {
            // console.log('requestPatchStudent FAIL', err)
            this.$VMessage('error', '修改失败')
          })
      },

      /**
       * 添加学生
       */
      _addStudent: function() {
        requestAddStudent(this.studentOperationForm)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestAddStudent SUCCESS', res)
              this.studentOperationDialogVisible = false
              this.$VMessage('success', '添加成功')
              this._getStudents()
            }
            else {
              // console.log('requestAddStudent FAIL', res)
              this.$VMessage('error', '添加失败')
            }
          })
          .catch(err => {
            // console.log('requestAddStudent FAIL', err)
            this.$VMessage('error', '添加失败')
          })
      },

      /**
       * 获取学生列表
       */
      _getStudents: function() {
        this.loadingVisible = true
        requestGetStudents(this.classId)
          .then(res => {
            setTimeout(() => this.loadingVisible = false, 200)             
            if (res.data.code === 200) {
              // console.log('requestGetStudents SUCCESS', res)
              // 设置数据
              this.studentList = res.data.list
              this.countData.total = res.data.count
              this.countData.male = res.data.sex.male_num
              this.countData.female = res.data.sex.female_num
              // 重置表单
              this.$refs['studentOperationForm'].resetFields()
              // 隐藏loading
              if (!this.studentList.length) {
                this.$VMessage('info', '当前班级没有学生，快去添加学生吧')
              }
            }
            else {
              // console.log('requestGetStudents FAIL', res)
            }
          })  
          .catch(err => {
            // console.log('requestGetStudents FAIL', err)
          })
      },
    },
    created: function() {
      if (this.classId !== 0) {
        this._getStudents()
      }
    },
    mounted: function() {
      if (this.classId === 0) {
        this.$VMessage('info', '当前没有班级，请先创建班级', 3000)
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .student-manage-content
    position relative
    height 100%
    padding 24px 20px
    .header
      padding-left 25px
      .count-wrapper
        display inline-block
        vertical-align middle
        margin-left 30px
        .count-item
          margin-right 12px
          font-size 24px
          &.sex-male
            color #98e6e6
          &.sex-female
            color #faaaab
        .total
          position relative
          top -2px
          font-size 14px
          color #885511
    .student-list-wrapper
      position absolute
      top 75px
      right 0
      bottom 0
      left 20px
      overflow auto
</style>
