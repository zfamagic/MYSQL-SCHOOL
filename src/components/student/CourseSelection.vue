<template>
  <div class="course-selection">
    <el-card>
      <h2>可选课程</h2>
      <!-- 加key强制表格重新渲染 -->
      <el-table 
        :data="availableCourses" 
        :key="availableCoursesKey" 
        border 
        style="width: 100%"
      >
        <el-table-column prop="id" label="课程ID" width="80"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="200"></el-table-column>
        <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
        <el-table-column prop="teacherName" label="授课教师" width="120"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleSelect(row.id)">选课</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px;">
      <h2>已选课程</h2>
      <!-- 加key强制表格重新渲染 -->
      <el-table 
        :data="selectedCourses" 
        :key="selectedCoursesKey" 
        border 
        style="width: 100%"
      >
        <el-table-column prop="id" label="课程ID" width="80"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="200"></el-table-column>
        <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
        <el-table-column prop="teacherName" label="授课教师" width="120"></el-table-column>
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
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getAvailableCourses, selectCourse, dropCourse, getSelectedCourses } from '@/api/student'

interface Course {
  id: number
  name: string
  code: string
  credit: number
  teacherName: string
}

const availableCourses = ref<Course[]>([])
const selectedCourses = ref<Course[]>([])
// 用于强制表格重新渲染的key
const availableCoursesKey = ref(0)
const selectedCoursesKey = ref(0)

const fetchAvailableCourses = async () => {
  try {
    const res = await getAvailableCourses()
    console.log('可选课程请求结果:', res)
    
    // 等待DOM更新后再赋值 + 强制更新key
    await nextTick()
    availableCourses.value = Array.isArray(res) ? res : []
    availableCoursesKey.value++ // 改变key，强制表格重新渲染
  } catch (error) {
    console.error('可选课程请求失败:', error)
    ElMessage.error('获取可选课程失败')
  }
}

const fetchSelectedCourses = async () => {
  try {
    const res = await getSelectedCourses()
    console.log('已选课程请求结果:', res)
    
    // 等待DOM更新后再赋值 + 强制更新key
    await nextTick()
    selectedCourses.value = Array.isArray(res) ? res : []
    selectedCoursesKey.value++ // 改变key，强制表格重新渲染
  } catch (error) {
    console.error('已选课程请求失败:', error)
    ElMessage.error('获取已选课程失败')
  }
}

const handleSelect = async (courseId: number) => {
  try {
    await selectCourse(courseId)
    ElMessage.success('选课成功')
    fetchAvailableCourses()
    fetchSelectedCourses()
  } catch (error) {
    console.error('选课失败:', error)
    ElMessage.error('选课失败')
  }
}

const handleDrop = async (courseId: number) => {
  try {
    await dropCourse(courseId)
    ElMessage.success('退课成功')
    fetchAvailableCourses()
    fetchSelectedCourses()
  } catch (error) {
    console.error('退课失败:', error)
    ElMessage.error('退课失败')
  }
}

onMounted(() => {
  fetchAvailableCourses()
  fetchSelectedCourses()
})
</script>

<style scoped>
.course-selection { padding: 20px; }
</style>