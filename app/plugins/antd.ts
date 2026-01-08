import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '~/assets/css/antdv-theme.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Antd)
})
