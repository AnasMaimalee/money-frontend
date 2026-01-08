<script setup lang="ts">
import { reactive } from 'vue'
import { Form, notification } from 'ant-design-vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

/* ---------------- FORM STATE ---------------- */
const modelRef = reactive({
  email: '',
  password: '',
})

const rulesRef = reactive({
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
  ],
})

const { validate, validateInfos } = Form.useForm(modelRef, rulesRef)

/* ---------------- LOGIN HANDLER ---------------- */
const handleLogin = async () => {
  try {
    await validate()

    auth.loading = true
    await auth.login(modelRef)

    notification.success({
      message: 'Login Successful',
      description: `Welcome back, ${auth.user?.name}`,
      placement: 'topRight',
    })

    // ✅ CORRECT ROLE SOURCE
    const role = auth.user?.roles?.[0]?.name

    if (role === 'superadmin') {
      router.push('/dashboard/superadmin')
    } else if (role === 'administrator' || role === 'admin') {
      router.push('/dashboard/administrator')
    } else {
      router.push('/dashboard/user')
    }
  } catch (err: any) {
    if (err?.errorFields) return

    notification.error({
      message: 'Login Failed',
      description:
        err?.response?.data?.message ||
        err?.message ||
        'Invalid email or password',
      placement: 'topRight',
    })
  } finally {
    auth.loading = false
  }
}

</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
  >
    <a-card
      title="Login to JAMB Portal"
      class="w-full max-w-md shadow-xl"
    >
      <a-form
        layout="vertical"
        :model="modelRef"
        :rules="rulesRef"
      >
        <a-form-item label="Email" v-bind="validateInfos.email">
          <a-input
            v-model:value="modelRef.email"
            type="email"
            placeholder="Enter your email"
            size="large"
          />
        </a-form-item>

        <a-form-item label="Password" v-bind="validateInfos.password">
          <a-input-password
            v-model:value="modelRef.password"
            placeholder="Enter your password"
            size="large"
          />
        </a-form-item>

        <a-form-item class="mt-6">
          <a-button
            type="primary"
            size="large"
            block
            :loading="auth.loading"
            @click="handleLogin"
          >
            Login
          </a-button>
        </a-form-item>
      </a-form>

      <div class="text-center mt-6 space-y-2">
        <NuxtLink to="/forgot-password" class="block">
          Forgot Password?
        </NuxtLink>
        <div>
          Don't have an account?
          <NuxtLink to="/register">Register</NuxtLink>
        </div>
      </div>
    </a-card>
  </div>
</template>
