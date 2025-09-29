<template>
  <div class="min-h-screen bg-gray-50 flex">
         <!-- Sidebar -->
     <div 
       class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#185ff9] via-[#2d3040] to-[#185ff9]/90 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col"
       :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
     >
             <!-- Logo Section -->
       <div class="flex items-center justify-between p-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
         <div class="flex items-center space-x-3">
           <div class="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 backdrop-blur-sm">
             <span class="material-icons text-white text-xl">admin_panel_settings</span>
           </div>
           <div>
             <h1 class="text-xl font-bold text-white">UFO Networks</h1>
             <p class="text-xs text-white/80">Admin Dashboard</p>
           </div>
         </div>
         <!-- Close button for mobile -->
         <button 
           @click="sidebarOpen = false"
           class="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
         >
           <span class="material-icons text-white/80">close</span>
         </button>
       </div>

                                                                                                               <!-- Navigation Menu -->
          <nav class="flex-1 overflow-y-auto p-4 space-y-2">
           <div v-for="section in navigationSections" :key="section.title" class="mb-6">
             <h3 class="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-3">
               {{ section.title }}
             </h3>
             <div class="space-y-1">
               <a
                 v-for="item in section.items"
                 :key="item.path"
                 @click="handleNavigationClick(item) ? navigateTo(item.path) : null"
                 class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer"
                 :class="[
                   $route.path.startsWith(item.path) 
                     ? 'bg-white/20 text-white border-r-2 border-white shadow-lg backdrop-blur-sm' 
                     : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md backdrop-blur-sm'
                 ]"
               >
                 <span class="material-icons text-lg group-hover:scale-110 transition-transform">
                   {{ item.icon }}
                 </span>
                 <span>{{ item.label }}</span>
                 <span v-if="item.comingSoon" class="ml-auto text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full">
                   Soon
                 </span>
               </a>
             </div>
           </div>
         </nav>

                            <!-- User Profile Section -->
         <div class="flex-shrink-0 p-4 border-t border-white/20 bg-white/10 backdrop-blur-sm">
         <div class="flex items-center space-x-3">
           <div class="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/30">
             <span class="material-icons text-white text-sm">person</span>
           </div>
           <div class="flex-1 min-w-0">
             <p class="text-sm font-medium text-white truncate">{{ currentUser.name }}</p>
             <p class="text-xs text-white/80">{{ currentUser.role }}</p>
           </div>
           <Button
             @click="handleLogout"
             icon="logout"
             text
             severity="secondary"
             size="small"
             class="p-2 text-white/80 hover:text-white hover:bg-white/10"
           />
         </div>
       </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 lg:ml-64 min-h-screen">
             <!-- Header -->
       <header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
         <div class="flex items-center justify-between px-6 py-4">
           <!-- Left side - Menu button and breadcrumb -->
           <div class="flex items-center space-x-4">
             <button 
               @click="sidebarOpen = true"
               class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
             >
               <span class="material-icons text-[#2d3040]">menu</span>
             </button>
             
             <!-- Breadcrumb -->
             <nav class="hidden sm:flex items-center space-x-2 text-sm">
               <span class="text-[#2d3040]/40">Admin</span>
               <span class="material-icons text-[#2d3040]/30 text-xs">chevron_right</span>
               <span class="text-[#2d3040] font-medium">{{ currentPageTitle }}</span>
             </nav>
           </div>

           <!-- Center - Date and Time -->
           <div class="hidden lg:flex items-center space-x-6">
             <!-- Current Date -->
             <div class="text-center">
               <div class="text-sm font-medium text-[#2d3040]">{{ currentDate }}</div>
               <div class="text-xs text-[#2d3040]/60">{{ currentDay }}</div>
             </div>
             
             <!-- Current Time -->
             <div class="text-center">
               <div class="text-lg font-bold text-[#185ff9]">{{ currentTime }}</div>
               <div class="text-xs text-[#2d3040]/60">Local Time</div>
             </div>
           </div>

           <!-- Right side - Search, notifications, user, and actions -->
           <div class="flex items-center space-x-4">
             <!-- Search -->
             <div class="relative hidden md:block">
               <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2d3040]/40 text-sm">
                 search
               </span>
               <InputText
                 v-model="searchQuery"
                 placeholder="Search..."
                 class="pl-10 pr-4 py-2 w-64 text-sm border-gray-200 focus:border-[#185ff9] focus:ring-[#185ff9]/10"
               />
             </div>

             <!-- Notifications -->
             <Button
               icon="notifications"
               text
               severity="secondary"
               size="small"
               class="relative"
               @click="showNotifications = !showNotifications"
             >
               <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                 3
               </span>
             </Button>

             <!-- Current User -->
             <div class="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
               <div class="w-8 h-8 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-full flex items-center justify-center">
                 <span class="material-icons text-white text-sm">person</span>
               </div>
               <div class="hidden sm:block">
                 <div class="text-sm font-medium text-[#2d3040]">{{ currentUser.name }}</div>
                 <div class="text-xs text-[#2d3040]/60">{{ currentUser.role }}</div>
               </div>
             </div>

             <!-- User Actions Dropdown -->
             <Dropdown
               v-model="selectedUserAction"
               :options="userActions"
               optionLabel="label"
               placeholder="Actions"
               class="w-48"
             >
               <template #value="slotProps">
                 <div v-if="slotProps.value" class="flex items-center space-x-2">
                   <span class="material-icons text-sm">{{ slotProps.value.icon }}</span>
                   <span>{{ slotProps.value.label }}</span>
                 </div>
               </template>
               <template #option="slotProps">
                 <div class="flex items-center space-x-2">
                   <span class="material-icons text-sm">{{ slotProps.option.icon }}</span>
                   <span>{{ slotProps.option.label }}</span>
                 </div>
               </template>
             </Dropdown>
           </div>
         </div>
       </header>

      <!-- Page Content -->
      <main class="p-6 flex-1">
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>
    
    <!-- Toast Component -->
    <Toast />
  </div>
