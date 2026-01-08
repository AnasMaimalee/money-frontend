<!-- pages/register.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { usePublicApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default',
})

const api = usePublicApi()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  state: '',
  password: '',
  password_confirmation: '',
})

const loading = ref(false)
const error = ref('')

const states = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

async function register() {
  loading.value = true
  error.value = ''

  if (form.password !== form.password_confirmation) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    const { data } = await api('/auth/register', {
      method: 'POST',
      body: form,
    })

    authStore.setToken(data.token)
    authStore.setUser(data.user)
    navigateTo('/dashboard/user')
  } catch (err: any) {
    error.value = err?.data?.message || 'Registration failed'
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
      title="Register for JAMB Portal"
      style="width: 100%; max-width: 480px"
    >
      <a-form layout="vertical" @finish="register">
        <!-- Full Name -->
        <a-form-item
          label="Full Name"
          name="name"
          :rules="[{ required: true, message: 'Please enter your full name' }]"
        >
          <a-input v-model:value="form.name" />
        </a-form-item>

        <!-- Email -->
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email address' },
          ]"
        >
          <a-input v-model:value="form.email" />
        </a-form-item>

        <!-- Phone Number -->
        <a-form-item
          label="Phone Number"
          name="phone"
          :rules="[
            { required: true, message: 'Please enter your phone number' },
            { pattern: /^[0-9]{10,15}$/, message: 'Enter a valid phone number' },
          ]"
        >
          <a-input
            v-model:value="form.phone"
            placeholder="e.g. 08012345678"
          />
        </a-form-item>

        <!-- State -->
        <a-form-item
          label="State"
          name="state"
          :rules="[{ required: true, message: 'Please select your state' }]"
        >
          <a-select
            v-model:value="form.state"
            placeholder="Select your state"
            show-search
          >
            <a-select-option
              v-for="state in states"
              :key="state"
              :value="state"
            >
              {{ state }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Password -->
        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please enter your password' }]"
        >
          <a-input-password v-model:value="form.password" />
        </a-form-item>

        <!-- Confirm Password -->
        <a-form-item
          label="Confirm Password"
          name="password_confirmation"
          :rules="[
            { required: true, message: 'Please confirm your password' },
          ]"
        >
          <a-input-password
            v-model:value="form.password_confirmation"
          />
        </a-form-item>

        <!-- Error -->
        <a-alert
          v-if="error"
          type="error"
          :message="error"
          show-icon
          style="margin-bottom: 16px"
        />

        <!-- Submit -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            :loading="loading"
          >
            Register
          </a-button>
        </a-form-item>
      </a-form>

      <div style="text-align: center">
        Already have an account?
        <NuxtLink to="/login">Login</NuxtLink>
      </div>
    </a-card>
  </div>
</template>
