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
          <!-- <Button
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
          /> -->
          <Button
            label="Upload PDF Batch"
            icon="upload_file"
            @click="openUploadDialog"
            class="custom-primary-button"
            severity="success"
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
      
                    <!-- Create Batch Dialog -->
       <Dialog 
         v-model:visible="showCreateDialog" 
         modal 
         header="Create New Batch" 
         :style="{ width: '50rem' }"
         :closable="false"
       >
         <div class="space-y-4">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Batch Name *</label>
               <InputText 
                 v-model="batchForm.name" 
                 placeholder="Enter batch name" 
                 class="w-full"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Location *</label>
               <Dropdown 
                 v-model="batchForm.locationId" 
                 :options="locationOptions" 
                 optionLabel="name" 
                 optionValue="id"
                 placeholder="Select location" 
                 :loading="loadingLocations"
                 :disabled="locationOptions.length === 0"
                 class="w-full"
               >
                 <template #option="{ option }">
                   <div class="flex flex-col">
                     <span class="font-medium">{{ option.name }}</span>
                     <span class="text-sm text-gray-500">{{ option.code }} - {{ option.town }}</span>
                   </div>
                 </template>
                 <template #empty>
                   <div class="text-center py-2 text-gray-500">
                     {{ loadingLocations ? 'Loading locations...' : 'No locations available' }}
                   </div>
                 </template>
               </Dropdown>
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Retail Price *</label>
               <InputNumber 
                 v-model="batchForm.retailPrice" 
                 placeholder="0.00" 
                 :minFractionDigits="2"
                 :maxFractionDigits="2"
                 class="w-full"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Currency *</label>
               <Dropdown 
                 v-model="batchForm.currency" 
                 :options="[
                   { label: 'USD', value: 'USD' },
                   { label: 'ZWL', value: 'ZWL' },
                   { label: 'EUR', value: 'EUR' }
                 ]" 
                 optionLabel="label" 
                 optionValue="value"
                 placeholder="Select currency" 
                 class="w-full"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Hours *</label>
               <InputNumber 
                 v-model="batchForm.hours" 
                 placeholder="1" 
                 :min="1"
                 class="w-full"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Number of Users *</label>
               <InputNumber 
                 v-model="batchForm.numberOfUsers" 
                 placeholder="1" 
                 :min="1"
                 class="w-full"
               />
             </div>
             
                          <div>
                <label class="block text-sm font-medium text-[#2d3040] mb-2">Validity Period (Days) *</label>
                <InputNumber 
                  v-model="batchForm.validityDays" 
                  placeholder="60" 
                  :min="1"
                  :max="maxValidationPeriod"
                  class="w-full"
                  @input="calculateDates"
                />
                <small class="text-[#2d3040]/60">Maximum: {{ maxValidationPeriod }} days</small>
              </div>
            
            <div>
              <label class="block text-sm font-medium text-[#2d3040] mb-2">Start Date *</label>
              <Calendar 
                v-model="batchForm.startDate" 
                placeholder="Select start date" 
                :minDate="new Date()"
                class="w-full"
                @date-select="onStartDateChange"
              />
            </div>
            
                         <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">End Date *</label>
               <Calendar 
                 v-model="batchForm.endDate" 
                 placeholder="Select end date" 
                 :minDate="batchForm.startDate || new Date()"
                 :maxDate="(() => {
                   if (batchForm.startDate) {
                     const startDate = batchForm.startDate
                     const maxEndDate = new Date(startDate)
                     maxEndDate.setDate(startDate.getDate() + maxValidationPeriod - 1)
                     return maxEndDate
                   }
                   const maxDate = new Date()
                   maxDate.setDate(maxDate.getDate() + maxValidationPeriod - 1)
                   return maxDate
                 })()"
                 class="w-full"
                 @date-select="onEndDateChange"
               />
             </div>
          </div>
          
                     <div>
             <label class="block text-sm font-medium text-[#2d3040] mb-2">Notes</label>
             <Textarea 
               v-model="batchForm.notes" 
               placeholder="Enter any additional notes" 
               rows="3"
               class="w-full"
             />
           </div>
           
           <div class="text-sm text-[#2d3040]/60">
             <p>Date constraints:</p>
             <ul class="list-disc list-inside mt-1 space-y-1">
               <li>Start date: Today to {{ maxValidationPeriod }} days from today</li>
               <li>End date: After start date, up to {{ maxValidationPeriod }} days from start date</li>
             </ul>
           </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end space-x-2">
            <Button 
              label="Cancel" 
              severity="secondary" 
              @click="closeCreateDialog"
              :disabled="creatingBatch"
            />
            <Button 
              label="Create Batch" 
              @click="createBatch"
              :loading="creatingBatch"
              class="custom-primary-button"
            />
          </div>
        </template>
      </Dialog>
      
                  <!-- Upload Batch with PDF Dialog -->
      <Dialog 
        v-model:visible="showUploadDialog" 
        modal 
        header="Upload Batch with PDF" 
        :style="{ width: '60rem' }"
        :closable="false"
      >
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Batch Name *</label>
               <InputText 
                 v-model="batchForm.name" 
                 placeholder="Enter batch name" 
                 class="w-full"
               />
             </div>
             
                         <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Location *</label>
               <Dropdown 
                 v-model="batchForm.locationId" 
                 :options="locationOptions" 
                 optionLabel="name" 
                 optionValue="id"
                 placeholder="Select location" 
                 :loading="loadingLocations"
                 :disabled="locationOptions.length === 0"
                 class="w-full"
               >
                 <template #option="{ option }">
                   <div class="flex flex-col">
                     <span class="font-medium">{{ option.name }}</span>
                     <span class="text-sm text-gray-500">{{ option.code }} - {{ option.town }}</span>
                   </div>
                 </template>
                 <template #empty>
                   <div class="text-center py-2 text-gray-500">
                     {{ loadingLocations ? 'Loading locations...' : 'No locations available' }}
                   </div>
                 </template>
               </Dropdown>
               <small class="text-[#2d3040]/60">
                 {{ loadingLocations ? 'Loading locations...' : `${locationOptions.length} location(s) available` }}
               </small>
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Retail Price *</label>
               <InputNumber 
                 v-model="batchForm.retailPrice" 
                 placeholder="0.00" 
                 :minFractionDigits="2"
                 :maxFractionDigits="2"
                 class="w-full"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Currency *</label>
               <Dropdown 
                 v-model="batchForm.currency" 
                 :options="[
                   { label: 'USD', value: 'USD' },
                   { label: 'ZWL', value: 'ZWL' },
                   { label: 'EUR', value: 'EUR' }
                 ]" 
                 optionLabel="label" 
                 optionValue="value"
                 placeholder="Select currency" 
                 class="w-full"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Hours *</label>
               <InputNumber 
                 v-model="batchForm.hours" 
                 placeholder="1" 
                 :min="1"
                 class="w-full"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Number of Users *</label>
               <InputNumber 
                 v-model="batchForm.numberOfUsers" 
                 placeholder="1" 
                 :min="1"
                 class="w-full"
               />
             </div>
             
                           <div>
                <label class="block text-sm font-medium text-[#2d3040] mb-2">Validity Period (Days) *</label>
                <InputNumber 
                  v-model="batchForm.validityDays" 
                  placeholder="60" 
                  :min="1"
                  :max="maxValidationPeriod"
                  class="w-full"
                  @input="calculateDates"
                />
                <small class="text-[#2d3040]/60">Maximum: {{ maxValidationPeriod }} days</small>
              </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">Start Date *</label>
               <Calendar 
                 v-model="batchForm.startDate" 
                 placeholder="Select start date" 
                 :minDate="new Date()"
                 class="w-full"
                 @date-select="onStartDateChange"
               />
             </div>
             
             <div>
               <label class="block text-sm font-medium text-[#2d3040] mb-2">End Date *</label>
               <Calendar 
                 v-model="batchForm.endDate" 
                 placeholder="Select end date" 
                 :minDate="batchForm.startDate || new Date()"
                 :maxDate="(() => {
                   if (batchForm.startDate) {
                     const startDate = batchForm.startDate
                     const maxEndDate = new Date(startDate)
                     maxEndDate.setDate(startDate.getDate() + maxValidationPeriod - 1)
                     return maxEndDate
                   }
                   const maxDate = new Date()
                   maxDate.setDate(maxDate.getDate() + maxValidationPeriod - 1)
                   return maxDate
                 })()"
                 class="w-full"
                 @date-select="onEndDateChange"
               />
             </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Notes</label>
            <Textarea 
              v-model="batchForm.notes" 
              placeholder="Enter any additional notes" 
              rows="3"
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[#2d3040] mb-2">PDF File *</label>
            <FileUpload 
              mode="basic" 
              :auto="true" 
              accept="application/pdf"
              :maxFileSize="10000000"
              @select="handleFileUpload"
              chooseLabel="Choose PDF"
              class="w-full"
            />
            <small class="text-[#2d3040]/60">Upload a PDF containing batch numbers (max 10MB). Batch numbers will be extracted automatically.</small>
          </div>
          
          <div v-if="extractedBatchNumbers.length > 0" class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-medium text-green-800 mb-2">✅ Extracted Batch Numbers</h4>
            <div class="grid grid-cols-4 gap-4">
              <div 
                v-for="batchNumber in extractedBatchNumbers" 
                :key="batchNumber"
                class="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-mono"
              >
                {{ batchNumber }}
              </div>
            </div>
            <p class="text-sm text-green-600 mt-2">
              Found {{ extractedBatchNumbers.length }} valid batch numbers. You can now upload the batch.
            </p>
          </div>
          
          <div v-else-if="pdfFile && extractingPDF" class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-medium text-yellow-800 mb-2">⏳ Processing PDF</h4>
            <p class="text-sm text-yellow-600">
              PDF selected. Please wait for batch numbers to be extracted...
            </p>
          </div>
          
          <div v-else-if="pdfFile && !extractingPDF && extractedBatchNumbers.length === 0" class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-medium text-red-800 mb-2">❌ No Batch Numbers Found</h4>
            <p class="text-sm text-red-600">
              No valid batch numbers were found in the PDF. Please try a different file or check the content.
            </p>
          </div>
          
          <div class="text-sm text-[#2d3040]/60">
            <p>Date constraints:</p>
            <ul class="list-disc list-inside mt-1 space-y-1">
              <li>Start date: Today to {{ maxValidationPeriod }} days from today</li>
              <li>End date: After start date, up to {{ maxValidationPeriod }} days from start date</li>
            </ul>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end space-x-2">
            <Button 
              label="Cancel" 
              severity="error"
              @click="closeUploadDialog"
              :disabled="uploadingBatch"
            />
            <Button 
              label="Upload Batch" 
              @click="uploadBatchWithPDF"
              :loading="uploadingBatch"
              class="custom-primary-button"
            />
          </div>
        </template>
      </Dialog>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'
import { extractBatchNumbers, validateBatchNumbers } from '~/utils/pdf'

// Toast instance
const toast = useToast()

// Reactive data
const loading = ref(false)
const batches = ref<any[]>([])
const totalBatches = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Dialog states
const showCreateDialog = ref(false)
const showUploadDialog = ref(false)
const creatingBatch = ref(false)
const uploadingBatch = ref(false)

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
const locationOptions = ref<any[]>([])
const statusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
])

