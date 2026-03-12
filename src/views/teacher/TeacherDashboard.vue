<template>
  <div class="teacher-dashboard">
    <h2>教师仪表盘</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">教授课程数</div>
          <div class="stat-value">{{ courseCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">授课学生数</div>
          <div class="stat-value">{{ studentCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">平均成绩</div>
          <div class="stat-value">{{ averageScore }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="chart-card" style="margin-top: 20px">
      <div class="chart-title">学生成绩分布</div>
      <div ref="scoreChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getTeacherStats, getScoreDistribution } from '@/api/teacher'

const courseCount = ref(0)
const studentCount = ref(0)
const averageScore = ref('0.00')
const scoreChart = ref()

const fetchStats = async () => {
  try {
    const res = await getTeacherStats()
    courseCount.value = res.courseCount
    studentCount.value = res.studentCount
    averageScore.value = res.averageScore
  } catch (err) {
    console.error('获取教师统计数据失败:', err)
  }
}

const fetchScoreDistribution = async () => {
  try {
    const res = await getScoreDistribution()
    return res
  } catch (err) {
    console.error('获取成绩分布失败:', err)
    return [0, 0, 0, 0, 0]
  }
}

onMounted(async () => {
  await fetchStats()
  const distributionData = await fetchScoreDistribution()

  const chartInstance = echarts.init(scoreChart.value!)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['学生人数'] }, // ✅ 与 series.name 一致
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['0-59', '60-69', '70-79', '80-89', '90-100']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '学生人数', // ✅ 与 legend.data 一致
        type: 'bar',
        data: distributionData,
        itemStyle: { color: '#1989fa' }
      }
    ]
  })
})
</script>

<style scoped>
.teacher-dashboard { padding: 20px; }
.stat-card { text-align: center; padding: 20px; }
.stat-title { font-size: 16px; color: #666; margin-bottom: 10px; }
.stat-value { font-size: 28px; font-weight: bold; color: #1989fa; }
.chart-card { padding: 20px; }
.chart-title { font-size: 16px; color: #666; margin-bottom: 10px; }
</style>