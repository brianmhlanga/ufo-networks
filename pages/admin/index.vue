<template>
  <NuxtLayout name="admin">
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p class="text-gray-600">Comprehensive insights into your network performance, sales, and user behavior</p>
        </div>
        <div class="flex items-center space-x-3">
         
          <Button 
            @click="refreshAnalytics" 
            icon="refresh" 
            label="Refresh" 
            :loading="loading"
            severity="info"
          />
        </div>
      </div>

      <!-- Filters -->
      <Card>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <Select 
                v-model="filters.dateRange" 
                :options="dateRangeOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select Date Range" 
                class="w-full"
                @change="onFilterChange"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Select 
                v-model="filters.locationId" 
                :options="locationOptions" 
                optionLabel="label" 
                optionValue="id"
                placeholder="All Locations" 
                class="w-full"
                @change="onFilterChange"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">User Role</label>
              <Select 
                v-model="filters.userRole" 
                :options="userRoleOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All Roles" 
                class="w-full"
                @change="onFilterChange"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Voucher Status</label>
              <Select 
                v-model="filters.voucherStatus" 
                :options="voucherStatusOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All Statuses" 
                class="w-full"
                @change="onFilterChange"
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

      <!-- Key Metrics Cards -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-lg p-6 h-32"></div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p class="text-2xl font-bold">${{ formatCurrency(metrics?.totalRevenue) }}</p>
                <p class="text-blue-200 text-xs">{{ (metrics?.revenueGrowth || 0) > 0 ? '+' : '' }}{{ metrics?.revenueGrowth || 0 }}% vs last period</p>
              </div>
              <span class="material-icons text-3xl text-blue-200">trending_up</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Active Vouchers</p>
                <p class="text-2xl font-bold">{{ (metrics?.activeVouchers || 0).toLocaleString() }}</p>
                <p class="text-green-200 text-xs">{{ metrics?.voucherUtilization || 0 }}% utilization</p>
              </div>
              <span class="material-icons text-3xl text-green-200">redeem</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm font-medium">Total Users</p>
                <p class="text-2xl font-bold">{{ (metrics?.totalUsers || 0).toLocaleString() }}</p>
                <p class="text-purple-200 text-xs">{{ metrics?.newUsers || 0 }} new this period</p>
              </div>
              <span class="material-icons text-3xl text-purple-200">people</span>
            </div>
          </template>
        </Card>

        <Card class="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-sm font-medium">Conversion Rate</p>
                <p class="text-2xl font-bold">{{ metrics?.conversionRate || 0 }}%</p>
                <p class="text-orange-200 text-xs">{{ (metrics?.conversionGrowth || 0) > 0 ? '+' : '' }}{{ metrics?.conversionGrowth || 0 }}% vs last period</p>
              </div>
              <span class="material-icons text-3xl text-orange-200">analytics</span>
            </div>
          </template>
        </Card>
      </div>

      <!-- Additional Metrics Summary -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-gray-200 rounded-lg p-6 h-48"></div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <template #content>
            <div class="text-center">
              <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <span class="material-icons text-3xl text-blue-600">location_on</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Network Coverage</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Locations</span>
                  <span class="font-semibold">{{ metrics.totalLocations || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Active Locations</span>
                  <span class="font-semibold text-green-600">{{ metrics.activeLocations || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Coverage Area</span>
                  <span class="font-semibold">{{ metrics.coverageArea || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #content>
            <div class="text-center">
              <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <span class="material-icons text-3xl text-green-600">store</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Agent Performance</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Agents</span>
                  <span class="font-semibold">{{ metrics.totalAgents || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Active Agents</span>
                  <span class="font-semibold text-green-600">{{ metrics.activeAgents || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Avg Commission</span>
                  <span class="font-semibold">{{ metrics.avgCommission || 0 }}%</span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <Card>
          <template #content>
            <div class="text-center">
              <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                <span class="material-icons text-3xl text-purple-600">campaign</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Advertising</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Active Ads</span>
                  <span class="font-semibold">{{ metrics.activeAds || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Impressions</span>
                  <span class="font-semibold">{{ metrics.totalImpressions || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Click Rate</span>
                  <span class="font-semibold">{{ metrics.clickRate || 0 }}%</span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts Row 1: Revenue & Sales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Trend Chart -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p class="text-sm text-gray-600">Daily revenue over the selected period</p>
            </div>
            <Chart 
              type="line" 
              :data="revenueChartData" 
              :options="revenueChartOptions" 
              class="h-80"
            />
          </template>
        </Card>

        <!-- Sales by Location Chart -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Sales by Location</h3>
              <p class="text-sm text-gray-600">Revenue distribution across locations</p>
            </div>
            <Chart 
              type="doughnut" 
              :data="locationSalesChartData" 
              :options="doughnutChartOptions" 
              class="h-80"
            />
          </template>
        </Card>
      </div>

      <!-- Charts Row 2: Vouchers & Users -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Voucher Status Distribution -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Voucher Status Distribution</h3>
              <p class="text-sm text-gray-600">Current status of all vouchers</p>
            </div>
            <Chart 
              type="pie" 
              :data="voucherStatusChartData" 
              :options="pieChartOptions" 
              class="h-80"
            />
          </template>
        </Card>

        <!-- User Growth Chart -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">User Growth</h3>
              <p class="text-sm text-gray-600">New user registrations over time</p>
            </div>
            <Chart 
              type="bar" 
              :data="userGrowthChartData" 
              :options="barChartOptions" 
              class="h-80"
            />
          </template>
        </Card>
      </div>

      <!-- Charts Row 3: Performance & Advertising -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Network Performance -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Network Performance</h3>
              <p class="text-sm text-gray-600">Voucher usage and network utilization</p>
            </div>
            <Chart 
              type="radar" 
              :data="networkPerformanceChartData" 
              :options="radarChartOptions" 
              class="h-80"
            />
          </template>
        </Card>

        <!-- Advertising Performance -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Advertising Performance</h3>
              <p class="text-sm text-gray-600">Ad impressions and click-through rates</p>
            </div>
            <Chart 
              type="bar" 
              :data="advertisingChartData" 
              :options="advertisingChartOptions" 
              class="h-80"
            />
          </template>
        </Card>
      </div>

      <!-- Detailed Metrics Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performing Locations -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Top Performing Locations</h3>
              <p class="text-sm text-gray-600">Locations with highest revenue and usage</p>
            </div>
            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            
            <div v-else-if="topLocations.length === 0" class="text-center py-8">
              <span class="material-icons text-4xl text-gray-300 mb-4">location_off</span>
              <p class="text-gray-500">No location data available</p>
              <p class="text-sm text-gray-400">Location performance will appear here once data is available</p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="location in topLocations" 
                :key="location.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-blue-600">location_on</span>
                  <div>
                    <p class="font-medium text-gray-900">{{ location.name }}</p>
                    <p class="text-sm text-gray-600">{{ location.town }}, {{ location.province }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">${{ formatCurrency(location?.revenue) }}</p>
                  <p class="text-sm text-gray-600">{{ location?.vouchersSold || 0 }} vouchers sold</p>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Agent Performance -->
        <Card>
          <template #content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Top Performing Agents</h3>
              <p class="text-sm text-gray-600">Agents with highest sales volume</p>
            </div>
            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            
            <div v-else-if="topAgents.length === 0" class="text-center py-8">
              <span class="material-icons text-4xl text-gray-300 mb-4">store_off</span>
              <p class="text-gray-500">No agent data available</p>
              <p class="text-sm text-gray-400">Agent performance will appear here once data is available</p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="agent in topAgents" 
                :key="agent.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <span class="material-icons text-green-600">store</span>
                  <div>
                    <p class="font-medium text-gray-900">{{ agent.displayName }}</p>
                    <p class="text-sm text-gray-600">{{ agent.salesCount }} sales</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">${{ formatCurrency(agent.totalSales) }}</p>
                  <p class="text-sm text-gray-600">{{ agent.commission }}% commission</p>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Real-time Activity Feed -->
      <Card>
        <template #content>
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Real-time Activity</h3>
            <p class="text-sm text-gray-600">Live updates on voucher sales and usage</p>
          </div>
          
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          <div v-else-if="recentActivity.length === 0" class="text-center py-8">
            <span class="material-icons text-4xl text-gray-300 mb-4">notifications_none</span>
            <p class="text-gray-500">No recent activity to display</p>
            <p class="text-sm text-gray-400">Activity will appear here as transactions occur</p>
          </div>
          
          <div v-else class="space-y-3 max-h-64 overflow-y-auto">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
            >
              <span class="material-icons text-blue-600">{{ activity.icon }}</span>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.message }}</p>
                <p class="text-xs text-gray-600">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
              <span class="text-xs text-gray-500">{{ activity.location }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <Toast />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'

// Toast
const toast = useToast()

// Reactive data
const loading = ref(false)
const metrics = ref({
  totalRevenue: 0,
  revenueGrowth: 0,
  activeVouchers: 0,
  voucherUtilization: 0,
  totalUsers: 0,
  newUsers: 0,
  conversionRate: 0,
  conversionGrowth: 0,
  totalLocations: 0,
  activeLocations: 0,
  coverageArea: 'N/A',
  totalAgents: 0,
  activeAgents: 0,
  avgCommission: 0,
  activeAds: 0,
  totalImpressions: 0,
  clickRate: 0
})

// Filters
const filters = ref({
  dateRange: '30d',
  locationId: '',
  userRole: '',
  voucherStatus: ''
})

// Chart data
const revenueChartData = ref<any>({})
const locationSalesChartData = ref<any>({})
const voucherStatusChartData = ref<any>({})
const userGrowthChartData = ref<any>({})
const networkPerformanceChartData = ref<any>({})
const advertisingChartData = ref<any>({})

// Table data
const topLocations = ref<any[]>([])
const topAgents = ref<any[]>([])
const recentActivity = ref<any[]>([])

// Options
const locationOptions = ref<any[]>([])
const userRoleOptions = ref([
  { label: 'All Roles', value: '' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Agent', value: 'AGENT' },
  { label: 'Customer', value: 'CUSTOMER' }
])

const voucherStatusOptions = ref([
  { label: 'All Statuses', value: '' },
  { label: 'Available', value: 'AVAILABLE' },
  { label: 'Reserved', value: 'RESERVED' },
  { label: 'Sold', value: 'SOLD' },
  { label: 'Redeemed', value: 'REDEEMED' },
  { label: 'Expired', value: 'EXPIRED' },
  { label: 'Disabled', value: 'DISABLED' }
])

const dateRangeOptions = ref([
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' }
])

// Chart options
const revenueChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return '$' + value.toLocaleString()
        }
      }
    }
  }
})

const doughnutChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

const radarChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100
    }
  }
})

const advertisingChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

// Lifecycle
onMounted(() => {
  fetchAnalytics()
  fetchLocations()
  startRealTimeUpdates()
})

// Methods
const fetchAnalytics = async () => {
  try {
    loading.value = true
    
    // Fetch all analytics data
    const [metricsData, chartsData, tablesData] = await Promise.all([
      $fetch('/api/admin/analytics/metrics', { params: filters.value }),
      $fetch('/api/admin/analytics/charts', { params: filters.value }),
      $fetch('/api/admin/analytics/tables', { params: filters.value })
    ])
    
    // Update metrics
    metrics.value = metricsData.metrics
    
    // Update chart data
    updateChartData(chartsData)
    
    // Update table data
    topLocations.value = tablesData.topLocations
    topAgents.value = tablesData.topAgents
    recentActivity.value = tablesData.recentActivity
    
  } catch (error) {
    console.error('Error fetching analytics:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch analytics data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const updateChartData = (data: any) => {
  // Revenue trend chart
  revenueChartData.value = {
    labels: data.revenueTrend.labels,
    datasets: [{
      label: 'Revenue',
      data: data.revenueTrend.data,
      borderColor: '#185ff9',
      backgroundColor: 'rgba(24, 95, 249, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
  
  // Location sales chart
  locationSalesChartData.value = {
    labels: data.locationSales.labels,
    datasets: [{
      data: data.locationSales.data,
      backgroundColor: [
        '#185ff9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
      ]
    }]
  }
  
  // Voucher status chart
  voucherStatusChartData.value = {
    labels: data.voucherStatus.labels,
    datasets: [{
      data: data.voucherStatus.data,
      backgroundColor: [
        '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280', '#84cc16'
      ]
    }]
  }
  
  // User growth chart
  userGrowthChartData.value = {
    labels: data.userGrowth.labels,
    datasets: [{
      label: 'New Users',
      data: data.userGrowth.data,
      backgroundColor: '#8b5cf6',
      borderColor: '#7c3aed'
    }]
  }
  
  // Network performance chart
  networkPerformanceChartData.value = {
    labels: ['Voucher Usage', 'Network Load', 'User Satisfaction', 'Revenue per User', 'Agent Performance'],
    datasets: [{
      label: 'Performance Score',
      data: data.networkPerformance.data,
      backgroundColor: 'rgba(24, 95, 249, 0.2)',
      borderColor: '#185ff9',
      pointBackgroundColor: '#185ff9'
    }]
  }
  
  // Advertising chart
  advertisingChartData.value = {
    labels: data.advertising.labels,
    datasets: [
      {
        label: 'Impressions',
        data: data.advertising.impressions,
        backgroundColor: '#10b981',
        borderColor: '#059669'
      },
      {
        label: 'Clicks',
        data: data.advertising.clicks,
        backgroundColor: '#f59e0b',
        borderColor: '#d97706'
      }
    ]
  }
}

const fetchLocations = async () => {
  try {
    const response = await $fetch('/api/admin/locations')
    locationOptions.value = [
      { label: 'All Locations', value: '' },
      ...response.locations.map((location: any) => ({
        id: location.id,
        label: `${location.name} (${location.code})`
      }))
    ]
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}

const onFilterChange = () => {
  fetchAnalytics()
}

const clearFilters = () => {
  filters.value = {
    dateRange: '30d',
    locationId: '',
    userRole: '',
    voucherStatus: ''
  }
  fetchAnalytics()
}

const refreshAnalytics = () => {
  fetchAnalytics()
}

const generateSampleData = async () => {
  try {
    loading.value = true
    
    const response = await $fetch('/api/admin/analytics/sample-data', {
      method: 'POST'
    })
    
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: response.message,
        life: 3000
      })
      
      // Refresh analytics after generating sample data
      setTimeout(() => {
        fetchAnalytics()
      }, 1000)
    }
  } catch (error) {
    console.error('Error generating sample data:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate sample data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  // TODO: Implement data export functionality
  toast.add({
    severity: 'info',
    summary: 'Export',
    detail: 'Data export functionality coming soon',
    life: 3000
  })
}

const startRealTimeUpdates = () => {
  // Update activity feed every 30 seconds
  setInterval(() => {
    fetchAnalytics()
  }, 30000)
}

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00'
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Watch for filter changes
watch(filters, () => {
  fetchAnalytics()
}, { deep: true })
</script>

<style scoped>
/* Custom chart styling */
:deep(.p-chart) {
  font-family: 'Poppins', sans-serif;
}

/* Custom scrollbar for activity feed */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
