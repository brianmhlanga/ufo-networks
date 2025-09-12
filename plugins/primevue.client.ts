import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined'
  })
  
  // Register components globally
  nuxtApp.vueApp.component('Chart', Chart)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('InputNumber', InputNumber)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Calendar', Calendar)
  nuxtApp.vueApp.component('Textarea', Textarea)
  nuxtApp.vueApp.component('FileUpload', FileUpload)
})
