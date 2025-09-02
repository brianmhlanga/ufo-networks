<template>
  <NuxtLayout name="admin">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Advertising Management</h1>
          <p class="text-gray-600">Manage ads, track performance, and monitor campaigns</p>
        </div>
        <Button 
          @click="openCreateDialog" 
          icon="add" 
          label="Create Ad" 
          class="bg-[#185ff9] hover:bg-[#185ff9]/90"
        />
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Ads</p>
                <p class="text-2xl font-bold">{{ stats.totalAds || 0 }}</p>
              </div>
              <span class="material-icons text-3xl text-blue-200">campaign</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Active Ads</p>
                <p class="text-2xl font-bold">{{ stats.activeAds || 0 }}</p>
              </div>
              <span class="material-icons text-3xl text-green-200">play_circle</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Total Impressions</p>
                <p class="text-2xl font-bold">{{ (stats.totalImpressions || 0).toLocaleString() }}</p>
              </div>
              <span class="material-icons text-3xl text-purple-200">visibility</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm font-medium">Click Rate</p>
                <p class="text-2xl font-bold">{{ (stats.clickThroughRate || 0).toFixed(2) }}%</p>
              </div>
              <span class="material-icons text-3xl text-orange-200">trending_up</span>
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
                placeholder="Search ads..." 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Advertiser</label>
              <Select 
                v-model="filters.advertiserId" 
                :options="advertiserOptions" 
                optionLabel="label" 
                optionValue="id"
                placeholder="All Advertisers" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Placement</label>
              <Select 
                v-model="filters.placementPage" 
                :options="placementOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All Placements" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select 
                v-model="filters.active" 
                :options="statusOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All Statuses" 
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

      <!-- Ads Table -->
      <Card>
        <template #content>
          <DataTable 
            :value="ads" 
            :loading="loading"
            paginator 
            :rows="pagination.limit"
            :totalRecords="pagination.total"
            :rowsPerPageOptions="[10, 20, 50]"
            @page="onPageChange"
            class="w-full"
          >
            <Column field="id" header="Ad ID" sortable style="width: 150px">
              <template #body="{ data }">
                <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ data.id }}</code>
              </template>
            </Column>
            
            <Column field="title" header="Title & Media" sortable style="width: 250px">
              <template #body="{ data }">
                <div>
                  <div class="font-medium">{{ data.title }}</div>
                  <div class="text-sm text-gray-500">{{ data.placementPage }}</div>
                  
                  <!-- Media preview -->
                  <div v-if="data.mediaUrl" class="mt-2">
                    <div v-if="isImageFile(data.mediaUrl)" class="w-16 h-12">
                      <img 
                        :src="`/api/uploads/${data.mediaUrl}`" 
                        alt="Media preview" 
                        class="w-full h-full object-cover rounded border"
                      />
                    </div>
                    <div v-else-if="data.mediaUrl.match(/\.(mp4|avi|mov|wmv|flv)$/i)" class="w-16 h-12 bg-gray-100 rounded border flex items-center justify-center">
                      <span class="material-icons text-gray-500">play_circle</span>
                    </div>
                    <div v-else-if="data.mediaUrl.endsWith('.pdf')" class="w-16 h-12 bg-gray-100 rounded border flex items-center justify-center">
                      <span class="material-icons text-red-500">picture_as_pdf</span>
                    </div>
                  </div>
                </div>
              </template>
            </Column>
            
            <Column field="advertiser.name" header="Advertiser" sortable style="width: 180px">
              <template #body="{ data }">
                <div v-if="data.advertiser">
                  <div class="font-medium">{{ data.advertiser.name }}</div>
                  <div class="text-sm text-gray-500">{{ data.advertiser.company || 'No Company' }}</div>
                </div>
                <div v-else class="text-gray-400">No Advertiser</div>
              </template>
            </Column>
            
            <Column field="locations" header="Locations" style="width: 150px">
              <template #body="{ data }">
                <div v-if="data.locations && data.locations.length > 0">
                  <div class="font-medium">{{ data.locations.length }} location(s)</div>
                  <div class="text-sm text-gray-500">
                    {{ data.locations.map(l => l.location.name).join(', ') }}
                  </div>
                </div>
                <div v-else class="text-gray-400">No Locations</div>
              </template>
            </Column>
            
            <Column field="impressions" header="Impressions" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="font-medium">{{ data.impressions.toLocaleString() }}</span>
              </template>
            </Column>
            
            <Column field="clicks" header="Clicks" sortable style="width: 100px">
              <template #body="{ data }">
                <span class="font-medium">{{ data.clicks.toLocaleString() }}</span>
              </template>
            </Column>
            
            <Column field="startsAt" header="Schedule" sortable style="width: 150px">
              <template #body="{ data }">
                <div class="text-sm">
                  <div class="font-medium">From: {{ formatDate(data.startsAt) }}</div>
                  <div v-if="data.endsAt" class="text-gray-500">
                    To: {{ formatDate(data.endsAt) }}
                  </div>
                </div>
              </template>
            </Column>
            
            <Column field="active" header="Status" sortable style="width: 100px">
              <template #body="{ data }">
                <Tag 
                  :value="data.active ? 'Active' : 'Inactive'"
                  :severity="data.active ? 'success' : 'danger'"
                />
              </template>
            </Column>
            
                         <Column header="Actions" style="width: 150px">
               <template #body="{ data }">
                 <div class="flex space-x-2">
                   <Button 
                     @click="viewAd(data)" 
                     size="small" 
                     text 
                     severity="info"
                     v-tooltip.top="'View Details'"
                     class="p-2"
                   >
                     <span class="material-icons text-blue-600">visibility</span>
                   </Button>
                   <Button 
                     @click="editAd(data)" 
                     size="small" 
                     text 
                     severity="warning"
                     v-tooltip.top="'Edit Ad'"
                     class="p-2"
                   >
                     <span class="material-icons text-orange-600">edit</span>
                   </Button>
                   <Button 
                     @click="confirmDeleteAd(data)" 
                     size="small" 
                     text 
                     severity="danger"
                     v-tooltip.top="'Delete Ad'"
                     class="p-2"
                   >
                     <span class="material-icons text-red-600">delete</span>
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
        :header="dialogMode === 'create' ? 'Create New Ad' : 'Edit Ad'"
        :style="{ width: '800px' }" 
        modal
      >
        <form @submit.prevent="saveAd" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <InputText 
                v-model="form.title" 
                placeholder="Ad title" 
                class="w-full"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Advertiser</label>
              <Select 
                v-model="form.advertiserId" 
                :options="advertiserOptions" 
                optionLabel="label" 
                optionValue="id"
                placeholder="Select Advertiser" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Placement Page *</label>
              <Select 
                v-model="form.placementPage" 
                :options="placementOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select Placement" 
                class="w-full"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select 
                v-model="form.active" 
                :options="[
                  { label: 'Active', value: true },
                  { label: 'Inactive', value: false }
                ]" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select Status" 
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <DatePicker 
                v-model="form.startsAt" 
                placeholder="Start Date" 
                class="w-full"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <DatePicker 
                v-model="form.endsAt" 
                placeholder="End Date (Optional)" 
                class="w-full"
              />
            </div>
          </div>
          
                    <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Media File</label>
            <div class="space-y-3">
              <!-- File input and upload button -->
              <div class="flex items-center space-x-3">
                <input 
                  type="file" 
                  ref="fileInput"
                  name="file"
                  @change="handleFileSelect"
                  accept="image/*,video/*,.pdf"
                  class="hidden"
                />
                <Button 
                  @click="triggerFileInput" 
                  icon="upload" 
                  label="Choose File" 
                  severity="secondary"
                  class="flex-shrink-0"
                />
                <span v-if="selectedFile" class="text-sm text-gray-600 font-medium">
                  {{ selectedFile.name }}
                </span>
              </div>
              
              <!-- Upload progress -->
              <div v-if="uploading" class="w-full">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                </div>
                <p class="text-sm text-gray-600 mt-1">Uploading... {{ uploadProgress }}%</p>
              </div>
              
              <!-- Current file display and preview -->
              <div v-if="form.mediaUrl" class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <span class="material-icons text-gray-500">attach_file</span>
                    <span class="text-sm text-gray-700">{{ form.mediaUrl }}</span>
                  </div>
                  <Button 
                    @click="removeMedia" 
                    icon="delete" 
                    size="small" 
                    text 
                    severity="danger"
                    v-tooltip.top="'Remove file'"
                  />
                </div>
                
                <!-- Media preview -->
                <div v-if="isImageFile(form.mediaUrl)" class="mt-2">
                  <img 
                    :src="`/api/uploads/${form.mediaUrl}`" 
                    alt="Media preview" 
                    class="max-w-xs max-h-32 object-cover rounded border shadow-sm"
                  />
                </div>
                <div v-else-if="form.mediaUrl.match(/\.(mp4|avi|mov|wmv|flv)$/i)" class="mt-2">
                  <div class="w-32 h-24 bg-gray-100 rounded border flex items-center justify-center">
                    <span class="material-icons text-gray-500 text-2xl">play_circle</span>
                  </div>
                </div>
                <div v-else-if="form.mediaUrl.endsWith('.pdf')" class="mt-2">
                  <div class="w-32 h-24 bg-gray-100 rounded border flex items-center justify-center">
                    <span class="material-icons text-red-500 text-2xl">picture_as_pdf</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
            <InputText 
              v-model="form.targetUrl" 
              placeholder="https://example.com" 
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">HTML Snippet</label>
            <Textarea 
              v-model="form.htmlSnippet" 
              placeholder="Custom HTML content..." 
              class="w-full"
              rows="4"
            />
          </div>
          
                     <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">Target Locations</label>
             <MultiSelect 
               v-model="form.locationIds" 
               :options="locationOptions" 
               optionLabel="label" 
               optionValue="id"
               placeholder="Select one or more locations..." 
               class="w-full"
               multiple
               :showClear="true"
               :filter="true"
               filterPlaceholder="Search locations..."
             />
             
             <!-- Selected locations display -->
             <div v-if="form.locationIds && form.locationIds.length > 0" class="mt-2">
               <p class="text-xs text-gray-500 mb-2">Selected locations:</p>
               <div class="flex flex-wrap gap-2">
                 <div 
                   v-for="locationId in form.locationIds" 
                   :key="locationId"
                   class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                 >
                   <span class="material-icons text-xs mr-1">location_on</span>
                   {{ locationOptions.find(opt => opt.id === locationId)?.label || 'Unknown Location' }}
                 </div>
               </div>
             </div>
           </div>
        </form>
        
        <template #footer>
          <div class="flex justify-end space-x-2">
            <Button 
              @click="showDialog = false" 
              label="Cancel" 
              text 
              severity="secondary"
            />
            <Button 
              @click="saveAd" 
              :label="dialogMode === 'create' ? 'Create Ad' : 'Update Ad'"
              :loading="saving"
              class="bg-[#185ff9] hover:bg-[#185ff9]/90"
            />
          </div>
        </template>
      </Dialog>

      <!-- View Dialog -->
      <Dialog 
        v-model:visible="showViewDialog" 
        header="Ad Details"
        :style="{ width: '700px' }" 
        modal
      >
        <div v-if="selectedAd" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Title</label>
              <p class="text-gray-900">{{ selectedAd.title }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <Tag 
                :value="selectedAd.active ? 'Active' : 'Inactive'"
                :severity="selectedAd.active ? 'success' : 'danger'"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Placement</label>
              <p class="text-gray-900">{{ selectedAd.placementPage }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Impressions</label>
              <p class="text-gray-900">{{ selectedAd.impressions.toLocaleString() }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Clicks</label>
              <p class="text-gray-900">{{ selectedAd.clicks.toLocaleString() }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Click Rate</label>
              <p class="text-gray-900">
                {{ selectedAd.impressions > 0 ? ((selectedAd.clicks / selectedAd.impressions) * 100).toFixed(2) : 0 }}%
              </p>
            </div>
          </div>
          
          <div v-if="selectedAd.advertiser">
            <label class="block text-sm font-medium text-gray-700">Advertiser</label>
            <div class="bg-gray-50 p-3 rounded">
              <p class="font-medium">{{ selectedAd.advertiser.name }}</p>
              <p v-if="selectedAd.advertiser.company" class="text-sm text-gray-600">
                {{ selectedAd.advertiser.company }}
              </p>
              <p v-if="selectedAd.advertiser.email" class="text-sm text-gray-600">
                {{ selectedAd.advertiser.email }}
              </p>
            </div>
          </div>
          
          <div v-if="selectedAd.locations && selectedAd.locations.length > 0">
            <label class="block text-sm font-medium text-gray-700">Target Locations</label>
            <div class="bg-gray-50 p-3 rounded">
              <div v-for="location in selectedAd.locations" :key="location.location.id" class="mb-2">
                <p class="font-medium">{{ location.location.name }}</p>
                <p class="text-sm text-gray-600">
                  {{ location.location.town }}, {{ location.location.area }}, {{ location.location.province }}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Schedule</label>
            <div class="bg-gray-50 p-3 rounded">
              <p><strong>Start:</strong> {{ formatDate(selectedAd.startsAt) }}</p>
              <p v-if="selectedAd.endsAt"><strong>End:</strong> {{ formatDate(selectedAd.endsAt) }}</p>
            </div>
          </div>
          
          <div v-if="selectedAd.mediaUrl">
            <label class="block text-sm font-medium text-gray-700">Media File</label>
            <div class="space-y-2">
              <p class="text-blue-600 break-all">{{ selectedAd.mediaUrl }}</p>
              
              <!-- Media preview -->
              <div v-if="isImageFile(selectedAd.mediaUrl)" class="mt-2">
                <img 
                  :src="`/api/uploads/${selectedAd.mediaUrl}`" 
                  alt="Media preview" 
                  class="max-w-xs max-h-32 object-cover rounded border"
                />
              </div>
              
              <!-- Video preview -->
              <div v-else-if="selectedAd.mediaUrl.match(/\.(mp4|avi|mov|wmv|flv)$/i)" class="mt-2">
                <video 
                  :src="`/api/uploads/${selectedAd.mediaUrl}`" 
                  controls 
                  class="max-w-xs max-h-32 rounded border"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <!-- PDF preview -->
              <div v-else-if="selectedAd.mediaUrl.endsWith('.pdf')" class="mt-2">
                <div class="bg-gray-100 p-3 rounded border">
                  <span class="material-icons text-2xl text-red-500">picture_as_pdf</span>
                  <p class="text-sm text-gray-600 mt-1">PDF Document</p>
                  <a 
                    :href="`/api/uploads/${selectedAd.mediaUrl}`" 
                    target="_blank" 
                    class="text-blue-600 hover:underline text-sm"
                  >
                    View PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="selectedAd.targetUrl">
            <label class="block text-sm font-medium text-gray-700">Target URL</label>
            <p class="text-blue-600 break-all">{{ selectedAd.targetUrl }}</p>
          </div>
          
          <div v-if="selectedAd.htmlSnippet">
            <label class="block text-sm font-medium text-gray-700">HTML Snippet</label>
            <div class="bg-gray-50 p-3 rounded">
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ selectedAd.htmlSnippet }}</pre>
            </div>
          </div>
        </div>
        
        <template #footer>
          <Button 
            @click="showViewDialog = false" 
            label="Close" 
            class="bg-[#185ff9] hover:bg-[#185ff9]/90"
          />
        </template>
      </Dialog>

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
const saving = ref(false)
const ads = ref([])
const stats: any = ref({})
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

// Filters
const filters: any = ref({
  search: '',
  advertiserId: '',
  placementPage: '',
  active: '',
  dateFrom: null,
  dateTo: null
})

// Options
const advertiserOptions = ref([])
const locationOptions = ref([])
const placementOptions = ref([
  { label: 'Success Page', value: 'SUCCESS' }
])

const statusOptions = ref([
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' }
])

// Dialog state
const showDialog = ref(false)
const showViewDialog = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const selectedAd: any = ref(null)

// Form data
const form = ref({
  advertiserId: '',
  title: '',
  mediaUrl: '',
  targetUrl: '',
  htmlSnippet: '',
  placementPage: '',
  startsAt: null,
  endsAt: null,
  active: true,
  locationIds: []
})

// File upload state
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)

// Lifecycle
onMounted(() => {
  fetchAds()
  fetchAdStats()
  fetchAdvertisers()
  fetchLocations()
})

// Methods
const fetchAds = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.advertiserId) params.append('advertiserId', filters.value.advertiserId)
    if (filters.value.placementPage) params.append('placementPage', filters.value.placementPage)
    if (filters.value.active !== '') params.append('active', filters.value.active)
    if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
    if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
    
    const response: any = await $fetch(`/api/admin/ads?${params}`)
    ads.value = response.ads
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error fetching ads:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch ads',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const fetchAdStats = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
    if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
    
    const response = await $fetch(`/api/admin/ads/stats?${params}`)
    stats.value = response.stats
  } catch (error) {
    console.error('Error fetching ad stats:', error)
  }
}

