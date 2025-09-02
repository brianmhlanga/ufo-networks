<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[#2d3040]">Vouchers</h1>
          <p class="text-[#2d3040]/60 mt-1">Manage individual vouchers, status, and assignments</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            label="Bulk Actions"
            icon="settings"
            severity="secondary"
            @click="openBulkActions"
          />
          <Button
            label="Add Voucher"
            icon="add"
            @click="openCreateDialog"
            class="custom-primary-button"
          />
        </div>
      </div>

      <!-- Voucher Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- Total Vouchers -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Total</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ voucherStats.totalVouchers }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-blue-600 text-xl">receipt</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Available Vouchers -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Available</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ voucherStats.availableVouchers }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-green-600 text-xl">check_circle</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Reserved Vouchers -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Reserved</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ voucherStats.reservedVouchers }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-yellow-600 text-xl">schedule</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Sold Vouchers -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Sold</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ voucherStats.soldVouchers }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-purple-600 text-xl">shopping_cart</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Redeemed Vouchers -->
        <Card class="stats-card">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#2d3040]/60">Redeemed</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ voucherStats.redeemedVouchers }}</p>
              </div>
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="material-icons text-gray-600 text-xl">done_all</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Filters and Search -->
      <Card>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#2d3040] mb-2">Search</label>
              <InputText
                v-model="filters.search"
                placeholder="Voucher #, PIN..."
                class="w-full"
              />
            </div>
                         <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Status</label>
               <Select
                 v-model="filters.status"
                 :options="statusOptions"
                 optionLabel="label"
                 optionValue="value"
                 placeholder="All Status"
                 class="w-full"
               />
             </div>
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Location</label>
               <Select
                 v-model="filters.locationId"
                 :options="locationOptions"
                 optionLabel="name"
                 optionValue="id"
                 placeholder="All Locations"
                 class="w-full"
               />
             </div>
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Batch</label>
               <Select
                 v-model="filters.batchId"
                 :options="batchOptions"
                 optionLabel="name"
                 optionValue="id"
                 placeholder="All Batches"
                 class="w-full"
               />
             </div>
                         <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Date Range</label>
               <DatePicker
                 v-model="filters.dateRange"
                 selectionMode="range"
                 placeholder="Select dates"
                 class="w-full"
               />
             </div>
            <div class="flex items-end">
              <Button
                label="Clear"
                icon="clear"
                severity="secondary"
                @click="clearFilters"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Vouchers Table -->
      <Card>
        <template #content>
          <DataTable
            :value="vouchers"
            :loading="loading"
            :paginator="true"
            :rows="pageSize"
            :totalRecords="totalVouchers"
            :lazy="true"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vouchers"
            @page="onPageChange"
            dataKey="id"
            stripedRows
            showGridlines
            responsiveLayout="scroll"
            class="p-datatable-sm"
            v-model:selection="selectedVouchers"
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            
            <Column field="voucherNumber" header="Voucher #" sortable>
              <template #body="{ data }">
                <div class="font-mono font-medium text-[#2d3040]">{{ data.voucherNumber }}</div>
              </template>
            </Column>
            
            <Column field="pin" header="PIN" sortable>
              <template #body="{ data }">
                <div class="font-mono text-[#2d3040]/80">{{ data.pin }}</div>
              </template>
            </Column>
            
            <Column field="location" header="Location" sortable>
              <template #body="{ data }">
                <div class="flex items-center space-x-2">
                  <span class="material-icons text-[#185ff9] text-sm">location_on</span>
                  <span class="text-[#2d3040]">{{ data.location?.name }}</span>
                </div>
              </template>
            </Column>
            
            <Column field="batch" header="Batch" sortable>
              <template #body="{ data }">
                <div class="text-[#2d3040]">{{ data.batch?.name }}</div>
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
            
            <Column field="status" header="Status" sortable>
              <template #body="{ data }">
                <Tag
                  :value="getStatusLabel(data.status)"
                  :severity="getStatusSeverity(data.status)"
                />
              </template>
            </Column>
            
            <Column field="startDate" header="Start Date" sortable>
              <template #body="{ data }">
                <span class="text-[#2d3040]">{{ formatDate(data.startDate) }}</span>
              </template>
            </Column>
            
            <Column field="expiryDate" header="Expiry" sortable>
              <template #body="{ data }">
                <span class="text-[#2d3040]">{{ formatDate(data.expiryDate) }}</span>
              </template>
            </Column>
            
            <Column field="assignedToUser" header="Assigned To" sortable>
              <template #body="{ data }">
                <div v-if="data.assignedToUser" class="text-[#2d3040]">
                  {{ data.assignedToUser.name || data.assignedToUser.email }}
                </div>
                <div v-else-if="data.assignedToAgent" class="text-[#2d3040]">
                  {{ data.assignedToAgent.displayName }}
                </div>
                <span v-else class="text-[#2d3040]/40">-</span>
              </template>
            </Column>
            
            <Column header="Actions" :exportable="false" style="min-width: 12rem">
              <template #body="{ data }">
                <div class="flex items-center space-x-2">
                  <Button
                    text
                    size="small"
                    @click="viewVoucher(data)"
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
                    @click="editVoucher(data)"
                    v-tooltip.top="'Edit Voucher'"
                    class="action-button edit-button"
                  >
                    <template #icon>
                      <span class="material-icons">edit</span>
                    </template>
                  </Button>
                  <Button
                    text
                    size="small"
                    @click="changeStatus(data)"
                    v-tooltip.top="'Change Status'"
                    class="action-button status-button"
                  >
                    <template #icon>
                      <span class="material-icons">swap_horiz</span>
                    </template>
                  </Button>
                  <Button
                    text
                    size="small"
                    severity="danger"
                    @click="confirmDelete(data)"
                    v-tooltip.top="'Delete Voucher'"
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

      <!-- Create/Edit Dialog -->
      <Dialog
        v-model:visible="showDialog"
        :modal="true"
        :header="isEditing ? 'Edit Voucher' : 'Create New Voucher'"
        class="p-fluid w-full max-w-5xl"
      >
        <!-- Basic Information Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-[#2d3040] mb-4 border-b border-gray-200 pb-2">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
               <label for="voucherNumber" class="block text-sm font-medium text-[#2d3040] mb-2">Voucher Number</label>
               <InputText
                 id="voucherNumber"
                 v-model="voucherForm.voucherNumber"
                 placeholder="Auto-generated"
                 readonly
                 class="bg-gray-50"
               />
               <small class="text-[#2d3040]/60">
                 {{ voucherForm.locationId ? `Preview: ${getVoucherNumberPreview()}` : 'Select location to see preview' }}
               </small>
             </div>

                         <div>
               <label for="pin" class="block text-sm font-medium text-[#2d3040] mb-2">PIN *</label>
               <div class="flex space-x-2">
                 <InputText
                   id="pin"
                   v-model="voucherForm.pin"
                   placeholder="Enter PIN"
                   :class="{ 'p-invalid': submitted && !voucherForm.pin }"
                   class="flex-1"
                 />
                 <Button
                   type="button"
                   icon="refresh"
                   @click="generateRandomPin"
                   class="px-3"
                   v-tooltip.top="'Generate Random PIN'"
                 />
               </div>
               <small v-if="submitted && !voucherForm.pin" class="p-error">PIN is required.</small>
             </div>

                                      <div>
               <label for="batchId" class="block text-sm font-medium text-[#2d3040] mb-2">Batch</label>
               <Select
                 id="batchId"
                 v-model="voucherForm.batchId"
                 :options="batchOptions"
                 optionLabel="name"
                 optionValue="id"
                 placeholder="Select batch (optional)"
                 class="w-full"
               />
               <small class="text-[#2d3040]/60">Optional - vouchers can exist without a batch</small>
             </div>

             <div>
               <label for="locationId" class="block text-sm font-medium text-[#2d3040] mb-2">Location *</label>
               <Select
                 id="locationId"
                 v-model="voucherForm.locationId"
                 :options="locationOptions"
                 optionLabel="name"
                 optionValue="id"
                 placeholder="Select location"
                 :class="{ 'p-invalid': submitted && !voucherForm.locationId }"
                 class="w-full"
               />
               <small v-if="submitted && !voucherForm.locationId" class="p-error">Location is required.</small>
             </div>
          </div>
        </div>

        <!-- Pricing & Configuration Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-[#2d3040] mb-4 border-b border-gray-200 pb-2">Pricing & Configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="retailPrice" class="block text-sm font-medium text-[#2d3040] mb-2">Retail Price ($) *</label>
              <InputNumber
                id="retailPrice"
                v-model="voucherForm.retailPrice"
                placeholder="0.00"
                :minFractionDigits="2"
                :maxFractionDigits="2"
                prefix="$"
                :min="0"
                :class="{ 'p-invalid': submitted && !voucherForm.retailPrice }"
              />
              <small v-if="submitted && !voucherForm.retailPrice" class="p-error">Retail price is required.</small>
            </div>

            <div>
              <label for="hours" class="block text-sm font-medium text-[#2d3040] mb-2">Duration (Hours) *</label>
              <InputNumber
                id="hours"
                v-model="voucherForm.hours"
                placeholder="24"
                :min="1"
                :max="8760"
                suffix=" hours"
                :class="{ 'p-invalid': submitted && !voucherForm.hours }"
              />
              <small v-if="submitted && !voucherForm.hours" class="p-error">Duration is required.</small>
            </div>

            <div>
              <label for="numberOfUsers" class="block text-sm font-medium text-[#2d3040] mb-2">Concurrent Users *</label>
              <InputNumber
                id="numberOfUsers"
                v-model="voucherForm.numberOfUsers"
                placeholder="1"
                :min="1"
                :max="100"
                suffix=" users"
                :class="{ 'p-invalid': submitted && !voucherForm.numberOfUsers }"
              />
              <small v-if="submitted && !voucherForm.numberOfUsers" class="p-error">Number of users is required.</small>
            </div>
          </div>
        </div>

        <!-- Status Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-[#2d3040] mb-4 border-b border-gray-200 pb-2">Status & Availability</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                 <label for="status" class="block text-sm font-medium text-[#2d3040] mb-2">Status *</label>
                 <Select
                   id="status"
                   v-model="voucherForm.status"
                   :options="statusOptions"
                   optionLabel="label"
                   optionValue="value"
                   placeholder="Select status"
                   :class="{ 'p-invalid': submitted && !voucherForm.status }"
                   class="w-full"
                 />
                 <small v-if="submitted && !voucherForm.status" class="p-error">Status is required.</small>
               </div>
          </div>
        </div>

        <!-- Date Configuration Section -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-[#2d3040] mb-4 border-b border-gray-200 pb-2">Date Configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div>
               <label for="startDate" class="block text-sm font-medium text-[#2d3040] mb-2">Start Date & Time *</label>
               <DatePicker
                 id="startDate"
                 v-model="voucherForm.startDate"
                 showTime
                 hourFormat="24"
                 fluid
                 placeholder="Select start date and time"
                 :class="{ 'p-invalid': submitted && !voucherForm.startDate }"
               />
               <small v-if="submitted && !voucherForm.startDate" class="p-error">Start date and time is required.</small>
             </div>

             <div>
               <label for="endDate" class="block text-sm font-medium text-[#2d3040] mb-2">End Date & Time *</label>
               <DatePicker
                 id="endDate"
                 v-model="voucherForm.endDate"
                 showTime
                 hourFormat="24"
                 fluid
                 placeholder="Select end date and time"
                 :class="{ 'p-invalid': submitted && !voucherForm.endDate }"
               />
               <small v-if="submitted && !voucherForm.endDate" class="p-error">End date and time is required.</small>
             </div>

             <div>
               <label for="expiryDate" class="block text-sm font-medium text-[#2d3040] mb-2">Expiry Date *</label>
               <DatePicker
                 id="expiryDate"
                 v-model="voucherForm.expiryDate"
                 fluid
                 placeholder="Select expiry date"
                 :class="{ 'p-invalid': submitted && !voucherForm.expiryDate }"
               />
               <small v-if="submitted && !voucherForm.expiryDate" class="p-error">Expiry date is required.</small>
             </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <Button
              label="Cancel"
              icon="cancel"
              text
              @click="closeDialog"
            />
            <Button
              :label="isEditing ? 'Update' : 'Create'"
              :icon="isEditing ? 'update' : 'add'"
              :loading="saving"
              @click="saveVoucher"
              class="custom-primary-button"
            />
          </div>
        </template>
      </Dialog>

      <!-- Change Status Dialog -->
      <Dialog
        v-model:visible="showStatusDialog"
        :modal="true"
        header="Change Voucher Status"
        class="p-fluid w-full max-w-md"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Voucher</label>
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="font-medium text-[#2d3040]">{{ selectedVoucher?.voucherNumber }}</div>
              <div class="text-sm text-[#2d3040]/60">{{ selectedVoucher?.location?.name }} - ${{ selectedVoucher?.retailPrice }}</div>
            </div>
          </div>

                     <div>
             <label for="newStatus" class="block text-sm font-medium text-[#2d3040] mb-2">New Status *</label>
             <Select
               id="newStatus"
               v-model="statusForm.newStatus"
               :options="statusOptions"
               optionLabel="label"
               optionValue="value"
               placeholder="Select new status"
               :class="{ 'p-invalid': submitted && !statusForm.newStatus }"
               class="w-full"
             />
             <small v-if="submitted && !statusForm.newStatus" class="p-error">New status is required.</small>
           </div>

          <div>
            <label for="statusNotes" class="block text-sm font-medium text-[#2d3040] mb-2">Notes</label>
            <Textarea
              id="statusNotes"
              v-model="statusForm.notes"
              placeholder="Enter reason for status change..."
              rows="3"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <Button
              label="Cancel"
              icon="cancel"
              text
              @click="closeStatusDialog"
            />
            <Button
              label="Update Status"
              icon="update"
              :loading="updatingStatus"
              @click="updateVoucherStatus"
              class="custom-primary-button"
            />
          </div>
        </template>
             </Dialog>
     </div>
     
     <!-- Toast Component -->
     <Toast />
   </NuxtLayout>
 </template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'

// Toast instance
const toast = useToast()

// Reactive data
const loading = ref(false)
const saving = ref(false)
const updatingStatus = ref(false)
const submitted = ref(false)
const showDialog = ref(false)
const showStatusDialog = ref(false)
const isEditing = ref(false)
const selectedVoucher = ref<any>(null)
const selectedVouchers = ref<any[]>([])

// Vouchers data
const vouchers = ref<any[]>([])
const totalVouchers = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// Voucher stats
const voucherStats = ref({
  totalVouchers: 0,
  availableVouchers: 0,
  reservedVouchers: 0,
  soldVouchers: 0,
  redeemedVouchers: 0
})

// Filters
const filters = ref({
  search: '',
  status: '',
  locationId: null,
  batchId: null,
  dateRange: null
})

// Voucher form
const voucherForm = ref({
  voucherNumber: '',
  pin: '',
  batchId: '',
  locationId: '',
  retailPrice: 0,
  hours: 24,
  numberOfUsers: 1,
  status: 'AVAILABLE',
  startDate: new Date() as Date,
  endDate: new Date(Date.now() + (24 * 60 * 60 * 1000)) as Date,
  expiryDate: null as Date | null
})

// Status form
const statusForm = ref({
  newStatus: '',
  notes: ''
})

// Options for dropdowns
const locationOptions = ref([])
const batchOptions:any = ref([])
const statusOptions:any = ref([
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Reserved', value: 'RESERVED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Redeemed', value: 'REDEEMED' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Disabled', value: 'DISABLED' }
])

// Methods
const getDurationSeverity = (hours: number) => {
  if (hours <= 1) return 'info'
  if (hours <= 24) return 'success'
  if (hours <= 168) return 'warning'
  return 'danger'
}

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'AVAILABLE': 'Available',
    'RESERVED': 'Reserved',
    'SOLD': 'Sold',
    'REDEEMED': 'Redeemed',
    'EXPIRED': 'Expired',
    'DISABLED': 'Disabled'
  }
  return statusMap[status] || status
}

const getStatusSeverity = (status: string) => {
  const severityMap: { [key: string]: string } = {
    'AVAILABLE': 'success',
    'RESERVED': 'warning',
    'SOLD': 'info',
    'REDEEMED': 'secondary',
    'EXPIRED': 'danger',
    'DISABLED': 'danger'
  }
  return severityMap[status] || 'info'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getVoucherNumberPreview = () => {
  if (!voucherForm.value.locationId) return ''
  
  const location = locationOptions.value.find((loc:any) => loc.id === voucherForm.value.locationId)
  if (!location) return ''
  
  // Find the last voucher for this location to get the next number
  const lastVoucher = vouchers.value
    .filter(v => v.locationId === voucherForm.value.locationId)
    .sort((a, b) => {
      const aMatch = a.voucherNumber?.match(/\d+$/)
      const bMatch = b.voucherNumber?.match(/\d+$/)
      const aNum = aMatch ? parseInt(aMatch[0]) : 0
      const bNum = bMatch ? parseInt(bMatch[0]) : 0
      return bNum - aNum
    })[0]
  
  let nextNumber = 1
  if (lastVoucher && lastVoucher.voucherNumber) {
    const lastNumberMatch = lastVoucher.voucherNumber.match(/\d+$/)
    if (lastNumberMatch) {
      nextNumber = parseInt(lastNumberMatch[0]) + 1
    }
  }
  
  return `UFO-${location.code}-${nextNumber.toString().padStart(4, '0')}`
}

const generateRandomPin = () => {
  // Generate a random 6-digit PIN
  const pin = Math.floor(100000 + Math.random() * 900000).toString()
  voucherForm.value.pin = pin
}

const resetForm = () => {
  // Set default start time to current time
  const now = new Date()
  const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
  
  // Set default end time to 24 hours from start time
  const endTime = new Date(startTime.getTime() + (24 * 60 * 60 * 1000))
  
  voucherForm.value = {
    voucherNumber: '',
    pin: '',
    batchId: '',
    locationId: '',
    retailPrice: 0,
    hours: 24,
    numberOfUsers: 1,
    status: 'AVAILABLE',
    startDate: startTime,
    endDate: endTime,
    expiryDate: null as Date | null
  }
  submitted.value = false
}

const openCreateDialog = () => {
  resetForm()
  isEditing.value = false
  showDialog.value = true
  // Auto-generate PIN for new vouchers
  generateRandomPin()
}

const closeDialog = () => {
  showDialog.value = false
  resetForm()
}

const closeStatusDialog = () => {
  showStatusDialog.value = false
  statusForm.value = { newStatus: '', notes: '' }
  selectedVoucher.value = null
}

const saveVoucher = async () => {
  submitted.value = true

  // Validation
  if (!voucherForm.value.pin) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'PIN is required', life: 3000 })
    return
  }
  
  if (!voucherForm.value.locationId) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Location is required', life: 3000 })
    return
  }
  
  if (!voucherForm.value.retailPrice || voucherForm.value.retailPrice <= 0) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Retail price must be greater than 0', life: 3000 })
    return
  }
  
  if (!voucherForm.value.hours || voucherForm.value.hours <= 0) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Duration must be greater than 0', life: 3000 })
    return
  }
  
  if (!voucherForm.value.numberOfUsers || voucherForm.value.numberOfUsers <= 0) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Number of users must be greater than 0', life: 3000 })
    return
  }
  
  if (!voucherForm.value.status) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Status is required', life: 3000 })
    return
  }
  
  if (!voucherForm.value.startDate) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Start date and time is required', life: 3000 })
    return
  }
  
  if (!voucherForm.value.endDate) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'End date and time is required', life: 3000 })
    return
  }
  
  if (!voucherForm.value.expiryDate) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Expiry date is required', life: 3000 })
    return
  }

  // Validate dates
  if (new Date(voucherForm.value.startDate) >= new Date(voucherForm.value.endDate)) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'End date must be after start date', life: 3000 })
    return
  }
  
  if (new Date(voucherForm.value.endDate) >= new Date(voucherForm.value.expiryDate)) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Expiry date must be after end date', life: 3000 })
    return
  }

  saving.value = true

  try {
    if (isEditing.value) {
      const response = await $fetch(`/api/admin/vouchers/${selectedVoucher.value.id}`, {
        method: 'PUT',
        body: voucherForm.value
      } as any)
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'Voucher updated successfully', life: 3000 })
    } else {
      const response = await $fetch('/api/admin/vouchers', {
        method: 'POST',
        body: voucherForm.value
      })
      
      // Show the generated voucher number
      const generatedNumber = response.voucher?.voucherNumber || 'Unknown'
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: `Voucher created successfully with number: ${generatedNumber}`, 
        life: 5000 
      })
    }

    closeDialog()
    fetchVouchers() // Refresh the list
    fetchVoucherStats() // Refresh stats
  } catch (error: any) {
    console.error('Error saving voucher:', error)
    
    // Handle different types of errors
    if (error.data?.message) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.data.message, 
        life: 5000 
      })
    } else if (error.statusMessage) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.statusMessage, 
        life: 5000 
      })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to save voucher. Please try again.', 
        life: 3000 
      })
    }
  } finally {
    saving.value = false
  }
}