</template>

<script lang="ts" setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { useToast } from 'primevue/usetoast'

// Toast instance
const toast = useToast()

// Sidebar state
const sidebarOpen = ref(false)

// Search state
const searchQuery = ref('')

// Notifications state
const showNotifications = ref(false)

 // Quick actions
 const selectedQuickAction = ref(null)
 const quickActions = ref([
   { label: 'Add New User', icon: 'person_add', action: 'add-user' },
   { label: 'Create Voucher Batch', icon: 'add_card', action: 'create-batch' },
   { label: 'Add Location', icon: 'location_on', action: 'add-location' },
   { label: 'Generate Report', icon: 'assessment', action: 'generate-report' }
 ])

 // User actions
 const selectedUserAction = ref(null)
 const userActions = ref([
   { label: 'Profile Settings', icon: 'person', action: 'profile' },
   { label: 'Account Settings', icon: 'settings', action: 'account' },
   { label: 'Change Password', icon: 'lock', action: 'password' },
   { label: 'Notifications', icon: 'notifications', action: 'notifications' },
   { label: 'Help & Support', icon: 'help', action: 'help' },
   { label: 'Logout', icon: 'logout', action: 'logout' }
 ])

 // Get user session
 const session = useUserSession()
 
 // Current user data from session
 const currentUser = computed(() => {
   const { user } = session
   if (user?.value) {
     const userData = user.value as any
     return {
       name: userData.name || 'Admin User',
       role: userData.role === 'SUPER_ADMIN' ? 'Super Administrator' : 
             userData.role === 'ADMIN' ? 'Administrator' : 
             userData.role === 'AGENT' ? 'Agent' : 'Customer',
       email: userData.email || 'admin@ufonetworks.com',
       phone: userData.phone || '',
       id: userData.id
     }
   }
   return {
     name: 'Admin User',
     role: 'Administrator',
     email: 'admin@ufonetworks.com',
     phone: '',
     id: ''
   }
 })

 // Date and time
 const currentDate = ref('')
 const currentDay = ref('')
 const currentTime = ref('')
 


 // Update date and time
 const updateDateTime = () => {
   const now = new Date()
   
   // Format date
   currentDate.value = now.toLocaleDateString('en-US', {
     month: 'short',
     day: 'numeric',
     year: 'numeric'
   })
   
   // Format day
   currentDay.value = now.toLocaleDateString('en-US', {
     weekday: 'long'
   })
   
   // Format time
   currentTime.value = now.toLocaleTimeString('en-US', {
     hour: '2-digit',
     minute: '2-digit',
     hour12: true
   })
 }

 // Initialize and update time every second
 onMounted(() => {
   updateDateTime()
   setInterval(updateDateTime, 1000)
 })

// Navigation sections based on Prisma schema
const navigationSections = ref([
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'dashboard', path: '/admin' }
    ]
  },
  {
    title: 'Network',
    items: [
      { label: 'Locations', icon: 'location_on', path: '/admin/locations' },
      { label: 'Voucher Batches', icon: 'inventory', path: '/admin/batches' },
      { label: 'Vouchers', icon: 'redeem', path: '/admin/vouchers' }
    ]
  },
  {
    title: 'Sales & Orders',
    items: [
      { label: 'Orders', icon: 'shopping_cart', path: '/admin/orders' },
      { label: 'Payments', icon: 'payment', path: '/admin/payments' },
      { label: 'Agent Sales', icon: 'point_of_sale', path: '/admin/agent-sales' }
    ]
  },
  {
    title: 'Advertising',
    items: [
      { label: 'Packages', icon: 'shopping_cart', path: '/admin/ad-packages', comingSoon: true },
      { label: 'Advertisers', icon: 'business', path: '/admin/advertisers', comingSoon: true },
      { label: 'Ads', icon: 'campaign', path: '/admin/ads' }
    ]
  },
  {
    title: 'User Management',
    items: [
      { label: 'Users', icon: 'people', path: '/admin/users' },
      { label: 'Agents', icon: 'store', path: '/admin/agents' }
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', icon: 'person', path: '/admin/profile' }
    ]
  }
])

