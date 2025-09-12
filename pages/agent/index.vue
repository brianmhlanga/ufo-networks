<template>
  <NuxtLayout name="agent">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
          </div>
      </div>

      <!-- Filters -->
     

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Sales -->
        <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-600">Total Sales</p>
                <p class="text-2xl font-bold text-green-900">{{ metrics.totalSales }}</p>
                <p class="text-xs text-green-600 mt-1">All time</p>
              </div>
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span class="material-icons text-white text-xl">point_of_sale</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Total Revenue -->
        <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-600">Total Revenue</p>
                <p class="text-2xl font-bold text-blue-900">${{ metrics.totalRevenue.toFixed(2) }}</p>
                <p class="text-xs text-blue-600 mt-1">All time</p>
              </div>
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span class="material-icons text-white text-xl">attach_money</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Total Profit -->
        <Card class="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-emerald-600">Total Profit</p>
                <p class="text-2xl font-bold text-emerald-900">${{ metrics.totalProfit.toFixed(2) }}</p>
                <p class="text-xs text-emerald-600 mt-1">All time</p>
              </div>
              <div class="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span class="material-icons text-white text-xl">trending_up</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- Active Entitlements -->
        <Card class="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-purple-600">Active Entitlements</p>
                <p class="text-2xl font-bold text-purple-900">{{ metrics.activeEntitlements }}</p>
                <p class="text-xs text-purple-600 mt-1">Available for sale</p>
              </div>
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <span class="material-icons text-white text-xl">inventory</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts Row 1: Sales Performance -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Sales Trend Chart -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Sales Trend</h3>
          </template>
          <template #content>
            <Chart
              type="line"
              :data="salesTrendChartData"
              :options="lineChartOptions"
              class="w-full h-80"
            />
          </template>
        </Card>

        <!-- Sales by Location Chart -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Sales by Location</h3>
          </template>
          <template #content>
            <Chart
              type="doughnut"
              :data="locationSalesChartData"
              :options="doughnutChartOptions"
              class="w-full h-80"
            />
          </template>
        </Card>
      </div>

      <!-- Charts Row 2: Voucher Performance -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Voucher Type Performance -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Voucher Type Performance</h3>
          </template>
          <template #content>
            <Chart
              type="bar"
              :data="voucherTypeChartData"
              :options="barChartOptions"
              class="w-full h-80"
            />
          </template>
        </Card>

        <!-- Profit by Voucher Type -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Profit by Voucher Type</h3>
          </template>
          <template #content>
            <Chart
              type="pie"
              :data="profitChartData"
              :options="pieChartOptions"
              class="w-full h-80"
            />
          </template>
        </Card>
      </div>

      <!-- Charts Row 3: Business Insights -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Monthly Performance -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Monthly Performance</h3>
          </template>
          <template #content>
            <Chart
              type="bar"
              :data="monthlyPerformanceChartData"
              :options="monthlyChartOptions"
              class="w-full h-80"
            />
          </template>
        </Card>

        <!-- Entitlements vs Sales -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Entitlements vs Sales</h3>
          </template>
          <template #content>
            <Chart
              type="line"
              :data="entitlementsChartData"
              :options="entitlementsChartOptions"
              class="w-full h-80"
            />
          </template>
        </Card>
      </div>

      <!-- Detailed Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performing Locations -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Top Performing Locations</h3>
          </template>
          <template #content>
            <DataTable 
              :value="topLocations" 
              :loading="loading"
              class="w-full"
              stripedRows
            >
              <Column field="location" header="Location" sortable>
                <template #body="{ data }">
                  <span class="font-medium">{{ data.location }}</span>
                </template>
              </Column>
              <Column field="sales" header="Sales" sortable>
                <template #body="{ data }">
                  <span class="text-green-600 font-medium">{{ data.sales }}</span>
                </template>
              </Column>
              <Column field="revenue" header="Revenue" sortable>
                <template #body="{ data }">
                  <span class="text-blue-600 font-medium">${{ data.revenue.toFixed(2) }}</span>
                </template>
              </Column>
              <Column field="profit" header="Profit" sortable>
                <template #body="{ data }">
                  <span class="text-emerald-600 font-medium">${{ data.profit.toFixed(2) }}</span>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>

        <!-- Recent Sales Activity -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Recent Sales Activity</h3>
          </template>
          <template #content>
            <DataTable 
              :value="recentSales" 
              :loading="loading"
              class="w-full"
              stripedRows
            >
              <Column field="date" header="Date" sortable>
                <template #body="{ data }">
                  <span class="text-sm">{{ formatDate(data.date) }}</span>
                </template>
              </Column>
              <Column field="voucherType" header="Type" sortable>
                <template #body="{ data }">
                  <span class="text-sm">{{ data.voucherType }}</span>
                </template>
              </Column>
              <Column field="amount" header="Amount" sortable>
                <template #body="{ data }">
                  <span class="text-green-600 font-medium">${{ data.amount.toFixed(2) }}</span>
                </template>
              </Column>
              <Column field="profit" header="Profit" sortable>
                <template #body="{ data }">
                  <span class="text-emerald-600 font-medium">${{ data.profit.toFixed(2) }}</span>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
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
const loading = ref(false)
const metrics = ref({
  totalSales: 0,
  totalRevenue: 0,
  totalProfit: 0,
  activeEntitlements: 0
})

