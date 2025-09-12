<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#10b981] via-[#059669] to-[#10b981]/90 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <!-- Logo Section -->
      <div class="flex items-center justify-between p-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center shadow-lg border border-white/30 backdrop-blur-sm">
            <span class="material-icons text-white text-xl">store</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">UFO Networks</h1>
            <p class="text-xs text-white/80">Agent Dashboard</p>
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
      <nav class="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        <div v-for="section in navigationSections" :key="section.title" class="mb-6">
          <h3 class="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-3">
            {{ section.title }}
          </h3>
          <div class="space-y-1">
            <NuxtLink
              v-for="item in section.items"
              :key="item.path"
              :to="item.path"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
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
            </NuxtLink>
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
             @click="showLogoutConfirm"
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
              <span class="material-icons text-[#059669]">menu</span>
            </button>
            
            <!-- Breadcrumb -->
            <nav class="hidden sm:flex items-center space-x-2 text-sm">
              <span class="text-[#059669]/40">Agent</span>
              <span class="material-icons text-[#059669]/30 text-xs">chevron_right</span>
              <span class="text-[#059669] font-medium">{{ currentPageTitle }}</span>
            </nav>
          </div>

          <!-- Center - Date and Time -->
          <div class="hidden lg:flex items-center space-x-6">
            <!-- Current Date -->
            <div class="text-center">
              <div class="text-sm font-medium text-[#059669]">{{ currentDate }}</div>
              <div class="text-xs text-[#059669]/60">{{ currentDay }}</div>
            </div>
            
            <!-- Current Time -->
            <div class="text-center">
              <div class="text-lg font-bold text-[#10b981]">{{ currentTime }}</div>
              <div class="text-xs text-[#059669]/60">Local Time</div>
            </div>
          </div>

          <!-- Right side - Search, notifications, user, and actions -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
           

            <!-- Notifications -->
           
        

            <!-- Current User -->
            <div class="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div class="w-8 h-8 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center">
                <span class="material-icons text-white text-sm">person</span>
              </div>
              <div class="hidden sm:block">
                <div class="text-sm font-medium text-[#059669]">{{ currentUser.name }}</div>
                <div class="text-xs text-[#059669]/60">{{ currentUser.role }}</div>
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
  </div>
</template>

<script lang="ts" setup>
// Sidebar state
const sidebarOpen = ref(false)

// Search state
const searchQuery = ref('')

// Notifications state
const showNotifications = ref(false)
const notificationCount = ref(0)

// User actions
const selectedUserAction = ref(null)
const userActions = ref([
  { label: 'Profile', icon: 'person', action: 'profile' },
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
      name: userData.name || 'Agent User',
      role: userData.role === 'AGENT' ? 'Agent' : 'User',
      email: userData.email || 'agent@ufonetworks.com',
      phone: userData.phone || '',
      id: userData.id
    }
  }
  return {
    name: 'Agent User',
    role: 'Agent',
    email: 'agent@ufonetworks.com',
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

// Navigation sections for agents
const navigationSections = ref([
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'dashboard', path: '/agent' }
    ]
  },
  {
    title: 'Sales',
    items: [
      { label: 'My Sales', icon: 'point_of_sale', path: '/agent/sales' },
      { label: 'Create Sale', icon: 'add_shopping_cart', path: '/agent/create-sale' }
    ]
  },
  {
    title: 'Purchases',
    items: [
      { label: 'My Inventory', icon: 'shopping_basket', path: '/agent/entitlements' },
      { label: 'Buy Vouchers', icon: 'add_card', path: '/agent/buy-vouchers' }
    ]
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Sales Reports', icon: 'analytics', path: '/agent/reports' }
    ]
  },
  {
    title: 'Settings',
    items: [
      { label: 'Profile', icon: 'person', path: '/agent/profile' }
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

// Show logout confirmation
const showLogoutConfirm = () => {
  if (confirm('Are you sure you want to logout? You will need to login again to access your account.')) {
    handleLogout()
  }
}

// Handle user actions
const handleUserAction = (action: any) => {
  console.log('User action clicked:', action.action)
  switch (action.action) {
    case 'profile':
      navigateTo('/agent/profile')
      break
    case 'logout':
      showLogoutConfirm()
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
</script>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Firefox scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
}
</style>