const editVoucher = (voucher: any) => {
  selectedVoucher.value = voucher
  voucherForm.value = {
    voucherNumber: voucher.voucherNumber || '',
    pin: voucher.pin || '',
    batchId: voucher.batchId || '',
    locationId: voucher.locationId || '',
    retailPrice: voucher.retailPrice || 0,
    hours: voucher.hours || 24,
    numberOfUsers: voucher.numberOfUsers || 1,
    status: voucher.status || 'AVAILABLE',
    startDate: voucher.startDate ? new Date(voucher.startDate) : new Date(),
    endDate: voucher.endDate ? new Date(voucher.endDate) : new Date(Date.now() + (24 * 60 * 60 * 1000)),
    expiryDate: voucher.expiryDate ? new Date(voucher.expiryDate) : null
  }
  isEditing.value = true
  showDialog.value = true
}

const viewVoucher = (voucher: any) => {
  toast.add({ severity: 'info', summary: 'Info', detail: `Viewing voucher: ${voucher.voucherNumber}`, life: 3000 })
}

const changeStatus = (voucher: any) => {
  selectedVoucher.value = voucher
  statusForm.value.newStatus = voucher.status
  showStatusDialog.value = true
}

const updateVoucherStatus = async () => {
  submitted.value = true

  if (!statusForm.value.newStatus) {
    toast.add({ severity: 'error', summary: 'Validation Error', detail: 'New status is required', life: 3000 })
    return
  }

  updatingStatus.value = true

  try {
    await $fetch(`/api/admin/vouchers/${selectedVoucher.value.id}/status`, {
      method: 'PUT',
      body: {
        status: statusForm.value.newStatus,
        notes: statusForm.value.notes
      }
    })
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'Voucher status updated successfully', life: 3000 })
    
    closeStatusDialog()
    fetchVouchers() // Refresh the list
    fetchVoucherStats() // Refresh stats
  } catch (error: any) {
    console.error('Error updating voucher status:', error)
    
    if (error.data?.message) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.data.message, 
        life: 5000 
      })
    } else if (error.statusMessage) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.statusMessage, 
        life: 5000 
      })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to update voucher status. Please try again.', 
        life: 3000 
      })
    }
  } finally {
    updatingStatus.value = false
  }
}

