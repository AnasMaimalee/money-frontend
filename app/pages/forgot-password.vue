<!-- pages/forgot-password.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { usePublicApi } from '~/composables/useApi'

definePageMeta({
  layout: 'default',
})

const api = usePublicApi()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await api('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })

    success.value =
      'If this email exists, a password reset link has been sent.'
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong'
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
      title="Forgot Password"
      style="width: 100%; max-width: 420px"
    >
      <p style="margin-bottom: 16px; color: #555">
        Enter your email and we’ll send you a reset link.
      </p>

      <a-form layout="vertical" @finish="submit">
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email address' },
          ]"
        >
          <a-input v-model:value="email" />
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
            Send Reset Link
          </a-button>
        </a-form-item>
      </a-form>

      <div style="text-align: center">
        <NuxtLink to="/login">Back to login</NuxtLink>
      </div>
    </a-card>
  </div>
</template>