// Computed current page title
const currentPageTitle = computed(() => {
  const route = useRoute()
  const currentSection = navigationSections.value.find(section => 
    section.items.some(item => route.path.startsWith(item.path))
  )
  if (currentSection) {
    const currentItem = currentSection.items.find(item => 
      route.path.startsWith(item.path)
    )
    return currentItem?.label || 'Dashboard'
  }
  return 'Dashboard'
})

 // Handle navigation clicks
 const handleNavigationClick = (item: any) => {
   if (item.comingSoon) {
     toast.add({
       severity: 'info',
       summary: 'Coming Soon',
       detail: `${item.label} feature is coming soon!`,
       life: 3000
     })
     return false // Prevent navigation
   }
   return true // Allow navigation
 }

 // Handle logout
 const handleLogout = async () => {
   try {
     await $fetch('/api/auth/logout', {
       method: 'POST'
     })
     
     // Redirect to login page
     await navigateTo('/login')
   } catch (error) {
     console.error('Logout error:', error)
     // Even if logout fails, redirect to login
     await navigateTo('/login')
   }
 }

 // Handle user actions
 const handleUserAction = (action: any) => {
   console.log('User action clicked:', action.action)
   // TODO: Implement user action logic based on action.action
   switch (action.action) {
     case 'profile':
       // Navigate to profile settings
       break
     case 'account':
       // Navigate to account settings
       break
     case 'password':
       // Open change password modal
       break
     case 'notifications':
       // Open notifications settings
       break
     case 'help':
       // Open help and support
       break
     case 'logout':
       handleLogout()
       break
   }
   selectedUserAction.value = null
 }

 // Watch for user action selection
 watch(selectedUserAction, (newValue) => {
   if (newValue) {
     handleUserAction(newValue)
   }
 })

// Watch for route changes to close sidebar on mobile
watch(() => useRoute().path, () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})

// Meta tags
useHead({
  title: 'Admin Dashboard - UFO Networks',
  meta: [
    { name: 'description', content: 'UFO Networks Admin Dashboard - Manage users, vouchers, locations, and more.' }
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
:deep(.p-inputtext) {
  border-radius: 8px;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

:deep(.p-inputtext:focus) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
}

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  border-radius: 0 8px 8px 0;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

:deep(.p-dropdown .p-dropdown-label) {
  border-radius: 8px 0 0 8px;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

:deep(.p-dropdown:not(.p-disabled):hover .p-dropdown-trigger) {
  border-color: #185ff9;
  background: rgba(255, 255, 255, 1);
}

:deep(.p-dropdown:not(.p-disabled):hover .p-dropdown-label) {
  border-color: #185ff9;
  background: rgba(255, 255, 255, 1);
}

:deep(.p-dropdown.p-focus .p-dropdown-trigger) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
}

:deep(.p-dropdown.p-focus .p-dropdown-label) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
}

:deep(.p-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.875rem;
}

:deep(.p-button.p-button-text) {
  color: rgba(45, 48, 64, 0.7);
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(24, 95, 249, 0.1);
  color: #185ff9;
}

/* Material Icons sizing */
.material-icons {
  font-size: 20px;
}

.material-icons.text-lg {
  font-size: 1.125rem;
}

.material-icons.text-sm {
  font-size: 0.875rem;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease;
}

 /* Custom scrollbar for sidebar */
 nav {
   scrollbar-width: thin;
   scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
 }
 
 nav::-webkit-scrollbar {
   width: 6px;
 }
 
 nav::-webkit-scrollbar-track {
   background: transparent;
 }
 
 nav::-webkit-scrollbar-thumb {
   background-color: rgba(255, 255, 255, 0.3);
   border-radius: 3px;
   border: 1px solid rgba(255, 255, 255, 0.1);
 }
 
 nav::-webkit-scrollbar-thumb:hover {
   background-color: rgba(255, 255, 255, 0.5);
 }
 
 /* Enhanced sidebar effects */
 .sidebar-gradient {
   background: linear-gradient(135deg, #185ff9 0%, #2d3040 50%, #185ff9 100%);
   position: relative;
 }
 
 .sidebar-gradient::before {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
   pointer-events: none;
 }
</style>
