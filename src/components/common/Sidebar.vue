<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    background-color="#2e3b4e"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <!-- 管理员菜单 -->
    <el-menu-item index="/admin/dashboard" v-if="userInfo?.role === 'admin'">
      <i class="el-icon-menu"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-menu-item index="/admin/user-management" v-if="userInfo?.role === 'admin'">
      <i class="el-icon-user"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/course-management" v-if="userInfo?.role === 'admin'">
      <i class="el-icon-folder-opened"></i>
      <span slot="title">课程管理</span>
    </el-menu-item>

    <!-- 教师菜单 -->
    <el-menu-item index="/teacher/dashboard" v-if="userInfo?.role === 'teacher'">
      <i class="el-icon-menu"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-menu-item index="/teacher/score-entry" v-if="userInfo?.role === 'teacher'">
      <i class="el-icon-edit"></i>
      <span slot="title">成绩录入</span>
    </el-menu-item>
    <el-menu-item index="/teacher/teaching-schedule" v-if="userInfo?.role === 'teacher'">
      <i class="el-icon-calendar"></i>
      <span slot="title">教学管理</span>
    </el-menu-item>
    <el-menu-item index="/teacher/course-creation" v-if="userInfo?.role === 'teacher'">
      <i class="el-icon-plus"></i>
      <span slot="title">开课</span>
    </el-menu-item>

    <!-- 学生菜单 -->
    <el-menu-item index="/student/dashboard" v-if="userInfo?.role === 'student'">
      <i class="el-icon-menu"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-menu-item index="/student/course-selection" v-if="userInfo?.role === 'student'">
      <i class="el-icon-plus"></i>
      <span slot="title">选课</span>
    </el-menu-item>
    <el-menu-item index="/student/score-query" v-if="userInfo?.role === 'student'">
      <i class="el-icon-search"></i>
      <span slot="title">成绩查询</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const userInfo = authStore.userInfo
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>