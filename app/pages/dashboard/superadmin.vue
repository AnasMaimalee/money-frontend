<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['superadmin']
})

import { ref } from 'vue'
import {
  UserOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'

// Mock data for a stunning super admin overview
const totalUsers = ref(12458)
const activeUsers = ref(8923)
const totalAdmins = ref(47)
const totalRevenue = ref(456789)
const monthlyRevenue = ref(78950)
const totalServicesSold = ref(3214)
const growthRate = ref(12.5)
const churnRate = ref(2.1)

const revenueTrend = ref([
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 38000 },
  { month: 'Mar', revenue: 42000 },
  { month: 'Apr', revenue: 51000 },
  { month: 'May', revenue: 62000 },
  { month: 'Jun', revenue: 78950 }
])
</script>

<template>
  <div class="space-y-8">
    <!-- Page Title -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Overview</h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening across the JAMB Fortal platform today.
        </p>
      </div>
      <a-button type="primary" size="large" class="shadow-lg">
        <template #icon><RiseOutlined /></template>
        Generate Report
      </a-button>
    </div>

    <!-- Key Metrics Cards - Modern Grid with Gradient Accents -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ totalUsers.toLocaleString() }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <RiseOutlined class="mr-1" /> +8.2% from last month
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <UserOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ activeUsers.toLocaleString() }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <RiseOutlined class="mr-1" /> +5.4% this week
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <TeamOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Administrators</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ totalAdmins }}</p>
              <p class="text-sm text-blue-600 dark:text-blue-400 mt-2 flex items-center">
                Stable
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <UserOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">${{ totalRevenue.toLocaleString() }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <RiseOutlined class="mr-1" /> {{ growthRate }}% growth
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
              <DollarCircleOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Secondary Metrics + Charts -->
    <a-row :gutter="[24, 24]">
      <!-- Revenue & Services -->
      <a-col :xs="24" :lg="12">
        <a-card title="Revenue Performance" class="shadow-lg border-0 h-full">
          <template #extra>
            <a-tag color="green">+{{ growthRate }}%</a-tag>
          </template>
          <div class="space-y-6">
            <div class="flex items-center justify-between py-4 border-b dark:border-gray-700">
              <div>
                <p class="text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                <p class="text-2xl font-bold">${{ monthlyRevenue.toLocaleString() }}</p>
              </div>
              <DollarCircleOutlined class="text-5xl text-green-500 opacity-20" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400">Services & Pricing Sales</p>
                <p class="text-2xl font-bold">{{ totalServicesSold.toLocaleString() }}</p>
              </div>
              <ShoppingCartOutlined class="text-5xl text-blue-500 opacity-20" />
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- Growth & Churn -->
      <a-col :xs="24" :lg="12">
        <a-card title="Platform Health" class="shadow-lg border-0 h-full">
          <div class="grid grid-cols-2 gap-6">
            <div class="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
              <RiseOutlined class="text-4xl text-green-600 dark:text-green-400 mb-3" />
              <p class="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ growthRate }}%</p>
            </div>
            <div class="text-center p-6 bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl">
              <FallOutlined class="text-4xl text-red-600 dark:text-red-400 mb-3" />
              <p class="text-sm text-gray-600 dark:text-gray-400">Churn Rate</p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ churnRate }}%</p>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Optional: Add real charts here with ant-design-charts or echarts -->
    <!-- For now, placeholder for revenue trend chart -->
    <a-card title="Revenue Trend (Last 6 Months)" class="shadow-lg border-0">
      <div class="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p class="text-gray-500">Beautiful line/area chart goes here (use @ant-design/charts)</p>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
/* Enhanced hover effects and modern feel */
.ant-card {
  border-radius: 16px;
  background: rgb(255, 255, 255);
}
.dark .ant-card {
  background: rgb(31, 41, 55);
}
</style>