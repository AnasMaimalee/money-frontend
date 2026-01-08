<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['administrator']
})

import { ref } from 'vue'
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  RiseOutlined,
  NotificationOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'

// Mock data
const totalUsers = ref(12458)
const pendingApprovals = ref(312)
const activeServices = ref(892)
const monthlyRevenue = ref(45678)
const approvalRate = ref(94.3)
</script>

<template>
  <div class="space-y-8">
    <!-- Page Title -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Administrator Overview</h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Manage users, approve services, and monitor platform activity.
        </p>
      </div>
      <a-button type="primary" size="large" class="shadow-lg">
        <template #icon><NotificationOutlined /></template>
        Review Pending
      </a-button>
    </div>

    <!-- Key Metrics -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ totalUsers.toLocaleString() }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <RiseOutlined class="mr-1" /> +12% growth
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
              <TeamOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ pendingApprovals }}</p>
              <p class="text-sm text-orange-600 dark:text-orange-400 mt-2 flex items-center">
                <ClockCircleOutlined class="mr-1" /> Needs attention
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <CheckCircleOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ activeServices.toLocaleString() }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-2">Stable</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
              <AppstoreOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">${{ monthlyRevenue.toLocaleString() }}</p>
              <p class="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <RiseOutlined class="mr-1" /> {{ approvalRate }}% approval rate
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <DollarCircleOutlined class="text-4xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Additional Sections (e.g., Recent Activity, Charts) -->
    <a-card title="Recent Activity" class="shadow-lg border-0">
      <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p class="text-gray-500">Activity timeline or chart placeholder</p>
      </div>
    </a-card>
  </div>
</template>