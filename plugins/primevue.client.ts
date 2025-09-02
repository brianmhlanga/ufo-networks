import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Chart from 'primevue/chart'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined'
  })
  
  // Register Chart component globally
  nuxtApp.vueApp.component('Chart', Chart)
})