// Batch form data
const batchForm = ref({
  name: '',
  locationId: '',
  retailPrice: '',
  currency: 'USD',
  hours: 1,
  numberOfUsers: 1,
  validityDays: 60,
  startDate: null as Date | null,
  endDate: null as Date | null,
  notes: ''
})

// PDF upload data
const pdfFile = ref<File | null>(null)
const extractedBatchNumbers = ref<string[]>([])
const maxValidationPeriod = ref(60)
const extractingPDF = ref(false)
const loadingLocations = ref(false)

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

const resetBatchForm = () => {
  batchForm.value = {
    name: '',
    locationId: '',
    retailPrice: '',
    currency: 'USD',
    hours: 1,
    numberOfUsers: 1,
    validityDays: 60,
    startDate: null,
    endDate: null,
    notes: ''
  }
  pdfFile.value = null
  extractedBatchNumbers.value = []
  extractingPDF.value = false
}

const calculateDates = () => {
  console.log('calculateDates called with validityDays:', batchForm.value.validityDays)
  
  if (batchForm.value.validityDays && batchForm.value.validityDays > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Set start date to today
    batchForm.value.startDate = today
    
    // Calculate end date based on validity period
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + batchForm.value.validityDays - 1)
    batchForm.value.endDate = endDate
    
    console.log('Calculated dates:', {
      validityDays: batchForm.value.validityDays,
      startDate: batchForm.value.startDate,
      endDate: batchForm.value.endDate
    })
  }
}

