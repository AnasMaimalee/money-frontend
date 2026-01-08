<script setup lang="ts">
definePageMeta({ 
  layout: 'dashboard', 
  middleware: 'auth', 
  roles: ['superadmin'] 
})

import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Table, Card, Button, Input, Select, Modal, InputNumber, message, 
  Tag, Space, Typography, Dropdown, Textarea, Form, Row, Col
} from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, PlusOutlined, UserAddOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const { $api } = useNuxtApp()

/* ================= STATE ================= */
const users = ref([])
const loading = ref(false)
const searchText = ref('')
const roleFilter = ref(null)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
})

/* ================= MODAL STATE ================= */
const createModalVisible = ref(false)
const fundModalVisible = ref(false)
const debitModalVisible = ref(false)
const deleteModalVisible = ref(false)
const selectedUser = ref(null)
const amount = ref(null)
const reason = ref('')
const modalLoading = ref(false)

// NEW CREATE USER FORM
const createForm = ref({
  name: '',
  email: '',
  phone: '',
  state: '',
  role: 'user'
})

/* Nigerian States */
const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

/* ================= API ================= */
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      search: searchText.value || undefined,
      role: roleFilter.value || undefined,
      page: pagination.value.current,
      per_page: pagination.value.pageSize
    }
    const res = await $api('/users', { params })
    users.value = res.data.data || []
    pagination.value.current = res.data.current_page || 1
    pagination.value.total = res.data.total || 0
    pagination.value.pageSize = res.data.per_page || 10
  } catch (err) {
    message.error('Failed to fetch users')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (paginationConfig) => {
  Object.assign(pagination.value, paginationConfig)
  fetchUsers()
}

/* ================= CREATE USER ================= */
const openCreateModal = () => {
  createForm.value = { name: '', email: '', phone: '', state: '', role: 'user' }
  createModalVisible.value = true
}

const handleCreateUser = async () => {
  modalLoading.value = true
  try {
    await $api('/superadmin/users', {
      method: 'POST',
      body: createForm.value
    })
    message.success('✅ New user created successfully!')
    createModalVisible.value = false
    fetchUsers()
  } catch (err: any) {
    message.error(err.data?.message || 'Failed to create user')
  } finally {
    modalLoading.value = false
  }
}

/* ================= ACTION FUNCTIONS ================= */
const openFundModal = (user) => { 
  selectedUser.value = user
  amount.value = null
  reason.value = ''
  fundModalVisible.value = true 
}

const openDebitModal = (user) => { 
  selectedUser.value = user
  amount.value = null
  reason.value = ''
  debitModalVisible.value = true 
}

const confirmDeleteUser = (user) => {
  selectedUser.value = user
  deleteModalVisible.value = true
}

/* ================= FUND/DEBIT/DELETE HANDLERS ================= */
const handleFundUser = async () => {
  if (amount.value === null || amount.value <= 0) {
    message.error('Amount is required and must be greater than 0')
    return
  }
  modalLoading.value = true
  try {
    await $api(`/users/${selectedUser.value.id}/fund`, {
      method: 'POST',
      body: { amount: Number(amount.value), reason: reason.value || 'Admin fund' }
    })
    message.success(`✅ Funded ₦${Number(amount.value).toLocaleString()}`)
    fundModalVisible.value = false
    amount.value = null
    reason.value = ''
    fetchUsers()
  } catch (err: any) {
    message.error(err.data?.message || 'Failed to fund user')
  } finally {
    modalLoading.value = false
  }
}

const handleDebitUser = async () => {
  if (amount.value === null || amount.value <= 0) {
    message.error('Amount is required and must be greater than 0')
    return
  }
  modalLoading.value = true
  try {
    await $api(`/users/${selectedUser.value.id}/debit`, {
      method: 'POST',
      body: { amount: Number(amount.value), reason: reason.value || 'Admin debit' }
    })
    message.success(`✅ Debited ₦${Number(amount.value).toLocaleString()}`)
    debitModalVisible.value = false
    amount.value = null
    reason.value = ''
    fetchUsers()
  } catch (err: any) {
    message.error(err.data?.message || 'Failed to debit user')
  } finally {
    modalLoading.value = false
  }
}

const deleteUser = async () => {
  modalLoading.value = true
  try {
    await $api(`/users/${selectedUser.value.id}`, { method: 'DELETE' })
    message.success('✅ User deleted successfully')
    deleteModalVisible.value = false
    selectedUser.value = null
    fetchUsers()
  } catch (err: any) {
    message.error(err.response?.data?.message || 'Failed to delete user')
  } finally {
    modalLoading.value = false
  }
}

watch([searchText, roleFilter], () => {
  pagination.value.current = 1
  fetchUsers()
})

onMounted(() => fetchUsers())
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header - Store button LEFT, Refresh RIGHT -->
   <!-- ✅ BUTTONS AT THE END (RIGHT SIDE) -->
    <div class="flex justify-between items-center">
    <Typography.Title level={2} class="!m-0">Users Management</Typography.Title>
    <div class="flex items-center gap-4">
        <Button 
        type="primary" 
        size="large" 
        @click="openCreateModal"
        icon="PlusOutlined"
        >
        <UserAddOutlined /> Store User
        </Button>
        <Button @click="fetchUsers" icon="ReloadOutlined" size="large">
        Refresh
        </Button>
    </div>
    </div>


    <!-- Filters - NEXT TO Store button -->
    <Card>
      <div class="flex gap-4 items-end">
        <Input.Search
          v-model:value="searchText"
          placeholder="Search by name or email..."
          size="large"
          style="flex: 1"
          @search="fetchUsers"
        />
        <Select
          v-model:value="roleFilter"
          placeholder="Filter by role"
          allow-clear
          style="width: 180px"
          size="large"
        >
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
          <Select.Option value="superadmin">Super Admin</Select.Option>
        </Select>
      </div>
    </Card>

    <!-- Table -->
    <Card class="!shadow-lg">
      <Table
        :columns="[
          { title: '#', key: 'index', width: 80, slots: { customRender: 'indexCell' } },
          { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
          { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
          { title: 'Role', dataIndex: 'role', key: 'role', width: 120, slots: { customRender: 'roleCell' } },
          { title: 'Wallet', key: 'balance', width: 140, align: 'right', slots: { customRender: 'balanceCell' } },
          { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 140 },
          { title: 'State', dataIndex: 'state', key: 'state', width: 120 },
          { title: 'Created', dataIndex: 'created_at', key: 'created_at', width: 140, slots: { customRender: 'createdCell' } },
          { title: 'Actions', key: 'actions', width: 100, slots: { customRender: 'actionsCell' }, fixed: 'right' }
        ]"
        :data-source="users"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
        :scroll="{ x: 1400 }"
      >
        <!-- Table slots unchanged -->
        <template #indexCell="{ index }">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>
        <template #roleCell="{ record }">
          <Tag :color="record.role === 'superadmin' ? 'volcano' : record.role === 'admin' ? 'blue' : 'green'">
            {{ record.role.toUpperCase() }}
          </Tag>
        </template>
        <template #balanceCell="{ record }">
          <div class="font-mono text-right">
            <span class="text-green-600 font-bold">₦{{ Number(record.wallet?.balance || 0).toLocaleString() }}</span>
          </div>
        </template>
        <template #createdCell="{ record }">
          {{ new Date(record.created_at).toLocaleDateString() }}
        </template>
        <template #actionsCell="{ record }">
          <Dropdown trigger="click" placement="bottomRight">
            <Button type="link" size="small" class="p-0 w-8 h-8 flex items-center justify-center">...</Button>
            <template #overlay>
              <Space direction="vertical" style="width: 160px">
                <Button block type="primary" size="small" @click="router.push(`/superadmin/users/${record.id}`)">👁️ View</Button>
                <Button block type="success" size="small" @click="openFundModal(record)">💰 Fund</Button>
                <Button block type="warning" size="small" @click="openDebitModal(record)">💳 Debit</Button>
                <Button block danger size="small" @click="confirmDeleteUser(record)">🗑️ Delete</Button>
              </Space>
            </template>
          </Dropdown>
        </template>
      </Table>
    </Card>

    <!-- ✅ NEW CREATE USER MODAL (500px) -->
    <Modal v-model:visible="createModalVisible" title="Create New User" width="500" :footer="null" class="!max-w-[500px]">
      <div class="space-y-4 p-4">
        <div class="grid grid-cols-1 gap-3">
          <Input v-model:value="createForm.name" size="large" placeholder="Full Name" />
          <Input v-model:value="createForm.email" size="large" placeholder="Email Address" />
          <Input v-model:value="createForm.phone" size="large" placeholder="Phone Number" />
          <Select v-model:value="createForm.state" size="large" placeholder="Select State" class="w-full">
            <Select.Option v-for="state in nigerianStates" :key="state" :value="state">{{ state }}</Select.Option>
          </Select>
          <Select v-model:value="createForm.role" size="large" placeholder="User Role" class="w-full">
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </div>
        <div class="flex gap-3 pt-2">
          <Button size="large" @click="createModalVisible = false" class="flex-1">Cancel</Button>
          <Button 
            type="primary" 
            size="large" 
            :loading="modalLoading" 
            @click="handleCreateUser" 
            class="flex-1"
          >
            <UserAddOutlined /> Create User
          </Button>
        </div>
      </div>
    </Modal>
<!-- ADD THESE MISSING MODALS at the BOTTOM (before </template>) -->

<!-- ✅ FUND MODAL -->
<Modal v-model:visible="fundModalVisible" title="Fund Wallet" width="450" :footer="null" class="!max-w-[450px]">
  <div class="space-y-3 p-4">
    <div>
      <div class="text-sm font-medium truncate">{{ selectedUser?.name }}</div>
      <div class="text-xs text-gray-500 truncate">{{ selectedUser?.email }}</div>
    </div>
    <div class="text-right text-sm mb-3 p-2 bg-green-50 rounded-lg">
      <span class="text-green-700 font-bold text-lg">₦{{ Number(selectedUser?.wallet?.balance || 0).toLocaleString() }}</span>
      <div class="text-xs text-green-600">Current Balance</div>
    </div>
    <InputNumber 
      v-model:value="amount" 
      :min="1" 
      :precision="0" 
      size="middle" 
      class="w-full" 
      placeholder="Enter amount to fund"
    />
    <Input 
      v-model:value="reason" 
      size="middle" 
      class="w-full" 
      placeholder="Reason for funding (optional)"
    />
    <div class="flex gap-2 pt-2">
      <Button size="middle" @click="fundModalVisible = false" class="flex-1">Cancel</Button>
      <Button 
        type="primary" 
        size="middle" 
        :loading="modalLoading" 
        @click="handleFundUser" 
        class="flex-1"
      >
        💰 Fund ₦{{ amount ? Number(amount).toLocaleString() : '0' }}
      </Button>
    </div>
  </div>
</Modal>

<!-- ✅ DEBIT MODAL -->
<Modal v-model:visible="debitModalVisible" title="Debit Wallet" width="450" :footer="null" class="!max-w-[450px]">
  <div class="space-y-3 p-4">
    <div>
      <div class="text-sm font-medium truncate">{{ selectedUser?.name }}</div>
      <div class="text-xs text-gray-500 truncate">{{ selectedUser?.email }}</div>
    </div>
    <div class="text-right text-sm mb-3 p-2 bg-green-50 rounded-lg">
      <span class="text-green-700 font-bold text-lg">₦{{ Number(selectedUser?.wallet?.balance || 0).toLocaleString() }}</span>
      <div class="text-xs text-green-600">Current Balance</div>
    </div>
    <InputNumber 
      v-model:value="amount" 
      :min="1" 
      :precision="0" 
      :max="selectedUser?.wallet?.balance" 
      size="middle" 
      class="w-full" 
      placeholder="Enter amount to debit"
    />
    <Input 
      v-model:value="reason" 
      size="middle" 
      class="w-full" 
      placeholder="Reason for debit (optional)"
    />
    <div class="flex gap-2 pt-2">
      <Button size="middle" @click="debitModalVisible = false" class="flex-1">Cancel</Button>
      <Button 
        type="primary" 
        danger 
        size="middle" 
        :loading="modalLoading" 
        @click="handleDebitUser" 
        class="flex-1"
      >
        💳 Debit ₦{{ amount ? Number(amount).toLocaleString() : '0' }}
      </Button>
    </div>
  </div>
</Modal>

<!-- ✅ DELETE MODAL -->
<Modal v-model:visible="deleteModalVisible" title="Delete User?" width="450" :footer="null" class="!max-w-[450px]">
  <div class="space-y-4 p-4">
    <p class="text-sm leading-relaxed">
      Are you sure you want to delete <strong class="text-red-600">{{ selectedUser?.name }}</strong>?
    </p>
    <div class="p-3 bg-red-50 border border-red-200 rounded-lg space-y-1">
      <div class="text-sm font-medium">{{ selectedUser?.email }}</div>
      <div class="text-xs text-gray-600">Wallet: <span class="font-mono">₦{{ Number(selectedUser?.wallet?.balance || 0).toLocaleString() }}</span></div>
      <div class="text-xs text-gray-600">Phone: {{ selectedUser?.phone }}</div>
    </div>
    <div class="text-xs text-gray-500 text-center">
      This action cannot be undone
    </div>
    <div class="flex gap-2 pt-2">
      <Button size="middle" @click="deleteModalVisible = false" class="flex-1">Cancel</Button>
      <Button danger size="middle" :loading="modalLoading" @click="deleteUser" class="flex-1">
        🗑️ Delete User
      </Button>
    </div>
  </div>
</Modal>

    <!-- PERFECT-SIZED FUND/DEBIT/DELETE MODALS (keep your existing ones) -->
    <!-- ... your existing modals exactly as provided ... -->
  </div>
</template>

<style scoped>
.font-mono {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
