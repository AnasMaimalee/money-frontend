<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['superadmin'],
})

import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  FilePdfOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'

const { $api } = useNuxtApp()

/* ================= STATE ================= */
const loading = ref(false)
const hideBalance = ref(true)

const walletBalance = ref(0)
const currency = ref('NGN')

/* RAW DATA */
const allTransactions = ref<any[]>([])

/* FILTER STATE */
const search = ref('')
const month = ref<number | null>(null)
const year = ref<string | null>(null)

/* ================= COMPUTED ================= */
const balanceText = computed(() =>
  hideBalance.value ? '••••••' : `₦${walletBalance.value.toLocaleString()}`
)

const transactions = computed(() => {
  return allTransactions.value.filter((tx) => {
    const text = search.value.toLowerCase()

    const matchesSearch =
      !text || tx.description?.toLowerCase().includes(text)

    const matchesMonth =
      !month.value ||
      dayjs(tx.created_at).month() + 1 === month.value

    const matchesYear =
      !year.value ||
      dayjs(tx.created_at).format('YYYY') === year.value

    return matchesSearch && matchesMonth && matchesYear
  })
})

/* ================= API ================= */
const fetchWallet = async () => {
  const res = await $api('/wallet/me')
  walletBalance.value = Number(res.balance)
  currency.value = res.currency || 'NGN'
}

const fetchTransactions = async () => {
  loading.value = true
  try {
    const res = await $api('/wallet/transactions')
    allTransactions.value = res.transactions.data
  } finally {
    loading.value = false
  }
}

/* ================= ACTIONS ================= */
const resetFilters = () => {
  search.value = ''
  month.value = null
  year.value = null
}

const exportPdf = async () => {
  const blob = await $api('/wallet/history/pdf', {
    responseType: 'blob',
  })
  window.open(URL.createObjectURL(blob))
}

/* ================= INIT ================= */
onMounted(async () => {
  await fetchWallet()
  await fetchTransactions()
})

// ================= ACTION: REFRESH =================
const walletLoading = ref(false)   // for wallet card

const refreshAll = async () => {
  walletLoading.value = true
  loading.value = true
  try {
    await fetchWallet()
    await fetchTransactions()
  } finally {
    walletLoading.value = false
    loading.value = false
  }
}


</script>

<template>
  <div class="space-y-8">
    <!-- ================= WALLET CARD ================= -->
   <div
    class="relative overflow-hidden rounded-3xl p-8 shadow-lg"
    style="background: linear-gradient(135deg, #1a2f4c, #2f4f6f);" 
    >
    <!-- soft overlay -->
    <div class="absolute inset-0 bg-white/5"></div>

    <!-- spinner -->
    <a-spin :spinning="walletLoading" class="w-full">
        <div class="relative z-10 flex flex-col md:flex-row md:justify-between text-white">
        <div>
            <p class="text-sm uppercase tracking-wide text-gray-300">
            Wallet Balance
            </p>
            <h1 class="text-5xl font-extrabold mt-3">
            {{ balanceText }}
            </h1>
            <p class="text-sm mt-2 text-gray-300">
            Available funds
            </p>
        </div>

        <div class="flex gap-3 mt-6 md:mt-0">
            <a-button
            ghost
            size="large"
            class="border-white/40 text-white"
            @click="hideBalance = !hideBalance"
            >
            <component :is="hideBalance ? EyeOutlined : EyeInvisibleOutlined" />
            {{ hideBalance ? 'Show' : 'Hide' }}
            </a-button>
        </div>
        </div>
    </a-spin>
    </div>




    <!-- ================= TABLE ================= -->
    <a-card class="border-0 shadow">
      <a-table
        :data-source="transactions"
        :loading="loading"
        row-key="id"
        bordered
      >
      <!-- ================= TABLE HEADER CONTROLS ================= -->
        <template #title>
        <div class="flex items-center justify-between gap-3">
            <!-- SEARCH -->
            <a-input
            v-model:value="search"
            placeholder="Search transactions"
            allow-clear
            class="max-w-xs"
            >
            <template #prefix>
                <SearchOutlined />
            </template>
            </a-input>

            <!-- FILTER + PDF + REFRESH -->
            <div class="flex gap-2">
            <!-- FILTER -->
            <a-dropdown
                :trigger="['click']"
                :destroyPopupOnHide="false"
                :getPopupContainer="trigger => trigger.parentElement"
            >
                <a-button>
                <FilterOutlined />
                Filter
                </a-button>

                <template #overlay>
                <a-card
                    class="w-64 shadow-lg"
                    @click.stop
                >
                    <!-- MONTH -->
                    <a-select
                    v-model:value="month"
                    placeholder="Month"
                    allow-clear
                    class="w-full mb-3"
                    >
                    <a-select-option v-for="m in 12" :key="m" :value="m">
                        {{ dayjs().month(m - 1).format('MMMM') }}
                    </a-select-option>
                    </a-select>

                    <!-- YEAR -->
                    <a-select
                    v-model:value="year"
                    placeholder="Year"
                    allow-clear
                    class="w-full mb-3"
                    >
                    <a-select-option v-for="y in 6" :key="2025 - y" :value="String(2025 - y)">
                        {{ 2025 - y }}
                    </a-select-option>
                    </a-select>

                    <a-button block @click="resetFilters">
                    <ReloadOutlined />
                    Reset
                    </a-button>
                </a-card>
                </template>
            </a-dropdown>

            <!-- EXPORT PDF -->
            <a-button type="primary" @click="exportPdf">
                <FilePdfOutlined />
                Export PDF
            </a-button>

            <!-- REFRESH -->
            <a-button @click="refreshAll">
                <ReloadOutlined />
                Refresh
            </a-button>
            </div>
        </div>
        </template>


        <!-- S/N -->
        <a-table-column title="S/N" width="70" align="center">
          <template #default="{ index }">
            {{ index + 1 }}
          </template>
        </a-table-column>

        <!-- TYPE -->
        <a-table-column title="Type" width="120">
          <template #default="{ record }">
            <a-tag :color="record.type === 'credit' ? 'green' : 'red'">
              {{ record.type.toUpperCase() }}
            </a-tag>
          </template>
        </a-table-column>

        <!-- DESCRIPTION -->
        <a-table-column title="Description">
          <template #default="{ record }">
            {{ record.description }}
          </template>
        </a-table-column>

        <!-- BALANCE BEFORE -->
        <a-table-column title="Balance Before" align="right">
          <template #default="{ record }">
            ₦{{ Number(record.balance_before).toLocaleString() }}
          </template>
        </a-table-column>

        <!-- AMOUNT -->
        <a-table-column title="Amount" align="right">
          <template #default="{ record }">
            <span
              :class="record.type === 'credit'
                ? 'text-green-600 font-bold'
                : 'text-red-600 font-bold'"
            >
              {{ record.type === 'credit' ? '+' : '-' }}
              ₦{{ Number(record.amount).toLocaleString() }}
            </span>
          </template>
        </a-table-column>

         <!-- BALANCE AFTER -->
        <a-table-column title="Balance After" align="right">
          <template #default="{ record }">
            ₦{{ Number(record.balance_after).toLocaleString() }}
          </template>
        </a-table-column>

        <!-- DATE -->
        <a-table-column title="Date" width="180">
          <template #default="{ record }">
            {{ dayjs(record.created_at).format('DD MMM YYYY • hh:mm A') }}
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </div>
</template>
