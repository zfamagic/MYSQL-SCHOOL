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

interface Score {
  courseName: string
  courseCode: string
  credit: number
  score: number
  semester: string
}

const scores = ref<Score[]>([
  { courseName: '高等数学', courseCode: 'MATH101', credit: 4, score: 85, semester: '2024-2025学年第一学期' },
  { courseName: '大学物理', courseCode: 'PHYS101', credit: 3, score: 78, semester: '2024-2025学年第一学期' }
])
</script>

<style scoped>
.score-query { padding: 20px; }
</style>