<template>
  <NuxtLayout name="admin">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Agent Sales Management</h1>
          <p class="text-gray-600">Track and manage agent voucher sales and performance</p>
        </div>
        <Button 
          @click="openCreateDialog" 
          icon="add" 
          label="Create Sale" 
          class="bg-[#185ff9] hover:bg-[#185ff9]/90"
        />
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Sales</p>
                <p class="text-2xl font-bold">{{ stats.totalSales || 0 }}</p>
              </div>
              <span class="material-icons text-3xl text-blue-200">point_of_sale</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Total Revenue</p>
                <p class="text-2xl font-bold">${{ Number(stats.totalRevenue || 0).toFixed(2) }}</p>
              </div>
              <span class="material-icons text-3xl text-green-200">attach_money</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Average Sale</p>
                <p class="text-2xl font-bold">${{ Number(stats.averageSaleValue || 0).toFixed(2) }}</p>
              </div>
              <span class="material-icons text-3xl text-purple-200">trending_up</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm font-medium">Active Agents</p>
                <p class="text-2xl font-bold">{{ (stats.topAgents || []).length }}</p>
              </div>
              <span class="material-icons text-3xl text-orange-200">people</span>
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
                placeholder="Search sales..." 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Agent</label>
              <Select 
                v-model="filters.agentId" 
                :options="agentOptions" 
                optionLabel="label" 
                optionValue="id"
                placeholder="All Agents" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Select 
                v-model="filters.locationId" 
                :options="locationOptions" 
                optionLabel="label" 
                optionValue="id"
                placeholder="All Locations" 
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

      <!-- Agent Sales Table -->
      <Card>
        <template #content>
          <DataTable 
            :value="agentSales" 
            :loading="loading"
            paginator 
            :rows="pagination.limit"
            :totalRecords="pagination.total"
            :rowsPerPageOptions="[10, 20, 50]"
            @page="onPageChange"
            class="w-full"
          >
            <Column field="id" header="Sale ID" sortable style="width: 150px">
              <template #body="{ data }">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ data.id }}</code>
              </template>
            </Column>
            
            <Column field="agent.displayName" header="Agent" sortable style="width: 200px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium">{{ data.agent?.displayName || data.agent?.user?.name || 'Unknown' }}</div>
                  <div class="text-sm text-gray-500">{{ data.agent?.user?.email || 'No email' }}</div>
                  <div class="text-sm text-gray-500">{{ data.agent?.user?.phone || 'No phone' }}</div>
                </div>
              </template>
            </Column>
            
            <Column field="voucher.voucherNumber" header="Voucher" sortable style="width: 150px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium">{{ data.voucher?.voucherNumber }}</div>
                  <div class="text-sm text-gray-500">PIN: {{ data.voucher?.pin }}</div>
                </div>
              </template>
            </Column>
            
            <Column field="soldPrice" header="Sold Price" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="font-medium">${{ parseFloat(data.soldPrice).toFixed(2) }}</span>
              </template>
            </Column>
            
            <Column field="agentPurchase.location.name" header="Location" style="width: 150px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium">{{ data.agentPurchase?.location?.name || 'No Location' }}</div>
                  <div class="text-sm text-gray-500">{{ data.agentPurchase?.batch?.name || 'No Batch' }}</div>
                </div>
              </template>
            </Column>
            
            <Column field="buyerPhone" header="Buyer" style="width: 120px">
              <template #body="{ data }">
                <div class="text-sm">
                  <div v-if="data.buyerPhone" class="font-medium">{{ data.buyerPhone }}</div>
                  <div v-else class="text-gray-400">No phone</div>
                </div>
              </template>
            </Column>
            
            <Column field="createdAt" header="Sold Date" sortable style="width: 150px">
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
                    @click="viewSale(data)" 
                    icon="visibility" 
                    size="small" 
                    text 
                    severity="info"
                    v-tooltip.top="'View Details'"
                  />
                  <Button 
                    @click="editSale(data)" 
                    icon="edit" 
                    size="small" 
                    text 
                    severity="warning"
                    v-tooltip.top="'Edit Sale'"
                  />
                  <Button 
                    @click="confirmDeleteSale(data)" 
                    icon="delete" 
                    size="small" 
                    text 
                    severity="danger"
                    v-tooltip.top="'Delete Sale'"
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
const $confirm = useConfirm()

// Reactive data
const loading = ref(false)
const agentSales = ref([])
const stats:any = ref({})
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

// Filters
const filters:any = ref({
  search: '',
  agentId: '',
  locationId: '',
  dateFrom: null,
  dateTo: null
})

// Options
const agentOptions = ref([])
const locationOptions = ref([])

// Lifecycle
onMounted(() => {
  fetchAgentSales()
  fetchAgentSaleStats()
  fetchAgents()
  fetchLocations()
})

// Methods
const fetchAgentSales = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.agentId) params.append('agentId', filters.value.agentId)
    if (filters.value.locationId) params.append('locationId', filters.value.locationId)
    if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
    if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
    
    const response:any = await $fetch(`/api/admin/agent-sales?${params}`)
    agentSales.value = response.agentSales
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error fetching agent sales:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch agent sales',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const fetchAgentSaleStats = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
    if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
    
    const response = await $fetch(`/api/admin/agent-sales/stats?${params}`)
    stats.value = response.stats
  } catch (error) {
    console.error('Error fetching agent sale stats:', error)
  }
}

const fetchAgents = async () => {
  try {
    const response:any = await $fetch('/api/admin/agents')
    agentOptions.value = response.agents.map((agent:any) => ({
      id: agent.id,
      label: `${agent.displayName || agent.user?.name || 'Unknown'} (${agent.user?.email || 'No email'})`
    }))
  } catch (error) {
    console.error('Error fetching agents:', error)
  }
}

const fetchLocations = async () => {
  try {
    const response:any = await $fetch('/api/admin/locations')
    locationOptions.value = response.locations.map((location:any) => ({
      id: location.id,
      label: `${location.name} (${location.code})`
    }))
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}

const openCreateDialog = () => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Create sale functionality coming soon',
    life: 3000
  })
}

const editSale = (sale:any) => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Edit sale functionality coming soon',
    life: 3000
  })
}

const viewSale = (sale:any) => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'View sale functionality coming soon',
    life: 3000
  })
}

const confirmDeleteSale = (sale:any) => {
  $confirm.require({
    message: `Are you sure you want to delete sale ${sale.id}?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteSale(sale.id)
  })
}

const deleteSale = async (saleId:any) => {
  try {
    await $fetch(`/api/admin/agent-sales/${saleId}`, {
      method: 'DELETE'
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Sale deleted successfully',
      life: 3000
    })
    
    fetchAgentSales()
    fetchAgentSaleStats()
  } catch (error) {
    console.error('Error deleting sale:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete sale',
      life: 3000
    })
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    agentId: '',
    locationId: '',
    dateFrom: null,
    dateTo: null
  }
  pagination.value.page = 1
  fetchAgentSales()
  fetchAgentSaleStats()
}

const onPageChange = (event:any) => {
  pagination.value.page = event.page + 1
  pagination.value.limit = event.rows
  fetchAgentSales()
}

const formatDate = (date:any) => {
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
  fetchAgentSales()
  fetchAgentSaleStats()
}, { deep: true })
</script>

<style scoped>
/* Custom styling for agent sales cards */
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
