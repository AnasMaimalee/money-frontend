<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  roles: ['superadmin']
})

import { ref, onMounted, watch, computed } from 'vue'
import { Table, Button, Tag, Popconfirm, message, Typography, Input, Card, Dropdown, Modal } from 'ant-design-vue'
import { CheckOutlined, CloseOutlined, EyeOutlined, ReloadOutlined, FilterOutlined, MoreOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

const { $api } = useNuxtApp()

const payouts = ref<any[]>([])
const loading = ref(false)
const searchText = ref('')
const statusFilter = ref<string | null>(null)

// ✨ REJECT MODAL
const rejectModalVisible = ref(false)
const currentRejectPayoutId = ref<string | null>(null)
const rejectReason = ref('')

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payout requests`
})

/* COMPUTED */
const filteredPayouts = computed(() => {
  return payouts.value.filter(payout => {
    const matchesSearch = !searchText.value || 
      payout.administrator?.name?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      payout.administrator?.email?.toLowerCase().includes(searchText.value.toLowerCase())
    const matchesStatus = !statusFilter.value || payout.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
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
    payouts.value = res.data.data || []
    pagination.value.current = res.data.current_page || 1
    pagination.value.total = res.data.total || 0
    pagination.value.pageSize = res.data.per_page || 10
  } finally {
    loading.value = false
  }
}

const approvePayout = async (id: string) => {
  try {
    await $api(`/superadmin/payout/${id}/approve`, { method: 'POST' })
    message.success('Payout approved successfully!')
    fetchPayouts()
  } catch (err) {
    message.error('Failed to approve payout')
  }
}

// ✨ REJECT WITH REASON
const openRejectModal = (id: string) => {
  currentRejectPayoutId.value = id
  rejectReason.value = ''
  rejectModalVisible.value = true
}

const handleReject = async () => {
  if (!currentRejectPayoutId.value || !rejectReason.value.trim()) {
    message.error('Please enter a reason for rejection')
    return
  }

  try {
    await $api(`/admin/payout/${currentRejectPayoutId.value}/reject`, {
      method: 'POST',
      body: { reason: rejectReason.value }
    })
    message.success('Payout rejected successfully!')
    rejectModalVisible.value = false
    currentRejectPayoutId.value = null
    rejectReason.value = ''
    fetchPayouts()
  } catch (err) {
    message.error('Failed to reject payout')
  }
}

const columns = [
  { title: '#', key: 'index', width: 80, slots: { customRender: 'indexCell' } },
  { title: 'Administrator', key: 'admin', width: 280, slots: { customRender: 'adminCell' } },
  { title: 'Amount', key: 'amount', width: 180, align: 'right', slots: { customRender: 'amountCell' } },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 140, slots: { customRender: 'statusCell' } },
  { title: 'Requested', dataIndex: 'created_at', key: 'created_at', width: 170, slots: { customRender: 'dateCell' } },
  { title: 'Actions', key: 'actions', width: 120, align: 'center', slots: { customRender: 'actionsCell' } }
]

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
      <div>
        <Typography.Title level={2} class="!m-0 mb-1">Payout Requests</Typography.Title>
        <Typography.Text type="secondary">{{ pagination.total }} total requests</Typography.Text>
      </div>
      <Button type="primary" @click="fetchPayouts" :loading="loading" icon="ReloadOutlined" size="large">
        Refresh
      </Button>
    </div>

    <!-- Filters -->
    <Card class="!shadow-lg">
      <div class="flex flex-wrap gap-4 items-end mb-6 p-6">
        <Input.Search
          v-model:value="searchText"
          placeholder="🔍 Search by admin name or email..."
          size="large"
          style="flex: 1; min-width: 300px"
        />
        <Dropdown trigger="click" placement="bottomRight">
          <Button size="large" icon="FilterOutlined">Status ▼</Button>
          <template #overlay>
            <div class="p-4 w-64 bg-white shadow-xl rounded-lg">
              <div class="space-y-2">
                <Button block size="middle" :type="statusFilter === 'pending' ? 'primary' : 'default'" @click="statusFilter = 'pending'">
                  🟡 Pending
                </Button>
                <Button block size="middle" :type="statusFilter === 'approved' ? 'primary' : 'default'" @click="statusFilter = 'approved'">
                  🟢 Approved
                </Button>
                <Button block size="middle" :type="statusFilter === 'rejected' ? 'primary' : 'default'" @click="statusFilter = 'rejected'">
                  🔴 Rejected
                </Button>
                <Button block size="middle" :type="statusFilter === null ? 'primary' : 'default'" @click="statusFilter = null">
                  All Statuses
                </Button>
              </div>
              <Button block type="dashed" @click="resetFilters" class="mt-3">Reset Filters</Button>
            </div>
          </template>
        </Dropdown>
      </div>

      <!-- Table -->
      <Table
        :columns="columns"
        :data-source="filteredPayouts"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 1400 }"
        class="payout-table"
      >
        <!-- Your existing templates unchanged -->
        <template #indexCell="{ index }">
          <div class="font-bold text-blue-600 bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-sm mx-auto shadow-sm">
            {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
          </div>
        </template>
        
        <template #adminCell="{ record }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {{ record.administrator?.name?.charAt(0) || 'A' }}
            </div>
            <div>
              <div class="font-semibold text-gray-800">{{ record.administrator?.name || 'N/A' }}</div>
              <div class="text-sm text-gray-500">{{ record.administrator?.email || 'No email' }}</div>
            </div>
          </div>
        </template>
        
        <template #amountCell="{ record }">
          <div class="text-right">
            <div class="font-black text-2xl text-green-600 mb-1">
              ₦{{ Number(record.amount).toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
              Balance: ₦{{ Number(record.balance_snapshot).toLocaleString() }}
            </div>
          </div>
        </template>
        
        <template #statusCell="{ record }">
          <Tag 
            :color="record.status === 'pending' ? 'orange' : record.status === 'approved' ? 'green' : 'red'"
            class="font-bold px-4 py-2 shadow-md text-sm !border-2"
          >
            {{ record.status?.toUpperCase() }}
          </Tag>
        </template>
        
        <template #dateCell="{ record }">
          <div class="font-mono text-sm">
            {{ new Date(record.created_at).toLocaleString('en-US', { 
              year: 'numeric', month: 'short', day: 'numeric', 
              hour: '2-digit', minute: '2-digit' 
            }) }}
          </div>
        </template>
        
        <!-- ✨ UPDATED ACTIONS WITH REJECT MODAL -->
        <template #actionsCell="{ record }">
          <div class="flex items-center justify-center">
            <Dropdown trigger="click" placement="bottomRight">
              <Button 
                type="text" 
                size="small" 
                class="p-2 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl w-12 h-12"
              >
                <MoreOutlined class="text-xl" />
              </Button>
              <template #overlay>
                <div class="p-3 min-w-[160px] shadow-2xl rounded-2xl border bg-white">
                  <div v-if="record.status === 'pending'" class="space-y-2">
                    <Popconfirm 
                      title="Approve this payout request?" 
                      ok-text="Approve" 
                      ok-type="primary" 
                      cancel-text="Cancel"
                      @confirm="approvePayout(record.id)"
                    >
                      <Button block type="primary" size="middle" class="!h-12 font-medium">
                        <CheckOutlined class="mr-2" />Approve Payout
                      </Button>
                    </Popconfirm>
                    
                    <!-- ✨ REJECT → OPEN MODAL -->
                    <Button 
                      block 
                      danger 
                      size="middle" 
                      class="!h-12 font-medium"
                      @click="openRejectModal(record.id)"
                    >
                      <CloseOutlined class="mr-2" />Reject Payout
                    </Button>
                  </div>
                  <div v-else-if="record.status === 'approved'" class="text-center py-4">
                    <CheckOutlined class="text-3xl text-green-500 mb-2 block" />
                    <div class="font-bold text-green-600">Approved</div>
                  </div>
                  <div v-else-if="record.status === 'rejected'" class="text-center py-4">
                    <CloseOutlined class="text-3xl text-red-500 mb-2 block" />
                    <div class="font-bold text-red-600">Rejected</div>
                  </div>
                </div>
              </template>
            </Dropdown>
          </div>
        </template>
      </Table>
    </Card>

    <!-- ✨ REJECT REASON MODAL -->
    <Modal 
      v-model:visible="rejectModalVisible" 
      title="Reject Payout Request" 
      ok-text="Reject Payout" 
      cancel-text="Cancel"
      @ok="handleReject"
      @cancel="rejectModalVisible = false"
      ok-button-props="{ disabled: !rejectReason.trim() }"
      class="reject-modal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rejection Reason <span class="text-red-500">*</span></label>
          <Input.TextArea 
            v-model:value="rejectReason"
            :rows="4"
            placeholder="Please enter the reason for rejecting this payout request..."
            class="!resize-none"
          />
          <p class="text-xs text-gray-500 mt-1">This reason will be shown to the administrator</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* ✅ NO YELLOW HEADER - Clean white gradient */
.payout-table :deep(.ant-table-thead th) {
  @apply bg-gradient-to-r from-gray-50 to-gray-100 font-bold border-b-2 border-gray-200;
}

/* ✅ STATUS-BASED ROW COLORS (exactly like transactions) */
.payout-table :deep(.ant-table-row) {
  @apply relative transition-all duration-200;
}

/* PENDING - Light orange */
.payout-table :deep(.ant-table-row:has(.status-cell[data-status="pending"])) {
  @apply bg-orange-50/50 hover:bg-orange-100 border-l-4 border-orange-300;
}

/* APPROVED - Light green */
.payout-table :deep(.ant-table-row:has(.status-cell[data-status="approved"])) {
  @apply bg-green-50/50 hover:bg-green-100 border-l-4 border-green-300;
}

/* REJECTED - Light red */
.payout-table :deep(.ant-table-row:has(.status-cell[data-status="rejected"])) {
  @apply bg-red-50/50 hover:bg-red-100 border-l-4 border-red-300;
}

.payout-table :deep(.ant-table-tbody td) {
  @apply py-5 border-b border-gray-100;
}

.reject-modal :deep(.ant-modal-body) {
  @apply p-6;
}

</style>
