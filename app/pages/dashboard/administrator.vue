<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['administrator']
})

import { ref, onMounted } from 'vue'
import { 
  ProfileOutlined, CheckCircleOutlined, CloseCircleOutlined, 
  DollarCircleOutlined, AppstoreOutlined, TimeOutlined,
  NotificationOutlined, UserOutlined, RiseOutlined
} from '@ant-design/icons-vue'

const loading = ref(true)
const error = ref('')
const dashboardData = ref<any>(null)



const serviceColumns = [
  { title: 'Service', dataIndex: 'service', key: 'service', ellipsis: true },
  { title: 'Total', dataIndex: 'jobs', key: 'jobs', sorter: (a, b) => a.jobs - b.jobs },
  { title: 'Completed', dataIndex: 'completed', key: 'completed' },
  { title: 'Rejected', dataIndex: 'rejected', key: 'rejected' },
  {
    title: 'Progress',
    key: 'progress',
    slots: { customRender: 'progress' },
    width: 200
  }
]

const recentColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', ellipsis: true, width: 120 },
  { title: 'User', dataIndex: 'user_id', key: 'user_id', ellipsis: true },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    slots: { customRender: 'status' },
    width: 100
  },
  { title: 'Created', dataIndex: 'created_at', key: 'created_at', ellipsis: true },
  { title: 'Updated', dataIndex: 'updated_at', key: 'updated_at', ellipsis: true },
  { title: 'Ago', dataIndex: 'ago', key: 'ago', slots: { customRender: 'ago' } }
]
// ✅ LIVE DATA FROM YOUR BACKEND API
const fetchDashboardData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await $fetch('/api/dashboard/admin', {
      baseURL: 'http://127.0.0.1:8000',
      headers: {
        Authorization: `Bearer ${useCookie('token').value}`
      }
    })
    
    dashboardData.value = response
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to load dashboard data'
    console.error('Dashboard error:', err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchDashboardData()
}

// Refresh every 30 seconds
let refreshInterval: NodeJS.Timeout
onMounted(() => {
  fetchDashboardData()
  refreshInterval = setInterval(fetchDashboardData, 30000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<template>
  <div v-if="error" class="p-6 bg-red-50 border border-red-200 rounded-2xl">
    <div class="flex items-center gap-3 text-red-800">
      <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
      <div>
        <h3 class="font-semibold">Dashboard Error</h3>
        <p>{{ error }}</p>
        <a-button type="primary" @click="refreshData" class="mt-3">
          Retry
        </a-button>
      </div>
    </div>
  </div>

  <div v-else class="space-y-8 p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-3xl border">
      <div>
        <h1 class="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3">
          Admin Dashboard
        </h1>
        <div class="flex items-center gap-6 text-xl">
          <span class="px-4 py-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg font-semibold">
            {{ dashboardData?.stats?.performance || 'Loading...' }}
          </span>
          <span class="text-gray-600">
            {{ dashboardData?.stats?.processed_jobs || 0 }} jobs processed
          </span>
          <span class="text-emerald-600 font-semibold">
            ₦{{ Number(dashboardData?.stats?.earnings || 0).toLocaleString() }}
          </span>
        </div>
      </div>
      <div class="flex gap-4">
        <a-button 
          type="primary" 
          size="large" 
          @click="refreshData"
          class="shadow-2xl font-bold px-8 h-14 flex items-center gap-2"
        >
          <Icon name="heroicons:arrow-path" class="w-5 h-5 animate-spin" v-if="loading" />
          <span v-else>Refresh</span>
          <NotificationOutlined />
        </a-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full glass-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-700 uppercase tracking-wider mb-4">Total Processed</p>
              <p class="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                {{ dashboardData?.stats?.processed_jobs?.toLocaleString() || 0 }}
              </p>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-lg" 
                     :style="{ width: '100%' }"></div>
              </div>
            </div>
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <ProfileOutlined class="text-3xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full glass-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-700 uppercase tracking-wider mb-4">Completed Jobs</p>
              <p class="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                {{ dashboardData?.stats?.completed_jobs?.toLocaleString() || 0 }}
              </p>
              <div class="text-sm text-emerald-600 font-semibold flex items-center gap-2">
                <CheckCircleOutlined /> {{ dashboardData?.stats?.performance }}
              </div>
            </div>
            <div class="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <CheckCircleOutlined class="text-3xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full glass-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-700 uppercase tracking-wider mb-4">Rejected</p>
              <p class="text-5xl font-black text-red-500 mb-4">{{ dashboardData?.stats?.rejected_jobs || 0 }}</p>
              <div class="text-sm text-red-500 font-semibold flex items-center gap-2">
                <CloseCircleOutlined /> {{ Math.round((dashboardData?.stats?.rejected_jobs || 0) / Math.max((dashboardData?.stats?.processed_jobs || 1), 1) * 100) }}%
              </div>
            </div>
            <div class="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <CloseCircleOutlined class="text-3xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full glass-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-700 uppercase tracking-wider mb-4">Earnings</p>
              <p class="text-5xl font-black bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
                ₦{{ Number(dashboardData?.stats?.earnings || 0).toLocaleString() }}
              </p>
              <p class="text-sm text-gray-600">{{ dashboardData?.stats?.avg_processing_time }}</p>
            </div>
            <div class="w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <DollarCircleOutlined class="text-3xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Service Breakdown & Recent Jobs -->
    <a-row :gutter="[24, 24]">
      <!-- Jobs by Service -->
      <a-col :xs="24" :lg="16">
        <a-card title="Jobs by Service" class="border-0 shadow-2xl glass-card">
          <a-table
            :data-source="dashboardData?.jobs_by_service || []"
            :columns="serviceColumns"
            :loading="loading"
            :pagination="false"
            row-key="service"
            class="rounded-2xl"
          >
            <template #progress="{ record }">
              <div class="flex items-center gap-3">
                <div class="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm transition-all"
                    :style="{ width: (record.completed/record.jobs * 100) + '%' }"
                  ></div>
                </div>
                <span class="font-semibold text-lg">{{ Math.round((record.completed/record.jobs) * 100) }}%</span>
              </div>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- Recent Jobs -->
      <a-col :xs="24" :lg="8">
        <a-card title="Recent Activity" class="border-0 shadow-2xl glass-card">
          <a-table
            :data-source="dashboardData?.recent_jobs?.slice(0, 8) || []"
            :columns="recentColumns"
            :loading="loading"
            :pagination="false"
            row-key="id"
            class="rounded-2xl"
            size="small"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Fraud Flags -->
    <a-card v-if="dashboardData?.fraud_flags" title="Performance Alerts" class="border-0 shadow-2xl glass-card">
      <a-row :gutter="[16, 16]">
        <a-col v-for="(flag, key) in dashboardData.fraud_flags" :key="key" :xs="24" :sm="12">
          <a-alert
            :type="flag ? 'warning' : 'success'"
            :message="key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())"
            :description="flag ? 'Review your performance metrics' : 'All good!'"
            show-icon
          />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>



<style scoped>
.glass-card {
  @apply bg-white/80 backdrop-blur-xl border-white/50;
}

.text-gradient-gold {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:deep(.ant-table) {
  @apply bg-white/60 backdrop-blur-sm;
}

:deep(.ant-table-thead > tr > th) {
  @apply bg-blue-50/50 border-b-2 border-blue-100 font-bold text-gray-800;
}
</style>
