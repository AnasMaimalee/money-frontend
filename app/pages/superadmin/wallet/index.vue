<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['superadmin'],
})

import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  Table, Card, Button, Input, Select, Typography, Dropdown, message, Tag
} from 'ant-design-vue'
import { 
  EyeOutlined, EyeInvisibleOutlined, FilterOutlined, FilePdfOutlined, ReloadOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const { $api } = useNuxtApp()

/* ================= STATE ================= */
const loading = ref(false)
const walletLoading = ref(false)
const hideBalance = ref(true)

const walletBalance = ref(0)
const currency = ref('NGN')

/* TRANSACTIONS + PAGINATION */
const transactions = ref<any[]>([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`
})

/* FILTERS */
const searchText = ref('')
const monthFilter = ref<number | null>(null)
const yearFilter = ref<string | null>(null)

/* ================= COMPUTED ================= */
const balanceText = computed(() =>
  hideBalance.value ? '••••••' : `₦${walletBalance.value.toLocaleString()}`
)

/* ================= ROW STYLING ================= */
const getRowClassName = (record: any) => {
  if (!record || !record.type) return ''
  return record.type === 'credit' ? 'credit-row' : 'debit-row'
}

/* ================= API ================= */
const fetchWallet = async () => {
  try {
    const res = await $api('/wallet/me')
    walletBalance.value = Number(res.balance || 0)
    currency.value = res.currency || 'NGN'
  } catch (err) {
    console.error('Wallet error:', err)
  }
}

const fetchTransactions = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.current,
      per_page: pagination.value.pageSize
    }
    
    // Add optional filters
    if (searchText.value) params.search = searchText.value
    if (monthFilter.value) params.month = monthFilter.value
    if (yearFilter.value) params.year = yearFilter.value

    const res = await $api('/wallet/transactions', { params })
    
    // 🔥 FIXED: Handle ALL possible API structures
    transactions.value = res.data?.data || res.data || res.transactions?.data || []
    
    // 🔥 FIXED: Extract pagination from correct location
    const meta = res.data || res
    pagination.value.current = Number(meta.current_page || meta.page || 1)
    pagination.value.total = Number(meta.total || meta.total_count || meta.count || 0)
    pagination.value.pageSize = Number(meta.per_page || meta.page_size || 10)
    
    // Safety check
    if (!Array.isArray(transactions.value)) transactions.value = []
    
  } catch (error) {
    console.error('Transactions error:', error)
    transactions.value = []
    pagination.value.total = 0
  } finally {
    loading.value = false
  }
}

/* ================= ACTIONS ================= */
const resetFilters = () => {
  searchText.value = ''
  monthFilter.value = null
  yearFilter.value = null
  pagination.value.current = 1
  fetchTransactions()
}

const exportPdf = async () => {
  try {
    const blob = await $api('/wallet/history/pdf', { responseType: 'blob' })
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch (err) {
    message.error('Failed to export PDF')
  }
}

const refreshAll = async () => {
  await Promise.all([fetchWallet(), fetchTransactions()])
  message.success('Refreshed successfully')
}

const handleTableChange = (paginationConfig: any) => {
  pagination.value.current = paginationConfig.current
  pagination.value.pageSize = paginationConfig.pageSize
  fetchTransactions()
}

/* ================= WATCHERS ================= */
watch([searchText, monthFilter, yearFilter], () => {
  pagination.value.current = 1
  fetchTransactions()
})

/* ================= INIT ================= */
onMounted(async () => {
  await Promise.all([fetchWallet(), fetchTransactions()])
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Wallet Balance Card -->
    <Card class="!shadow-lg">
      <div class="relative overflow-hidden rounded-3xl p-8" 
           style="background: linear-gradient(135deg, #1a2f4c, #2f4f6f);">
        <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:justify-between text-white">
          <div>
            <Typography.Text class="text-sm uppercase tracking-wide text-gray-300">
              Wallet Balance
            </Typography.Text>
            <Typography.Title :level="1" class="text-5xl font-extrabold mt-3 !m-0 text-white drop-shadow-lg">
              {{ balanceText }}
            </Typography.Title>
            <Typography.Text class="text-sm mt-2 text-gray-300">
              Available funds • {{ currency }}
            </Typography.Text>
          </div>
          <Button 
            ghost 
            size="large" 
            class="border-white/40 text-white hover:border-white/60 mt-6 md:mt-0"
            @click="hideBalance = !hideBalance"
          >
            <component :is="hideBalance ? EyeOutlined : EyeInvisibleOutlined" class="mr-1" />
            {{ hideBalance ? 'Show' : 'Hide' }}
          </Button>
        </div>
      </div>
    </Card>

    <!-- Transactions Table -->
    <Card class="!shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <div>
          <Typography.Title level={3} class="!m-0 mb-1">Transaction History</Typography.Title>
          <Typography.Text type="secondary">{{ pagination.total }} total transactions</Typography.Text>
        </div>
        <Button type="primary" @click="refreshAll" :loading="loading" icon="ReloadOutlined" size="large">
          Refresh All
        </Button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 items-end mb-6">
        <Input.Search
          v-model:value="searchText"
          placeholder="🔍 Search by description..."
          size="large"
          style="flex: 1; min-width: 300px"
          @search="fetchTransactions"
        />
        <Dropdown trigger="click" placement="bottomRight">
          <Button size="large" icon="FilterOutlined">
            Filters ▼
          </Button>
          <template #overlay>
            <div class="p-4 w-72 space-y-3 bg-white shadow-xl rounded-xl border">
              <Select
                v-model:value="monthFilter"
                placeholder="All Months"
                allow-clear
                size="middle"
                class="w-full"
              >
                <Select.Option v-for="m in 12" :key="m" :value="m">
                  {{ dayjs().month(m - 1).format('MMMM') }}
                </Select.Option>
              </Select>
              <Select
                v-model:value="yearFilter"
                placeholder="All Years"
                allow-clear
                size="middle"
                class="w-full"
              >
                <Select.Option v-for="y in 6" :key="2025 - y" :value="String(2025 - y)">
                  {{ 2025 - y }}
                </Select.Option>
              </Select>
              <div class="flex gap-2 pt-2">
                <Button block size="middle" @click="resetFilters">Reset All</Button>
                <Button type="primary" block size="middle" @click="fetchTransactions">Apply</Button>
              </div>
            </div>
          </template>
        </Dropdown>
        <Button type="primary" ghost size="large" @click="exportPdf" icon="FilePdfOutlined">
          Export PDF
        </Button>
      </div>

      <!-- PERFECT PAGINATED TABLE -->
      <Table
        :columns="[
          { title: '#', key: 'index', width: 80, slots: { customRender: 'indexCell' } },
          { title: 'Type', dataIndex: 'type', key: 'type', width: 120, slots: { customRender: 'typeCell' } },
          { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
          { title: 'Balance Before', key: 'balanceBefore', width: 150, align: 'right', slots: { customRender: 'balanceBeforeCell' } },
          { title: 'Amount', key: 'amount', width: 150, align: 'right', slots: { customRender: 'amountCell' } },
          { title: 'Balance After', key: 'balanceAfter', width: 150, align: 'right', slots: { customRender: 'balanceAfterCell' } },
          { title: 'Date', dataIndex: 'created_at', key: 'created_at', width: 180, slots: { customRender: 'dateCell' } }
        ]"
        :data-source="transactions"
        :loading="loading"
        row-key="id"
        :scroll="{ x: 1300 }"
        :pagination="pagination"
        @change="handleTableChange"
        :row-class-name="getRowClassName"
      >
        <template #indexCell="{ index }">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>
        
        <template #typeCell="{ record }">
          <Tag v-if="record?.type" :color="record.type === 'credit' ? 'green' : 'red'" class="!font-bold !px-3">
            {{ record.type.toUpperCase() }}
          </Tag>
          <span v-else class="text-gray-500 text-sm">-</span>
        </template>
        
        <template #balanceBeforeCell="{ record }">
          <div class="font-mono text-right text-sm">
            ₦{{ Number(record.balance_before || 0).toLocaleString() }}
          </div>
        </template>
        
        <template #amountCell="{ record }">
          <div class="font-mono text-right font-bold text-lg">
            <span :class="record?.type === 'credit' ? 'text-green-600' : 'text-red-600'">
              {{ record?.type === 'credit' ? '+' : '-' }}₦{{ Number(record.amount || 0).toLocaleString() }}
            </span>
          </div>
        </template>
        
        <template #balanceAfterCell="{ record }">
          <div class="font-mono text-right text-sm">
            ₦{{ Number(record.balance_after || 0).toLocaleString() }}
          </div>
        </template>
        
        <template #dateCell="{ record }">
          <span class="text-sm">
            {{ dayjs(record.created_at).format('DD MMM YY • hh:mm A') }}
          </span>
        </template>
      </Table>
    </Card>
  </div>
</template>

<style scoped>
.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

:deep(.credit-row) {
  @apply bg-green-50/80 border-l-4 border-green-400;
}
:deep(.credit-row:hover) {
  @apply bg-green-100 border-l-4 border-green-500;
}
:deep(.debit-row) {
  @apply bg-red-50/80 border-l-4 border-red-400;
}
:deep(.debit-row:hover) {
  @apply bg-red-100 border-l-4 border-red-500;
}
</style>
