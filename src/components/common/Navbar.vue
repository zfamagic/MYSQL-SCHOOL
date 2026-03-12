<template>
  <div class="navbar">
    <!-- 左上角：系统名称 -->
    <div class="navbar-left">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
      <span>教学事务管理系统</span>
    </div>

    <!-- 右上角：用户信息和退出 -->
    <div class="navbar-right">
      <span class="user-name" v-if="userInfo">{{ userInfo.name }}</span>
      <el-button 
        type="primary" 
        size="small" 
        @click="handleLogout" 
        v-if="userInfo"
      >
        退出登录
      </el-button>
      <el-button 
        type="primary" 
        size="small" 
        @click="router.push('/login')" 
        v-if="!userInfo"
      >
        登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const userInfo = authStore.userInfo

const handleLogout = async () => {
  await authStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2e3b4e;
  color: #fff;
  padding: 0 20px;
  height: 60px;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-size: 14px;
}
</style>