// Filters
const filters = ref({
  dateRange: '30days',
  locationId: 'all',
  voucherType: 'all',
  reportType: 'all'
})

// Filter options
const dateRangeOptions = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'This Year', value: 'year' },
  { label: 'All Time', value: 'all' }
]

const locationOptions = ref([
  { label: 'All Locations', value: 'all' }
])

const voucherTypeOptions = ref([
  { label: 'All Types', value: 'all' }
])

const reportTypeOptions = [
  { label: 'All Reports', value: 'all' },
  { label: 'Sales Reports', value: 'sales' },
  { label: 'Performance Reports', value: 'performance' },
  { label: 'Financial Reports', value: 'financial' }
]

// Chart data
const salesTrendChartData = ref<any>({})
const locationSalesChartData = ref<any>({})
const voucherTypeChartData = ref<any>({})
const profitChartData = ref<any>({})
const monthlyPerformanceChartData = ref<any>({})
const entitlementsChartData = ref<any>({})

// Table data
const topLocations = ref<any[]>([])
const recentSales = ref<any[]>([])

// Chart options
const lineChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
})

const doughnutChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
})

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
})

const monthlyChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
})

const entitlementsChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
})

// Fetch locations
const fetchLocations = async () => {
  try {
    const response = await $fetch('/api/locations')
    if (response.success) {
      locationOptions.value = [
        { label: 'All Locations', value: 'all' },
        ...response.data.map((location: any) => ({
          label: location.name,
          value: location.id
        }))
      ]
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}

// Fetch voucher types
const fetchVoucherTypes = async () => {
  try {
    const response = await $fetch('/api/agent/voucher-types')
    if (response.success) {
      voucherTypeOptions.value = [
        { label: 'All Types', value: 'all' },
        ...response.data.map((type: any) => ({
          label: `${type.hours}H, ${type.numberOfUsers}U`,
          value: `${type.hours}-${type.numberOfUsers}`
        }))
      ]
    }
  } catch (error) {
    console.error('Error fetching voucher types:', error)
  }
}

// Fetch reports data
const fetchReportsData = async () => {
  try {
    loading.value = true
    
    const [metricsData, chartsData, tablesData] = await Promise.all([
      $fetch('/api/agent/reports/metrics', { params: filters.value }),
      $fetch('/api/agent/reports/charts', { params: filters.value }),
      $fetch('/api/agent/reports/tables', { params: filters.value })
    ])

    if (metricsData.success) {
      metrics.value = metricsData.data
    }

    if (chartsData.success) {
      updateChartData(chartsData.data)
    }

    if (tablesData.success) {
      topLocations.value = tablesData.data.topLocations || []
      recentSales.value = tablesData.data.recentSales || []
    }

  } catch (error) {
    console.error('Error fetching reports data:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load reports data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Update chart data
const updateChartData = (data: any) => {
  // Sales trend chart
  salesTrendChartData.value = {
    labels: data.salesTrend?.labels || [],
    datasets: [
      {
        label: 'Sales',
        data: data.salesTrend?.sales || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      },
      {
        label: 'Revenue',
        data: data.salesTrend?.revenue || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1
      }
    ]
  }

  // Location sales chart
  locationSalesChartData.value = {
    labels: data.locationSales?.labels || [],
    datasets: [
      {
        data: data.locationSales?.data || [],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4'
        ]
      }
    ]
  }

  // Voucher type performance chart
  voucherTypeChartData.value = {
    labels: data.voucherTypePerformance?.labels || [],
    datasets: [
      {
        label: 'Sales Count',
        data: data.voucherTypePerformance?.sales || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Revenue',
        data: data.voucherTypePerformance?.revenue || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)'
      }
    ]
  }

  // Profit chart
  profitChartData.value = {
    labels: data.profitByType?.labels || [],
    datasets: [
      {
        data: data.profitByType?.data || [],
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ]
      }
    ]
  }

  // Monthly performance chart
  monthlyPerformanceChartData.value = {
    labels: data.monthlyPerformance?.labels || [],
    datasets: [
      {
        label: 'Sales',
        data: data.monthlyPerformance?.sales || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Revenue',
        data: data.monthlyPerformance?.revenue || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)'
      },
      {
        label: 'Profit',
        data: data.monthlyPerformance?.profit || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)'
      }
    ]
  }

  // Entitlements vs sales chart
  entitlementsChartData.value = {
    labels: data.entitlementsVsSales?.labels || [],
    datasets: [
      {
        label: 'Entitlements',
        data: data.entitlementsVsSales?.entitlements || [],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.1
      },
      {
        label: 'Sales',
        data: data.entitlementsVsSales?.sales || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }
    ]
  }
}

