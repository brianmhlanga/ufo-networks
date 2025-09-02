
<template>
  <NuxtLayout name="admin">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payments Management</h1>
          <p class="text-gray-600">Manage payment transactions and track financial data</p>
        </div>
        <Button 
          @click="openCreateDialog" 
          icon="add" 
          label="Create Payment" 
          class="bg-[#185ff9] hover:bg-[#185ff9]/90"
        />
      </div>
  
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Payments</p>
                <p class="text-2xl font-bold">{{ stats.totalPayments || 0 }}</p>
              </div>
              <span class="material-icons text-3xl text-blue-200">payment</span>
            </div>
          </template>
        </Card>
  
        <Card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Total Amount</p>
                <p class="text-2xl font-bold">${{ (stats.totalAmount || 0).toFixed(2) }}</p>
              </div>
              <span class="material-icons text-3xl text-green-200">attach_money</span>
            </div>
          </template>
        </Card>
  
        <Card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Success Rate</p>
                <p class="text-2xl font-bold">{{ stats.successRate || 0 }}%</p>
              </div>
              <span class="material-icons text-3xl text-purple-200">trending_up</span>
            </div>
          </template>
        </Card>
  
        <Card class="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100 text-sm font-medium">Failed Payments</p>
                <p class="text-2xl font-bold">{{ stats.failedPayments || 0 }}</p>
              </div>
              <span class="material-icons text-3xl text-red-200">error</span>
            </div>
          </template>
        </Card>
      </div>
  
      <!-- Filters -->
      <Card>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <InputText 
                v-model="filters.search" 
                placeholder="Search payments..." 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select 
                v-model="filters.status" 
                :options="statusOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All Statuses" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <Select 
                v-model="filters.provider" 
                :options="providerOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All Providers" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <DatePicker 
                v-model="filters.dateFrom" 
                placeholder="Start Date" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <DatePicker 
                v-model="filters.dateTo" 
                placeholder="End Date" 
                class="w-full"
              />
            </div>
          </div>
          
          <div class="flex justify-end mt-4">
            <Button 
              @click="clearFilters" 
              icon="clear" 
              label="Clear Filters" 
              text 
              severity="secondary"
            />
          </div>
        </template>
      </Card>
  
      <!-- Payments Table -->
      <Card>
        <template #content>
          <DataTable 
            :value="payments" 
            :loading="loading"
            paginator 
            :rows="pagination.limit"
            :totalRecords="pagination.total"
            :rowsPerPageOptions="[10, 20, 50]"
            @page="onPageChange"
            class="w-full"
          >
            <Column field="id" header="Payment ID" sortable style="width: 200px">
              <template #body="{ data }">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ data.id }}</code>
              </template>
            </Column>
            
            <Column field="order.buyerName" header="Customer" sortable style="width: 200px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium">{{ data.order?.buyerName || data.order?.user?.name || 'Anonymous' }}</div>
                  <div class="text-sm text-gray-500">{{ data.order?.buyerEmail || data.order?.user?.email || 'No email' }}</div>
                  <div class="text-sm text-gray-500">{{ data.order?.buyerPhone || data.order?.user?.phone || 'No phone' }}</div>
                </div>
              </template>
            </Column>
            
            <Column field="amount" header="Amount" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="font-medium">${{ parseFloat(data.amount).toFixed(2) }}</span>
              </template>
            </Column>
            
            <Column field="provider" header="Provider" sortable style="width: 100px">
              <template #body="{ data }">
                <Tag :value="data.provider" severity="info" />
              </template>
            </Column>
            
            <Column field="status" header="Status" sortable style="width: 120px">
              <template #body="{ data }">
                <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
              </template>
            </Column>
            
            <Column field="paynowReference" header="Reference" style="width: 150px">
              <template #body="{ data }">
                <div class="text-sm">
                  <div v-if="data.paynowReference" class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {{ data.paynowReference }}
                  </div>
                  <div v-else class="text-gray-400">No reference</div>
                </div>
              </template>
            </Column>
            
            <Column field="createdAt" header="Created" sortable style="width: 150px">
              <template #body="{ data }">
                <div class="text-sm">
                  {{ formatDate(data.createdAt) }}
                </div>
              </template>
            </Column>
            
            <Column header="Actions" style="width: 120px">
              <template #body="{ data }">
                <div class="flex space-x-2">
                  <Button 
                    @click="viewPayment(data)" 
                    icon="visibility" 
                    size="small" 
                    text 
                    severity="info"
                    v-tooltip.top="'View Details'"
                  />
                  <Button 
                    @click="editPayment(data)" 
                    icon="edit" 
                    size="small" 
                    text 
                    severity="warning"
                    v-tooltip.top="'Edit Payment'"
                  />
                  <Button 
                    @click="confirmDeletePayment(data)" 
                    icon="delete" 
                    size="small" 
                    text 
                    severity="danger"
                    v-tooltip.top="'Delete Payment'"
                    :disabled="!canDeletePayment(data.status)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
  
      <!-- Toast -->
      <Toast />
      
      <!-- Confirm Dialog -->
      <ConfirmDialog />
    </div>
  </NuxtLayout>
  </template>
  
  <script lang="ts" setup>
  import { useToast } from 'primevue/usetoast'
  import { useConfirm } from 'primevue/useconfirm'
  // Toast and Confirm
