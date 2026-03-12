<template>
  <div class="teaching-schedule">
    <el-card>
      <div class="card-header">
        <h2>教学管理</h2>
        <el-select v-model="selectedCourseId" placeholder="选择课程" style="width: 200px">
          <el-option v-for="course in courses" :key="course.id" :label="course.name" :value="course.id"></el-option>
        </el-select>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="课程信息" name="info">
          <el-table :data="courses" border style="width: 100%">
            <el-table-column prop="id" label="课程ID" width="100"></el-table-column>
            <el-table-column prop="name" label="课程名称" width="200"></el-table-column>
            <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
            <el-table-column prop="credit" label="学分" width="80"></el-table-column>
            <el-table-column label="当前选课人数" width="120">
              <template #default="{ row }">
                {{ row.current_student || 0 }} 人
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="学生名单" name="students">
          <el-table :data="students" border style="width: 100%">
            <el-table-column prop="id" label="学生ID" width="100"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column label="出勤状态" width="120">
              <template #default="{ row }">
                <el-select v-model="row.attendance" placeholder="选择状态" @change="handleAttendance(row)">
                  <el-option label="出勤" value="present"></el-option>
                  <el-option label="缺勤" value="absent"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCoursesWithStudents, getCourseStudents, recordAttendance } from '@/api/teacher'

const courses = ref([])
const students = ref([])
const selectedCourseId = ref<number | undefined>()
const activeTab = ref('info')

const fetchCourses = async () => {
  try {
    const res = await getCoursesWithStudents()
    courses.value = res.map(c => ({
      ...c,
      current_student: c.current_student || 0
    }))
  } catch (error) {
    console.error('获取课程失败:', error)
    ElMessage.error('获取课程失败')
  }
}

watch(selectedCourseId, async (val) => {
  if (val) {
    try {
      const res = await getCourseStudents(val)
      students.value = res.map(s => ({ ...s, attendance: '' }))
    } catch (error) {
      console.error('获取学生失败:', error)
      ElMessage.error('获取学生失败')
    }
  } else {
    students.value = []
  }
})

const handleAttendance = async (row) => {
  if (!selectedCourseId.value) return
  try {
    await recordAttendance({
      courseId: selectedCourseId.value,
      studentId: row.id,
      status: row.attendance
    })
    ElMessage.success('出勤记录成功')
  } catch (error) {
    console.error('记录出勤失败:', error)
    ElMessage.error('记录出勤失败')
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