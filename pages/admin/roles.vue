<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[#2d3040]">Roles & Permissions</h1>
          <p class="text-[#2d3040]/60 mt-1">Manage role-based access control and permissions</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            label="Export Permissions"
            icon="download"
            severity="secondary"
            @click="exportPermissions"
          />
          <Button
            label="Reset to Defaults"
            icon="refresh"
            severity="warning"
            @click="resetToDefaults"
          />
        </div>
      </div>

      <!-- Role Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="role-card">
          <template #content>
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-white text-2xl">admin_panel_settings</span>
              </div>
              <h3 class="text-lg font-semibold text-[#2d3040] mb-2">Super Admin</h3>
              <p class="text-sm text-[#2d3040]/60 mb-3">Full system access</p>
              <div class="text-2xl font-bold text-red-600">{{ getPermissionsForRole('SUPER_ADMIN').length }}</div>
              <p class="text-xs text-[#2d3040]/40">Permissions</p>
            </div>
          </template>
        </Card>

        <Card class="role-card">
          <template #content>
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-white text-2xl">admin_panel_settings</span>
              </div>
              <h3 class="text-lg font-semibold text-[#2d3040] mb-2">Admin</h3>
              <p class="text-sm text-[#2d3040]/60 mb-3">Administrative access</p>
              <div class="text-2xl font-bold text-blue-600">{{ getPermissionsForRole('ADMIN').length }}</div>
              <p class="text-xs text-[#2d3040]/40">Permissions</p>
            </div>
          </template>
        </Card>

        <Card class="role-card">
          <template #content>
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-white text-2xl">person</span>
              </div>
              <h3 class="text-lg font-semibold text-[#2d3040] mb-2">Agent</h3>
              <p class="text-sm text-[#2d3040]/60 mb-3">Limited access</p>
              <div class="text-2xl font-bold text-green-600">{{ getPermissionsForRole('AGENT').length }}</div>
              <p class="text-xs text-[#2d3040]/40">Permissions</p>
            </div>
          </template>
        </Card>

        <Card class="role-card">
          <template #content>
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-white text-2xl">person_outline</span>
              </div>
              <h3 class="text-lg font-semibold text-[#2d3040] mb-2">Customer</h3>
              <p class="text-sm text-[#2d3040]/60 mb-3">Basic access</p>
              <div class="text-2xl font-bold text-gray-600">{{ getPermissionsForRole('CUSTOMER').length }}</div>
              <p class="text-xs text-[#2d3040]/40">Permissions</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Role Permissions Management -->
      <Card>
        <template #content>
          <div class="space-y-6">
            <!-- Role Selection -->
            <div class="flex items-center space-x-4">
              <label class="text-lg font-medium text-[#2d3040]">Select Role:</label>
              <Dropdown
                v-model="selectedRole"
                :options="roleOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Choose a role"
                class="w-64"
                @change="onRoleChange"
              />
            </div>

            <!-- Role Description -->
            <div v-if="selectedRole" class="p-4 bg-gray-50 rounded-lg">
              <h3 class="text-lg font-medium text-[#2d3040] mb-2">{{ getRoleLabel(selectedRole) }}</h3>
              <p class="text-[#2d3040]/60">{{ getRoleDescription(selectedRole) }}</p>
            </div>

            <!-- Permissions by Category -->
            <div v-if="selectedRole" class="space-y-6">
              <div v-for="(permissions, category) in permissionsByCategory" :key="category" class="border border-gray-200 rounded-lg">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 class="text-lg font-medium text-[#2d3040]">{{ category }}</h4>
                  <p class="text-sm text-[#2d3040]/60">{{ permissions.length }} permissions</p>
                </div>
                
                <div class="p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      v-for="permission in permissions"
                      :key="permission.id"
                      class="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      :class="{ 'bg-blue-50 border-blue-300': isPermissionAssigned(permission.id) }"
                    >
                      <Checkbox
                        :modelValue="isPermissionAssigned(permission.id)"
                        :binary="true"
                        @change="(checked) => togglePermission(permission.id, checked)"
                        class="mt-1"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <label class="text-sm font-medium text-[#2d3040] cursor-pointer">
                            {{ permission.name }}
                          </label>
                          <Tag
                            :value="permission.action"
                            :severity="getActionSeverity(permission.action)"
                            class="text-xs"
                          />
                        </div>
                        <p class="text-xs text-[#2d3040]/60 mt-1">{{ permission.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Changes -->
            <div v-if="selectedRole && hasChanges" class="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center space-x-2">
                <span class="material-icons text-blue-600">info</span>
                <span class="text-blue-800">You have unsaved changes</span>
              </div>
              <div class="flex items-center space-x-3">
                <Button
                  label="Cancel"
                  icon="close"
                  text
                  @click="cancelChanges"
                />
                <Button
                  label="Save Changes"
                  icon="save"
                  :loading="saving"
                  @click="saveChanges"
                  class="custom-primary-button"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { ALL_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS, getPermissionsByCategory, getPermissionsForRole } from '~/configs/permissions'
import { useToast } from 'primevue/usetoast'



// Toast instance
const toast = useToast()

// Reactive data
const selectedRole = ref('')
const saving = ref(false)
const hasChanges = ref(false)
const originalPermissions = ref<string[]>([])
const currentPermissions = ref<string[]>([])

// Role options for dropdown
const roleOptions = ref([
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Agent', value: 'AGENT' },
  { label: 'Customer', value: 'CUSTOMER' }
])

// Get permissions organized by category
const permissionsByCategory = computed(() => {
  return getPermissionsByCategory()
})

// Methods
const getRoleLabel = (role: string) => {
  const roleOption = roleOptions.value.find(r => r.value === role)
  return roleOption ? roleOption.label : role
}

const getRoleDescription = (role: string) => {
  const descriptions = {
    'SUPER_ADMIN': 'Full system access with all permissions. Can manage everything including system settings and other administrators.',
    'ADMIN': 'Administrative access to manage users, agents, locations, vouchers, and most system operations.',
    'AGENT': 'Limited access to manage own profile, view locations, and access basic reports.',
    'CUSTOMER': 'Basic access to manage own profile, view locations, and access own vouchers and orders.'
  }
  return descriptions[role as keyof typeof descriptions] || 'No description available.'
}

const getActionSeverity = (action: string) => {
  const severities = {
    'view': 'info',
    'create': 'success',
    'edit': 'warning',
    'delete': 'danger',
    'blacklist': 'danger',
    'unblacklist': 'success',
    'approve': 'success',
    'process': 'warning',
    'refund': 'danger',
    'settings': 'info',
    'audit': 'info',
    'backup': 'warning',
    'export': 'info',
    'financial': 'success',
    'resolve': 'success'
  }
  return severities[action as keyof typeof severities] || 'info'
}

const isPermissionAssigned = (permissionId: string) => {
  return currentPermissions.value.includes(permissionId)
}

const togglePermission = (permissionId: string, checked: boolean) => {
  if (checked) {
    if (!currentPermissions.value.includes(permissionId)) {
      currentPermissions.value.push(permissionId)
    }
  } else {
    currentPermissions.value = currentPermissions.value.filter(id => id !== permissionId)
  }
  
  // Check if there are changes
  hasChanges.value = JSON.stringify(currentPermissions.value.sort()) !== JSON.stringify(originalPermissions.value.sort())
}

const onRoleChange = () => {
  if (selectedRole.value) {
    // Get current permissions for the selected role
    const rolePermissions = DEFAULT_ROLE_PERMISSIONS.find(rp => rp.role === selectedRole.value)
    currentPermissions.value = rolePermissions ? [...rolePermissions.permissions] : []
    originalPermissions.value = [...currentPermissions.value]
    hasChanges.value = false
  }
}

const saveChanges = async () => {
  saving.value = true
  
  try {
    // In a real app, this would save to the database
    // For now, we'll just update the local state
    const roleIndex = DEFAULT_ROLE_PERMISSIONS.findIndex(rp => rp.role === selectedRole.value)
    if (roleIndex !== -1) {
      DEFAULT_ROLE_PERMISSIONS[roleIndex].permissions = [...currentPermissions.value]
    }
    
    // Update original permissions
    originalPermissions.value = [...currentPermissions.value]
    hasChanges.value = false
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Permissions updated for ${getRoleLabel(selectedRole.value)}`,
      life: 3000
    })
  } catch (error) {
    console.error('Error saving permissions:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save permissions',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

const cancelChanges = () => {
  currentPermissions.value = [...originalPermissions.value]
  hasChanges.value = false
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset all role permissions to their default values? This action cannot be undone.')) {
    // Reset to original defaults
    DEFAULT_ROLE_PERMISSIONS.forEach(rolePerm => {
      const defaultRole = DEFAULT_ROLE_PERMISSIONS.find(dr => dr.role === rolePerm.role)
      if (defaultRole) {
        rolePerm.permissions = [...defaultRole.permissions]
      }
    })
    
    // Update current view if a role is selected
    if (selectedRole.value) {
      onRoleChange()
    }
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'All role permissions have been reset to defaults',
      life: 3000
    })
  }
}

const exportPermissions = () => {
  const data = {
    roles: DEFAULT_ROLE_PERMISSIONS,
    permissions: ALL_PERMISSIONS,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ufo-networks-permissions-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Permissions exported successfully',
    life: 3000
  })
}

// Meta tags
useHead({
  title: 'Roles & Permissions - UFO Networks Admin',
  meta: [
    { name: 'description', content: 'Manage role-based access control and permissions in the UFO Networks system.' }
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

/* Role cards styling */
:deep(.role-card) {
  border-radius: 12px !important;
  border: 1px solid rgba(45, 48, 64, 0.1) !important;
  background: white !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05) !important;
  transition: all 0.2s ease !important;
}

:deep(.role-card:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

/* Checkbox styling */
:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 4px;
  border: 2px solid rgba(45, 48, 64, 0.2);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #185ff9;
  border-color: #185ff9;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight .p-checkbox-icon) {
  color: white;
}

/* Dropdown styling */
:deep(.p-dropdown) {
  border-radius: 8px;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

:deep(.p-dropdown:focus) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
}
</style>
