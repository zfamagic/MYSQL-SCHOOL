<template>
  <div class="course-management">
    <el-card>
      <div class="card-header">
        <h2>课程管理</h2>
        <el-button type="primary" @click="handleAddCourse">添加课程</el-button>
      </div>
      <el-table :data="courses" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="200"></el-table-column>
        <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
        <el-table-column label="当前选课人数" width="120">
          <template #default="{ row }">
            {{ row.current_student || 0 }} 人
          </template>
        </el-table-column>
        <el-table-column prop="teacher" label="授课教师" width="120">
          <template #default="{ row }">
            {{ getTeacherName(row.teacher) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditCourse(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteCourse(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right;"
      />
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课程代码" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input v-model="form.credit" type="number"></el-input>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-select v-model="form.teacher" placeholder="请选择教师">
            <el-option v-for="t in teachers" :key="t.id" :label="t.name" :value="t.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/store/admin'
import { ElMessage } from 'element-plus'
import { deleteCourse } from '@/api/admin' // 引入删除 API

const adminStore = useAdminStore()
const courses = ref(adminStore.courses)
const teachers = ref(adminStore.users.filter(u => u.role === 'teacher'))
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(courses.value.length)

const dialogVisible = ref(false)
const isAdd = ref(true)
const dialogTitle = ref('添加课程')
const formRef = ref()
const form = ref({
  id: 0,
  name: '',
  code: '',
  credit: 0,
  teacher: 0
})

const rules = ref({
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入课程代码', trigger: 'blur' }],
  credit: [{ required: true, message: '请输入学分', trigger: 'blur' }],
  teacher: [{ required: true, message: '请选择授课教师', trigger: 'change' }]
})

const getTeacherName = (teacherId: number) => {
  const teacher = teachers.value.find(t => t.id === teacherId)
  return teacher ? teacher.name : ''
}

const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }

const handleAddCourse = () => {
  isAdd.value = true
  dialogTitle.value = '添加课程'
  form.value = { id: 0, name: '', code: '', credit: 0, teacher: 0 }
  dialogVisible.value = true
}

const handleEditCourse = (row: any) => {
  isAdd.value = false
  dialogTitle.value = '编辑课程'
  form.value = { ...row }
  dialogVisible.value = true
}

// 修改删除方法，调用后端 API
const handleDeleteCourse = async (id: number) => {
  if (confirm('确定要删除该课程吗？')) {
    try {
      await deleteCourse(id) // 调用后端删除接口
      adminStore.fetchCourses() // 删除成功后重新获取课程列表
      courses.value = adminStore.courses
      total.value = courses.value.length
      ElMessage.success('删除成功')
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

const handleSubmit = async () => {
  try {
    // @ts-ignore
    await formRef.value.validate()
    if (isAdd.value) {
      adminStore.addCourse(form.value)
      ElMessage.success('添加成功')
    } else {
      adminStore.updateCourse(form.value)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    courses.value = adminStore.courses
    total.value = courses.value.length
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

onMounted(() => {
  adminStore.fetchUsers()
  adminStore.fetchCourses()
})
</script>

<style scoped>
.course-management { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.dialog-footer { text-align: right; }
</style>