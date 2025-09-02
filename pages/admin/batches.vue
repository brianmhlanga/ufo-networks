<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[#2d3040]">Voucher Batches</h1>
          <p class="text-[#2d3040]/60 mt-1">Manage voucher batches, pricing, and availability</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            label="Generate Vouchers"
            icon="add_card"
            @click="openGenerateDialog"
            class="custom-primary-button"
          />
          <Button
            label="Add Batch"
            icon="add"
            @click="openCreateDialog"
            class="custom-primary-button"
          />
        </div>
      </div>

      <!-- Batch Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Batches -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Total Batches</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ batchStats.totalBatches }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-blue-600 text-xl">inventory</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Active Batches -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Active Batches</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ batchStats.activeBatches }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-green-600 text-xl">check_circle</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Total Vouchers -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Total Vouchers</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ batchStats.totalVouchers }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-purple-600 text-xl">receipt</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Available Vouchers -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Available Vouchers</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ batchStats.availableVouchers }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-orange-600 text-xl">local_offer</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Filters and Search -->
      <Card>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#2d3040] mb-2">Search</label>
              <InputText
                v-model="filters.search"
                placeholder="Search by name, location..."
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#2d3040] mb-2">Location</label>
              <Dropdown
                v-model="filters.locationId"
                :options="locationOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="All Locations"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#2d3040] mb-2">Status</label>
              <Dropdown
                v-model="filters.active"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="All Status"
                class="w-full"
              />
            </div>
            <div class="flex items-end">
              <Button
                label="Clear Filters"
                icon="clear"
                severity="secondary"
                @click="clearFilters"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Batches Table -->
      <Card>
        <template #content>
          <DataTable
            :value="batches"
            :loading="loading"
            :paginator="true"
            :rows="pageSize"
            :totalRecords="totalBatches"
            :lazy="true"
            :rowsPerPageOptions="[10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} batches"
            @page="onPageChange"
            dataKey="id"
            stripedRows
            showGridlines
            responsiveLayout="scroll"
            class="p-datatable-sm"
          >
            <Column field="name" header="Batch Name" sortable>
              <template #body="{ data }">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-lg flex items-center justify-center">
                    <span class="material-icons text-white text-sm">inventory</span>
                  </div>
                  <div>
                    <div class="font-medium text-[#2d3040]">{{ data.name }}</div>
                    <div class="text-sm text-[#2d3040]/60">{{ data.location?.name }}</div>
                  </div>
                </div>
              </template>
            </Column>
            
            <Column field="retailPrice" header="Price" sortable>
              <template #body="{ data }">
                <span class="text-[#2d3040] font-medium">${{ data.retailPrice }}</span>
              </template>
            </Column>
            
            <Column field="hours" header="Duration" sortable>
              <template #body="{ data }">
                <Tag
                  :value="`${data.hours}h`"
                  :severity="getDurationSeverity(data.hours)"
                />
              </template>
            </Column>
            
            <Column field="numberOfUsers" header="Users" sortable>
              <template #body="{ data }">
                <span class="text-[#2d3040]">{{ data.numberOfUsers }}</span>
              </template>
            </Column>
            
            <Column field="vouchers" header="Vouchers" sortable>
              <template #body="{ data }">
                <div class="text-center">
                  <div class="text-[#2d3040] font-medium">{{ data._count?.vouchers || 0 }}</div>
                  <div class="text-xs text-[#2d3040]/60">
                    {{ getAvailableVouchers(data) }} available
                  </div>
                </div>
              </template>
            </Column>
            
            <Column field="startDate" header="Start Date" sortable>
              <template #body="{ data }">
                <span class="text-[#2d3040]">{{ formatDate(data.startDate) }}</span>
              </template>
            </Column>
            
            <Column field="endDate" header="End Date" sortable>
              <template #body="{ data }">
                <span class="text-[#2d3040]">{{ formatDate(data.endDate) }}</span>
              </template>
            </Column>
            
            <Column field="active" header="Status" sortable>
              <template #body="{ data }">
                <Tag
                  :value="data.active ? 'Active' : 'Inactive'"
                  :severity="data.active ? 'success' : 'secondary'"
                />
              </template>
            </Column>
            
            <Column header="Actions" :exportable="false" style="min-width: 12rem">
              <template #body="{ data }">
                <div class="flex items-center space-x-2">
                  <Button
                    text
                    size="small"
                    @click="viewBatch(data)"
                    v-tooltip.top="'View Details'"
                    class="action-button view-button"
                  >
                    <template #icon>
                      <span class="material-icons">visibility</span>
                    </template>
                  </Button>
                  <Button
                    text
                    size="small"
                    @click="editBatch(data)"
                    v-tooltip.top="'Edit Batch'"
                    class="action-button edit-button"
                  >
                    <template #icon>
                      <span class="material-icons">edit</span>
                    </template>
                  </Button>
                  <Button
                    text
                    size="small"
                    @click="generateVouchers(data)"
                    v-tooltip.top="'Generate Vouchers'"
                    class="action-button generate-button"
                  >
                    <template #icon>
                      <span class="material-icons">add_card</span>
                    </template>
                  </Button>
                  <Button
                    text
                    size="small"
                    @click="toggleBatchStatus(data)"
                    v-tooltip.top="data.active ? 'Deactivate' : 'Activate'"
                    class="action-button toggle-button"
                  >
                    <template #icon>
                      <span class="material-icons">{{ data.active ? 'pause' : 'play_arrow' }}</span>
                    </template>
                  </Button>
                  <Button
                    text
                    size="small"
                    severity="danger"
                    @click="confirmDelete(data)"
                    v-tooltip.top="'Delete Batch'"
                    class="action-button delete-button"
                  >
                    <template #icon>
                      <span class="material-icons">delete</span>
                    </template>
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'

