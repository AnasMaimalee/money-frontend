// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // On refresh/load, if we have token but no user → fetch it
  if (auth.token && !auth.user) {
    await auth.fetchUser()
  }

  // Protect dashboard routes
  if (to.meta.middleware === 'auth' || to.meta.auth === true) {
    if (!auth.isAuthenticated) {
      return navigateTo('/login')
    }
  }

  // Redirect logged-in users away from login page
  if (to.path === '/login' && auth.isAuthenticated) {
    return navigateTo('/dashboard')  // or '/'
  }
})