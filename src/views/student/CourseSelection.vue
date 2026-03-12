<template>
  <div class="course-selection">
    <el-card>
      <h2>可选课程</h2>
      <el-table :data="availableCourses" border style="width: 100%">
        <el-table-column prop="id" label="课程ID" width="80"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="200"></el-table-column>
        <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
        <el-table-column label="当前选课人数" width="120">
          <template #default="{ row }">
            {{ row.current_student || 0 }} 人
          </template>
        </el-table-column>
        <el-table-column label="授课教师" width="120">
          <template #default="{ row }">
            {{ row.teacherName || row.teacher_name || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleSelect(row.id)">选课</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px;">
      <h2>已选课程</h2>
      <el-table :data="selectedCourses" border style="width: 100%">
        <el-table-column prop="id" label="课程ID" width="80"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="200"></el-table-column>
        <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
        <el-table-column label="当前选课人数" width="120">
          <template #default="{ row }">
            {{ row.current_student || 0 }} 人
          </template>
        </el-table-column>
        <el-table-column label="授课教师" width="120">
          <template #default="{ row }">
            {{ row.teacherName || row.teacher_name || '未知' }}
          </template>
        </el-table-column>
        <el-table-column label="选课时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.selectedTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDrop(row.id)">退课</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { formatTime } from '@/utils/format'
import { selectCourse, dropCourse } from '@/api/student'
import { useStudentStore } from '@/store/student'

const store = useStudentStore()
const { availableCourses, selectedCourses, fetchAvailableCourses, fetchSelectedCourses } = store

const handleSelect = async (courseId: number) => {
  try {
    await selectCourse(courseId)
    ElMessage.success('选课成功')
    await fetchAvailableCourses()
    await fetchSelectedCourses()
  } catch (error) {
    console.error('选课失败:', error)
    ElMessage.error('选课失败')
  }
}

const handleDrop = async (courseId: number) => {
  try {
    await dropCourse(courseId)
    ElMessage.success('退课成功')
    await fetchAvailableCourses()
    await fetchSelectedCourses()
  } catch (error) {
    console.error('退课失败:', error)
    ElMessage.error('退课失败')
  }
}

onMounted(async () => {
  await fetchAvailableCourses()
  await fetchSelectedCourses()
})
</script>

<style scoped>
.course-selection { padding: 20px; }
</style>