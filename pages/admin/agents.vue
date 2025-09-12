<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#2d3040]">Agent Management</h1>
        <p class="text-[#2d3040]/60 mt-1">Manage agents, view performance, and handle blacklisting</p>
      </div>
      <div class="flex items-center space-x-3 mt-4 sm:mt-0">
        <Button
          label="Add Agent"
          icon="add"
          @click="openCreateDialog"
          class="custom-primary-button"
        />
        <Button
          label="Export"
          icon="download"
          severity="secondary"
          @click="exportAgents"
        />
      </div>
    </div>

    <!-- Agent Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Agents -->
      <Card class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60">Total Agents</p>
              <p class="text-2xl font-bold text-[#2d3040]">{{ agentStats.totalAgents }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="material-icons text-blue-600 text-xl">people</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Agents -->
      <Card class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60">Active Agents</p>
              <p class="text-2xl font-bold text-[#2d3040]">{{ agentStats.activeAgents }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="material-icons text-green-600 text-xl">check_circle</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Blacklisted Agents -->
      <Card class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60">Blacklisted</p>
              <p class="text-2xl font-bold text-[#2d3040]">{{ agentStats.blacklistedAgents }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span class="material-icons text-red-600 text-xl">block</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Sales -->
      <Card class="stats-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60">Total Sales</p>
              <p class="text-2xl font-bold text-[#2d3040]">${{ agentStats.totalSales.toLocaleString() }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span class="material-icons text-purple-600 text-xl">attach_money</span>
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
              placeholder="Search by name, email, phone..."
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Status</label>
            <Dropdown
              v-model="filters.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Status"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Performance</label>
            <Dropdown
              v-model="filters.performance"
              :options="performanceOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Performance"
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

    <!-- Agents Table -->
    <Card>
      <template #content>
        <DataTable
          :value="agents"
          :loading="loading"
          :paginator="true"
          :rows="pageSize"
          :totalRecords="totalAgents"
          :lazy="true"
          :rowsPerPageOptions="[10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} agents"
          @page="onPageChange"
          dataKey="id"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
          class="p-datatable-sm"
        >
          <Column field="name" header="Agent" sortable>
            <template #body="{ data }">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-full flex items-center justify-center">
                  <span class="material-icons text-white text-sm">person</span>
                </div>
                <div>
                  <div class="font-medium text-[#2d3040]">{{ data.name || 'N/A' }}</div>
                  <div class="text-sm text-[#2d3040]/60">{{ data.email }}</div>
                  <div class="text-xs text-[#2d3040]/40">{{ data.phone || 'No phone' }}</div>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="agentProfile.displayName" header="Display Name" sortable>
            <template #body="{ data }">
              <span class="text-[#2d3040] font-medium">{{ data.agentProfile?.displayName || 'N/A' }}</span>
            </template>
          </Column>

          <Column field="agentProfile.location.name" header="Location" sortable>
            <template #body="{ data }">
              <div v-if="data.agentProfile?.location" class="flex items-center space-x-2">
                <span class="material-icons text-gray-400 text-sm">location_on</span>
                <div>
                  <div class="text-[#2d3040] font-medium">{{ data.agentProfile.location.name }}</div>
                  <div class="text-xs text-[#2d3040]/60">{{ data.agentProfile.location.town }}, {{ data.agentProfile.location.province }}</div>
                </div>
              </div>
              <span v-else class="text-[#2d3040]/40 text-sm">No location assigned</span>
            </template>
          </Column>
          
          <Column field="agentProfile.defaultDiscountPct" header="Discount" sortable>
            <template #body="{ data }">
              <Tag
                :value="`${data.agentProfile?.defaultDiscountPct || 0}%`"
                :severity="getDiscountSeverity(data.agentProfile?.defaultDiscountPct)"
              />
            </template>
          </Column>
          
          <Column field="agentStats.totalSales" header="Total Sales" sortable>
            <template #body="{ data }">
              <span class="text-[#2d3040] font-medium">${{ (data.agentStats?.totalSales || 0).toLocaleString() }}</span>
            </template>
          </Column>
          
          <Column field="agentStats.totalVouchers" header="Vouchers Sold" sortable>
            <template #body="{ data }">
              <span class="text-[#2d3040]">{{ data.agentStats?.totalVouchers || 0 }}</span>
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
          
          <Column header="Actions" :exportable="false" style="min-width: 10rem">
            <template #body="{ data }">
              <div class="flex items-center space-x-2">
                <Button
                  text
                  size="small"
                  @click="viewAgent(data)"
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
                  @click="editAgent(data)"
                  v-tooltip.top="'Edit Agent'"
                  class="action-button edit-button"
                >
                  <template #icon>
                    <span class="material-icons">edit</span>
                  </template>
                </Button>
                <Button
                  v-if="data.status !== 'BLACKLISTED'"
                  text
                  size="small"
                  @click="blacklistAgent(data)"
                  v-tooltip.top="'Blacklist Agent'"
                  class="action-button blacklist-button"
                >
                  <template #icon>
                    <span class="material-icons">block</span>
                  </template>
                </Button>
                <Button
                  v-else
                  text
                  size="small"
                  @click="unblacklistAgent(data)"
                  v-tooltip.top="'Remove from Blacklist'"
                  class="action-button unblacklist-button"
                >
                  <template #icon>
                    <span class="material-icons">check_circle</span>
                  </template>
                </Button>
                <Button
                  text
                  size="small"
                  severity="danger"
                  @click="confirmDelete(data)"
                  v-tooltip.top="'Delete Agent'"
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
      :header="isEditing ? 'Edit Agent' : 'Create New Agent'"
      class="p-fluid w-full max-w-4xl"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-[#2d3040] mb-2">Full Name *</label>
          <InputText
            id="name"
            v-model="agentForm.name"
            placeholder="Enter full name"
            :class="{ 'p-invalid': submitted && !agentForm.name }"
          />
          <small v-if="submitted && !agentForm.name" class="p-error">Name is required.</small>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-[#2d3040] mb-2">Email *</label>
          <InputText
            id="email"
            v-model="agentForm.email"
            type="email"
            placeholder="Enter email address"
            :class="{ 'p-invalid': submitted && !agentForm.email }"
          />
          <small v-if="submitted && !agentForm.email" class="p-error">Email is required.</small>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-[#2d3040] mb-2">Phone Number *</label>
          <InputText
            id="phone"
            v-model="agentForm.phone"
            placeholder="Enter phone number"
            :class="{ 'p-invalid': submitted && !agentForm.phone }"
          />
          <small v-if="submitted && !agentForm.phone" class="p-error">Phone is required.</small>
        </div>

        <div v-if="!isEditing">
          <label for="password" class="block text-sm font-medium text-[#2d3040] mb-2">Password *</label>
          <Password
            id="password"
            v-model="agentForm.password"
            placeholder="Enter password"
            :feedback="false"
            :toggleMask="true"
            :class="{ 'p-invalid': submitted && !agentForm.password }"
          />
          <small v-if="submitted && !agentForm.password" class="p-error">Password is required.</small>
        </div>

        <div v-if="!isEditing">
          <label for="confirmPassword" class="block text-sm font-medium text-[#2d3040] mb-2">Confirm Password *</label>
          <Password
            id="confirmPassword"
            v-model="agentForm.confirmPassword"
            placeholder="Confirm password"
            :feedback="false"
            :toggleMask="true"
            :class="{ 'p-invalid': submitted && agentForm.password !== agentForm.confirmPassword }"
          />
          <small v-if="submitted && agentForm.password !== agentForm.confirmPassword" class="p-error">Passwords do not match.</small>
        </div>
      </div>

      <!-- Agent Profile Section -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-medium text-[#2d3040] mb-4">Agent Profile</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="displayName" class="block text-sm font-medium text-[#2d3040] mb-2">Display Name *</label>
            <InputText
              id="displayName"
              v-model="agentForm.agentProfile.displayName"
              placeholder="Enter display name"
              :class="{ 'p-invalid': submitted && !agentForm.agentProfile.displayName }"
            />
            <small v-if="submitted && !agentForm.agentProfile.displayName" class="p-error">Display name is required.</small>
          </div>

          <div>
            <label for="defaultDiscountPct" class="block text-sm font-medium text-[#2d3040] mb-2">Default Discount (%)</label>
            <InputNumber
              id="defaultDiscountPct"
              v-model="agentForm.agentProfile.defaultDiscountPct"
              placeholder="0.00"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              suffix="%"
              :min="0"
              :max="100"
            />
          </div>

          <div>
            <label for="cashOnly" class="block text-sm font-medium text-[#2d3040] mb-2">Cash Only</label>
            <Checkbox
              id="cashOnly"
              v-model="agentForm.agentProfile.cashOnly"
              :binary="true"
            />
          </div>


          <div>
            <label for="locationId" class="block text-sm font-medium text-[#2d3040] mb-2">Primary Location</label>
            <Dropdown
              id="locationId"
              v-model="agentForm.agentProfile.locationId"
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
            @click="saveAgent"
            class="custom-primary-button"
          />
        </div>
      </template>
    </Dialog>

    <!-- View Dialog -->
    <Dialog
      v-model:visible="showViewDialog"
      :modal="true"
      header="Agent Details"
      class="p-fluid w-full max-w-4xl"
    >
      <div v-if="selectedAgent" class="space-y-6">
        <!-- Agent Info -->
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-full flex items-center justify-center">
            <span class="material-icons text-white text-2xl">person</span>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-[#2d3040]">{{ selectedAgent.name || 'N/A' }}</h3>
            <p class="text-[#2d3040]/60">{{ selectedAgent.email }}</p>
            <p class="text-[#2d3040]/60">{{ selectedAgent.phone }}</p>
            <Tag
              :value="getStatusLabel(selectedAgent.status)"
              :severity="getStatusSeverity(selectedAgent.status)"
            />
          </div>
        </div>

        <!-- Agent Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card class="stat-card">
            <template #content>
              <div class="text-center">
                <p class="text-sm text-[#2d3040]/60">Total Sales</p>
                <p class="text-2xl font-bold text-[#2d3040]">${{ (selectedAgent.agentStats?.totalSales || 0).toLocaleString() }}</p>
              </div>
            </template>
          </Card>
          <Card class="stat-card">
            <template #content>
              <div class="text-center">
                <p class="text-sm text-[#2d3040]/60">Vouchers Sold</p>
                <p class="text-2xl font-bold text-[#2d3040]">{{ selectedAgent.agentStats?.totalVouchers || 0 }}</p>
              </div>
            </template>
          </Card>
          <Card class="stat-card">
            <template #content>
              <div class="text-center">
                <p class="text-sm text-[#2d3040]/60">Commission Earned</p>
                <p class="text-2xl font-bold text-[#2d3040]">${{ (selectedAgent.agentStats?.totalCommission || 0).toLocaleString() }}</p>
              </div>
            </template>
          </Card>
        </div>

        <!-- Agent Profile -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="text-lg font-medium text-[#2d3040] mb-3">Agent Profile</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Display Name</label>
              <p class="text-[#2d3040]">{{ selectedAgent.agentProfile?.displayName || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Default Discount</label>
              <p class="text-[#2d3040]">{{ selectedAgent.agentProfile?.defaultDiscountPct || 0 }}%</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Commission Rate</label>
              <p class="text-[#2d3040]">{{ selectedAgent.agentProfile?.commissionRate || 0 }}%</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Cash Only</label>
              <p class="text-[#2d3040]">{{ selectedAgent.agentProfile?.cashOnly ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="text-lg font-medium text-[#2d3040] mb-3">Recent Activity</h4>
          <div v-if="selectedAgent.recentActivity && selectedAgent.recentActivity.length > 0" class="space-y-2">
            <div v-for="activity in selectedAgent.recentActivity.slice(0, 5)" :key="activity.id" class="flex items-center space-x-3 p-2 bg-white rounded">
              <span class="material-icons text-[#185ff9] text-sm">{{ activity.icon }}</span>
              <div>
                <p class="text-sm text-[#2d3040]">{{ activity.description }}</p>
                <p class="text-xs text-[#2d3040]/60">{{ formatDate(activity.createdAt) }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-[#2d3040]/40 text-sm">No recent activity</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button
            label="Edit"
            icon="edit"
            @click="editFromView"
            class="custom-primary-button"
          />
          <Button
            v-if="selectedAgent.status !== 'BLACKLISTED'"
            label="Blacklist"
            icon="block"
            severity="danger"
            @click="blacklistFromView"
          />
          <Button
            v-else
            label="Remove Blacklist"
            icon="check_circle"
            severity="success"
            @click="unblacklistFromView"
          />
          <Button
            label="Close"
            icon="close"
            text
            @click="closeViewDialog"
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
const selectedAgent = ref<any>(null)

// Filters
const filters = ref({
  search: '',
  status: null,
  performance: null
})

// Agent form
const agentForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agentProfile: {
    displayName: '',
    defaultDiscountPct: 0,
    cashOnly: true,
    locationId: null
  }
})

// Real data from API
const agents = ref<any[]>([])
const totalAgents = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Location data
const locationOptions = ref<any[]>([])
const loadingLocations = ref(false)

// Agent stats
const agentStats = ref({
  totalAgents: 0,
  activeAgents: 0,
  blacklistedAgents: 0,
  totalSales: 0
})

// Options for dropdowns
const statusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Blacklisted', value: 'BLACKLISTED' },
  { label: 'Inactive', value: 'INACTIVE' }
])

const performanceOptions = ref([
  { label: 'All', value: '' },
  { label: 'Top Performers', value: 'TOP' },
  { label: 'Average', value: 'AVERAGE' },
  { label: 'Low Performers', value: 'LOW' }
])

// API functions
const fetchAgents = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.performance) params.append('performance', filters.value.performance)

    const response: any = await $fetch(`/api/admin/agents?${params}`)
    agents.value = response.agents
    totalAgents.value = response.pagination.total
  } catch (error) {
    console.error('Error fetching agents:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch agents', life: 3000 })
  } finally {
    loading.value = false
  }
}

const fetchAgentStats = async () => {
  try {
    const response: any = await $fetch('/api/admin/agents/stats')
    agentStats.value = response
  } catch (error) {
    console.error('Error fetching agent stats:', error)
  }
}

const fetchLocations = async () => {
  loadingLocations.value = true
  try {
    const response: any = await $fetch('/api/locations')
    if (response.success) {
      locationOptions.value = response.data
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch locations', life: 3000 })
  } finally {
    loadingLocations.value = false
  }
}

// Watch for filter changes
watch([filters, currentPage], () => {
  fetchAgents()
}, { deep: true })

// Load data on mount
onMounted(() => {
  fetchAgents()
  fetchAgentStats()
  fetchLocations()
})

// Methods
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'success'
    case 'BLACKLISTED': return 'danger'
    case 'INACTIVE': return 'warning'
    default: return 'secondary'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'Active'
    case 'BLACKLISTED': return 'Blacklisted'
    case 'INACTIVE': return 'Inactive'
    default: return status
  }
}

const getDiscountSeverity = (discount: number) => {
  if (discount >= 20) return 'danger'
  if (discount >= 10) return 'warning'
  return 'success'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const resetForm = () => {
  agentForm.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agentProfile: {
      displayName: '',
      defaultDiscountPct: 0,
      cashOnly: true,
      locationId: null
    }
  }
  submitted.value = false
}

const openCreateDialog = () => {
  resetForm()
  isEditing.value = false
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  resetForm()
}

const closeViewDialog = () => {
  showViewDialog.value = false
  selectedAgent.value = null
}

const saveAgent = async () => {
  submitted.value = true

  // Validation
  if (!agentForm.value.name || !agentForm.value.email || !agentForm.value.phone) {
    return
  }

  if (!isEditing.value && (!agentForm.value.password || agentForm.value.password !== agentForm.value.confirmPassword)) {
    return
  }

  if (!agentForm.value.agentProfile.displayName) {
    return
  }

  saving.value = true

  try {
    const agentData = {
      name: agentForm.value.name,
      email: agentForm.value.email,
      phone: agentForm.value.phone,
      password: agentForm.value.password,
      role: 'AGENT',
      agentProfile: agentForm.value.agentProfile
    }

    if (isEditing.value) {
      await $fetch(`/api/admin/agents/${selectedAgent.value.id}`, {
        method: 'PUT',
        body: agentData
      } as any)
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'Agent updated successfully', life: 3000 })
    } else {
      await $fetch('/api/admin/agents', {
        method: 'POST',
        body: agentData
      })
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'Agent created successfully', life: 3000 })
    }

    closeDialog()
    fetchAgents() // Refresh the list
    fetchAgentStats() // Refresh stats
  } catch (error) {
    console.error('Error saving agent:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save agent', life: 3000 })
  } finally {
    saving.value = false
  }
}

const editAgent = (agent: any) => {
  selectedAgent.value = agent
  agentForm.value = {
    name: agent.name || '',
    email: agent.email || '',
    phone: agent.phone || '',
    password: '',
    confirmPassword: '',
    agentProfile: agent.agentProfile ? {
      displayName: agent.agentProfile.displayName || '',
      defaultDiscountPct: agent.agentProfile.defaultDiscountPct || 0,
      cashOnly: agent.agentProfile.cashOnly !== false,
      locationId: agent.agentProfile.locationId || null
    } : {
      displayName: '',
      defaultDiscountPct: 0,
      cashOnly: true,
      locationId: null
    }
  }
  isEditing.value = true
  showDialog.value = true
}

const viewAgent = (agent: any) => {
  selectedAgent.value = agent
  showViewDialog.value = true
}

const editFromView = () => {
  closeViewDialog()
  editAgent(selectedAgent.value)
}

const blacklistAgent = async (agent: any) => {
  if (confirm(`Are you sure you want to blacklist "${agent.name || agent.email}"?`)) {
    try {
      await $fetch(`/api/admin/agents/${agent.id}/blacklist`, {
        method: 'POST'
      } as any)
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'Agent blacklisted successfully', life: 3000 })
      fetchAgents() // Refresh the list
      fetchAgentStats() // Refresh stats
    } catch (error) {
      console.error('Error blacklisting agent:', error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to blacklist agent', life: 3000 })
    }
  }
}

