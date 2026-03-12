<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo图片 -->
      <img src="@/assets/images/logo.png" alt="系统Logo" class="login-logo" />

      <h2 class="login-title">教学管理系统</h2>

      <el-form :model="form" label-width="80px" class="login-form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="教师" value="teacher"></el-option>
            <el-option label="学生" value="student"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="login-btn-group">
          <el-button type="primary" @click="login" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth'
import { pinia } from '@/main'

const router = useRouter()
const authStore = useAuthStore(pinia)

const form = ref({
  username: '',
  password: '',
  role: 'student' as 'admin' | 'teacher' | 'student'
})

const login = async () => {
  try {
    const res = await authApi.login(form.value)
    console.log('登录成功', res)

    authStore.setToken(res.token)
    authStore.setUserInfo(res.user)

    router.push(`/${form.value.role}/dashboard`)
    ElMessage.success('登录成功')
  } catch (err: any) {
    console.error('登录失败', err)
    ElMessage.error(err.message || '登录失败，请检查账号密码')
  }
}
</script>

<style scoped>
.login-container {
  background: url('@/assets/images/login-bg.jpg') no-repeat center center;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 420px;
}

.login-logo {
  width: 100px;
  margin-bottom: 20px;
}

.login-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}

.login-form {
  margin-top: 20px;
}

.login-btn-group {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}
</style>