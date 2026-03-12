<template>
  <div class="user-management">
    <el-card>
      <div class="card-header">
        <h2>用户管理</h2>
        <el-button type="primary" @click="handleAddUser">添加用户</el-button>
      </div>
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.role === 'admin' ? '系统管理员' : row.role === 'teacher' ? '教师' : '学生' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditUser(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDeleteUser(row.id)">删除</el-button>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isAdd">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="系统管理员" value="admin"></el-option>
            <el-option label="教师" value="teacher"></el-option>
            <el-option label="学生" value="student"></el-option>
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
import { ref } from 'vue'
import { useAdminStore } from '@/store/admin'
import { ElMessage } from 'element-plus'

const adminStore = useAdminStore()
const users = ref(adminStore.users)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(users.value.length)

const dialogVisible = ref(false)
const isAdd = ref(true)
const dialogTitle = ref('添加用户')
const formRef = ref()
const form = ref({
  id: 0,
  username: '',
  password: '',
  name: '',
  role: 'student' as 'admin' | 'teacher' | 'student'
})

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
})

const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }

const handleAddUser = () => {
  isAdd.value = true
  dialogTitle.value = '添加用户'
  form.value = { id: 0, username: '', password: '', name: '', role: 'student' }
  dialogVisible.value = true
}

const handleEditUser = (row: any) => {
  isAdd.value = false
  dialogTitle.value = '编辑用户'
  form.value = { ...row, password: '' }
  dialogVisible.value = true
}

const handleDeleteUser = (id: number) => {
  if (confirm('确定要删除该用户吗？')) {
    adminStore.deleteUser(id)
    users.value = adminStore.users
    total.value = users.value.length
    ElMessage.success('删除成功')
  }
}

const handleSubmit = async () => {
  try {
    // @ts-ignore
    await formRef.value.validate()
    if (isAdd.value) {
      adminStore.addUser(form.value)
      ElMessage.success('添加成功')
    } else {
      adminStore.updateUser(form.value)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    users.value = adminStore.users
    total.value = users.value.length
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.user-management { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.dialog-footer { text-align: right; }
</style>