const unblacklistAgent = async (agent: any) => {
  if (confirm(`Are you sure you want to remove "${agent.name || agent.email}" from blacklist?`)) {
    try {
      await $fetch(`/api/admin/agents/${agent.id}/unblacklist`, {
        method: 'POST'
      } as any)
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'Agent removed from blacklist successfully', life: 3000 })
      fetchAgents() // Refresh the list
      fetchAgentStats() // Refresh stats
    } catch (error) {
      console.error('Error unblacklisting agent:', error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove agent from blacklist', life: 3000 })
    }
  }
}

const blacklistFromView = () => {
  closeViewDialog()
  blacklistAgent(selectedAgent.value)
}

const unblacklistFromView = () => {
  closeViewDialog()
  unblacklistAgent(selectedAgent.value)
}

const confirmDelete = (agent: any) => {
  if (confirm(`Are you sure you want to delete "${agent.name || agent.email}"?`)) {
    deleteAgent(agent)
  } else {
    toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Delete operation cancelled', life: 3000 })
  }
}

const deleteAgent = async (agent: any) => {
  try {
    await $fetch(`/api/admin/agents/${agent.id}`, {
      method: 'DELETE'
    } as any)
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'Agent deleted successfully', life: 3000 })
    
    fetchAgents() // Refresh the list
    fetchAgentStats() // Refresh stats
  } catch (error) {
    console.error('Error deleting agent:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete agent', life: 3000 })
  }
}

const exportAgents = () => {
  toast.add({ severity: 'info', summary: 'Export', detail: 'Export functionality will be implemented', life: 3000 })
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: null,
    performance: null
  }
}

const onPageChange = (event: any) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
}

// Meta tags
useHead({
  title: 'Agent Management - UFO Networks Admin',
  meta: [
    { name: 'description', content: 'Manage agents, view performance, and handle blacklisting in the UFO Networks system.' }
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

:deep(.stat-card) {
  border-radius: 8px !important;
  border: 1px solid rgba(45, 48, 64, 0.1) !important;
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
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

/* Blacklist button styling */
:deep(.blacklist-button) {
  color: #dc2626 !important;
  background: rgba(220, 38, 38, 0.1) !important;
}

:deep(.blacklist-button:hover) {
  background: rgba(220, 38, 38, 0.2) !important;
  color: #dc2626 !important;
}

/* Unblacklist button styling */
:deep(.unblacklist-button) {
  color: #059669 !important;
  background: rgba(5, 150, 105, 0.1) !important;
}

:deep(.unblacklist-button:hover) {
  background: rgba(5, 150, 105, 0.2) !important;
  color: #059669 !important;
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
