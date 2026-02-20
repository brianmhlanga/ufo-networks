<template>
  <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[#2d3040]">Admin Profile</h1>
          <p class="text-[#2d3040]/60 mt-1">Manage your profile information and account settings</p>
        </div>
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            label="Save Changes"
            icon="save"
            @click="saveProfile"
            :loading="saving"
            class="custom-primary-button"
          />
        </div>
      </div>

      <!-- Profile Overview Card -->
      <Card class="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <template #content>
          <div class="flex items-center space-x-6">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <span class="material-icons text-white text-3xl">{{ profileInitials }}</span>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-[#2d3040]">{{ adminProfile.name || 'Admin Name' }}</h2>
              <p class="text-[#2d3040]/70">{{ adminProfile.email || 'No email set' }}</p>
              <p class="text-[#2d3040]/70">{{ adminProfile.phone || 'No phone set' }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {{ adminProfile.role || 'ADMIN' }}
                </span>
                <span class="text-sm text-[#2d3040]/60">Member since {{ formatDate(adminProfile.createdAt) }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Profile Information Form -->
      <Card>
        <template #header>
          <div class="flex items-center space-x-2">
            <span class="material-icons text-blue-600">person</span>
            <h3 class="text-lg font-semibold text-[#2d3040]">Profile Information</h3>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-[#2d3040] mb-2">Full Name *</label>
              <InputText
                id="name"
                v-model="adminProfile.name"
                placeholder="Enter your full name"
                class="w-full"
                :class="{ 'p-invalid': submitted && !adminProfile.name }"
              />
              <small v-if="submitted && !adminProfile.name" class="p-error">Name is required.</small>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-[#2d3040] mb-2">Email Address *</label>
              <InputText
                id="email"
                v-model="adminProfile.email"
                type="email"
                placeholder="Enter your email"
                class="w-full"
                :class="{ 'p-invalid': submitted && !adminProfile.email }"
              />
              <small v-if="submitted && !adminProfile.email" class="p-error">Email is required.</small>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-[#2d3040] mb-2">Phone Number</label>
              <InputText
                id="phone"
                v-model="adminProfile.phone"
                placeholder="Enter your phone number"
                class="w-full"
              />
            </div>

            <!-- Role (Read-only) -->
            <div>
              <label for="role" class="block text-sm font-medium text-[#2d3040] mb-2">Role</label>
              <InputText
                id="role"
                :value="adminProfile.role || 'ADMIN'"
                readonly
                class="w-full bg-gray-50"
              />
              <small class="text-gray-500">Role cannot be changed</small>
            </div>
          </div>
        </template>
      </Card>

      <!-- Change Password Section -->
      <Card>
        <template #header>
          <div class="flex items-center space-x-2">
            <span class="material-icons text-blue-600">lock</span>
            <h3 class="text-lg font-semibold text-[#2d3040]">Change Password</h3>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-[#2d3040] mb-2">Current Password *</label>
              <Password
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                placeholder="Enter current password"
                :feedback="false"
                :toggleMask="true"
                class="w-full"
                :class="{ 'p-invalid': submitted && !passwordForm.currentPassword }"
              />
              <small v-if="submitted && !passwordForm.currentPassword" class="p-error">Current password is required.</small>
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-[#2d3040] mb-2">New Password *</label>
              <Password
                id="newPassword"
                v-model="passwordForm.newPassword"
                placeholder="Enter new password"
                :feedback="true"
                :toggleMask="true"
                class="w-full"
                :class="{ 'p-invalid': submitted && !passwordForm.newPassword }"
              />
              <small v-if="submitted && !passwordForm.newPassword" class="p-error">New password is required.</small>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label for="confirmNewPassword" class="block text-sm font-medium text-[#2d3040] mb-2">Confirm New Password *</label>
              <Password
                id="confirmNewPassword"
                v-model="passwordForm.confirmNewPassword"
                placeholder="Confirm new password"
                :feedback="false"
                :toggleMask="true"
                class="w-full"
                :class="{ 'p-invalid': submitted && passwordForm.newPassword !== passwordForm.confirmNewPassword }"
              />
              <small v-if="submitted && passwordForm.newPassword !== passwordForm.confirmNewPassword" class="p-error">Passwords do not match.</small>
            </div>

            <!-- Change Password Button -->
            <div class="flex items-end">
              <Button
                label="Change Password"
                icon="lock_reset"
                @click="changePassword"
                :loading="changingPassword"
                severity="secondary"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Account Settings -->
      <Card>
        <template #header>
          <div class="flex items-center space-x-2">
            <span class="material-icons text-blue-600">settings</span>
            <h3 class="text-lg font-semibold text-[#2d3040]">Account Settings</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <!-- Two-Factor Authentication -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-blue-600">security</span>
                <div>
                  <h4 class="font-medium text-[#2d3040]">Two-Factor Authentication</h4>
                  <p class="text-sm text-[#2d3040]/60">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Button
                label="Enable 2FA"
                icon="qr_code_scanner"
                severity="secondary"
                @click="enable2FA"
                class="custom-secondary-button"
              />
            </div>

            <!-- Email Notifications -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-blue-600">notifications</span>
                <div>
                  <h4 class="font-medium text-[#2d3040]">Email Notifications</h4>
                  <p class="text-sm text-[#2d3040]/60">Receive notifications about system events</p>
                </div>
              </div>
              <InputSwitch v-model="emailNotifications" />
            </div>

            <!-- Session Management -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-blue-600">logout</span>
                <div>
                  <h4 class="font-medium text-[#2d3040]">Active Sessions</h4>
                  <p class="text-sm text-[#2d3040]/60">Manage your active login sessions</p>
                </div>
              </div>
              <Button
                label="View Sessions"
                icon="visibility"
                severity="secondary"
                @click="viewSessions"
                class="custom-secondary-button"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Danger Zone -->
      <Card class="border-red-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <span class="material-icons text-red-600">warning</span>
            <h3 class="text-lg font-semibold text-red-600">Danger Zone</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <!-- Delete Account -->
            <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div class="flex items-center space-x-3">
                <span class="material-icons text-red-600">delete_forever</span>
                <div>
                  <h4 class="font-medium text-red-600">Delete Account</h4>
                  <p class="text-sm text-red-600/70">Permanently delete your admin account. This action cannot be undone.</p>
                </div>
              </div>
              <Button
                label="Delete Account"
                icon="delete_forever"
                severity="danger"
                @click="confirmDeleteAccount"
                class="custom-danger-button"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Toast Component -->
    <Toast />
    
    <!-- Confirm Dialog -->
    <ConfirmDialog />
</template>

<script lang="ts" setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Toast instance
const toast = useToast()

// Confirm dialog instance
const confirm = useConfirm()

// Reactive data
const saving = ref(false)
const changingPassword = ref(false)
const submitted = ref(false)
const emailNotifications = ref(true)

// Admin profile data
const adminProfile = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  role: '',
  createdAt: ''
})

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// Computed properties
const profileInitials = computed(() => {
  if (adminProfile.value.name) {
    return adminProfile.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
  }
  return 'A'
})

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchAdminProfile = async () => {
  try {
    const response = await $fetch('/api/auth/me') as any
    adminProfile.value = {
      id: response.id || '',
      name: response.name || '',
      email: response.email || '',
      phone: response.phone || '',
      role: response.role || 'ADMIN',
      createdAt: response.createdAt || ''
    }
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch profile information', life: 3000 })
  }
}

const saveProfile = async () => {
  submitted.value = true
  
  // Validation
  if (!adminProfile.value.name || !adminProfile.value.email) {
    return
  }

  saving.value = true
  
  try {
    await $fetch(`/api/admin/users/${adminProfile.value.id}`, {
      method: 'PUT',
      body: {
        name: adminProfile.value.name,
        email: adminProfile.value.email,
        phone: adminProfile.value.phone
      }
    } as any)
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully', life: 3000 })
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile', life: 3000 })
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  submitted.value = true
  
  // Validation
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmNewPassword) {
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    return
  }

  changingPassword.value = true
  
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    } as any)
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'Password changed successfully', life: 3000 })
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  } catch (error) {
    console.error('Error changing password:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to change password', life: 3000 })
  } finally {
    changingPassword.value = false
  }
}

const enable2FA = () => {
  toast.add({ severity: 'info', summary: 'Coming Soon', detail: 'Two-factor authentication will be available soon', life: 3000 })
}

const viewSessions = () => {
  toast.add({ severity: 'info', summary: 'Coming Soon', detail: 'Session management will be available soon', life: 3000 })
}

const confirmDeleteAccount = () => {
  confirm.require({
    message: 'Are you sure you want to delete your admin account? This action cannot be undone and will permanently remove all your data.',
    header: 'Confirm Account Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete Account',
    accept: () => {
      deleteAccount()
    },
    reject: () => {
      toast.add({ 
        severity: 'info', 
        summary: 'Cancelled', 
        detail: 'Account deletion cancelled', 
        life: 3000 
      })
    }
  })
}

const deleteAccount = async () => {
  try {
    await $fetch(`/api/admin/users/${adminProfile.value.id}`, {
      method: 'DELETE'
    } as any)
    
    toast.add({ severity: 'success', summary: 'Success', detail: 'Account deleted successfully', life: 3000 })
    
    // Redirect to login
    await navigateTo('/login')
  } catch (error) {
    console.error('Error deleting account:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete account', life: 3000 })
  }
}

// Lifecycle
onMounted(() => {
  fetchAdminProfile()
})
</script>

<style scoped>
.custom-primary-button {
  background: linear-gradient(135deg, #1d5caa 0%, #2563eb 100%);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.custom-primary-button:hover {
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(29, 92, 170, 0.3);
}

.custom-secondary-button {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.custom-secondary-button:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.custom-danger-button {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.custom-danger-button:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
</style>
