<template>
  <div class="layout-wrapper">
    <!-- 导航栏 -->
    <Navbar />
    <!-- 内容区（侧边栏 + 页面） -->
    <div class="content-container">
      <Sidebar />
      <main class="page-content">
        <router-view />
      </main>
    </div>
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import Footer from './Footer.vue'
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  display: flex;
  flex: 1;
}

.page-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}
</style>