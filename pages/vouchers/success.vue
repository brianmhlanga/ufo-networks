<template>
  <NuxtLayout name="home">
    <div class="min-h-screen bg-gray-50">
      <!-- Page Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <h1 class="text-2xl font-bold text-[#2d3040]">Payment Successful</h1>
            <NuxtLink to="/" class="text-primary hover:text-primary-900 font-medium">
              ← Back to Home
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <!-- Success Icon -->
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span class="material-icons text-6xl text-green-600">check_circle</span>
        </div>

        <!-- Success Message -->
        <h1 class="text-4xl font-bold text-[#2d3040] mb-4">Payment Successful!</h1>
        <p class="text-xl text-gray-600 mb-8">
          Thank you for your purchase. Your WiFi vouchers have been reserved and will be delivered shortly.
        </p>

        <!-- Order Details -->
        <div v-if="orderDetails" class="bg-white rounded-lg shadow-lg p-8 mb-8 text-left">
          <h2 class="text-2xl font-semibold text-[#2d3040] mb-6">Order Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p class="text-sm font-medium text-gray-500">Order ID</p>
              <p class="text-lg font-semibold text-[#2d3040]">{{ orderDetails.id }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total Amount</p>
              <p class="text-lg font-semibold text-[#185ff9]">${{ Number(orderDetails.total).toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Email</p>
              <p class="text-lg text-[#2d3040]">{{ orderDetails.buyerEmail }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Status</p>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {{ orderDetails.status }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-[#2d3040] mb-4">Vouchers Ordered</h3>
            <div class="space-y-3">
              <div v-for="item in orderDetails.items" :key="item.id" class="flex justify-between items-center py-2">
                <div>
                  <p class="font-medium text-[#2d3040]">{{ item.quantity }} × WiFi Vouchers</p>
                  <p class="text-sm text-gray-600">Location: {{ item.location?.name || 'Selected Location' }}</p>
                </div>
                <p class="font-semibold text-[#185ff9]">${{ Number(item.lineTotal).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-semibold text-[#2d3040] mb-4">What Happens Next?</h3>
          <div class="space-y-3 text-left">
            <div class="flex items-start space-x-3">
              <span class="material-icons text-blue-600 mt-1">schedule</span>
              <div>
                <p class="font-medium text-[#2d3040]">Processing</p>
                <p class="text-sm text-gray-600">Your order is being processed and vouchers are being prepared</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <span class="material-icons text-blue-600 mt-1">email</span>
              <div>
                <p class="font-medium text-[#2d3040]">Email Delivery</p>
                <p class="text-sm text-gray-600">You will receive an email with your voucher PINs within the next few minutes</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <span class="material-icons text-blue-600 mt-1">wifi</span>
              <div>
                <p class="font-medium text-[#2d3040]">Ready to Use</p>
                <p class="text-sm text-gray-600">Once you receive the PINs, you can use them at the selected location</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/vouchers" 
            class="bg-[#185ff9] text-white px-8 py-3 rounded-lg hover:bg-[#185ff9]/90 font-medium"
          >
            Order More Vouchers
          </NuxtLink>
          <NuxtLink 
            to="/" 
            class="bg-white text-[#185ff9] border-2 border-[#185ff9] px-8 py-3 rounded-lg hover:bg-[#185ff9] hover:text-white font-medium transition-colors"
          >
            Back to Home
          </NuxtLink>
        </div>

        <!-- Support Info -->
        <div class="mt-12 text-center">
          <p class="text-gray-600 mb-2">Need help? Contact our support team</p>
          <div class="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div class="flex items-center space-x-2">
              <span class="material-icons text-gray-400">email</span>
              <span>support@ufonetworks.co.zw</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="material-icons text-gray-400">phone</span>
              <span>+263 77 123 4567</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>


// Get order ID from query params
const route = useRoute()
const orderId = route.query.orderId as string

// Order details
const orderDetails = ref<any>(null)
const loading = ref(true)

// Fetch order details
const fetchOrderDetails = async () => {
  if (!orderId) return
  
  try {
    const response:any = await $fetch(`/api/orders/${orderId}`)
    if (response.success) {
      orderDetails.value = response.order
    }
  } catch (error:any) {
    console.error('Error fetching order details:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchOrderDetails()
})

// Meta tags
useHead({
  title: 'Payment Successful - UFO Networks',
  meta: [
    { name: 'description', content: 'Your WiFi voucher payment was successful. Thank you for choosing UFO Networks!' }
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
</style>
