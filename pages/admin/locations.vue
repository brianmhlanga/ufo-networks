<template>
  <NuxtLayout name="admin">
    <div>
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-[#2d3040] mb-2">Locations Management</h1>
            <p class="text-[#2d3040]/60">Manage WiFi hotspot locations across Zimbabwe</p>
          </div>
          <Button
            label="Add New Location"
            icon="add"
            @click="openCreateDialog"
            class="bg-[#185ff9] hover:bg-[#185ff9]/90 border-0"
          >
            <template #icon>
              <span class="material-icons mr-2">add</span>
            </template>
          </Button>
        </div>
      </div>

      <!-- Filters and Search -->
      <Card class="mb-6">
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <span class="p-input-icon-left w-full">
               
                <InputText
                  v-model="filters.search"
                  placeholder="Search locations..."
                  class="w-full"
                />
              </span>
            </div>

            <!-- Province Filter -->
            <Dropdown
              v-model="filters.province"
              :options="provinceOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Provinces"
              class="w-full"
              showClear
            />

            <!-- Status Filter -->
            <Dropdown
              v-model="filters.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Status"
              class="w-full"
              showClear
            />
          </div>
        </template>
      </Card>

      <!-- Locations Table -->
      <Card>
        <template #content>
                     <DataTable
             :value="locations"
             :loading="loading"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} locations"
            responsiveLayout="scroll"
            class="p-datatable-sm"
            stripedRows
            showGridlines
            v-model:selection="selectedLocations"
            dataKey="id"
          >
            <!-- Selection Column -->
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <!-- Location Name -->
            <Column field="name" header="Location Name" sortable>
              <template #body="{ data }">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9]/10 to-[#2d3040]/10 rounded-lg flex items-center justify-center">
                    <span class="material-icons text-[#185ff9] text-lg">location_on</span>
                  </div>
                  <div>
                    <div class="font-medium text-[#2d3040]">{{ data.name }}</div>
                    <div class="text-sm text-[#2d3040]/60">{{ data.code }}</div>
                  </div>
                </div>
              </template>
            </Column>

            <!-- Town & Area -->
            <Column field="town" header="Town & Area" sortable>
              <template #body="{ data }">
                <div>
                  <div class="font-medium text-[#2d3040]">{{ data.town }}</div>
                  <div class="text-sm text-[#2d3040]/60">{{ data.area }}</div>
                </div>
              </template>
            </Column>

            <!-- Province -->
            <Column field="province" header="Province" sortable>
              <template #body="{ data }">
                <Tag :value="data.province" severity="info" />
              </template>
            </Column>

            <!-- Voucher Count -->
            <Column field="voucherCount" header="Vouchers" sortable>
              <template #body="{ data }">
                <div class="text-center">
                  <div class="font-bold text-[#2d3040]">{{ data.voucherCount }}</div>
                  <div class="text-xs text-[#2d3040]/60">Available</div>
                </div>
              </template>
            </Column>

            <!-- Status -->
            <Column field="status" header="Status" sortable>
              <template #body="{ data }">
                <Tag
                  :value="data.status"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </Column>

            <!-- Actions -->
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
              <template #body="{ data }">
                <div class="flex items-center space-x-2">
                  <Button
                    icon="visibility"
                    text
                    size="small"
                    @click="viewLocation(data)"
                    class="text-blue-600 hover:text-blue-800"
                    v-tooltip.top="'View Details'"
                  >
                    <template #icon>
                      <span class="material-icons text-sm">visibility</span>
                    </template>
                  </Button>
                  <Button
                    icon="edit"
                    text
                    size="small"
                    @click="editLocation(data)"
                    class="text-green-600 hover:text-green-800"
                    v-tooltip.top="'Edit Location'"
                  >
                    <template #icon>
                      <span class="material-icons text-sm">edit</span>
                    </template>
                  </Button>
                  <Button
                    icon="delete"
                    text
                    size="small"
                    @click="confirmDelete(data)"
                    class="text-red-600 hover:text-red-800"
                    v-tooltip.top="'Delete Location'"
                  >
                    <template #icon>
                      <span class="material-icons text-sm">delete</span>
                    </template>
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Bulk Actions -->
      <div v-if="selectedLocations.length > 0" class="mt-4">
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span class="text-sm text-[#2d3040]/60">
                  {{ selectedLocations.length }} location(s) selected
                </span>
                <Button
                  label="Delete Selected"
                  icon="delete"
                  severity="danger"
                  text
                  @click="confirmBulkDelete"
                >
                  <template #icon>
                    <span class="material-icons mr-2">delete</span>
                  </template>
                </Button>
                <Button
                  label="Export Selected"
                  icon="download"
                  text
                  @click="exportSelected"
                >
                  <template #icon>
                    <span class="material-icons mr-2">download</span>
                  </template>
                </Button>
              </div>
              <Button
                label="Clear Selection"
                text
                size="small"
                @click="selectedLocations = []"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- Create/Edit Dialog -->
      <Dialog
        v-model:visible="showDialog"
        :header="isEditing ? 'Edit Location' : 'Add New Location'"
        :style="{ width: '50rem' }"
        :modal="true"
        :closable="true"
        :closeOnEscape="true"
        class="p-fluid"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Location Name -->
          <div class="md:col-span-2">
            <label for="name" class="font-medium text-[#2d3040] mb-2 block">Location Name *</label>
            <InputText
              id="name"
              v-model="locationForm.name"
              placeholder="Enter location name"
              :class="{ 'p-invalid': submitted && !locationForm.name }"
            />
            <small v-if="submitted && !locationForm.name" class="p-error">Location name is required.</small>
          </div>

          <!-- Location Code -->
          <div>
            <label for="code" class="font-medium text-[#2d3040] mb-2 block">Location Code *</label>
            <InputText
              id="code"
              v-model="locationForm.code"
              placeholder="e.g., HARARE_CBD"
              :class="{ 'p-invalid': submitted && !locationForm.code }"
            />
            <small v-if="submitted && !locationForm.code" class="p-error">Location code is required.</small>
          </div>

          <!-- Town -->
          <div>
            <label for="town" class="font-medium text-[#2d3040] mb-2 block">Town *</label>
            <InputText
              id="town"
              v-model="locationForm.town"
              placeholder="Enter town name"
              :class="{ 'p-invalid': submitted && !locationForm.town }"
            />
            <small v-if="submitted && !locationForm.town" class="p-error">Town is required.</small>
          </div>

          <!-- Area -->
          <div>
            <label for="area" class="font-medium text-[#2d3040] mb-2 block">Area</label>
            <InputText
              id="area"
              v-model="locationForm.area"
              placeholder="e.g., Central Business District"
            />
          </div>

          <!-- Province -->
          <div>
            <label for="province" class="font-medium text-[#2d3040] mb-2 block">Province *</label>
            <Dropdown
              id="province"
              v-model="locationForm.province"
              :options="provinceOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select province"
              :class="{ 'p-invalid': submitted && !locationForm.province }"
            />
            <small v-if="submitted && !locationForm.province" class="p-error">Province is required.</small>
          </div>

          <!-- Router Model -->
          <div>
            <label for="routerModel" class="font-medium text-[#2d3040] mb-2 block">Router Model</label>
            <InputText
              id="routerModel"
              v-model="locationForm.routerModel"
              placeholder="e.g., MikroTik RB951G-2HnD"
            />
          </div>

          <!-- SSID -->
          <div>
            <label for="ssid" class="font-medium text-[#2d3040] mb-2 block">SSID</label>
            <InputText
              id="ssid"
              v-model="locationForm.ssid"
              placeholder="e.g., UFO_HARARE_CBD"
            />
          </div>

          <!-- Coordinates -->
          <div class="md:col-span-2">
            <label class="font-medium text-[#2d3040] mb-2 block">Coordinates</label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="latitude" class="text-sm text-[#2d3040]/60 mb-1 block">Latitude</label>
                <InputNumber
                  id="latitude"
                  v-model="locationForm.latitude"
                  placeholder="e.g., -17.8252"
                  :minFractionDigits="4"
                  :maxFractionDigits="6"
                />
              </div>
              <div>
                <label for="longitude" class="text-sm text-[#2d3040]/60 mb-1 block">Longitude</label>
                <InputNumber
                  id="longitude"
                  v-model="locationForm.longitude"
                  placeholder="e.g., 31.0335"
                  :minFractionDigits="4"
                  :maxFractionDigits="6"
                />
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="md:col-span-2">
            <label for="notes" class="font-medium text-[#2d3040] mb-2 block">Notes</label>
            <Textarea
              id="notes"
              v-model="locationForm.notes"
              rows="3"
              placeholder="Additional notes about this location..."
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <Button
              label="Cancel"
              text
              @click="closeDialog"
            />
            <Button
              :label="isEditing ? 'Update' : 'Create'"
              :icon="isEditing ? 'save' : 'add'"
              @click="saveLocation"
              :loading="saving"
            >
              <template #icon>
                <span class="material-icons mr-2">{{ isEditing ? 'save' : 'add' }}</span>
              </template>
            </Button>
          </div>
        </template>
      </Dialog>

      <!-- View Details Dialog -->
      <Dialog
        v-model:visible="showViewDialog"
        header="Location Details"
        :style="{ width: '40rem' }"
        :modal="true"
        :closable="true"
        :closeOnEscape="true"
      >
        <div v-if="selectedLocation" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">Location Name</label>
              <p class="text-[#2d3040] font-medium">{{ selectedLocation.name }}</p>
            </div>
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">Location Code</label>
              <p class="text-[#2d3040] font-medium">{{ selectedLocation.code }}</p>
            </div>
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">Town</label>
              <p class="text-[#2d3040]">{{ selectedLocation.town }}</p>
            </div>
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">Area</label>
              <p class="text-[#2d3040]">{{ selectedLocation.area || 'N/A' }}</p>
            </div>
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">Province</label>
              <Tag :value="selectedLocation.province" severity="info" />
            </div>
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">Status</label>
              <Tag
                :value="selectedLocation.status"
                :severity="getStatusSeverity(selectedLocation.status)"
              />
            </div>
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">Router Model</label>
              <p class="text-[#2d3040]">{{ selectedLocation.routerModel || 'N/A' }}</p>
            </div>
            <div>
              <label class="font-medium text-[#2d3040]/60 text-sm">SSID</label>
              <p class="text-[#2d3040]">{{ selectedLocation.ssid || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <label class="font-medium text-[#2d3040]/60 text-sm">Coordinates</label>
              <p class="text-[#2d3040]">
                {{ selectedLocation.coordinates ? `${selectedLocation.coordinates.lat}, ${selectedLocation.coordinates.lng}` : 'N/A' }}
              </p>
            </div>
            <div class="col-span-2">
              <label class="font-medium text-[#2d3040]/60 text-sm">Notes</label>
              <p class="text-[#2d3040]">{{ selectedLocation.notes || 'No notes available' }}</p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <Button
              label="Edit"
              icon="edit"
              @click="editFromView"
            >
              <template #icon>
                <span class="material-icons mr-2">edit</span>
              </template>
            </Button>
            <Button
              label="Close"
              text
              @click="showViewDialog = false"
            />
          </div>
        </template>
      </Dialog>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { useToast } from 'primevue/usetoast'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Toast instance
const toast = useToast()

// Reactive data
const loading = ref(false)
const saving = ref(false)
const submitted = ref(false)
const showDialog = ref(false)
const showViewDialog = ref(false)
const isEditing = ref(false)
const selectedLocations = ref<any[]>([])
const selectedLocation:any = ref(null)

// Filters
const filters = ref({
  search: '',
  province: null,
  status: null
})

// Location form
const locationForm = ref({
  name: '',
  code: '',
  town: '',
  area: '',
  province: '',
  routerModel: '',
  ssid: '',
  latitude: null,
  longitude: null,
  notes: ''
})

// Real data from API
const locations = ref<any[]>([])
const totalLocations = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Options for dropdowns
const provinceOptions = ref([
  { label: 'Harare', value: 'Harare' },
  { label: 'Bulawayo', value: 'Bulawayo' },
  { label: 'Manicaland', value: 'Manicaland' },
  { label: 'Mashonaland Central', value: 'Mashonaland Central' },
  { label: 'Mashonaland East', value: 'Mashonaland East' },
  { label: 'Mashonaland West', value: 'Mashonaland West' },
  { label: 'Masvingo', value: 'Masvingo' },
  { label: 'Matabeleland North', value: 'Matabeleland North' },
  { label: 'Matabeleland South', value: 'Matabeleland South' },
  { label: 'Midlands', value: 'Midlands' }
])

const statusOptions = ref([
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Maintenance', value: 'MAINTENANCE' }
])

// API functions
const fetchLocations = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.province) params.append('province', filters.value.province)
    if (filters.value.status) params.append('status', filters.value.status)

    const response = await $fetch(`/api/admin/locations?${params}`)
    locations.value = response.locations
    totalLocations.value = response.pagination.total
  } catch (error) {
    console.error('Error fetching locations:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch locations',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch([filters, currentPage], () => {
  fetchLocations()
}, { deep: true })

// Load locations on mount
onMounted(() => {
  fetchLocations()
})

// Methods
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'INACTIVE':
      return 'danger'
    case 'MAINTENANCE':
      return 'warning'
    default:
      return 'info'
  }
}

