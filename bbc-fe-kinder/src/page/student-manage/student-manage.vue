/** 
 * @Desc: 学生管理
 */
<template>
  <div>
    <v-header></v-header>
    <!-- S 导航 -->
    <v-nav>
      <v-sub-nav 
        :edit="true"
        :title="grade.gradeName" 
        :open="Number(grade.gradeId) === gradeId"
        v-for="(grade, gradeIndex) in $store.state.gradeList" 
        :key="grade.gradeId"
        @addClass="_addClassClick(grade)"
        @editGrade="_editGradeClick(grade)">
        <v-nav-item
          :edit="true"
          :active="Number(classItem.classId) === classId"
          v-for="(classItem, classIndex) in grade.classes"
          :key="classItem.classId"
          @click.native="$router.push(`/student-manage/${ grade.gradeId }/${ classItem.classId } `)"
          @editClass="_editClassClick(grade, classItem)"
          @removeClass="_removeClassClick(classItem)">
          {{ classItem.className }}
        </v-nav-item>
      </v-sub-nav>
    </v-nav>
    <!-- E 导航 -->

    <!-- S 内容区 -->
    <content-box>
      <router-view></router-view>
    </content-box>
    <!-- E 内容区 -->

    <!-- S 修改年级对话框 -->
    <Modal 
      title="修改年级信息"
      v-model="editGradeDialogVisible"
      @on-ok="_handleEditGrade"
      @on-cancel="$refs['editGradeForm'].resetFields()">
      <Form 
        :model="editGradeForm"
        :rules="editGradeFormRule"
        :labelWidth="90"
        ref="editGradeForm"
        style="padding:0 50px;">
        <FormItem label="年级名称" prop="gradeName">
          <Input 
            size="large"
            v-model="editGradeForm.gradeName" 
            placeholder="请输入年级名称"/>
        </FormItem>
      </Form>
    </Modal>
    <!-- E 修改年级对话框 -->

    <!-- S 添加班级对话框 -->
    <Modal 
      title="添加班级"
      v-model="addClassDialogVisible"
      @on-ok="_handleAddClass"
      @on-cancel="$refs['addClassForm'].resetFields()">
      <Form 
        :model="addClassForm"
        :rules="addClassFormRule"
        :labelWidth="90"
        ref="addClassForm"
        style="padding:0 50px;">
        <FormItem label="班级名称" prop="className">
          <Input 
            size="large"
            v-model="addClassForm.className" 
            placeholder="请输入班级名称"/>
        </FormItem>
        <FormItem label="所属年级" prop="gradeId">
          <Select
           size="large" 
           v-model="addClassForm.gradeId" 
           placeholder="请选择年级">
            <Option
              v-for="grade in $store.state.gradeList"
              :key="grade.gradeId"
              :value="grade.gradeId">
              {{ grade.gradeName }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!-- E 添加班级对话框 -->

    <!-- S 修改班级对话框 -->
    <Modal 
      title="修改班级信息"
      v-model="editClassDialogVisible"
      @on-ok="_handleEditClass"
      @on-cancel="$refs['editClassForm'].resetFields()">
      <Form 
        :model="editClassForm"
        :rules="editClassFormRule"
        :labelWidth="90"
        ref="editClassForm"
        style="padding:0 50px;">
        <FormItem label="班级名称" prop="className">
          <Input 
            size="large"
            v-model="editClassForm.className" 
            placeholder="请输入班级名称"/>
        </FormItem>
        <FormItem label="所属年级" prop="gradeId">
          <Select
           size="large" 
           v-model="editClassForm.gradeId" 
           placeholder="请选择年级">
            <Option
              v-for="grade in $store.state.gradeList"
              :key="grade.gradeId"
              :value="grade.gradeId">
              {{ grade.gradeName }}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!-- E 修改班级对话框 -->

    <!-- S 删除班级对话框 -->
    <Modal
      title="删除学生"
      v-model="removeClassDialogVisible"
      :confirm="true"
      @on-ok="_removeClass">
      <p style="text-align:center;">
        确定要删除班级 
        <span style="color:#ed3f14;font-weight:bold;">
          {{ removeClass.className }}
        </span>
        吗？
      </p>
    </Modal>
    <!-- E 删除学生对话框 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import { 
    requestAddClass, 
    requestPatchGrade, 
    requestDeleteClass, 
    requestPatchClass 
  } from 'api/student-manage'
  export default {
    name: 'StudentManage',
    data: function() {
      return {
        // 添加班级对话框
        addClassDialogVisible: false,
        addClassForm: {
          className: '',
          gradeId: '',
        },
        addClassFormRule: {
          className: [
            { required: true, message: '班级名不能为空', trigger: 'blur' },
            { min: 2, max: 8, message: '2 至 8 个字符之间', trigger: 'blur' }
          ],
          gradeId: [
            { required: true, type: 'number', message: '请选择年级', trigger: 'change' }
          ],
        },

        // 修改年级对话框
        editGradeDialogVisible: false,
        editGradeForm: {
          gradeId: '',
          gradeName: '',
        },
        editGradeFormRule: {
          gradeName: [
            { required: true, message: '年级名不能为空', trigger: 'blur' },
            { min: 2, max: 5, message: '2 至 5 个字符之间', trigger: 'blur' }
          ],
        },

        // 修改班级对话框
        editClassDialogVisible: false,
        editClassForm: {
          classId: '',
          gradeId: '',
          className: ''
        },
        editClassFormRule: {
          className: [
            { required: true, message: '班级名不能为空', trigger: 'blur' },
            { min: 2, max: 8, message: '2 至 8 个字符之间', trigger: 'blur' }
          ],
          gradeId: [
            { required: true, type: 'number', message: '请选择年级', trigger: 'change' }
          ],
        },

        // 删除班级对话框
        removeClassDialogVisible: false,
        removeClass: {
          className: '',
          classId: ''
        },
      }
    },
    computed: {
      /**
       * 班级id
       */
      classId: function() {
        return Number(this.$route.params.classId)
      },
      /**
       * 年级id
       */
      gradeId: function() {
        return Number(this.$route.params.gradeId)
      }
    },
    methods: {
      /**
       * 删除班级，重新进入当前页面
       */
      _refreshCurrentPage: async function() {
        // 同步
        await this.$store.dispatch('getGradeAndClass')
        this.$router.push('/student-manage')
      },

      /**
       * 刷新vuex年级数据
       */
      _refreshGradeList: function() {
        this.$store.dispatch('getGradeAndClass')
      },

      /**
       * 确定修改班级
       */
      _handleEditClass: function() {
        // 表单校验
        this.$refs['editClassForm'].validate((valid) => {
          if (valid) {
            this._editClass()
          }
        })
      },

      /**
       * 确定添加班级
       */
      _handleAddClass: function() {
        // 表单校验
        this.$refs['addClassForm'].validate((valid) => {
          if (valid) {
            this._addClass()
          }
        })
      },

      _handleEditGrade: function() {
        // 表单校验
        this.$refs['editGradeForm'].validate((valid) => {
          if (valid) {
            this._editGrade()
          }
        })
      },

      /**
       * 请求删除班级
       */
      _removeClass: function() {
        requestDeleteClass(this.removeClass.classId)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestDeleteClass SUCCESS', res)      
              this.$VMessage('success', '班级删除成功')
              this.removeClassDialogVisible = false
              this._refreshCurrentPage()
            } 
            else if (res.code === 203) {
              // console.log('requestDeleteClass FAIL', res)      
              this.$VMessage('error', '班级中有学生存在，请清空学生后再重试')
            }
            else {
              // console.log('requestDeleteClass FAIL', res)      
              this.$VMessage('error', '班级删除失败')
            }
          })
          .catch(err => {
            // console.log('requestDeleteClass FAIL', err)      
          })
      },

      /**
       * 请求修改班级
       */
      _editClass: function() {
        requestPatchClass(this.editClassForm)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestPatchClass SUCCESS', res)      
              this.$VMessage('success', '班级修改成功')
              this.editClassDialogVisible = false
              this._refreshGradeList()
            } 
            else if (res.code === 203) {
              // console.log('requestPatchClass FAIL', res)      
              this.$VMessage('error', '班级名称已经存在，请换个名字')
            }
            else {
              // console.log('requestPatchClass FAIL', res)      
              this.$VMessage('error', '班级修改失败')
            }
          })
          .catch(err => {
            // console.log('requestPatchClass FAIL', err)      
          })
      },

      /**
       * 请求添加班级
       */
      _addClass: function() {
        requestAddClass(this.addClassForm)
          .then(res => {
            if (res.code === 200) {
              // console.log('requestAddClass SUCCESS', res)      
              this.$VMessage('success', '班级添加成功')
              this.addClassDialogVisible = false
              this._refreshGradeList()
            } 
            else if (res.code === 202) {
              // console.log('requestAddClass FAIL', res)      
              this.$VMessage('error', '班级名称已经存在，请换个名字')
            }
            else {
              // console.log('requestAddClass FAIL', res)      
              this.$VMessage('error', '班级添加失败')
            }
          })
          .catch(err => {
            // console.log('requestAddClass FAIL', err)      
          })
      },

      /**
       * 请求修改年级
       */
      _editGrade: function() {
        requestPatchGrade(this.editGradeForm) 
          .then(res => {
            if (res.code === 200) {
              // console.log('requestPatchGrade SUCCESS', res)      
              this.$VMessage('success', '年级信息修改成功')
              this.editGradeDialogVisible = false
              document.location.reload()
            } 
            else {
              // console.log('requestPatchGrade FAIL', res)      
              this.$VMessage('error', '年级信息修改失败')
            }
          })
          .catch(err => {
            // console.log('requestPatchGrade FAIL', err)      
          })
      },

      /**
       * 修改班级按钮点击
       */
      _editClassClick: function(grade, classItem) {
        this.editClassForm.className = classItem.className
        this.editClassForm.classId = classItem.classId
        this.editClassForm.gradeId = Number(grade.gradeId)
        this.editClassDialogVisible = true
      },

      /**
       * 删除班级按钮点击
       */
      _removeClassClick: function(classItem) {
        this.removeClass.classId = classItem.classId
        this.removeClass.className = classItem.className
        this.removeClassDialogVisible = true
      },

      /**
       * 添加班级按钮点击
       */
      _addClassClick: function(grade) {
        this.addClassForm.className = ''
        this.addClassForm.gradeId = Number(grade.gradeId)
        this.addClassDialogVisible = true
      },

      /**
       * 修改年级按钮点击
       */
      _editGradeClick: function(grade) {
        this.editGradeForm.gradeId = grade.gradeId
        this.editGradeForm.gradeName = grade.gradeName
        this.editGradeDialogVisible = true
      },
    },
  }
</script>


