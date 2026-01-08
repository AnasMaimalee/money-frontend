// plugins/pinia-persist.client.ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(() => {
  const pinia = usePinia()
  pinia.use(piniaPluginPersistedstate)
})