// composables/useProfileApi.ts
export const useProfileApi = () => {
  const { $api } = useNuxtApp()
  const loading = ref(false)
  const error = ref('')

  // Profile data
  const profile = reactive({
    name: '',
    email: '',
    bank_account: null as any | null
  })

  // Bank form
  const bankForm = reactive({
    bank_name: '',
    account_name: '',
    account_number: '',
    bank_code: ''
  })

  // Fetch profile from /profile API
  const fetchProfile = async () => {
    loading.value = true
    error.value = ''
    try {
      const res = await $api('/profile')
      Object.assign(profile, {
        name: res.data.name || '',
        email: res.data.email || '',
        bank_account: res.data.bank_account || null
      })

      // Auto-fill bank form
      if (profile.bank_account) {
        Object.assign(bankForm, {
          bank_name: profile.bank_account.bank_name || '',
          account_name: profile.bank_account.account_name || '',
          account_number: profile.bank_account.account_number || '',
          bank_code: profile.bank_account.bank_code || ''
        })
      }
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to load profile'
    } finally {
      loading.value = false
    }
  }

  // Save bank details
  const saveBank = async (formData: any) => {
    loading.value = true
    try {
      const method = profile.bank_account ? 'PUT' : 'POST'
      const res = await $api('/admin/payout/bank', {
        method,
        body: formData
      })
      profile.bank_account = res.data
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.data?.message || 'Failed to save bank' }
    } finally {
      loading.value = false
    }
  }

  return {
    profile: readonly(profile),
    bankForm: readonly(bankForm),
    loading,
    error,
    fetchProfile,
    saveBank
  }
}