const onStartDateChange = () => {
  if (batchForm.value.startDate && batchForm.value.validityDays) {
    const startDate = new Date(batchForm.value.startDate)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + batchForm.value.validityDays - 1)
    batchForm.value.endDate = endDate
  }
}

const onEndDateChange = () => {
  if (batchForm.value.startDate && batchForm.value.endDate) {
    const startDate = new Date(batchForm.value.startDate)
    const endDate = new Date(batchForm.value.endDate)
    const diffTime = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    batchForm.value.validityDays = diffDays
  }
}

const openUploadDialog = () => {
  console.log('Opening upload dialog')
  showUploadDialog.value = true
  resetBatchForm()
  // Set default validity days to 60
  batchForm.value.validityDays = 60
  // Auto-calculate dates when dialog opens
  nextTick(() => {
    console.log('Dialog opened, calculating dates...')
    calculateDates()
  })
}

const closeCreateDialog = () => {
  showCreateDialog.value = false
  resetBatchForm()
}

const closeUploadDialog = () => {
  showUploadDialog.value = false
  resetBatchForm()
}

const handleFileUpload = async (event: any) => {
  console.log('File upload event:', event)
  
  // PrimeVue FileUpload component event
  if (event.files && event.files.length > 0) {
    const file = event.files[0]
    pdfFile.value = file
    extractingPDF.value = true
    extractedBatchNumbers.value = []
    
    try {
      // Extract batch numbers from PDF
      const { extractBatchNumbers } = await import('~/utils/pdf')
      const batchNumbers = await extractBatchNumbers(file)
      extractedBatchNumbers.value = batchNumbers
      
      if (batchNumbers.length > 0) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: `Extracted ${batchNumbers.length} batch numbers from PDF`,
          life: 3000
        })
      } else {
        toast.add({
          severity: 'warning',
          summary: 'Warning',
          detail: 'No batch numbers found in PDF. Please check the file content.',
          life: 3000
        })
      }
    } catch (error) {
      console.error('Error extracting PDF:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to extract batch numbers from PDF. Please try again.',
        life: 3000
      })
      // Clear the file and extracted numbers on error
      pdfFile.value = null
      extractedBatchNumbers.value = []
    } finally {
      extractingPDF.value = false
    }
  }
}