// Toast instance
const toast = useToast()

// Reactive data
const loading = ref(false)
const batches = ref<any[]>([])
const totalBatches = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Batch stats
const batchStats = ref({
  totalBatches: 0,
  activeBatches: 0,
  totalVouchers: 0,
  availableVouchers: 0
})

// Filters
const filters = ref({
  search: '',
  locationId: null,
  active: null
})

// Options for dropdowns
const locationOptions = ref([])
const statusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
])

// Methods
const getDurationSeverity = (hours: number) => {
  if (hours <= 1) return 'info'
  if (hours <= 24) return 'success'
  if (hours <= 168) return 'warning'
  return 'danger'
}

const getAvailableVouchers = (batch: any) => {
  if (!batch.vouchers) return 0
  return batch.vouchers.filter((v: any) => v.status === 'AVAILABLE').length
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const clearFilters = () => {
  filters.value = {
    search: '',
    locationId: null,
    active: null
  }
}

const onPageChange = (event: any) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
}

// Placeholder methods for future implementation
const openGenerateDialog = () => {
  toast.add({ severity: 'info', summary: 'Info', detail: 'Generate vouchers dialog will be implemented', life: 3000 })
}

const openCreateDialog = () => {
  toast.add({ severity: 'info', summary: 'Info', detail: 'Create batch dialog will be implemented', life: 3000 })
}

const viewBatch = (batch: any) => {
  toast.add({ severity: 'info', summary: 'Info', detail: `Viewing batch: ${batch.name}`, life: 3000 })
}

const editBatch = (batch: any) => {
  toast.add({ severity: 'info', summary: 'Info', detail: `Editing batch: ${batch.name}`, life: 3000 })
}

const generateVouchers = (batch: any) => {
  toast.add({ severity: 'info', summary: 'Info', detail: `Generating vouchers for: ${batch.name}`, life: 3000 })
}

const toggleBatchStatus = (batch: any) => {
  toast.add({ severity: 'info', summary: 'Info', detail: `Toggling status for: ${batch.name}`, life: 3000 })
}

