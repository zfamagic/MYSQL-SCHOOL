<template>
  <div class="course-creation">
    <el-card>
      <h2>创建新课程</h2>
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
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createCourse } from '@/api/teacher'

const formRef = ref()
const form = ref({
  name: '',
  code: '',
  credit: 0
})

const rules = ref({
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入课程代码', trigger: 'blur' }],
  credit: [{ required: true, message: '请输入学分', trigger: 'blur' }]
})

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    await createCourse(form.value)
    ElMessage.success('课程创建成功')
    form.value = { name: '', code: '', credit: 0 }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('课程创建失败')
  }
}
</script>

<style scoped>
.course-creation { padding: 20px; }
</style>