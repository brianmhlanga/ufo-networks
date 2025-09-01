<template>
  <NuxtLayout name="admin">
    <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[#2d3040] mb-2">Dashboard Overview</h1>
      <p class="text-[#2d3040]/60">Welcome back! Here's what's happening with UFO Networks today.</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Users -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60 mb-1">Total Users</p>
              <p class="text-2xl font-bold text-[#2d3040]">{{ stats.totalUsers.toLocaleString() }}</p>
              <p class="text-xs text-green-600 mt-1">
                <span class="material-icons text-xs mr-1">trending_up</span>
                +12% from last month
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span class="material-icons text-white text-xl">people</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Vouchers -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60 mb-1">Active Vouchers</p>
              <p class="text-2xl font-bold text-[#2d3040]">{{ stats.activeVouchers.toLocaleString() }}</p>
              <p class="text-xs text-green-600 mt-1">
                <span class="material-icons text-xs mr-1">trending_up</span>
                +8% from last week
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span class="material-icons text-white text-xl">redeem</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Revenue -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60 mb-1">Total Revenue</p>
              <p class="text-2xl font-bold text-[#2d3040]">${{ stats.totalRevenue.toLocaleString() }}</p>
              <p class="text-xs text-green-600 mt-1">
                <span class="material-icons text-xs mr-1">trending_up</span>
                +15% from last month
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span class="material-icons text-white text-xl">attach_money</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Locations -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-[#2d3040]/60 mb-1">Active Locations</p>
              <p class="text-2xl font-bold text-[#2d3040]">{{ stats.activeLocations }}</p>
              <p class="text-xs text-blue-600 mt-1">
                <span class="material-icons text-xs mr-1">location_on</span>
                Across Zimbabwe
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span class="material-icons text-white text-xl">location_on</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts and Analytics Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Revenue Chart -->
      <Card class="chart-card">
        <template #title>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#2d3040]">Revenue Overview</h3>
            <Dropdown
              v-model="selectedRevenuePeriod"
              :options="revenuePeriods"
              optionLabel="label"
              placeholder="Last 7 days"
              class="w-32"
            />
          </div>
        </template>
        <template #content>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <span class="material-icons text-4xl text-[#2d3040]/20 mb-2">bar_chart</span>
              <p class="text-[#2d3040]/40">Revenue chart will be displayed here</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- Voucher Usage Chart -->
      <Card class="chart-card">
        <template #title>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#2d3040]">Voucher Usage</h3>
            <Dropdown
              v-model="selectedVoucherPeriod"
              :options="voucherPeriods"
              optionLabel="label"
              placeholder="Last 30 days"
              class="w-32"
            />
          </div>
        </template>
        <template #content>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <span class="material-icons text-4xl text-[#2d3040]/20 mb-2">pie_chart</span>
              <p class="text-[#2d3040]/40">Voucher usage chart will be displayed here</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Activities and Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <Card class="activity-card">
        <template #title>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#2d3040]">Recent Orders</h3>
            <Button
              label="View All"
              text
              size="small"
              class="text-[#185ff9] hover:text-[#185ff9]/80"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9]/10 to-[#2d3040]/10 rounded-lg flex items-center justify-center">
                <span class="material-icons text-[#185ff9] text-lg">receipt</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[#2d3040] truncate">{{ order.customerName }}</p>
                <p class="text-xs text-[#2d3040]/60">{{ order.items }} vouchers • ${{ order.amount }}</p>
              </div>
              <div class="text-right">
                <span :class="getStatusBadgeClass(order.status)" class="text-xs px-2 py-1 rounded-full">
                  {{ order.status }}
                </span>
                <p class="text-xs text-[#2d3040]/40 mt-1">{{ order.timeAgo }}</p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Recent Users -->
      <Card class="activity-card">
        <template #title>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#2d3040]">Recent Users</h3>
            <Button
              label="View All"
              text
              size="small"
              class="text-[#185ff9] hover:text-[#185ff9]/80"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div v-for="user in recentUsers" :key="user.id" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9]/10 to-[#2d3040]/10 rounded-full flex items-center justify-center">
                <span class="material-icons text-[#185ff9] text-lg">person</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[#2d3040] truncate">{{ user.name }}</p>
                <p class="text-xs text-[#2d3040]/60">{{ user.email }}</p>
              </div>
              <div class="text-right">
                <span :class="getRoleBadgeClass(user.role)" class="text-xs px-2 py-1 rounded-full">
                  {{ user.role }}
                </span>
                <p class="text-xs text-[#2d3040]/40 mt-1">{{ user.timeAgo }}</p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Quick Actions -->
      <Card class="quick-actions-card">
        <template #title>
          <h3 class="text-lg font-semibold text-[#2d3040]">Quick Actions</h3>
        </template>
        <template #content>
          <div class="space-y-3">
            <Button
              v-for="action in quickActions"
              :key="action.id"
              :label="action.label"
              :icon="action.icon"
              class="w-full justify-start p-3 text-left"
              @click="handleQuickAction(action)"
            >
              <template #icon>
                <span class="material-icons mr-3">{{ action.icon }}</span>
              </template>
            </Button>
          </div>
        </template>
      </Card>
    </div>

    <!-- System Status -->
    <Card class="mt-8">
      <template #title>
        <h3 class="text-lg font-semibold text-[#2d3040]">System Status</h3>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p class="text-sm font-medium text-[#2d3040]">Database</p>
              <p class="text-xs text-[#2d3040]/60">Online</p>
            </div>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p class="text-sm font-medium text-[#2d3040]">Payment Gateway</p>
              <p class="text-xs text-[#2d3040]/60">Connected</p>
            </div>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p class="text-sm font-medium text-[#2d3040]">Email Service</p>
              <p class="text-xs text-[#2d3040]/60">Active</p>
            </div>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p class="text-sm font-medium text-[#2d3040]">API Services</p>
              <p class="text-xs text-[#2d3040]/60">Running</p>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
  </NuxtLayout>
  
</template>

<script lang="ts" setup>
import { primaryColor, secondaryColor } from '~/configs/colors'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Dashboard statistics
const stats = ref({
  totalUsers: 15420,
  activeVouchers: 8920,
  totalRevenue: 45680,
  activeLocations: 45
})

// Chart periods
const selectedRevenuePeriod = ref({ label: 'Last 7 days', value: '7d' })
const selectedVoucherPeriod = ref({ label: 'Last 30 days', value: '30d' })

const revenuePeriods = ref([
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'Last year', value: '1y' }
])

const voucherPeriods = ref([
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'Last year', value: '1y' }
])

// Recent orders
const recentOrders = ref([
  {
    id: 1,
    customerName: 'John Doe',
    items: 2,
    amount: 15.00,
    status: 'PAID',
    timeAgo: '2 min ago'
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    items: 1,
    amount: 8.50,
    status: 'PENDING',
    timeAgo: '5 min ago'
  },
  {
    id: 3,
    customerName: 'Mike Johnson',
    items: 3,
    amount: 22.50,
    status: 'PAID',
    timeAgo: '12 min ago'
  },
  {
    id: 4,
    customerName: 'Sarah Wilson',
    items: 1,
    amount: 8.50,
    status: 'FAILED',
    timeAgo: '15 min ago'
  }
])

// Recent users
const recentUsers = ref([
  {
    id: 1,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'CUSTOMER',
    timeAgo: '5 min ago'
  },
  {
    id: 2,
    name: 'Bob Davis',
    email: 'bob@example.com',
    role: 'AGENT',
    timeAgo: '12 min ago'
  },
  {
    id: 3,
    name: 'Carol Evans',
    email: 'carol@example.com',
    role: 'CUSTOMER',
    timeAgo: '25 min ago'
  },
  {
    id: 4,
    name: 'David Miller',
    email: 'david@example.com',
    role: 'AGENT',
    timeAgo: '1 hour ago'
  }
])

// Quick actions
const quickActions = ref([
  {
    id: 1,
    label: 'Add New User',
    icon: 'person_add',
    action: 'add-user'
  },
  {
    id: 2,
    label: 'Create Voucher Batch',
    icon: 'add_card',
    action: 'create-batch'
  },
  {
    id: 3,
    label: 'Add Location',
    icon: 'location_on',
    action: 'add-location'
  },
  {
    id: 4,
    label: 'Generate Report',
    icon: 'assessment',
    action: 'generate-report'
  },
  {
    id: 5,
    label: 'Manage Agents',
    icon: 'store',
    action: 'manage-agents'
  }
])

// Status badge classes
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Role badge classes
const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'AGENT':
      return 'bg-blue-100 text-blue-800'
    case 'CUSTOMER':
      return 'bg-green-100 text-green-800'
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Handle quick actions
const handleQuickAction = (action: any) => {
  console.log('Quick action clicked:', action.action)
  // TODO: Implement navigation or modal opening based on action
}

// Meta tags
useHead({
  title: 'Admin Dashboard - UFO Networks',
  meta: [
    { name: 'description', content: 'UFO Networks Admin Dashboard - Overview and statistics.' }
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

/* Card customizations */
.stat-card {
  @apply transition-all duration-300 hover:shadow-lg;
}

.stat-card :deep(.p-card) {
  @apply border-0 shadow-sm hover:shadow-md transition-all duration-300;
}

.chart-card :deep(.p-card) {
  @apply border-0 shadow-sm;
}

.activity-card :deep(.p-card) {
  @apply border-0 shadow-sm;
}

.quick-actions-card :deep(.p-card) {
  @apply border-0 shadow-sm;
}

/* Button customizations */
:deep(.p-button) {
  @apply border-0 font-medium transition-all duration-200;
}

:deep(.p-button.p-button-text) {
  @apply text-[#185ff9] hover:text-[#185ff9]/80 hover:bg-[#185ff9]/5;
}

:deep(.p-button:not(.p-button-text)) {
  @apply bg-white border border-gray-200 text-[#2d3040] hover:bg-gray-50 hover:border-[#185ff9]/20;
}

/* Dropdown customizations */
:deep(.p-dropdown) {
  @apply border-gray-200;
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  @apply border-[#185ff9]/30;
}

:deep(.p-dropdown.p-focus) {
  @apply border-[#185ff9] ring-[#185ff9]/10;
}

/* Material Icons */
.material-icons {
  font-size: 20px;
}

.material-icons.text-lg {
  font-size: 1.125rem;
}

.material-icons.text-xl {
  font-size: 1.25rem;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease;
}

/* Hover effects */
.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 1);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
