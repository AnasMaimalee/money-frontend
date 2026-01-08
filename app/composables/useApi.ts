// composables/useApi.ts

import type { FetchOptions } from 'ofetch'
import { useAuthStore } from '~/stores/auth'

interface ApiOptions extends FetchOptions {
  requiresAdmin?: boolean
  requiresSuperAdmin?: boolean
}

/**
 * Core authenticated API instance
 * Handles token injection and global error handling
 */
const createApi = (options: ApiOptions = {}) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // Role validation
  if (options.requiresSuperAdmin && !authStore.isSuperAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Superadmin access required'
    })
  }

  if (options.requiresAdmin && !authStore.isAdmin && !authStore.isSuperAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Administrator access required'
    })
  }

  return $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authStore.token && { Authorization: `Bearer ${authStore.token}` }),
    },

    // Global request interceptor
    onRequest({ options: fetchOptions }) {
      // Ensure latest token is always used
      if (authStore.token) {
        fetchOptions.headers = {
          ...fetchOptions.headers as Record<string, string>,
          Authorization: `Bearer ${authStore.token}`
        }
      }
    },

    // Global response error handler
    onResponseError({ response }) {
      switch (response.status) {
        case 401:
          // Unauthorized → force logout and redirect
          authStore.logout()
          navigateTo('/login', { replace: true })
          break

        case 403:
          // Forbidden → show toast or redirect
          if (process.client) {
            // You can integrate with a toast library later
            console.warn('Access denied:', response._data?.message || 'Forbidden')
          }
          break

        case 422:
          // Validation errors — can be handled per-call
          break

        default:
          if (response.status >= 500) {
            console.error('Server error:', response.status, response._data)
          }
      }
    }
  })
}

/**
 * General API for all authenticated users
 * Use this for user-facing endpoints
 */
export const useApi = () => createApi()

/**
 * Admin-only API
 * Automatically blocks non-admin/superadmin users
 */
export const useAdminApi = () => createApi({ requiresAdmin: true })

/**
 * Superadmin-only API
 * Highest privilege level
 */
export const useSuperApi = () => createApi({ requiresSuperAdmin: true })

/**
 * Public API (no auth)
 * For guest endpoints like login, register, etc.
 */
export const usePublicApi = () => {
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}