const resetForm = () => {
  locationForm.value = {
    name: '',
    code: '',
    town: '',
    area: '',
    province: '',
    routerModel: '',
    ssid: '',
    latitude: null,
    longitude: null,
    notes: ''
  }
  submitted.value = false
}

const openCreateDialog = () => {
  isEditing.value = false
  resetForm()
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  resetForm()
}

const saveLocation = async () => {
  submitted.value = true

  if (!locationForm.value.name || !locationForm.value.code || !locationForm.value.town || !locationForm.value.province) {
    return
  }

  saving.value = true

  try {
    const locationData = {
      name: locationForm.value.name,
      code: locationForm.value.code,
      town: locationForm.value.town,
      area: locationForm.value.area,
      province: locationForm.value.province,
      routerModel: locationForm.value.routerModel,
      ssid: locationForm.value.ssid,
      latitude: locationForm.value.latitude,
      longitude: locationForm.value.longitude,
      notes: locationForm.value.notes
    }

    if (isEditing.value) {
      // Update existing location
      await $fetch(`/api/admin/locations/${selectedLocation.value.id}`, {
        method: 'PUT',
        body: locationData
      } as any)
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Location updated successfully',
        life: 3000
      })
    } else {
      // Create new location
      await $fetch('/api/admin/locations', {
        method: 'POST',
        body: locationData
      })
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Location created successfully',
        life: 3000
      })
    }

    closeDialog()
    fetchLocations() // Refresh the list
  } catch (error) {
    console.error('Error saving location:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save location',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const editLocation = (location: any) => {
  selectedLocation.value = location
  isEditing.value = true
  
  locationForm.value = {
    name: location.name,
    code: location.code,
    town: location.town,
    area: location.area || '',
    province: location.province,
    routerModel: location.routerModel || '',
    ssid: location.ssid || '',
    latitude: location.coordinates?.lat || null,
    longitude: location.coordinates?.lng || null,
    notes: location.notes || ''
  }
  
  showDialog.value = true
}

const viewLocation = (location: any) => {
  selectedLocation.value = location
  showViewDialog.value = true
}

const editFromView = () => {
  showViewDialog.value = false
  editLocation(selectedLocation.value)
}

const confirmDelete = (location: any) => {
  if (confirm(`Are you sure you want to delete "${location.name}"?`)) {
    deleteLocation(location)
  } else {
    toast.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Delete operation cancelled',
      life: 3000
    })
  }
}

