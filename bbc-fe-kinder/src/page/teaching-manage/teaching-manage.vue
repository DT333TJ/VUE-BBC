/** 
 * @Desc: 教学管理页面
 */
<template>
  <div>
    <v-header></v-header>
    <!-- S 导航 -->
    <v-nav>
      <v-sub-nav title="课表管理" :open="$route.meta.mark == 'course-table-manage'">
        <v-nav-item 
          :active="Number(grade.gradeId) === gradeId"
          v-for="grade in $store.state.gradeList" 
          :key="grade.gradeId"
          @click.native="$router.replace(`/teaching-manage/course-table-manage/${ grade.gradeId }`)">
          {{ grade.gradeName }}
        </v-nav-item>
      </v-sub-nav>
      <v-sub-nav title="备课管理" :open="$route.meta.mark == 'prepare-lesson-manage'">
        <v-nav-item 
          :active="navItem.path === $route.path"
          v-for="navItem in prepareLessonManageChilds"
          :key="navItem.path"
          @click.native="$router.push(navItem.path)">
          {{ navItem.title }}
        </v-nav-item>
      </v-sub-nav>
    </v-nav>
    <!-- E 导航 -->

    <!-- S 内容区 -->
    <router-view ></router-view>
    <!-- E 内容区 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import store from 'store'
  export default {
    name: 'TeachingManage',
    data: function() {
      return {
        // 备课管理子导航
        prepareLessonManageChilds: [
          {
            title: '备课看板',
            path: '/teaching-manage/prepare-lesson-board'
          },
          {
            title: '备课明细',
            path: '/teaching-manage/prepare-lesson-detail'
          },
        ]
      }
    },
    computed: {
      gradeId: function() {
        return Number(this.$route.params.gradeId)
      }
    },
  }
</script>