const confirmDelete = (voucher: any) => {
  if (confirm(`Are you sure you want to delete voucher "${voucher.voucherNumber}"?`)) {
    deleteVoucher(voucher)
  }
}

const deleteVoucher = async (voucher: any) => {
  try {
    await $fetch(`/api/admin/vouchers/${voucher.id}`, {
      method: 'DELETE'
    } as any)
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'Voucher deleted successfully', life: 3000 })
    
    fetchVouchers() // Refresh the list
    fetchVoucherStats() // Refresh stats
  } catch (error: any) {
    console.error('Error deleting voucher:', error)
    
    if (error.data?.message) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.data.message, 
        life: 5000 
      })
    } else if (error.statusMessage) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.statusMessage, 
        life: 5000 
      })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to delete voucher. Please try again.', 
        life: 3000 
      })
    }
  }
}

const openBulkActions = () => {
  if (selectedVouchers.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select vouchers first', life: 3000 })
    return
  }
  toast.add({ severity: 'info', summary: 'Info', detail: `Bulk actions for ${selectedVouchers.value.length} vouchers`, life: 3000 })
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    locationId: null,
    batchId: null,
    dateRange: null
  }
}

const onPageChange = (event: any) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
}

// API functions
const fetchVouchers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.locationId) params.append('locationId', filters.value.locationId)
    if (filters.value.batchId) params.append('batchId', filters.value.batchId)

    const response: any = await $fetch(`/api/admin/vouchers?${params}`)
    vouchers.value = response.vouchers
    totalVouchers.value = response.pagination.total
  } catch (error: any) {
    console.error('Error fetching vouchers:', error)
    
    if (error.data?.message) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.data.message, 
        life: 5000 
      })
    } else if (error.statusMessage) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.statusMessage, 
        life: 5000 
      })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to fetch vouchers. Please try again.', 
        life: 3000 
      })
    }
  } finally {
    loading.value = false
  }
}

