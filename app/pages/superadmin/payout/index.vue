<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['superadmin']
})

import { ref, onMounted, watch } from 'vue'
import { Table, Button, Tag, Popconfirm, message, Typography, Input, Card } from 'ant-design-vue'
import { CheckOutlined, CloseOutlined, EyeOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons-vue'

const { $api } = useNuxtApp()

const payouts = ref<any[]>([])
const loading = ref(false)
const searchText = ref('')
const statusFilter = ref<string | null>(null)

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payout requests`
})

const fetchPayouts = async () => {
  loading.value = true
  try {
    const params = {
      search: searchText.value || undefined,
      status: statusFilter.value || undefined,
      page: pagination.value.current,
      per_page: pagination.value.pageSize
    }
    const res = await $api('/admin/payout/request', { params })
    payouts.value = res.data?.data || res.data || []
    pagination.value.current = res.data?.current_page || res.current_page || 1
    pagination.value.total = res.data?.total || res.total || 0
    pagination.value.pageSize = res.data?.per_page || res.per_page || 10
  } finally {
    loading.value = false
  }
}

const approvePayout = async (id: string) => {
  try {
    await $api(`/superadmin/payout/${id}/approve`, { method: 'POST' })
    message.success('Payout approved!')
    fetchPayouts()
  } catch (err) {
    message.error('Failed to approve payout')
  }
}

const rejectPayout = async (id: string) => {
  try {
    await $api(`/superadmin/payout/${id}/reject`, { method: 'POST' })
    message.success('Payout rejected!')
    fetchPayouts()
  } catch (err) {
    message.error('Failed to reject payout')
  }
}

const handleTableChange = (paginationConfig) => {
  Object.assign(pagination.value, paginationConfig)
  fetchPayouts()
}

const resetFilters = () => {
  searchText.value = ''
  statusFilter.value = null
  pagination.value.current = 1
  fetchPayouts()
}

// Watch filters
watch([searchText, statusFilter], () => {
  pagination.value.current = 1
  fetchPayouts()
})

onMounted(fetchPayouts)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <Typography.Title level={2} class="!m-0">
        Payout Requests
        <Typography.Text type="secondary" class="ml-2 block md:inline">
          ({{ pagination.total }} total)
        </Typography.Text>
      </Typography.Title>
      <Button type="primary" @click="fetchPayouts" :loading="loading" icon="ReloadOutlined" size="large">
        Refresh
      </Button>
    </div>

    <!-- Filters -->
    <Card class="!shadow-lg">
      <div class="flex flex-wrap gap-4 items-end mb-6 p-6">
        <Input.Search
          v-model:value="searchText"
          placeholder="🔍 Search by admin, bank, account..."
          size="large"
          style="flex: 1; min-width: 300px"
          @search="fetchPayouts"
        />
      </div>

      <!-- PERFECT Payout Requests Table -->
      <Table
        :columns="[
          { title: '#', key: 'index', width: 80, slots: { customRender: 'indexCell' } },
          { title: 'Admin', dataIndex: 'admin_name', key: 'admin_name', width: 220, ellipsis: true },
          { title: 'Amount', key: 'amount', width: 160, align: 'right', slots: { customRender: 'amountCell' } },
          { title: 'Bank', dataIndex: 'bank_name', key: 'bank_name', width: 150 },
          { title: 'Account', dataIndex: 'account_number', key: 'account_number', width: 140 },
          { title: 'Status', dataIndex: 'status', key: 'status', width: 130, slots: { customRender: 'statusCell' } },
          { title: 'Requested', dataIndex: 'created_at', key: 'created_at', width: 170, slots: { customRender: 'dateCell' } },
          { title: 'Actions', key: 'actions', width: 220, slots: { customRender: 'actionsCell' } }
        ]"
        :data-source="payouts"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 1300 }"
      >
        <template #indexCell="{ index }">
          <div class="font-semibold text-gray-800">
            {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
          </div>
        </template>
        
        <template #amountCell="{ record }">
          <div class="font-bold text-xl">
            <span class="text-green-600">₦{{ Number(record.amount || 0).toLocaleString() }}</span>
          </div>
        </template>
        
        <template #statusCell="{ record }">
          <Tag 
            :color="record.status === 'pending' ? 'orange' : record.status === 'approved' ? 'green' : 'red'"
            class="!font-bold !px-3 !py-1 shadow-sm"
          >
            {{ record.status?.toUpperCase() || 'N/A' }}
          </Tag>
        </template>
        
        <template #dateCell="{ record }">
          <div class="font-mono text-sm">
            {{ new Date(record.created_at).toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) }}
          </div>
        </template>
        
        <template #actionsCell="{ record }">
          <div class="flex gap-2" v-if="record.status === 'pending'">
            <Popconfirm 
              title="Approve this payout request?" 
              ok-text="Approve" 
              ok-type="primary" 
              cancel-text="Cancel"
              @confirm="approvePayout(record.id)"
            >
              <Button type="primary" size="small" icon="CheckOutlined">
                Approve
              </Button>
            </Popconfirm>
            <Popconfirm 
              title="Reject this payout request?" 
              ok-text="Reject" 
              ok-type="danger" 
              cancel-text="Cancel"
              @confirm="rejectPayout(record.id)"
            >
              <Button danger size="small" icon="CloseOutlined">
                Reject
              </Button>
            </Popconfirm>
          </div>
          <Tag v-else-if="record.status === 'approved'" color="green" class="!font-bold">
            ✅ Approved
          </Tag>
          <Tag v-else-if="record.status === 'rejected'" color="red" class="!font-bold">
            ❌ Rejected
          </Tag>
          <span v-else class="text-gray-500 text-sm font-medium">Completed</span>
        </template>
      </Table>
    </Card>
  </div>
</template>

<style scoped>
.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
