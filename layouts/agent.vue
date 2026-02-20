<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <!-- Logo Section -->
      <div class="flex items-center justify-between p-5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
            <span class="material-icons text-white text-xl">store</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-800">UFO Networks</h1>
            <p class="text-xs text-slate-500">Agent Dashboard</p>
          </div>
        </div>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors touch-manipulation"
          aria-label="Close menu"
        >
          <span class="material-icons">close</span>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        <div v-for="section in navigationSections" :key="section.title" class="mb-5">
          <h3 class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
            {{ section.title }}
          </h3>
          <div class="space-y-0.5">
            <NuxtLink
              v-for="item in section.items"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation"
              :class="[
                (item.path === '/agent' ? $route.path === '/agent' : $route.path.startsWith(item.path))
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <span class="material-icons text-[22px]" :class="(item.path === '/agent' ? $route.path === '/agent' : $route.path.startsWith(item.path)) ? 'text-emerald-600' : ''">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- User Profile Section -->
      <div class="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <span class="material-icons text-white text-sm">person</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-800 truncate">{{ currentUser.name }}</p>
            <p class="text-xs text-slate-500">{{ currentUser.role }}</p>
          </div>
          <Button
            @click="showLogoutConfirm"
            icon="logout"
            text
            severity="secondary"
            size="small"
            class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200"
          />
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 lg:ml-64 min-h-screen flex flex-col">
      <!-- Header: mobile-first, touch-friendly -->
      <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-sm safe-area-inset-top">
        <div class="flex items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
          <!-- Left - Menu (mobile) + Breadcrumb or page title -->
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <button
              @click="sidebarOpen = true"
              class="lg:hidden flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-colors touch-manipulation"
              aria-label="Open menu"
            >
              <span class="material-icons">menu</span>
            </button>
            <!-- Page title on mobile (truncated); full breadcrumb on sm+ -->
            <nav class="flex items-center gap-2 text-sm min-w-0">
              <span class="font-semibold text-slate-800 truncate sm:hidden">{{ currentPageTitle }}</span>
              <span class="hidden sm:flex items-center gap-2 text-slate-400 min-w-0">
                <span class="text-slate-400 flex-shrink-0">Agent</span>
                <span class="material-icons text-slate-300 text-xs flex-shrink-0">chevron_right</span>
                <span class="font-semibold text-slate-800 truncate">{{ currentPageTitle }}</span>
              </span>
            </nav>
          </div>

          <!-- Center - Date & Time (desktop only) -->
          <div class="hidden lg:flex items-center gap-6 flex-shrink-0">
            <div class="text-center">
              <div class="text-sm font-medium text-slate-700">{{ currentDate }}</div>
              <div class="text-xs text-slate-500">{{ currentDay }}</div>
            </div>
            <div class="w-px h-8 bg-slate-200" />
            <div class="text-center">
              <div class="text-lg font-bold text-emerald-600">{{ currentTime }}</div>
              <div class="text-xs text-slate-500">Local</div>
            </div>
          </div>

          <!-- Right - User + Actions (touch-sized) -->
          <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div class="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm min-h-[44px]">
              <div class="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-white text-sm">person</span>
              </div>
              <div class="hidden sm:block">
                <div class="text-sm font-semibold text-slate-800">{{ currentUser.name }}</div>
                <div class="text-xs text-slate-500">{{ currentUser.role }}</div>
              </div>
            </div>

            <Dropdown
              v-model="selectedUserAction"
              :options="userActions"
              optionLabel="label"
              placeholder="Actions"
              class="w-full min-w-[120px] sm:w-48"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center space-x-2">
                  <span class="material-icons text-sm">{{ slotProps.value.icon }}</span>
                  <span class="hidden sm:inline">{{ slotProps.value.label }}</span>
                </div>
                <span v-else class="flex items-center">
                  <span class="material-icons text-sm text-slate-500">more_vert</span>
                </span>
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

      <!-- Page Content: mobile-friendly padding and safe area -->
      <main class="p-4 sm:p-6 md:p-8 flex-1 overflow-x-hidden pb-safe">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="flex-shrink-0 border-t border-slate-200 bg-white/80 py-4 px-4 sm:px-6 md:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <span class="font-medium text-slate-700">UFO Networks</span>
          <span>
            Powered by
            <a
              href="https://webdev.co.zw"
              target="_blank"
              rel="noopener noreferrer"
              class="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              webdev
            </a>
          </span>
        </div>
      </footer>
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
  } catch (error) {
    console.error('Logout error:', error)
  }
  // Always full-page redirect to landing so session is cleared and UI updates (works on mobile)
  if (typeof location !== 'undefined') {
    location.replace('/')
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
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Safe area for notched devices (e.g. iPhone) */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
.safe-area-inset-top {
  padding-top: env(safe-area-inset-top, 0);
}

/* Touch-friendly dropdown trigger in header */
:deep(header .p-dropdown) {
  min-height: 44px;
}
</style>
