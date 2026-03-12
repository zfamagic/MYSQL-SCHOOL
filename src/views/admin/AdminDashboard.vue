<template>
  <div class="admin-dashboard">
    <h2>管理员仪表盘</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">用户总数</div>
          <div class="stat-value">{{ userCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">课程总数</div>
          <div class="stat-value">{{ courseCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">选课总数</div>
          <div class="stat-value">{{ selectionCount }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="chart-card" style="margin-top: 20px">
      <div class="chart-title">用户角色分布</div>
      <div ref="roleChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { useAdminStore } from '@/store/admin'

const adminStore = useAdminStore()
const userCount = ref(adminStore.users.length)
const courseCount = ref(adminStore.courses.length)
const selectionCount = ref(320) // 模拟数据
const roleChart = ref()

onMounted(() => {
  const chartInstance = echarts.init(roleChart.value)
  chartInstance.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: '0%', left: 'center' },
    series: [
      {
        name: '角色分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 600 } },
        labelLine: { show: false },
        data: [
          { value: adminStore.users.filter(u => u.role === 'admin').length, name: '管理员' },
          { value: adminStore.users.filter(u => u.role === 'teacher').length, name: '教师' },
          { value: adminStore.users.filter(u => u.role === 'student').length, name: '学生' }
        ]
      }
    ]
  })
})
</script>

<style scoped>
.admin-dashboard { padding: 20px; }
.stat-card { text-align: center; padding: 20px; }
.stat-title { font-size: 16px; color: #666; margin-bottom: 10px; }
.stat-value { font-size: 28px; font-weight: bold; color: #1989fa; }
.chart-card { padding: 20px; }
.chart-title { font-size: 16px; color: #666; margin-bottom: 10px; }
</style>