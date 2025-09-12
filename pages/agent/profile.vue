<template>
  <NuxtLayout name="agent">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
                     <h1 class="text-2xl font-bold text-gray-900">Agent Profile</h1>
           <p class="text-gray-600">View your profile information and change your password</p>
        </div>
                 <div class="flex space-x-3">
           <Button 
             @click="navigateTo('/agent/buy-vouchers')" 
             icon="add_card"
             label="Buy Vouchers"
             severity="secondary"
           />
           <Button 
             @click="navigateTo('/agent/create-sale')" 
             icon="add_shopping_cart"
             label="Create Sale"
             severity="success"
           />
           <Button 
             @click="navigateTo('/agent/reports')" 
             icon="analytics"
             label="View Reports"
             severity="info"
           />
         </div>
      </div>

      <!-- Profile Overview Card -->
      <Card class="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <template #content>
          <div class="flex items-center space-x-6">
            <div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="material-icons text-white text-3xl">{{ profileInitials }}</span>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900">{{ agentProfile.displayName || 'Agent Name' }}</h2>
              <p class="text-gray-600">{{ user.email || 'No email set' }}</p>
              <p class="text-gray-600">{{ user.phone || 'No phone set' }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Active Agent
                </span>
                <span class="text-sm text-gray-500">Member since {{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Personal Information & Settings -->
        <div class="lg:col-span-2 space-y-6">
                     <!-- Personal Information -->
           <Card>
             <template #header>
               <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
             </template>
             <template #content>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                   <InputText 
                     :value="agentProfile.displayName || 'Not set'" 
                     disabled
                     class="w-full bg-gray-50"
                   />
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                   <InputText 
                     :value="user.email || 'Not set'" 
                     disabled
                     class="w-full bg-gray-50"
                   />
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                   <InputText 
                     :value="user.phone || 'Not set'" 
                     disabled
                     class="w-full bg-gray-50"
                   />
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                   <InputText 
                     :value="user.role" 
                     disabled
                     class="w-full bg-gray-50"
                   />
                 </div>
               </div>
             </template>
           </Card>

                                 <!-- Business Settings -->
            <Card>
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900">Business Settings</h3>
              </template>
              <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Default Discount (%)</label>
                    <InputText 
                      :value="`${agentProfile.defaultDiscountPct || 0}%`" 
                      disabled
                      class="w-full bg-gray-50"
                    />
                    <p class="text-xs text-gray-500 mt-1">Default discount applied to voucher purchases</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cash Handling</label>
                    <div class="flex items-center space-x-3">
                      <Checkbox 
                        :modelValue="agentProfile.cashOnly" 
                        :disabled="true"
                        :binary="true"
                      />
                      <span class="text-sm text-gray-700">Cash only transactions</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Restrict to cash payments only</p>
                  </div>
                </div>
              </template>
            </Card>

           <!-- Password Change -->
           <Card>
             <template #header>
               <h3 class="text-lg font-semibold text-gray-900">Change Password</h3>
             </template>
             <template #content>
               <div class="space-y-4">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                   <Password 
                     v-model="passwordForm.currentPassword" 
                     :feedback="false"
                     :toggleMask="true"
                     class="w-full"
                     placeholder="Enter current password"
                     :disabled="!passwordEditMode"
                   />
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                   <Password 
                     v-model="passwordForm.newPassword" 
                     :feedback="true"
                     :toggleMask="true"
                     class="w-full"
                     placeholder="Enter new password"
                     :disabled="!passwordEditMode"
                   />
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                   <Password 
                     v-model="passwordForm.confirmPassword" 
                     :feedback="false"
                     :toggleMask="true"
                     class="w-full"
                     placeholder="Confirm new password"
                     :disabled="!passwordEditMode"
                   />
                 </div>
                 <div class="flex justify-between items-center">
                   <div class="flex space-x-3">
                     <Button 
                       v-if="!passwordEditMode"
                       @click="passwordEditMode = true" 
                       icon="lock_open"
                       label="Change Password"
                       severity="warning"
                       size="small"
                     />
                     <Button 
                       v-if="passwordEditMode"
                       @click="cancelPasswordChange" 
                       icon="close"
                       label="Cancel"
                       severity="secondary"
                       size="small"
                       text
                     />
                     <Button 
                       v-if="passwordEditMode"
                       @click="updatePassword" 
                       icon="save"
                       label="Update Password"
                       severity="success"
                       size="small"
                       :loading="updatingPassword"
                     />
                   </div>
                   <div v-if="passwordEditMode" class="text-xs text-gray-500">
                     Password must be at least 8 characters long
                   </div>
                 </div>
               </div>
             </template>
           </Card>
        </div>

        <!-- Right Column: Stats & Quick Actions -->
        <div class="space-y-6">
          <!-- Business Statistics -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Business Statistics</h3>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Entitlements</span>
                  <span class="text-lg font-semibold text-gray-900">{{ stats.totalEntitlements }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Available for Sale</span>
                  <span class="text-lg font-semibold text-green-600">{{ stats.availableEntitlements }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Sales</span>
                  <span class="text-lg font-semibold text-blue-600">{{ stats.totalSales }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Revenue</span>
                  <span class="text-lg font-semibold text-green-600">${{ stats.totalRevenue.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Profit</span>
                  <span class="text-lg font-semibold text-emerald-600">${{ stats.totalProfit.toFixed(2) }}</span>
                </div>
              </div>
            </template>
          </Card>

          <!-- Quick Actions -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </template>
            <template #content>
              <div class="space-y-2">
                <Button 
                  @click="navigateTo('/agent/buy-vouchers')" 
                  icon="add_card"
                  label="Buy Vouchers"
                  severity="secondary"
                  class="w-full justify-start"
                />
                <Button 
                  @click="navigateTo('/agent/create-sale')" 
                  icon="add_shopping_cart"
                  label="Create Sale"
                  severity="success"
                  class="w-full justify-start"
                />
                <Button 
                  @click="navigateTo('/agent/reports')" 
                  icon="analytics"
                  label="View Reports"
                  severity="info"
                  class="w-full justify-start"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Success Toast -->
      <Toast />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

// Get user session
const session = useUserSession()

// Toast instance
const toast = useToast()

// State
const passwordEditMode = ref(false)
const updatingPassword = ref(false)

// User and profile data
const user = ref<any>({})
const agentProfile = ref<any>({})
const stats = ref({
  totalEntitlements: 0,
  availableEntitlements: 0,
  totalSales: 0,
  totalRevenue: 0,
  totalProfit: 0
})

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
 })

// Computed
const profileInitials = computed(() => {
  if (agentProfile.value?.displayName) {
    return agentProfile.value.displayName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return 'AG'
})

// Fetch user data
const fetchUserData = async () => {
  try {
    const response = await $fetch('/api/agent/profile')
    if (response.success) {
      user.value = response.data.user
      agentProfile.value = response.data.agentProfile
      stats.value = response.data.stats
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load profile data',
      life: 3000
    })
  }
}

// Update password
const updatePassword = async () => {
  try {
    // Validate password fields
    if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'All password fields are required',
        life: 3000
      })
      return
    }

    if (passwordForm.value.newPassword.length < 8) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New password must be at least 8 characters long',
        life: 3000
      })
      return
    }

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match',
        life: 3000
      })
      return
    }

    updatingPassword.value = true
    const response = await $fetch('/api/agent/profile/password', {
      method: 'PUT',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    })
    
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Password updated successfully',
        life: 3000
      })
      cancelPasswordChange()
    }
  } catch (error: any) {
    console.error('Error updating password:', error)
    const errorMessage = error.data?.message || 'Failed to update password'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
  } finally {
    updatingPassword.value = false
  }
}

// Cancel password change
const cancelPasswordChange = () => {
  passwordEditMode.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// Utility functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fetch data on mount
onMounted(() => {
  fetchUserData()
  // Reset password form
  cancelPasswordChange()
})

// Meta tags
useHead({
  title: 'Agent Profile - UFO Networks',
  meta: [
    { name: 'description', content: 'Manage your agent profile and business settings.' }
  ]
})
</script>

<style scoped>
:deep(.p-card) {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:deep(.p-card:hover) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-inputtext:disabled) {
  background-color: #f9fafb;
  color: #6b7280;
}
</style>