const fetchVoucherStats = async () => {
  try {
    const response: any = await $fetch('/api/admin/vouchers/stats')
    voucherStats.value = response
  } catch (error: any) {
    console.error('Error fetching voucher stats:', error)
    if (error.data?.message) {
      toast.add({ 
        severity: 'warn', 
        summary: 'Warning', 
        detail: `Failed to fetch stats: ${error.data.message}`, 
        life: 3000 
      })
    }
  }
}

const fetchLocations = async () => {
  try {
    const response: any = await $fetch('/api/admin/locations')
    locationOptions.value = response.locations || []
  } catch (error: any) {
    console.error('Error fetching locations:', error)
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to fetch locations. Please refresh the page.', 
      life: 5000 
    })
  }
}

const fetchBatches = async () => {
  try {
    const response: any = await $fetch('/api/admin/batches')
    batchOptions.value = [
      { id: null, name: 'No Batch' },
      ...(response.batches || [])
    ]
  } catch (error: any) {
    console.error('Error fetching batches:', error)
    toast.add({ 
      severity: 'warn', 
      summary: 'Warning', 
      detail: 'Failed to fetch batches. Some features may be limited.', 
      life: 3000 
    })
  }
}

// Watch for filter changes
watch([filters, currentPage], () => {
  fetchVouchers()
}, { deep: true })

// Watch for location changes to update voucher number preview
watch(() => voucherForm.value.locationId, (newLocationId) => {
  if (newLocationId && !isEditing.value) {
    voucherForm.value.voucherNumber = getVoucherNumberPreview()
  }
})

// Load data on mount
onMounted(() => {
  fetchVouchers()
  fetchVoucherStats()
  fetchLocations()
  fetchBatches()
})

// Meta tags
useHead({
  title: 'Vouchers - UFO Networks Admin',
  meta: [
    { name: 'description', content: 'Manage individual vouchers, status, and assignments in the UFO Networks system.' }
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

/* Status button styling */
:deep(.status-button) {
  color: #7c3aed !important;
  background: rgba(124, 58, 237, 0.1) !important;
}

:deep(.status-button:hover) {
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