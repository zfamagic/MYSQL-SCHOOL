<template>
  <div class="score-entry">
    <el-card>
      <div class="card-header">
        <h2>成绩录入</h2>
        <el-select v-model="selectedCourseId" placeholder="选择课程" style="width: 200px">
          <el-option v-for="course in courses" :key="course.id" :label="course.name" :value="course.id"></el-option>
        </el-select>
      </div>
      <el-table :data="students" border style="width: 100%">
        <el-table-column prop="id" label="学生ID" width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column label="成绩" width="120">
          <template #default="{ row }">
            <el-input v-model.number="row.score" type="number" min="0" max="100"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px; text-align: right;">
        <el-button type="primary" @click="handleSubmit">提交成绩</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCoursesWithStudents, getCourseStudents, updateStudentScore } from '@/api/teacher'

const courses = ref([])
const students = ref([])
const selectedCourseId = ref<number | undefined>()

const fetchCourses = async () => {
  try {
    const res = await getCoursesWithStudents()
    courses.value = res
  } catch (error) {
    console.error('获取课程失败:', error)
    ElMessage.error('获取课程失败')
  }
}

watch(selectedCourseId, async (val) => {
  if (val) {
    try {
      const res = await getCourseStudents(val)
      students.value = res
    } catch (error) {
      console.error('获取学生失败:', error)
      ElMessage.error('获取学生失败')
    }
  } else {
    students.value = []
  }
})

const handleSubmit = async () => {
  if (!selectedCourseId.value) {
    ElMessage.warning('请先选择课程')
    return
  }
  try {
    const scores = students.value.map(s => ({
      studentId: s.id,
      courseId: selectedCourseId.value,
      score: s.score
    }))
    await updateStudentScore({ scores })
    ElMessage.success('成绩提交成功')
  } catch (error) {
    console.error('提交成绩失败:', error)
    ElMessage.error('提交成绩失败')
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.score-entry { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
</style>