const toast = useToast()
const confirm = useConfirm()
  // Reactive data
  const loading = ref(false)
  const payments:any = ref([])
  const stats:any = ref({})
  const pagination:any = ref({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  
  // Filters
  const filters:any = ref({
    search: '',
    status: '',
    provider: '',
    dateFrom: null,
    dateTo: null
  })
  
  // Options
  const statusOptions:any = ref([
    { label: 'Pending', value: 'PENDING' },
    { label: 'Authorized', value: 'AUTHORIZED' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Failed', value: 'FAILED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Refunded', value: 'REFUNDED' }
  ])
  
  const providerOptions:any = ref([
    { label: 'Paynow', value: 'PAYNOW' }
  ])
  
  // Lifecycle
  onMounted(() => {
    fetchPayments()
    fetchPaymentStats()
  })
  
  // Methods
  const fetchPayments = async () => {
    try {
      loading.value = true
      const params = new URLSearchParams({
        page: pagination.value.page.toString(),
        limit: pagination.value.limit.toString()
      })
      
      if (filters.value.search) params.append('search', filters.value.search)
      if (filters.value.status) params.append('status', filters.value.status)
      if (filters.value.provider) params.append('provider', filters.value.provider)
      if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
      if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
      
      const response = await $fetch(`/api/admin/payments?${params}`)
      payments.value = response.payments
      pagination.value = response.pagination
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch payments',
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }
  
  const fetchPaymentStats = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
      if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
      
      const response = await $fetch(`/api/admin/payments/stats?${params}`)
      stats.value = response.stats
    } catch (error) {
      console.error('Error fetching payment stats:', error)
    }
  }
  
  const openCreateDialog = () => {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Create payment functionality coming soon',
      life: 3000
    })
  }
  
  const editPayment = (payment) => {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Edit payment functionality coming soon',
      life: 3000
    })
  }
  
  const viewPayment = (payment) => {
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'View payment functionality coming soon',
      life: 3000
    })
  }
  
  const confirmDeletePayment = (payment) => {
  confirm.require({
    message: `Are you sure you want to delete payment ${payment.id}?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deletePayment(payment.id)
  })
}
  
  const deletePayment = async (paymentId) => {
    try {
      await $fetch(`/api/admin/payments/${paymentId}`, {
        method: 'DELETE'
      })
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Payment deleted successfully',
        life: 3000
      })
      
      fetchPayments()
      fetchPaymentStats()
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete payment',
        life: 3000
      })
    }
  }
  
  const clearFilters = () => {
    filters.value = {
      search: '',
      status: '',
      provider: '',
      dateFrom: null,
      dateTo: null
    }
    pagination.value.page = 1
    fetchPayments()
    fetchPaymentStats()
  }
  
  const onPageChange = (event) => {
    pagination.value.page = event.page + 1
    pagination.value.limit = event.rows
    fetchPayments()
  }
  
  const canDeletePayment = (status) => {
    const deletableStatuses = ['PENDING', 'AUTHORIZED']
    return deletableStatuses.includes(status)
  }
  
  const getStatusSeverity = (status) => {
    const severityMap = {
      'PENDING': 'warning',
      'AUTHORIZED': 'info',
      'PAID': 'success',
      'FAILED': 'danger',
      'CANCELLED': 'danger',
      'REFUNDED': 'info'
    }
    return severityMap[status] || 'info'
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Watch filters for auto-refresh
  watch(filters, () => {
    pagination.value.page = 1
    fetchPayments()
    fetchPaymentStats()
  }, { deep: true })
     </script>

<style scoped>
/* Custom styling for payment cards */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

/* Gradient backgrounds for statistics cards */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Material icons styling */
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

/* Custom button styling */
.btn-primary {
  @apply bg-[#185ff9] hover:bg-[#185ff9]/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

/* Table styling */
.data-table {
  @apply w-full border-collapse;
}

.data-table th {
  @apply bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 border-b border-gray-200;
}

.data-table td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200;
}

/* Status tag styling */
.status-tag {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.status-pending {
  @apply bg-yellow-100 text-yellow-800;
}

.status-authorized {
  @apply bg-blue-100 text-blue-800;
}

.status-paid {
  @apply bg-green-100 text-green-800;
}

.status-failed {
  @apply bg-red-100 text-red-800;
}

.status-cancelled {
  @apply bg-red-100 text-red-800;
}

.status-refunded {
  @apply bg-gray-100 text-gray-800;
}

/* Form styling */
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#185ff9] focus:border-[#185ff9];
}

/* Dialog styling */
.dialog-header {
  @apply text-lg font-medium text-gray-900 mb-4;
}

.dialog-content {
  @apply space-y-4;
}

.dialog-footer {
  @apply flex justify-end space-x-2 pt-4 border-t border-gray-200;
}

/* Responsive grid */
.grid-responsive {
  @apply grid grid-cols-1 gap-4;
}

@media (min-width: 640px) {
  .grid-responsive {
    @apply grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    @apply grid-cols-4;
  }
}

/* Loading states */
.loading {
  @apply opacity-50 pointer-events-none;
}

.loading::after {
  content: '';
  @apply absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center;
}

/* Hover effects */
.hover-card {
  @apply transition-all duration-200 hover:shadow-md hover:-translate-y-1;
}

.hover-button {
  @apply transition-all duration-200 hover:scale-105;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

/* Animation classes */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Focus states */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-[#185ff9] focus:ring-opacity-50;
}

/* Disabled states */
.disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Success/Error states */
.success {
  @apply text-green-600 bg-green-50 border-green-200;
}

.error {
  @apply text-red-600 bg-red-50 border-red-200;
}

.warning {
  @apply text-yellow-600 bg-yellow-50 border-yellow-200;
}

.info {
  @apply text-blue-600 bg-blue-50 border-blue-200;
}
</style>