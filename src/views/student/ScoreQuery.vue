<template>
  <div class="score-query">
    <el-card>
      <h2>成绩查询</h2>
      <el-table :data="scores" border style="width: 100%">
        <el-table-column prop="courseName" label="课程名称" width="200"></el-table-column>
        <el-table-column prop="courseCode" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
        <el-table-column prop="score" label="成绩" width="100"></el-table-column>
        <el-table-column prop="semester" label="学期" width="120"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStudentStore } from '@/store/student'

const studentStore = useStudentStore()
const scores = ref(studentStore.scores)
</script>

<style scoped>
.score-query { padding: 20px; }
</style>