const confirmDelete = (batch: any) => {
  if (confirm(`Are you sure you want to delete "${batch.name}"?`)) {
    toast.add({ severity: 'success', summary: 'Success', detail: `Batch ${batch.name} deleted`, life: 3000 })
  }
}

// Mock data for now
onMounted(() => {
  // Mock data
  batches.value = [
    {
      id: '1',
      name: '24 Hour WiFi - Harare CBD',
      location: { name: 'Harare CBD' },
      retailPrice: 5.00,
      hours: 24,
      numberOfUsers: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      active: true,
      _count: { vouchers: 100 }
    },
    {
      id: '2',
      name: '1 Hour WiFi - Bulawayo Mall',
      location: { name: 'Bulawayo Mall' },
      retailPrice: 2.50,
      hours: 1,
      numberOfUsers: 2,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      active: true,
      _count: { vouchers: 50 }
    }
  ]
  
  totalBatches.value = batches.value.length
  batchStats.value = {
    totalBatches: 2,
    activeBatches: 2,
    totalVouchers: 150,
    availableVouchers: 120
  }
  
  locationOptions.value = [
    { id: '1', name: 'Harare CBD' },
    { id: '2', name: 'Bulawayo Mall' }
  ]
})

// Meta tags
useHead({
  title: 'Voucher Batches - UFO Networks Admin',
  meta: [
    { name: 'description', content: 'Manage voucher batches, pricing, and availability in the UFO Networks system.' }
  ]
})
</script>

<style scoped>
/* Custom primary button with actual color codes */
:deep(.custom-primary-button) {
  background: linear-gradient(135deg, #185ff9 0%, #2d3040 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(24, 95, 249, 0.25);
  border: none !important;
}

:deep(.custom-primary-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(24, 95, 249, 0.35);
  background: linear-gradient(135deg, #185ff9 0%, #2d3040 100%) !important;
  color: white !important;
}

:deep(.custom-primary-button:active) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(24, 95, 249, 0.2);
}

:deep(.custom-primary-button:disabled) {
  background: rgba(45, 48, 64, 0.3) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  transform: none;
  box-shadow: none;
}

/* Stats cards styling */
:deep(.stats-card) {
  border-radius: 12px !important;
  border: 1px solid rgba(45, 48, 64, 0.1) !important;
  background: white !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.2s ease !important;
}

:deep(.stats-card:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

/* Action button styling */
:deep(.action-button) {
  border-radius: 6px !important;
  transition: all 0.2s ease !important;
  width: 2rem !important;
  height: 2rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
}

:deep(.action-button .material-icons) {
  font-size: 1rem !important;
  color: inherit !important;
}

:deep(.action-button:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

:deep(.action-button:active) {
  transform: translateY(0) !important;
}

/* View button styling */
:deep(.view-button) {
  color: #185ff9 !important;
  background: rgba(24, 95, 249, 0.1) !important;
}

:deep(.view-button:hover) {
  background: rgba(24, 95, 249, 0.2) !important;
  color: #185ff9 !important;
}

/* Edit button styling */
:deep(.edit-button) {
  color: #f59e0b !important;
  background: rgba(245, 158, 11, 0.1) !important;
}

:deep(.edit-button:hover) {
  background: rgba(245, 158, 11, 0.2) !important;
  color: #f59e0b !important;
}

/* Generate button styling */
:deep(.generate-button) {
  color: #059669 !important;
  background: rgba(5, 150, 105, 0.1) !important;
}

:deep(.generate-button:hover) {
  background: rgba(5, 150, 105, 0.2) !important;
  color: #059669 !important;
}

/* Toggle button styling */
:deep(.toggle-button) {
  color: #7c3aed !important;
  background: rgba(124, 58, 237, 0.1) !important;
}

:deep(.toggle-button:hover) {
  background: rgba(124, 58, 237, 0.2) !important;
  color: #7c3aed !important;
}

/* Delete button styling */
:deep(.delete-button) {
  color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.1) !important;
}

:deep(.delete-button:hover) {
  background: rgba(239, 68, 68, 0.2) !important;
  color: #ef4444 !important;
}
</style>