// Event handlers
const onFilterChange = () => {
  fetchReportsData()
}

const clearFilters = () => {
  filters.value = {
    dateRange: '30days',
    locationId: 'all',
    voucherType: 'all',
    reportType: 'all'
  }
  fetchReportsData()
}

const refreshReports = () => {
  fetchReportsData()
}

// Export reports
const exportReports = () => {
  // Create CSV content for export
  const csvContent = [
    ['Report Type', 'Value'],
    ['Total Sales', metrics.value.totalSales],
    ['Total Revenue', `$${metrics.value.totalRevenue.toFixed(2)}`],
    ['Total Profit', `$${metrics.value.totalProfit.toFixed(2)}`],
    ['Active Entitlements', metrics.value.activeEntitlements],
    ['', ''],
    ['Date Range', filters.value.dateRange],
    ['Location', filters.value.locationId === 'all' ? 'All Locations' : filters.value.locationId],
    ['Voucher Type', filters.value.voucherType === 'all' ? 'All Types' : filters.value.voucherType]
  ].map(row => row.join(',')).join('\n')

  // Download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `agent-reports-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)

  toast.add({
    severity: 'success',
    summary: 'Export Successful',
    detail: 'Reports exported to CSV',
    life: 3000
  })
}

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fetch data on mount
onMounted(() => {
  fetchLocations()
  fetchVoucherTypes()
  fetchReportsData()
})

// Meta tags
useHead({
  title: 'Reports & Analytics - Agent Dashboard',
  meta: [
    { name: 'description', content: 'Comprehensive reports and analytics for your agent business.' }
  ]
})
</script>

<style scoped>
/* Custom chart styling */
:deep(.p-chart) {
  border-radius: 0.5rem;
}

:deep(.p-card) {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:deep(.p-card:hover) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
