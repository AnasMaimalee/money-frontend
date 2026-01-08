<!-- pages/reset-password.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePublicApi } from '~/composables/useApi'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const api = usePublicApi()

const form = reactive({
  email: route.query.email || '',
  token: route.query.token || '',
  password: '',
  password_confirmation: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

async function resetPassword() {
  loading.value = true
  error.value = ''
  success.value = ''

  if (form.password !== form.password_confirmation) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    await api('/auth/reset-password', {
      method: 'POST',
      body: form,
    })

    success.value = 'Password reset successful. You can now login.'
  } catch (err: any) {
    error.value = err?.data?.message || 'Reset failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    "
  >
    <a-card
      title="Reset Password"
      style="width: 100%; max-width: 420px"
    >
      <a-form layout="vertical" @finish="resetPassword">
        <a-form-item label="Email">
          <a-input v-model:value="form.email" disabled />
        </a-form-item>

        <a-form-item
          label="New Password"
          name="password"
          :rules="[{ required: true, message: 'Enter new password' }]"
        >
          <a-input-password v-model:value="form.password" />
        </a-form-item>

        <a-form-item
          label="Confirm Password"
          name="password_confirmation"
          :rules="[{ required: true, message: 'Confirm password' }]"
        >
          <a-input-password
            v-model:value="form.password_confirmation"
          />
        </a-form-item>

        <a-alert
          v-if="error"
          type="error"
          :message="error"
          show-icon
          style="margin-bottom: 12px"
        />

        <a-alert
          v-if="success"
          type="success"
          :message="success"
          show-icon
          style="margin-bottom: 12px"
        />

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :loading="loading"
          >
            Reset Password
          </a-button>
        </a-form-item>
      </a-form>

      <div style="text-align: center">
        <NuxtLink to="/login">Go to login</NuxtLink>
      </div>
    </a-card>
  </div>
</template>