const deleteLocation = async (location: any) => {
  try {
    await $fetch(`/api/admin/locations/${location.id}`, {
      method: 'DELETE'
    } as any)
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Location deleted successfully',
      life: 3000
    })
    
    fetchLocations() // Refresh the list
  } catch (error) {
    console.error('Error deleting location:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete location',
      life: 3000
    })
  }
}

const confirmBulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedLocations.value.length} selected location(s)?`)) {
    bulkDelete()
  } else {
    toast.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Bulk delete operation cancelled',
      life: 3000
    })
  }
}

const bulkDelete = async () => {
  try {
    const idsToDelete = selectedLocations.value.map(l => l.id)
    
    await $fetch('/api/admin/locations/bulk', {
      method: 'DELETE',
      body: { ids: idsToDelete }
    } as any)
    
    selectedLocations.value = []
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${idsToDelete.length} location(s) deleted successfully`,
      life: 3000
    })
    
    fetchLocations() // Refresh the list
  } catch (error) {
    console.error('Error bulk deleting locations:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete selected locations',
      life: 3000
    })
  }
}

const exportSelected = () => {
  // Implement export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Export functionality will be implemented',
    life: 3000
  })
}

// Meta tags
useHead({
  title: 'Locations Management - UFO Networks Admin',
  meta: [
    { name: 'description', content: 'Manage WiFi hotspot locations across Zimbabwe' }
  ]
})
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Apply Poppins to all elements */
* {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* PrimeVue Component Customization */
:deep(.p-datatable) {
  @apply border-0;
}

:deep(.p-datatable .p-datatable-header) {
  @apply bg-transparent border-0;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  @apply bg-gray-50 border-gray-200 text-[#2d3040] font-semibold;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  @apply border-gray-100;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  @apply bg-gray-50;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
  @apply bg-[#185ff9]/10;
}

:deep(.p-button) {
  @apply border-0 font-medium transition-all duration-200;
}

:deep(.p-button.p-button-text) {
  @apply text-[#185ff9] hover:text-[#185ff9]/80 hover:bg-[#185ff9]/5;
}

:deep(.p-inputtext) {
  @apply border-gray-200 focus:border-[#185ff9] focus:ring-[#185ff9]/10;
}

:deep(.p-dropdown) {
  @apply border-gray-200;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  @apply border-[#185ff9]/30;
}

:deep(.p-dropdown.p-focus) {
  @apply border-[#185ff9] ring-[#185ff9]/10;
}

:deep(.p-tag) {
  @apply font-medium;
}

/* Material Icons */
.material-icons {
  font-size: 20px;
}

.material-icons.text-sm {
  font-size: 0.875rem;
}

.material-icons.text-lg {
  font-size: 1.125rem;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease;
}
</style>
