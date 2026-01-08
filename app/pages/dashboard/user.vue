<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['user']
})

import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  WalletOutlined,
  ShoppingOutlined,
  ProfileOutlined,
  HeartOutlined,
  RiseOutlined
} from '@ant-design/icons-vue'

const auth = useAuthStore()

// Mock data
const walletBalance = ref(1250.50)
const activeServices = ref(5)
const upcomingPayments = ref(120)
const satisfactionScore = ref(98)
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-primary rounded-2xl p-8 text-white shadow-2xl">
      <h1 class="text-4xl font-bold">Welcome back, {{ auth.user?.name || 'User' }}! 👋</h1>
      <p class="text-xl mt-4 opacity-90">Here's your JAMB Fortal overview</p>
    </div>

    <!-- Quick Stats -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="hover:shadow-2xl transition-all duration-300 border-0">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Wallet Balance</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">${{ walletBalance.toFixed(2) }}</p>
            </div>
            <div class="p-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <WalletOutlined class="text-5xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="hover:shadow-2xl transition-all duration-300 border-0">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ activeServices }}</p>
            </div>
            <div class="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <ShoppingOutlined class="text-5xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :lg="8">
        <a-card class="hover:shadow-2xl transition-all duration-300 border-0">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ satisfactionScore }}%</p>
              <p class="text-sm text-green-600 mt-2 flex items-center">
                <HeartOutlined class="mr-1" /> Excellent!
              </p>
            </div>
            <div class="p-5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl">
              <HeartOutlined class="text-5xl text-white" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <a-card hoverable class="text-center py-8 cursor-pointer">
        <ProfileOutlined class="text-5xl text-primary mb-4" />
        <h3 class="text-xl font-semibold">View Profile</h3>
      </a-card>
      <a-card hoverable class="text-center py-8 cursor-pointer">
        <ShoppingOutlined class="text-5xl text-primary mb-4" />
        <h3 class="text-xl font-semibold">Browse Services</h3>
      </a-card>
      <a-card hoverable class="text-center py-8 cursor-pointer">
        <WalletOutlined class="text-5xl text-primary mb-4" />
        <h3 class="text-xl font-semibold">Top Up Wallet</h3>
      </a-card>
    </div>

    <!-- Placeholder for personal chart/activity -->
    <a-card title="Your Recent Activity" class="shadow-lg border-0">
      <div class="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
        <p class="text-gray-500">Personal transaction history or chart</p>
      </div>
    </a-card>
  </div>
</template>