const fetchAdvertisers = async () => {
  try {
    const response: any = await $fetch('/api/admin/advertisers')
    advertiserOptions.value = response.advertisers.map((advertiser: any) => ({
      id: advertiser.id,
      label: `${advertiser.name}${advertiser.company ? ` (${advertiser.company})` : ''}`
    }))
  } catch (error) {
    console.error('Error fetching advertisers:', error)
  }
}

const fetchLocations = async () => {
  try {
    const response: any = await $fetch('/api/admin/locations')
    locationOptions.value = response.locations.map((location: any) => ({
      id: location.id,
      label: `${location.name} (${location.code})`
    }))
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}

const openCreateDialog = () => {
  dialogMode.value = 'create'
  resetForm()
  showDialog.value = true
}

const editAd = (ad: any) => {
  dialogMode.value = 'edit'
  selectedAd.value = ad
  form.value = {
    advertiserId: ad.advertiserId || '',
    title: ad.title,
    mediaUrl: ad.mediaUrl || '',
    targetUrl: ad.targetUrl || '',
    htmlSnippet: ad.htmlSnippet || '',
    placementPage: ad.placementPage,
    startsAt: new Date(ad.startsAt),
    endsAt: ad.endsAt ? new Date(ad.endsAt) : null,
    active: ad.active,
    locationIds: ad.locations.map((l: any) => l.location.id)
  }
  showDialog.value = true
}

const viewAd = (ad: any) => {
  selectedAd.value = ad
  showViewDialog.value = true
}

const confirmDeleteAd = (ad: any) => {
  $confirm.require({
    message: `Are you sure you want to delete ad "${ad.title}"?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteAd(ad.id)
  })
}

const deleteAd = async (adId: any) => {
  try {
    await $fetch(`/api/admin/ads/${adId}`, {
      method: 'DELETE'
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Ad deleted successfully',
      life: 3000
    })
    
    fetchAds()
    fetchAdStats()
  } catch (error) {
    console.error('Error deleting ad:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete ad',
      life: 3000
    })
  }
}

const saveAd = async () => {
  try {
    saving.value = true
    
    const payload = {
      ...form.value,
      startsAt: form.value.startsAt?.toISOString(),
      endsAt: form.value.endsAt?.toISOString()
    }
    
    if (dialogMode.value === 'create') {
      await $fetch('/api/admin/ads', {
        method: 'POST',
        body: payload
      })
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Ad created successfully',
        life: 3000
      })
    } else {
      await $fetch(`/api/admin/ads/${selectedAd.value.id}`, {
        method: 'PUT',
        body: payload
      })
      
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Ad updated successfully',
        life: 3000
      })
    }
    
    showDialog.value = false
    fetchAds()
    fetchAdStats()
  } catch (error) {
    console.error('Error saving ad:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save ad',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.value = {
    advertiserId: '',
    title: '',
    mediaUrl: '',
    targetUrl: '',
    htmlSnippet: '',
    placementPage: '',
    startsAt: null,
    endsAt: null,
    active: true,
    locationIds: []
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    advertiserId: '',
    placementPage: '',
    active: '',
    dateFrom: null,
    dateTo: null
  }
  pagination.value.page = 1
  fetchAds()
  fetchAdStats()
}

const onPageChange = (event: any) => {
  pagination.value.page = event.page + 1
  pagination.value.limit = event.rows
  fetchAds()
}

const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// File handling methods
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    selectedFile.value = file
    uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  try {
    uploading.value = true
    uploadProgress.value = 0
    
    // Create FormData
    const formData = new FormData()
    formData.append('file', file, file.name)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)
    
    // Upload file
    const response = await $fetch('/api/admin/ads/upload', {
      method: 'POST',
      body: formData
    })
    
    clearInterval(progressInterval)
    uploadProgress.value = 100
    
    // Update form with filename
    form.value.mediaUrl = response.filename
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'File uploaded successfully',
      life: 3000
    })
    
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    selectedFile.value = null
    
    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 1000)
    
  } catch (error) {
    console.error('Error uploading file:', error)
    uploading.value = false
    uploadProgress.value = 0
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to upload file',
      life: 3000
    })
  }
}

const isImageFile = (filename: string) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return imageExtensions.includes(extension)
}

const removeMedia = () => {
  form.value.mediaUrl = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}



// Watch filters for auto-refresh
watch(filters, () => {
  pagination.value.page = 1
  fetchAds()
  fetchAdStats()
}, { deep: true })
</script>

<style scoped>
/* Custom styling for ads cards */
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
