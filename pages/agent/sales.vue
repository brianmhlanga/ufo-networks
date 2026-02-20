<template>
  <NuxtLayout name="agent">
    <div class="space-y-6">
      <!-- Page Header (stacks on mobile) -->
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-4">
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">My Sales</h1>
          <p class="text-gray-600 text-sm sm:text-base">View and manage your voucher sales history</p>
        </div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <!-- Bluetooth thermal printer - always show so user sees Connect / status -->
          <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] flex-wrap">
            <template v-if="!bluetoothSupported">
              <span class="material-icons text-lg text-amber-500">bluetooth_disabled</span>
              <span class="text-sm text-gray-600">Use Chrome or Edge to print via Bluetooth</span>
            </template>
            <template v-else-if="bluetoothConnected">
              <span class="material-icons text-lg text-green-600">bluetooth_connected</span>
              <span class="max-w-[120px] truncate text-sm text-green-700" :title="bluetoothDevice?.name">{{ bluetoothDevice?.name || 'Printer' }}</span>
              <span class="text-sm text-green-600 font-medium">Connected</span>
              <Button
                size="small"
                severity="secondary"
                text
                class="min-w-0 p-1"
                v-tooltip.top="'Printer settings'"
                @click="showPrinterSetupDialog = true"
              >
                <span class="material-icons text-base">settings</span>
              </Button>
            </template>
            <template v-else>
              <span class="material-icons text-lg text-gray-400">bluetooth</span>
              <span class="text-sm text-gray-500">Printer not connected</span>
              <Button
                size="small"
                label="Connect printer"
                class="bg-blue-600 hover:bg-blue-700"
                :loading="bluetoothConnecting"
                @click="connectBluetoothPrinter"
              >
                <span class="material-icons text-sm mr-1">bluetooth</span>
                Connect
              </Button>
            </template>
          </div>
          <Button 
            class="bg-green-600 hover:bg-green-700 flex items-center min-h-[44px] touch-manipulation"
            @click="navigateTo('/agent/create-sale')"
          >
            <span class="material-icons mr-2">add_shopping_cart</span>
            Create New Sale
          </Button>
        </div>
      </div>

      <!-- Printer setup dialog -->
      <Dialog v-model:visible="showPrinterSetupDialog" modal header="Bluetooth thermal printer" :style="{ width: '90vw', maxWidth: '480px' }" dismissableMask>
        <p class="text-gray-600 mb-3">Use a Bluetooth thermal (ESC/POS) printer to print vouchers from the Print button on each sale.</p>
        <ol class="list-decimal pl-5 space-y-2 text-sm text-gray-700 mb-4">
          <li>Turn on Bluetooth on your printer and make it discoverable.</li>
          <li>Turn on Bluetooth on this device and pair with the printer if needed.</li>
          <li>Click <strong>Connect</strong> above and select your printer from the list.</li>
          <li>Choose the receipt paper width below to match your printer.</li>
        </ol>
        <div class="mb-2 text-sm font-medium text-gray-700">Paper width</div>
        <Select v-model="printerPaperWidth" :options="printerPaperWidthOptions" optionLabel="label" optionValue="value" class="w-full" @change="savePrinterPaperWidth" />
        <p class="text-xs text-gray-500 mt-2">Match your receipt roll width so text aligns correctly.</p>
        <template #footer>
          <Button label="Disconnect printer" severity="secondary" @click="disconnectBluetoothPrinter" />
          <Button label="Close" @click="showPrinterSetupDialog = false" />
        </template>
      </Dialog>

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
          <div class="overflow-x-auto -mx-2 sm:mx-0">
          <DataTable 
            :value="sales" 
            :loading="loading"
            :paginator="true" 
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sales"
            responsiveLayout="scroll"
            class="w-full min-w-[700px]"
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
                    :loading="printingSaleIds.has(data.id)"
                    :disabled="bluetoothPrinting"
                    @click="printVoucherOnBluetooth(data)"
                    v-tooltip.top="bluetoothConnected ? 'Print voucher to Bluetooth printer' : 'Connect a Bluetooth printer first'"
                  >
                    <span class="material-icons text-base">print</span>
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
          </div>
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

// Bluetooth thermal printer
const PRINTER_PAPER_WIDTH_KEY = 'ufo-printer-paper-width'
const printer = useBluetoothPrinter()
const bluetoothSupported = printer.isSupported
const bluetoothDevice = printer.device
const bluetoothConnected = printer.isConnected
const bluetoothPrinting = printer.isPrinting
const bluetoothConnecting = ref(false)
const showPrinterSetupDialog = ref(false)
const printingSaleIds = ref<Set<string>>(new Set())

const printerPaperWidthOptions = [
  { label: '57mm (2.25") - 32 columns', value: 32 },
  { label: '80mm (3.15") - 42 columns', value: 42 }
]
const printerPaperWidth = ref(32)
if (import.meta.client) {
  const saved = localStorage.getItem(PRINTER_PAPER_WIDTH_KEY)
  if (saved) {
    const n = parseInt(saved, 10)
    if (n === 32 || n === 42) printerPaperWidth.value = n
  }
}
function savePrinterPaperWidth() {
  if (import.meta.client) localStorage.setItem(PRINTER_PAPER_WIDTH_KEY, String(printerPaperWidth.value))
}

async function connectBluetoothPrinter() {
  bluetoothConnecting.value = true
  try {
    await printer.requestDevice()
    if (printer.error.value) {
      const msg = String(printer.error.value)
      if (!msg.includes('cancelled') && !msg.includes('User cancelled')) {
        toast.add({ severity: 'warn', summary: 'Printer', detail: msg, life: 5000 })
      }
    }
  } finally {
    bluetoothConnecting.value = false
  }
}
function disconnectBluetoothPrinter() {
  printer.disconnect()
  showPrinterSetupDialog.value = false
  toast.add({ severity: 'info', summary: 'Printer', detail: 'Printer disconnected', life: 3000 })
}

// Print voucher to Bluetooth thermal printer (ESC/POS)
async function printVoucherOnBluetooth(sale: any) {
  if (!bluetoothSupported.value) {
    toast.add({
      severity: 'warn',
      summary: 'Print',
      detail: 'Bluetooth printing needs Chrome or Edge. Open this page in Chrome/Edge (use localhost or HTTPS).',
      life: 6000
    })
    return
  }
  if (!bluetoothConnected.value) {
    toast.add({
      severity: 'warn',
      summary: 'Print',
      detail: 'Connect your printer first: click the blue "Connect printer" button above.',
      life: 5000
    })
    return
  }
  printingSaleIds.value = new Set([...printingSaleIds.value, sale.id])
  try {
    const { encodeVoucherReceipt } = await import('~/utils/escpos-voucher')
    const data = encodeVoucherReceipt(sale, printerPaperWidth.value)
    await printer.printRaw(data)
    toast.add({
      severity: 'success',
      summary: 'Printed',
      detail: `Voucher ${sale.voucher.voucherNumber} sent to printer`,
      life: 3000
    })
  } catch (e) {
    console.error('Bluetooth print error:', e)
    const msg = e instanceof Error ? e.message : 'Could not print voucher'
    const hint = /GATT|unknown reason/i.test(msg)
      ? ' Try: disconnect the printer above, then Connect again and print.'
      : ''
    toast.add({
      severity: 'error',
      summary: 'Print failed',
      detail: msg + hint,
      life: 7000
    })
  } finally {
    const next = new Set(printingSaleIds.value)
    next.delete(sale.id)
    printingSaleIds.value = next
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
