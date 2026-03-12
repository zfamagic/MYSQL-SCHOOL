<template>
  <div class="student-dashboard">
    <h2>学生仪表盘</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">已选课程数</div>
          <div class="stat-value">{{ selectedCourseCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-title">已修学分</div>
          <div class="stat-value">{{ completedCredits }}</div>
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
      <div class="chart-title">成绩趋势</div>
      <div ref="scoreTrendChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { useStudentStore } from '@/store/student'

const store = useStudentStore()
const { selectedCourseCount, completedCredits, averageScore, scores, fetchSelectedCourses, fetchScores } = store

const scoreTrendChart = ref()

onMounted(async () => {
  await fetchSelectedCourses()
  await fetchScores()

  const chartInstance = echarts.init(scoreTrendChart.value!)
  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['成绩'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: scores.map(s => s.courseName)
    },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [
      {
        name: '成绩',
        type: 'line',
        data: scores.map(s => s.score),
        itemStyle: { color: '#1989fa' },
        smooth: true
      }
    ]
  })
})
</script>

<style scoped>
.student-dashboard { padding: 20px; }
.stat-card { text-align: center; padding: 20px; }
.stat-title { font-size: 16px; color: #666; margin-bottom: 10px; }
.stat-value { font-size: 28px; font-weight: bold; color: #1989fa; }
.chart-card { padding: 20px; }
.chart-title { font-size: 16px; color: #666; margin-bottom: 10px; }
</style>