const createBatch = async () => {
  try {
    console.log('Creating batch with form data:', batchForm.value)
    creatingBatch.value = true
    
    // Convert dates to ISO strings for API
    const requestBody = {
      ...batchForm.value,
      startDate: batchForm.value.startDate?.toISOString(),
      endDate: batchForm.value.endDate?.toISOString()
    }
    
    console.log('Request body being sent:', requestBody)
    
    const response = await $fetch('/api/admin/batches', {
      method: 'POST',
      body: requestBody
    })
    
         if (response.success) {
       toast.add({
         severity: 'success',
         summary: 'Success',
         detail: 'Batch created successfully',
         life: 3000
       })
       
       closeCreateDialog()
       // Refresh the batches list and wait for it to complete
       await fetchBatches()
     }
  } catch (error: any) {
    console.error('Error creating batch:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.data?.message || 'Failed to create batch',
      life: 3000
    })
  } finally {
    creatingBatch.value = false
  }
}

const uploadBatchWithPDF = async () => {
  try {
    console.log('Uploading batch with form data:', batchForm.value)
    
    if (!pdfFile.value) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a PDF file',
        life: 3000
      })
      return
    }
    
    if (extractedBatchNumbers.value.length === 0) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please extract batch numbers from PDF first',
        life: 3000
      })
      return
    }
    
    uploadingBatch.value = true
    
    const formData = new FormData()
    formData.append('pdfFile', pdfFile.value)
    
    // Add form fields
    Object.entries(batchForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'startDate' || key === 'endDate') {
          formData.append(key, value.toISOString())
        } else {
          formData.append(key, value.toString())
        }
      }
    })
    
    // Add extracted batch numbers
    formData.append('extractedBatchNumbers', JSON.stringify(extractedBatchNumbers.value))
    
    console.log('Form data being sent:', Object.fromEntries(formData.entries()))
    
    const response = await $fetch('/api/admin/batches/upload', {
      method: 'POST',
      body: formData
    })
    
         if (response.success) {
       toast.add({
         severity: 'success',
         summary: 'Success',
         detail: `Batch uploaded successfully with ${response.extractedData.totalFound} batch numbers`,
         life: 3000
       })
       
       closeUploadDialog()
       // Refresh the batches list and wait for it to complete
       await fetchBatches()
     }
  } catch (error: any) {
    console.error('Error uploading batch:', error)
    
    // Handle different types of errors
    let errorMessage = 'Failed to upload batch'
    
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.statusMessage) {
      errorMessage = error.statusMessage
    } else if (error.message) {
      errorMessage = error.message
    }
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 5000
    })
  } finally {
    uploadingBatch.value = false
  }
}

