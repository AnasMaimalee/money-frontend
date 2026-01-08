export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()



  const allowedRoles = to.meta.roles as string[] | undefined

  if (!allowedRoles || allowedRoles.length === 0) {
    return
  }

  if (!allowedRoles.includes(authStore.user.role)) {
    return navigateTo('/unauthorized')
  }
})
