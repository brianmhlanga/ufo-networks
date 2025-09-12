<template>
  <NuxtLayout name="agent">
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <span class="material-icons text-green-600 text-2xl">check</span>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Purchase Successful!
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Your voucher entitlements have been purchased successfully.
        </p>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-500">Loading order details...</p>
          </div>
          
          <div v-else class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Order ID:</span>
              <span class="text-gray-900 font-medium">{{ orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="text-green-600 font-medium">Paid</span>
            </div>
                         <div class="flex justify-between">
               <span class="text-gray-600">Total Amount:</span>
               <span class="text-gray-900 font-medium">{{ computedTotalAmount }}</span>
             </div>
             <div class="flex justify-between">
               <span class="text-gray-600">Payment Method:</span>
               <span class="text-gray-900 font-medium">{{ orderDetails?.payments?.[0]?.provider || 'N/A' }}</span>
             </div>
             <div class="flex justify-between">
               <span class="text-gray-600">Payment Reference:</span>
               <span class="text-gray-900 font-medium text-xs">{{ orderDetails?.payments?.[0]?.paynowReference || 'N/A' }}</span>
             </div>
            
                         <div v-if="orderDetails" class="border-t pt-4">
               <h4 class="font-medium text-gray-900 mb-3">Purchase Details</h4>
               <div class="space-y-2 text-sm">
                 <div v-for="item in orderDetails.items" :key="item.id" class="flex justify-between">
                   <span class="text-gray-600">{{ item.hours }}H, {{ item.numberOfUsers }} Users × {{ item.quantity }}</span>
                   <span class="text-gray-900">${{ Number(item.lineTotal).toFixed(2) }}</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <Button 
          label="View My Entitlements" 
          icon="inventory"
          class="w-full bg-blue-600 hover:bg-blue-700"
          @click="navigateToEntitlements"
        />
        <Button 
          label="Buy More Vouchers" 
          icon="add_shopping_cart"
          class="w-full bg-green-600 hover:bg-green-700"
          @click="navigateToBuyVouchers"
        />
        <Button 
          label="Back to Dashboard" 
          icon="dashboard"
          class="w-full bg-gray-600 hover:bg-gray-700"
          @click="navigateToDashboard"
        />
      </div>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

const route = useRoute()
const orderId = ref('')
const totalAmount = ref('')
const orderDetails = ref<any>(null)
const loading = ref(true)

// Computed total amount that prioritizes API data over query params
const computedTotalAmount = computed(() => {
  if (orderDetails.value?.total) {
    return `$${Number(orderDetails.value.total).toFixed(2)}`
  }
  return totalAmount.value
})

onMounted(async () => {
  // Get order details from route params or query
  orderId.value = route.query.orderId as string || 'N/A'
  const totalFromQuery = route.query.total as string
  
  // Set total amount from query as initial value
  if (totalFromQuery) {
    totalAmount.value = `$${Number(totalFromQuery).toFixed(2)}`
  } else {
    totalAmount.value = 'N/A'
  }
  
  if (orderId.value && orderId.value !== 'N/A') {
    await fetchOrderDetails()
  } else {
    loading.value = false
  }
})

const fetchOrderDetails = async () => {
  try {
    loading.value = true
    const response: any = await $fetch(`/api/orders/${orderId.value}`)
    
    if (response.success) {
      orderDetails.value = response.order
      console.log('Order details fetched:', response.order)
      
      // Use the correct field from API response
      if (response.order.total) {
        const newTotal = `$${Number(response.order.total).toFixed(2)}`
        console.log('Setting total amount to:', newTotal)
        totalAmount.value = newTotal
      } else {
        console.log('No total field found in order:', response.order)
      }
    } else {
      console.log('API response not successful:', response)
    }
  } catch (error) {
    console.error('Error fetching order details:', error)
    // Keep the total from query parameters if API fails
  } finally {
    loading.value = false
  }
}

const navigateToEntitlements = () => {
  navigateTo('/agent/entitlements')
}

const navigateToBuyVouchers = () => {
  navigateTo('/agent/buy-vouchers')
}

const navigateToDashboard = () => {
  navigateTo('/agent')
}

// Debug watcher to see when totalAmount changes
watch(totalAmount, (newValue, oldValue) => {
  console.log('totalAmount changed from', oldValue, 'to', newValue)
})
</script>
