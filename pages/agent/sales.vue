<template>
  <NuxtLayout name="agent">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Sales</h1>
          <p class="text-gray-600">View and manage your voucher sales history</p>
        </div>
        <Button 
          class="bg-green-600 hover:bg-green-700 flex items-center"
          @click="navigateTo('/agent/create-sale')"
        >
          <span class="material-icons mr-2">add_shopping_cart</span>
          Create New Sale
        </Button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Sales -->
        <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-600">Total Sales</p>
                <p class="text-2xl font-bold text-green-900">{{ stats.totalSales }}</p>
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
                <p class="text-2xl font-bold text-blue-900">${{ stats.totalRevenue.toFixed(2) }}</p>
                <p class="text-xs text-blue-600 mt-1">All time</p>
              </div>
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span class="material-icons text-white text-xl">attach_money</span>
              </div>
            </div>
          </template>
        </Card>

        <!-- This Month Sales -->
        <Card class="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-purple-600">This Month</p>
                <p class="text-2xl font-bold text-purple-900">{{ stats.thisMonthSales }}</p>
                <p class="text-xs text-purple-600 mt-1">Sales count</p>
              </div>
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <span class="material-icons text-white text-xl">calendar_month</span>
              </div>
            </div>
          </template>
        </Card>

                 <!-- Average Sale Price -->
         <Card class="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
           <template #content>
             <div class="flex items-center justify-between">
               <div>
                 <p class="text-sm font-medium text-orange-600">Avg Sale Price</p>
                 <p class="text-2xl font-bold text-orange-900">${{ stats.averageSalePrice.toFixed(2) }}</p>
                 <p class="text-xs text-orange-600 mt-1">Per voucher</p>
               </div>
               <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                 <span class="material-icons text-white text-xl">analytics</span>
               </div>
             </div>
           </template>
         </Card>

         <!-- Total Profit/Loss -->
         <Card class="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
           <template #content>
             <div class="flex items-center justify-between">
               <div>
                 <p class="text-sm font-medium text-emerald-600">Total Profit/Loss</p>
                 <p class="text-2xl font-bold" :class="stats.totalProfitLoss >= 0 ? 'text-emerald-900' : 'text-red-900'">
                   {{ stats.totalProfitLoss >= 0 ? '+' : '' }}${{ stats.totalProfitLoss.toFixed(2) }}
                 </p>
                 <p class="text-xs text-emerald-600 mt-1">All time</p>
               </div>
               <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="stats.totalProfitLoss >= 0 ? 'bg-emerald-500' : 'bg-red-500'">
                 <span class="material-icons text-white text-xl">{{ stats.totalProfitLoss >= 0 ? 'trending_up' : 'trending_down' }}</span>
               </div>
             </div>
           </template>
         </Card>
      </div>

      <!-- Filters and Search -->
      <Card>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <Select 
                v-model="filters.dateRange" 
                :options="dateRangeOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="Select date range" 
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Voucher Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
              <Select 
                v-model="filters.voucherType" 
                :options="voucherTypeOptions" 
                optionLabel="label" 
                optionValue="value"
                placeholder="All types" 
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Select 
                v-model="filters.locationId" 
                :options="locationOptions" 
                optionLabel="name" 
                optionValue="id"
                placeholder="All locations" 
                class="w-full"
                @change="applyFilters"
              />
            </div>

            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <InputText 
                v-model="filters.search" 
                placeholder="Customer name/phone..." 
                class="w-full"
                @input="applyFilters"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Sales Table -->
      <Card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Sales History</h3>
            <div class="flex items-center space-x-2">
                             <Button 
                 severity="secondary"
                 size="small"
                 class="flex items-center"
                 @click="exportSales"
               >
                 <span class="material-icons text-sm mr-1">download</span>
                 Export
               </Button>
               <Button 
                 severity="secondary"
                 size="small"
                 class="flex items-center"
                 @click="fetchSales"
               >
                 <span class="material-icons text-sm mr-1">refresh</span>
                 Refresh
               </Button>
            </div>
          </div>
        </template>
        <template #content>
          <DataTable 
            :value="sales" 
            :loading="loading"
            :paginator="true" 
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sales"
            responsiveLayout="scroll"
            class="w-full"
          >
            <!-- Sale ID -->
            <Column field="id" header="Sale ID" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="font-mono text-xs text-gray-600">{{ data.id.slice(-8) }}</span>
              </template>
            </Column>

            <!-- Date -->
            <Column field="createdAt" header="Date" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="text-sm">{{ formatDate(data.createdAt) }}</span>
              </template>
            </Column>

            <!-- Voucher Type -->
            <Column field="voucher.hours" header="Voucher Type" sortable style="width: 120px">
              <template #body="{ data }">
                <span class="text-sm font-medium">{{ data.voucher.hours }}H, {{ data.voucher.numberOfUsers }}U</span>
              </template>
            </Column>

            <!-- Location -->
            <Column field="voucher.location.name" header="Location" sortable style="width: 150px">
              <template #body="{ data }">
                <span class="text-sm">{{ data.voucher.location.name }}</span>
              </template>
            </Column>

            <!-- Customer -->
            <Column field="buyerNote" header="Customer" sortable style="width: 150px">
              <template #body="{ data }">
                <div class="text-sm">
                  <div v-if="data.buyerNote" class="font-medium">{{ data.buyerNote }}</div>
                  <div v-if="data.buyerPhone" class="text-gray-600 text-xs">{{ data.buyerPhone }}</div>
                </div>
              </template>
            </Column>

                         <!-- Sale Price -->
             <Column field="soldPrice" header="Sale Price" sortable style="width: 120px">
               <template #body="{ data }">
                 <span class="text-sm font-medium text-green-600">${{ Number(data.soldPrice).toFixed(2) }}</span>
               </template>
             </Column>

             <!-- Profit/Loss -->
             <Column field="profitLoss" header="Profit/Loss" sortable style="width: 120px">
               <template #body="{ data }">
                 <div class="text-sm">
                   <div class="font-medium" :class="calculateProfitLoss(data) >= 0 ? 'text-emerald-600' : 'text-red-600'">
                     {{ calculateProfitLoss(data) >= 0 ? '+' : '' }}${{ calculateProfitLoss(data).toFixed(2) }}
                   </div>
                   <div class="text-xs text-gray-500">
                     Cost: ${{ Number(data.agentPurchase?.unitCost || 0).toFixed(2) }}
                   </div>
                 </div>
               </template>
             </Column>

            <!-- Voucher Details -->
            <Column field="voucher.voucherNumber" header="Voucher Details" style="width: 200px">
              <template #body="{ data }">
                <div class="text-sm">
                  <div class="font-mono text-xs text-gray-600">{{ data.voucher.voucherNumber }}</div>
                  <div class="text-xs text-gray-500">PIN: {{ data.voucher.pin }}</div>
                </div>
              </template>
            </Column>

            <!-- Actions -->
            <Column header="Actions" style="width: 100px">
              <template #body="{ data }">
                <div class="flex space-x-2">
                  <Button 
                    size="small"
                    severity="secondary"
                    class="min-w-[40px] h-8 px-2 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    @click="viewSaleDetails(data)"
                    v-tooltip.top="'View Details'"
                  >
                    <span class="material-icons text-base">visibility</span>
                  </Button>
                  <Button 
                    size="small"
                    severity="secondary"
                    class="min-w-[40px] h-8 px-2 hover:bg-green-100 hover:text-green-700 transition-colors"
                    @click="printVoucher(data)"
                    v-tooltip.top="'Print Voucher'"
                  >
                    <span class="material-icons text-base">print</span>
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Sale Details Dialog -->
      <Dialog 
        v-model:visible="showSaleDetails" 
        modal 
        header="Sale Details" 
        :style="{ width: '600px' }"
        :closable="true"
      >
        <div v-if="selectedSale" class="space-y-4">
          <!-- Sale Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Sale Information</h4>
                         <div class="grid grid-cols-2 gap-4 text-sm">
               <div>
                 <span class="text-gray-600">Sale ID:</span>
                 <span class="ml-2 font-mono">{{ selectedSale.id }}</span>
               </div>
               <div>
                 <span class="text-gray-600">Date:</span>
                 <span class="ml-2">{{ formatDate(selectedSale.createdAt) }}</span>
               </div>
               <div>
                 <span class="text-gray-600">Sale Price:</span>
                 <span class="ml-2 font-medium text-green-600">${{ Number(selectedSale.soldPrice).toFixed(2) }}</span>
               </div>
               <div>
                 <span class="text-gray-600">Agent Cost:</span>
                 <span class="ml-2">${{ Number(selectedSale.agentPurchase?.unitCost || 0).toFixed(2) }}</span>
               </div>
               <div>
                 <span class="text-gray-600">Profit/Loss:</span>
                 <span class="ml-2 font-medium" :class="calculateProfitLoss(selectedSale) >= 0 ? 'text-emerald-600' : 'text-red-600'">
                   {{ calculateProfitLoss(selectedSale) >= 0 ? '+' : '' }}${{ calculateProfitLoss(selectedSale).toFixed(2) }}
                 </span>
               </div>
               <div>
                 <span class="text-gray-600">Status:</span>
                 <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
               </div>
             </div>
          </div>

          <!-- Customer Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Customer Information</h4>
            <div class="space-y-2 text-sm">
              <div v-if="selectedSale.buyerNote">
                <span class="text-gray-600">Name:</span>
                <span class="ml-2 font-medium">{{ selectedSale.buyerNote }}</span>
              </div>
              <div v-if="selectedSale.buyerPhone">
                <span class="text-gray-600">Phone:</span>
                <span class="ml-2 font-medium">{{ selectedSale.buyerPhone }}</span>
              </div>
            </div>
          </div>

          <!-- Voucher Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-3">Voucher Information</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Voucher Number:</span>
                <span class="ml-2 font-mono text-xs">{{ selectedSale.voucher.voucherNumber }}</span>
              </div>
              <div>
                <span class="text-gray-600">PIN:</span>
                <span class="ml-2 font-mono text-xs">{{ selectedSale.voucher.pin }}</span>
              </div>
              <div>
                <span class="text-gray-600">Type:</span>
                <span class="ml-2">{{ selectedSale.voucher.hours }}H, {{ selectedSale.voucher.numberOfUsers }} Users</span>
              </div>
              <div>
                <span class="text-gray-600">Location:</span>
                <span class="ml-2">{{ selectedSale.voucher.location.name }}</span>
              </div>
              <div>
                <span class="text-gray-600">Retail Price:</span>
                <span class="ml-2">${{ Number(selectedSale.voucher.retailPrice).toFixed(2) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Expiry:</span>
                <span class="ml-2">{{ formatDate(selectedSale.voucher.endDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <!-- Success Toast -->
      <Toast />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Get user session
const session = useUserSession()

// Toast instance
const toast = useToast()

// State
const sales = ref<any[]>([])
const stats = ref({
  totalSales: 0,
  totalRevenue: 0,
  thisMonthSales: 0,
  averageSalePrice: 0,
  totalProfitLoss: 0
})
const loading = ref(false)
const showSaleDetails = ref(false)
const selectedSale = ref<any>(null)

// Filters
const filters = ref({
  dateRange: 'all',
  voucherType: 'all',
  locationId: 'all',
  search: ''
})

// Filter options
const dateRangeOptions = [
  { label: 'All Time', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' }
]

const voucherTypeOptions = ref([
  { label: 'All Types', value: 'all' }
])

const locationOptions = ref([
  { label: 'All Locations', value: 'all' }
])

// Fetch sales data
const fetchSales = async () => {
  try {
    loading.value = true
    
    const queryParams = new URLSearchParams()
    if (filters.value.dateRange !== 'all') queryParams.append('dateRange', filters.value.dateRange)
    if (filters.value.voucherType !== 'all') queryParams.append('voucherType', filters.value.voucherType)
    if (filters.value.locationId !== 'all') queryParams.append('locationId', filters.value.locationId)
    if (filters.value.search) queryParams.append('search', filters.value.search)

    const response = await $fetch(`/api/agent/sales?${queryParams.toString()}`)
    
    if (response.success) {
      sales.value = response.data.sales
      stats.value = response.data.stats
    }
  } catch (error) {
    console.error('Error fetching sales:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load sales data',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Fetch filter options
const fetchFilterOptions = async () => {
  try {
    // Fetch voucher types
    const voucherTypesResponse = await $fetch('/api/agent/voucher-types')
    if (voucherTypesResponse.success) {
      voucherTypeOptions.value = [
        { label: 'All Types', value: 'all' },
        ...voucherTypesResponse.data.map((type: any) => ({
          label: `${type.hours}H, ${type.numberOfUsers}U`,
          value: `${type.hours}-${type.numberOfUsers}`
        }))
      ]
    }

    // Fetch locations
    const locationsResponse = await $fetch('/api/locations')
    if (locationsResponse.success) {
      locationOptions.value = [
        { label: 'All Locations', value: 'all' },
        ...locationsResponse.data.map((location: any) => ({
          label: location.name,
          value: location.id
        }))
      ]
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
  }
}

// Apply filters
const applyFilters = () => {
  fetchSales()
}

// View sale details
const viewSaleDetails = (sale: any) => {
  selectedSale.value = sale
  showSaleDetails.value = true
}

// Print voucher
const printVoucher = (sale: any) => {
  // Open print window with voucher details
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Voucher - ${sale.voucher.voucherNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .voucher { border: 2px solid #000; padding: 20px; max-width: 400px; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .pin { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
            .footer { text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="voucher">
            <div class="header">
              <h2>WiFi Voucher</h2>
              <h3>${sale.voucher.location.name}</h3>
            </div>
            <div class="details">
              <p><strong>Voucher Number:</strong> ${sale.voucher.voucherNumber}</p>
              <p><strong>Type:</strong> ${sale.voucher.hours} Hours, ${sale.voucher.numberOfUsers} Users</p>
              <p><strong>Location:</strong> ${sale.voucher.location.name}</p>
              <p><strong>Expiry:</strong> ${formatDate(sale.voucher.endDate)}</p>
            </div>
            <div class="pin">
              PIN: ${sale.voucher.pin}
            </div>
            <div class="footer">
              <p>Valid until ${formatDate(sale.voucher.endDate)}</p>
              <p>Generated on ${formatDate(sale.createdAt)}</p>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

// Export sales
const exportSales = () => {
  // Create CSV content
  const headers = ['Date', 'Voucher Type', 'Location', 'Customer', 'Phone', 'Sale Price', 'Agent Cost', 'Profit/Loss', 'Voucher Number', 'PIN']
  const csvContent = [
    headers.join(','),
    ...sales.value.map(sale => [
      formatDate(sale.createdAt),
      `${sale.voucher.hours}H, ${sale.voucher.numberOfUsers}U`,
      sale.voucher.location.name,
      sale.buyerNote || '',
      sale.buyerPhone || '',
      sale.soldPrice,
      sale.agentPurchase?.unitCost || 0,
      calculateProfitLoss(sale).toFixed(2),
      sale.voucher.voucherNumber,
      sale.voucher.pin
    ].join(','))
  ].join('\n')

  // Download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sales-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)

  toast.add({
    severity: 'success',
    summary: 'Export Successful',
    detail: 'Sales data exported to CSV',
    life: 3000
  })
}

// Calculate profit/loss for a sale
const calculateProfitLoss = (sale: any) => {
  const sellingPrice = Number(sale.soldPrice)
  const buyingPrice = Number(sale.agentPurchase?.unitCost || 0)
  return sellingPrice - buyingPrice
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch data on mount
onMounted(() => {
  fetchFilterOptions()
  fetchSales()
})

// Meta tags
useHead({
  title: 'My Sales - Agent Dashboard',
  meta: [
    { name: 'description', content: 'View and manage your voucher sales history.' }
  ]
})
</script>
