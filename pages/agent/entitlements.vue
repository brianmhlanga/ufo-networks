<template>
  <NuxtLayout name="agent">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Voucher Entitlements</h1>
          <p class="text-gray-600">View and manage your voucher inventory</p>
        </div>
        <Button 
          label="Buy More Vouchers" 
          icon="add_shopping_cart"
          class="bg-green-600 hover:bg-green-700"
          @click="navigateToBuyVouchers"
        />
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="material-icons text-blue-600 text-xl">inventory</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Entitlements</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalEntitlements }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span class="material-icons text-green-600 text-xl">check_circle</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Available for Sale</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.availableForSale }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span class="material-icons text-yellow-600 text-xl">shopping_cart</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Sold Today</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.soldToday }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span class="material-icons text-purple-600 text-xl">trending_up</span>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.soldThisMonth }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Entitlements Table -->
      <div class="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Voucher Entitlements</h3>
        </div>
        
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">Loading entitlements...</p>
        </div>

        <div v-else-if="entitlements.length === 0" class="p-8 text-center">
          <span class="material-icons text-4xl text-gray-300 mb-4">inventory_2</span>
          <p class="text-gray-500">No voucher entitlements found</p>
          <p class="text-sm text-gray-400">Purchase vouchers to get started</p>
          <Button 
            label="Buy Vouchers" 
            icon="add_shopping_cart"
            class="mt-4 bg-green-600 hover:bg-green-700"
            @click="navigateToBuyVouchers"
          />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voucher Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Entitlements
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available for Sale
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="entitlement in entitlements" :key="entitlement.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="material-icons text-blue-600 text-sm">wifi</span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ entitlement.hours }} Hour WiFi
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ entitlement.numberOfUsers }} Users
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ entitlement.totalQuantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="entitlement.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ entitlement.availableQuantity }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ entitlement.soldQuantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(entitlement.purchaseDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <Button 
                      label="Record Sale" 
                      icon="add_shopping_cart"
                      size="small"
                      :disabled="entitlement.availableQuantity <= 0"
                      class="bg-blue-600 hover:bg-blue-700"
                      @click="recordSale(entitlement)"
                    />
                    <Button 
                      label="View History" 
                      icon="history"
                      size="small"
                      severity="secondary"
                      @click="viewHistory(entitlement)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Recent Sales</h3>
        </div>
        
        <div v-if="recentSales.length === 0" class="p-6 text-center text-gray-500">
          No recent sales recorded
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div v-for="sale in recentSales" :key="sale.id" class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="material-icons text-green-600 text-sm">receipt</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ sale.hours }}H, {{ sale.numberOfUsers }} Users × {{ sale.quantity }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Sold to {{ sale.customerName || sale.customerPhone || 'Anonymous' }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">${{ Number(sale.totalAmount).toFixed(2) }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(sale.saleDate) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Record Sale Modal -->
    <Dialog v-model:visible="showSaleModal" modal header="Record Voucher Sale" :style="{ width: '500px' }">
      <div v-if="selectedEntitlement" class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">Sale Details</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Voucher Type:</span>
              <span class="text-gray-900">{{ selectedEntitlement.hours }}H, {{ selectedEntitlement.numberOfUsers }} Users</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Available:</span>
              <span class="text-gray-900">{{ selectedEntitlement.availableQuantity }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity to Sell *</label>
            <InputNumber 
              v-model="saleQuantity" 
              :min="1" 
              :max="selectedEntitlement.availableQuantity"
              class="w-full"
              showButtons
              buttonLayout="horizontal"
              :step="1"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <InputText 
              v-model="customerName" 
              placeholder="Customer name (optional)" 
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
            <InputText 
              v-model="customerPhone" 
              placeholder="Customer phone (optional)" 
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sale Price per Voucher *</label>
            <InputNumber 
              v-model="salePrice" 
              :min="0.01" 
              :step="0.01"
              prefix="$"
              class="w-full"
            />
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-blue-900">Total Sale Amount:</span>
              <span class="text-lg font-bold text-blue-900">${{ (saleQuantity * salePrice).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button label="Cancel" severity="secondary" @click="showSaleModal = false" />
          <Button 
            label="Record Sale" 
            icon="save"
            class="bg-green-600 hover:bg-green-700"
            :loading="recordingSale"
            :disabled="saleQuantity <= 0 || salePrice <= 0"
            @click="confirmSale"
          />
        </div>
      </template>
    </Dialog>

    <!-- Toast Notifications -->
    <Toast />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Get user session
const session = useUserSession()

// Toast instance
const toast = useToast()

// State
const loading = ref(true)
const entitlements = ref<any[]>([])
const recentSales = ref<any[]>([])
const stats = ref({
  totalEntitlements: 0,
  availableForSale: 0,
  soldToday: 0,
  soldThisMonth: 0
})

// Sale modal state
const showSaleModal = ref(false)
const selectedEntitlement = ref<any>(null)
const saleQuantity = ref(1)
const salePrice = ref(0)
const customerName = ref('')
const customerPhone = ref('')
const recordingSale = ref(false)

// Fetch entitlements data
const fetchEntitlements = async () => {
  try {
    loading.value = true
    const response: any = await $fetch('/api/agent/entitlements')
    
    if (response.success) {
      entitlements.value = response.entitlements
      recentSales.value = response.recentSales
      stats.value = response.stats
    }
  } catch (error) {
    console.error('Error fetching entitlements:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load entitlements',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Record sale
const recordSale = (entitlement: any) => {
  selectedEntitlement.value = entitlement
  saleQuantity.value = 1
  salePrice.value = 0
  customerName.value = ''
  customerPhone.value = ''
  showSaleModal.value = true
}

// Confirm sale
const confirmSale = async () => {
  if (!selectedEntitlement.value) return

  try {
    recordingSale.value = true
    
    const saleData = {
      entitlementId: selectedEntitlement.value.id,
      quantity: saleQuantity.value,
      salePrice: salePrice.value,
      customerName: customerName.value || undefined,
      customerPhone: customerPhone.value || undefined,
      totalAmount: saleQuantity.value * salePrice.value
    }

    const response: any = await $fetch('/api/agent/record-sale', {
      method: 'POST',
      body: saleData
    })

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sale Recorded',
        detail: `Successfully recorded sale of ${saleQuantity.value} vouchers`,
        life: 3000
      })
      
      showSaleModal.value = false
      selectedEntitlement.value = null
      
      // Refresh data
      await fetchEntitlements()
    }
  } catch (error: any) {
    console.error('Error recording sale:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.data?.message || 'Failed to record sale',
      life: 3000
    })
  } finally {
    recordingSale.value = false
  }
}

// View history
const viewHistory = (entitlement: any) => {
  // TODO: Implement view history functionality
  toast.add({
    severity: 'info',
    summary: 'Coming Soon',
    detail: 'Sale history feature will be available soon',
    life: 3000
  })
}

// Navigation
const navigateToBuyVouchers = () => {
  navigateTo('/agent/buy-vouchers')
}

// Utility functions
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fetch data on mount
onMounted(() => {
  fetchEntitlements()
})

// Meta tags
useHead({
  title: 'My Entitlements - Agent Dashboard',
  meta: [
    { name: 'description', content: 'View and manage your voucher entitlements and sales.' }
  ]
})
</script>
