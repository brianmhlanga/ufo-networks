<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#2d3040]">User Management</h1>
        <p class="text-[#2d3040]/60 mt-1">Manage system users, agents, and administrators</p>
      </div>
      <div class="flex items-center space-x-3 mt-4 sm:mt-0">
        <Button
          label="Add User"
          icon="add"
          @click="openCreateDialog"
          class="custom-primary-button"
        />
        <Button
          v-if="selectedUsers.length > 0"
          label="Bulk Delete"
          icon="delete"
          severity="danger"
          @click="confirmBulkDelete"
        />
        <Button
          label="Export"
          icon="download"
          severity="secondary"
          @click="exportSelected"
        />
      </div>
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
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Role</label>
            <Dropdown
              v-model="filters.role"
              :options="roleOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Roles"
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

    <!-- Users Table -->
    <Card>
      <template #content>
        <DataTable
          v-model:selection="selectedUsers"
          :value="users"
          :loading="loading"
          :paginator="true"
          :rows="pageSize"
          :totalRecords="totalUsers"
          :lazy="true"
          :rowsPerPageOptions="[10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          @page="onPageChange"
          dataKey="id"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
          class="p-datatable-sm"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          
          <Column field="name" header="Name" sortable>
            <template #body="{ data }">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-full flex items-center justify-center">
                  <span class="material-icons text-white text-sm">person</span>
                </div>
                <div>
                  <div class="font-medium text-[#2d3040]">{{ data.name || 'N/A' }}</div>
                  <div class="text-sm text-[#2d3040]/60">{{ data.email }}</div>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="phone" header="Phone" sortable>
            <template #body="{ data }">
              <span class="text-[#2d3040]">{{ data.phone || 'N/A' }}</span>
            </template>
          </Column>
          
          <Column field="role" header="Role" sortable>
            <template #body="{ data }">
              <Tag
                :value="getRoleLabel(data.role)"
                :severity="getRoleSeverity(data.role)"
              />
            </template>
          </Column>
          
          <Column field="agentProfile" header="Agent Profile" sortable>
            <template #body="{ data }">
              <div v-if="data.agentProfile" class="text-sm">
                <div class="font-medium text-[#2d3040]">{{ data.agentProfile.displayName }}</div>
                <div class="text-[#2d3040]/60">{{ data.agentProfile.defaultDiscountPct }}% discount</div>
              </div>
              <span v-else class="text-[#2d3040]/40 text-sm">Not an agent</span>
            </template>
          </Column>
          
          <Column field="createdAt" header="Created" sortable>
            <template #body="{ data }">
              <span class="text-[#2d3040]">{{ formatDate(data.createdAt) }}</span>
            </template>
          </Column>
          
                     <Column header="Actions" :exportable="false" style="min-width: 8rem">
             <template #body="{ data }">
               <div class="flex items-center space-x-2">
                 <Button
                   text
                   size="small"
                   @click="viewUser(data)"
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
                   @click="editUser(data)"
                   v-tooltip.top="'Edit User'"
                   class="action-button edit-button"
                 >
                   <template #icon>
                     <span class="material-icons">edit</span>
                   </template>
                 </Button>
                 <Button
                   text
                   size="small"
                   severity="danger"
                   @click="confirmDelete(data)"
                   v-tooltip.top="'Delete User'"
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
      :header="isEditing ? 'Edit User' : 'Create New User'"
      class="p-fluid w-full max-w-4xl"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-[#2d3040] mb-2">Full Name *</label>
          <InputText
            id="name"
            v-model="userForm.name"
            placeholder="Enter full name"
            :class="{ 'p-invalid': submitted && !userForm.name }"
          />
          <small v-if="submitted && !userForm.name" class="p-error">Name is required.</small>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-[#2d3040] mb-2">Email *</label>
          <InputText
            id="email"
            v-model="userForm.email"
            type="email"
            placeholder="Enter email address"
            :class="{ 'p-invalid': submitted && !userForm.email }"
          />
          <small v-if="submitted && !userForm.email" class="p-error">Email is required.</small>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-[#2d3040] mb-2">Phone Number</label>
          <InputText
            id="phone"
            v-model="userForm.phone"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-[#2d3040] mb-2">Role *</label>
          <Dropdown
            id="role"
            v-model="userForm.role"
            :options="roleOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select role"
            :class="{ 'p-invalid': submitted && !userForm.role }"
          />
          <small v-if="submitted && !userForm.role" class="p-error">Role is required.</small>
        </div>

        <div v-if="!isEditing">
          <label for="password" class="block text-sm font-medium text-[#2d3040] mb-2">Password *</label>
          <Password
            id="password"
            v-model="userForm.password"
            placeholder="Enter password"
            :feedback="false"
            :toggleMask="true"
            :class="{ 'p-invalid': submitted && !userForm.password }"
          />
          <small v-if="submitted && !userForm.password" class="p-error">Password is required.</small>
        </div>

        <div v-if="!isEditing">
          <label for="confirmPassword" class="block text-sm font-medium text-[#2d3040] mb-2">Confirm Password *</label>
          <Password
            id="confirmPassword"
            v-model="userForm.confirmPassword"
            placeholder="Confirm password"
            :feedback="false"
            :toggleMask="true"
            :class="{ 'p-invalid': submitted && userForm.password !== userForm.confirmPassword }"
          />
          <small v-if="submitted && userForm.password !== userForm.confirmPassword" class="p-error">Passwords do not match.</small>
        </div>
      </div>

      <!-- Agent Profile Section -->
      <div v-if="userForm.role === 'AGENT'" class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-medium text-[#2d3040] mb-4">Agent Profile</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="displayName" class="block text-sm font-medium text-[#2d3040] mb-2">Display Name *</label>
            <InputText
              id="displayName"
              v-model="userForm.agentProfile.displayName"
              placeholder="Enter display name"
              :class="{ 'p-invalid': submitted && !userForm.agentProfile.displayName }"
            />
            <small v-if="submitted && !userForm.agentProfile.displayName" class="p-error">Display name is required for agents.</small>
          </div>

          <div>
            <label for="defaultDiscountPct" class="block text-sm font-medium text-[#2d3040] mb-2">Default Discount (%)</label>
            <InputNumber
              id="defaultDiscountPct"
              v-model="userForm.agentProfile.defaultDiscountPct"
              placeholder="0.00"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              suffix="%"
            />
          </div>

          <div>
            <label for="cashOnly" class="block text-sm font-medium text-[#2d3040] mb-2">Cash Only</label>
            <Checkbox
              id="cashOnly"
              v-model="userForm.agentProfile.cashOnly"
              :binary="true"
            />
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
            @click="saveUser"
            class="custom-primary-button"
          />
        </div>
      </template>
    </Dialog>

    <!-- View Dialog -->
    <Dialog
      v-model:visible="showViewDialog"
      :modal="true"
      header="User Details"
      class="p-fluid w-full max-w-2xl"
    >
      <div v-if="selectedUser" class="space-y-6">
        <!-- User Info -->
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-full flex items-center justify-center">
            <span class="material-icons text-white text-xl">person</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-[#2d3040]">{{ selectedUser.name || 'N/A' }}</h3>
            <p class="text-[#2d3040]/60">{{ selectedUser.email }}</p>
            <Tag
              :value="getRoleLabel(selectedUser.role)"
              :severity="getRoleSeverity(selectedUser.role)"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Phone</label>
            <p class="text-[#2d3040]">{{ selectedUser.phone || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Created</label>
            <p class="text-[#2d3040]">{{ formatDate(selectedUser.createdAt) }}</p>
          </div>
        </div>

        <!-- Agent Profile -->
        <div v-if="selectedUser.agentProfile" class="p-4 bg-gray-50 rounded-lg">
          <h4 class="text-lg font-medium text-[#2d3040] mb-3">Agent Profile</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Display Name</label>
              <p class="text-[#2d3040]">{{ selectedUser.agentProfile.displayName }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Default Discount</label>
              <p class="text-[#2d3040]">{{ selectedUser.agentProfile.defaultDiscountPct }}%</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#2d3040]/60 mb-1">Cash Only</label>
              <p class="text-[#2d3040]">{{ selectedUser.agentProfile.cashOnly ? 'Yes' : 'No' }}</p>
            </div>
          </div>
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
            label="Close"
            icon="close"
            text
            @click="closeViewDialog"
          />
        </div>
      </template>
         </Dialog>
   </div>
   
   <!-- Toast Component -->
   <Toast />
   
   <!-- Confirm Dialog -->
   <ConfirmDialog />
  </NuxtLayout>
  
 </template>

<script lang="ts" setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

// Toast instance
const toast = useToast()

// Confirm dialog instance
const confirm = useConfirm()

// Reactive data
const loading = ref(false)
const saving = ref(false)
const submitted = ref(false)
const showDialog = ref(false)
const showViewDialog = ref(false)
const isEditing = ref(false)
const selectedUsers = ref<any[]>([])
const selectedUser = ref<any>(null)

// Filters
const filters = ref({
  search: '',
  role: null,
  status: null
})

// User form
const userForm = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  confirmPassword: '',
  agentProfile: {
    displayName: '',
    defaultDiscountPct: 0,
    cashOnly: true
  }
})

// Real data from API
const users = ref<any[]>([])
const totalUsers = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Options for dropdowns
const roleOptions = ref([
  { label: 'Customer', value: 'CUSTOMER' },
  { label: 'Agent', value: 'AGENT' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' }
])

const statusOptions = ref([
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' }
])

// API functions
const fetchUsers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.role) params.append('role', filters.value.role)
    if (filters.value.status) params.append('status', filters.value.status)

    const response: any = await $fetch(`/api/admin/users?${params}`)
    users.value = response.users
    totalUsers.value = response.pagination.total
  } catch (error) {
    console.error('Error fetching users:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch users', life: 3000 })
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch([filters, currentPage], () => {
  fetchUsers()
}, { deep: true })

// Load users on mount
onMounted(() => {
  fetchUsers()
})

// Methods
const getRoleSeverity = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN': return 'danger'
    case 'ADMIN': return 'warning'
    case 'AGENT': return 'info'
    case 'CUSTOMER': return 'success'
    default: return 'secondary'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN': return 'Super Admin'
    case 'ADMIN': return 'Admin'
    case 'AGENT': return 'Agent'
    case 'CUSTOMER': return 'Customer'
    default: return role
  }
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
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
    agentProfile: {
      displayName: '',
      defaultDiscountPct: 0,
      cashOnly: true
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
  selectedUser.value = null
}

const saveUser = async () => {
  submitted.value = true

  // Validation
  if (!userForm.value.name || !userForm.value.email || !userForm.value.role) {
    return
  }

  if (!isEditing.value && (!userForm.value.password || userForm.value.password !== userForm.value.confirmPassword)) {
    return
  }

  if (userForm.value.role === 'AGENT' && !userForm.value.agentProfile.displayName) {
    return
  }

  saving.value = true

  try {
    const userData = {
      name: userForm.value.name,
      email: userForm.value.email,
      phone: userForm.value.phone,
      role: userForm.value.role,
      password: userForm.value.password,
      agentProfile: userForm.value.role === 'AGENT' ? userForm.value.agentProfile : null
    }

    if (isEditing.value) {
      await $fetch(`/api/admin/users/${selectedUser.value.id}`, {
        method: 'PUT',
        body: userData
      } as any)
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully', life: 3000 })
    } else {
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: userData
      })
      
      toast.add({ severity: 'success', summary: 'Success', detail: 'User created successfully', life: 3000 })
    }

    closeDialog()
    fetchUsers() // Refresh the list
  } catch (error) {
    console.error('Error saving user:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save user', life: 3000 })
  } finally {
    saving.value = false
  }
}

const editUser = (user: any) => {
  selectedUser.value = user
  userForm.value = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || '',
    password: '',
    confirmPassword: '',
    agentProfile: user.agentProfile ? {
      displayName: user.agentProfile.displayName || '',
      defaultDiscountPct: user.agentProfile.defaultDiscountPct || 0,
      cashOnly: user.agentProfile.cashOnly !== false
    } : {
      displayName: '',
      defaultDiscountPct: 0,
      cashOnly: true
    }
  }
  isEditing.value = true
  showDialog.value = true
}

const viewUser = (user: any) => {
  selectedUser.value = user
  showViewDialog.value = true
}

const editFromView = () => {
  closeViewDialog()
  editUser(selectedUser.value)
}

const confirmDelete = (user: any) => {
  confirm.require({
    message: `Are you sure you want to delete "${user.name || user.email}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      deleteUser(user)
    },
    reject: () => {
      toast.add({ 
        severity: 'info', 
        summary: 'Cancelled', 
        detail: 'Delete operation cancelled', 
        life: 3000 
      })
    }
  })
}

const deleteUser = async (user: any) => {
  try {
    await $fetch(`/api/admin/users/${user.id}`, {
      method: 'DELETE'
    } as any)
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully', life: 3000 })
    
    fetchUsers() // Refresh the list
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user', life: 3000 })
  }
}

const confirmBulkDelete = () => {
  confirm.require({
    message: `Are you sure you want to delete ${selectedUsers.value.length} selected user(s)?`,
    header: 'Confirm Bulk Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete All',
    accept: () => {
      bulkDelete()
    },
    reject: () => {
      toast.add({ 
        severity: 'info', 
        summary: 'Cancelled', 
        detail: 'Bulk delete operation cancelled', 
        life: 3000 
      })
    }
  })
}

const bulkDelete = async () => {
  try {
    const idsToDelete = selectedUsers.value.map(u => u.id)
    
    await $fetch('/api/admin/users/bulk', {
      method: 'DELETE',
      body: { ids: idsToDelete }
    } as any)
    
    selectedUsers.value = []
    
    toast.add({ severity: 'success', summary: 'Success', detail: `${idsToDelete.length} user(s) deleted successfully`, life: 3000 })
    
    fetchUsers() // Refresh the list
  } catch (error) {
    console.error('Error bulk deleting users:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete selected users', life: 3000 })
  }
}

const exportSelected = () => {
  toast.add({ severity: 'info', summary: 'Export', detail: 'Export functionality will be implemented', life: 3000 })
}

const clearFilters = () => {
  filters.value = {
    search: '',
    role: null,
    status: null
  }
}

const onPageChange = (event: any) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
}



// Meta tags
useHead({
  title: 'User Management - UFO Networks Admin',
  meta: [
    { name: 'description', content: 'Manage users, agents, and administrators in the UFO Networks system.' }
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