const fetchMaxValidationPeriod = async () => {
  try {
    const response = await $fetch('/api/admin/config/max-validation-period')
    if (response.success) {
      maxValidationPeriod.value = response.maxValidationPeriod
    }
  } catch (error) {
    console.error('Error fetching max validation period:', error)
  }
}

const fetchLocations = async () => {
  loadingLocations.value = true
  try {
    const response = await $fetch('/api/admin/locations/all')
    if (response.success) {
      locationOptions.value = response.locations
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch locations',
      life: 3000
    })
  } finally {
    loadingLocations.value = false
  }
}

const fetchBatches = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/admin/batches')
    if (response.success) {
      batches.value = response.batches
      totalBatches.value = response.total
      
      // Update batch stats
      batchStats.value = {
        totalBatches: response.total,
        activeBatches: batches.value.filter(b => b.active).length,
        totalVouchers: batches.value.reduce((sum, b) => sum + (b._count?.vouchers || 0), 0),
        availableVouchers: batches.value.reduce((sum, b) => sum + getAvailableVouchers(b), 0)
      }
    }
  } catch (error) {
    console.error('Error fetching batches:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch batches',
      life: 3000
    })
  } finally {
    loading.value = false
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
  showCreateDialog.value = true
  resetBatchForm()
  // Set default validity days to 60
  batchForm.value.validityDays = 60
  // Auto-calculate dates when dialog opens
  nextTick(() => {
    calculateDates()
  })
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

// Initialize data on mount
onMounted(() => {
  fetchMaxValidationPeriod()
  fetchLocations()
  fetchBatches()
})

// Watch for changes in validityDays to auto-calculate dates
watch(() => batchForm.value.validityDays, (newValidityDays) => {
  if (newValidityDays && newValidityDays > 0) {
    console.log('validityDays changed to:', newValidityDays)
    calculateDates()
  }
}, { immediate: true })

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
