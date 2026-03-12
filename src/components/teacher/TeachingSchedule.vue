<template>
  <div class="teaching-schedule">
    <el-card>
      <div class="card-header">
        <h2>教学计划</h2>
        <el-select v-model="selectedCourseId" placeholder="选择课程" style="width: 200px">
          <el-option v-for="course in courses" :key="course.id" :label="course.name" :value="course.id"></el-option>
        </el-select>
      </div>
      <el-table :data="courses" border style="width: 100%">
        <el-table-column prop="id" label="课程ID" width="100"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="200"></el-table-column>
        <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getTeacherCourses } from '@/api/teacher'

const courses = ref([])
const selectedCourseId = ref<number | undefined>()

const fetchCourses = async () => {
  try {
    const res = await getTeacherCourses()
    courses.value = res
  } catch (error) {
    console.error('获取课程失败:', error)
    ElMessage.error('获取课程失败')
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.teaching-schedule { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
</style>