<template>
  <NuxtLayout name="home">
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Success Header -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-icons text-4xl text-green-600">check_circle</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p class="text-lg text-gray-600">Your WiFi vouchers have been purchased successfully.</p>
        </div>

        <!-- Order Details -->
        <Card class="mb-8">
          <template #title>
            <h2 class="text-xl font-semibold text-gray-900">Order Details</h2>
          </template>
          <template #content>
            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-500">Loading order details...</p>
            </div>
            
            <div v-else-if="order" class="space-y-6">
              <!-- Order Summary -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm text-gray-600">Order ID</p>
                  <p class="font-medium text-gray-900">{{ order.id }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Order Date</p>
                  <p class="font-medium text-gray-900">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Total Amount</p>
                  <p class="font-medium text-green-600">${{ Number(order.total).toFixed(2) }}</p>
                </div>
              </div>

              <!-- Location Information -->
              <div v-if="order.items && order.items.length > 0" class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-medium text-gray-900 mb-2">Location</h3>
                <div class="flex items-center space-x-2">
                  <span class="material-icons text-blue-600">location_on</span>
                  <span class="text-gray-700">{{ order.items[0].location?.name || 'Selected Location' }}</span>
                </div>
              </div>

                             <!-- Purchased Vouchers -->
               <div>
                 <div class="flex justify-between items-center mb-4">
                   <h3 class="font-medium text-gray-900">Your WiFi Vouchers</h3>
                   <div class="text-sm text-gray-600">
                     Total: {{ vouchers.length }} vouchers
                   </div>
                 </div>
                 
                 <!-- Redemption Notice -->
                 <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                   <div class="flex items-start space-x-3">
                     <span class="material-icons text-blue-600 mt-0.5">info</span>
                     <div>
                       <h4 class="font-medium text-blue-900 mb-1">Vouchers Automatically Redeemed</h4>
                       <p class="text-sm text-blue-700">
                         Your vouchers have been automatically marked as redeemed and are now ready for use. 
                         Visit the selected location and use the PIN codes below to connect to WiFi.
                       </p>
                     </div>
                   </div>
                 </div>
                 <div class="space-y-6">
                   <div v-for="item in order.items" :key="item.id" class="border border-gray-200 rounded-lg p-6">
                     <div class="flex justify-between items-start mb-4">
                       <div>
                         <h4 class="text-lg font-semibold text-gray-900">{{ item.quantity }} × WiFi Vouchers</h4>
                         <p class="text-sm text-gray-600">Unit Price: ${{ Number(item.unitPrice).toFixed(2) }}</p>
                         <p class="text-sm text-gray-600">Line Total: ${{ Number(item.lineTotal).toFixed(2) }}</p>
                       </div>
                       <div class="text-right">
                         <span class="text-xl font-bold text-green-600">${{ Number(item.lineTotal).toFixed(2) }}</span>
                       </div>
                     </div>
                     
                     <!-- Voucher Details Grid -->
                     <div v-if="vouchers.length === 0" class="text-center py-8">
                       <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                       <p class="text-gray-500">Loading vouchers...</p>
                     </div>
                     <div v-else-if="getVouchersForItem(item).length === 0" class="text-center py-8 text-gray-500">
                       <span class="material-icons text-4xl text-gray-300 mb-4">wifi_off</span>
                       <p>No vouchers found for this item</p>
                     </div>
                     <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       <div v-for="(voucher, index) in getVouchersForItem(item)" :key="voucher.id" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                         <!-- Voucher Header -->
                         <div class="text-center mb-4">
                           <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                             <span class="material-icons text-white text-2xl">wifi</span>
                           </div>
                           <h5 class="font-semibold text-gray-900">Voucher #{{ index + 1 }}</h5>
                           <p class="text-xs text-gray-500">{{ item.location?.name || 'Selected Location' }}</p>
                           <div v-if="voucher.status === 'REDEEMED'" class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                             ✓ Redeemed
                           </div>
                         </div>
                         
                         <!-- Voucher Details -->
                         <div class="space-y-3 mb-4">
                           <div class="flex justify-between text-sm">
                             <span class="text-gray-600">Voucher Number:</span>
                             <span class="font-mono font-medium text-gray-900 text-xs">{{ voucher.voucherNumber }}</span>
                           </div>
                           <div class="bg-blue-50 rounded-lg p-3 text-center">
                             <div class="text-xs text-gray-600 mb-1">WiFi PIN</div>
                             <div class="font-mono font-bold text-xl text-blue-600 tracking-wider">{{ voucher.pin }}</div>
                           </div>
                           <div class="grid grid-cols-2 gap-2 text-xs">
                             <div class="text-center bg-gray-50 rounded p-2">
                               <div class="text-gray-600">Duration</div>
                               <div class="font-semibold text-gray-900">{{ voucher.hours }}H</div>
                             </div>
                             <div class="text-center bg-gray-50 rounded p-2">
                               <div class="text-gray-600">Users</div>
                               <div class="font-semibold text-gray-900">{{ voucher.numberOfUsers }}</div>
                             </div>
                           </div>
                           <div class="text-center text-xs text-gray-500">
                             Valid until {{ formatDate(voucher.expiryDate) }}
                           </div>
                           <div v-if="voucher.status === 'REDEEMED'" class="text-center text-xs text-green-600 bg-green-50 rounded p-2 mt-2">
                             ✓ Redeemed on {{ formatDate(voucher.redeemedAt) }}
                           </div>
                         </div>
                         
                                                   <!-- QR Code -->
                          <div class="text-center mb-4">
                            <div class="bg-gray-50 rounded-lg p-3 inline-block">
                              <Qrcode
                                :value="JSON.stringify({
                                  voucherNumber: voucher.voucherNumber,
                                  pin: voucher.pin,
                                  location: item.location?.name || 'Selected Location',
                                  hours: voucher.hours,
                                  users: voucher.numberOfUsers,
                                  expiry: voucher.expiryDate
                                })"
                                :width="96"
                                :height="96"
                                class="mx-auto"
                              />
                            </div>
                          </div>
                         
                                                                     <!-- Action Buttons -->
                          <div class="flex space-x-2">
                            <button
                              @click="downloadVoucher(voucher)"
                              class="flex-1 bg-blue-600 text-white px-2 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium flex items-center justify-center"
                            >
                              <span class="material-icons text-xs mr-1">download</span>
                              Download
                            </button>
                            <button
                              @click="printVoucher(voucher)"
                              class="flex-1 bg-green-600 text-white px-2 py-1.5 rounded-md hover:bg-green-700 transition-colors text-xs font-medium flex items-center justify-center"
                            >
                              <span class="material-icons text-xs mr-1">print</span>
                              Print
                            </button>
                          </div>
                  

                       </div>
                     </div>
                   </div>
                 </div>
               </div>

              <!-- Payment Information -->
              <div v-if="order.payments && order.payments.length > 0" class="p-4 bg-green-50 rounded-lg">
                <h3 class="font-medium text-gray-900 mb-2">Payment Information</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Payment Method:</span>
                    <span class="font-medium text-gray-900">{{ order.payments[0].provider }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Payment Reference:</span>
                    <span class="font-medium text-gray-900">{{ order.payments[0].paynowReference }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span class="font-medium text-green-600">{{ order.payments[0].status }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <span class="material-icons text-4xl text-gray-300 mb-4">error</span>
              <p>Order not found or you don't have permission to view it.</p>
            </div>
          </template>
        </Card>

        <!-- Next Steps -->
        <Card>
          <template #title>
            <h3 class="text-lg font-semibold text-gray-900">What's Next?</h3>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-2xl text-blue-600">email</span>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Check Your Email</h4>
                <p class="text-sm text-gray-600">Voucher details will be sent to your email address</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-2xl text-green-600">wifi</span>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Visit the Location</h4>
                <p class="text-sm text-gray-600">Go to the selected UFO Networks location</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-2xl text-purple-600">login</span>
                </div>
                <h4 class="font-medium text-gray-900 mb-2">Connect to WiFi</h4>
                <p class="text-sm text-gray-600">Use your voucher PIN to connect to the network</p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-4 mt-8">
          <NuxtLink to="/vouchers" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Order More Vouchers
          </NuxtLink>
          <NuxtLink to="/" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Get order ID from route
const route = useRoute()
const orderId = route.params.orderId as string

// State
const loading = ref(true)
const order = ref<any>(null)
const vouchers = ref<any[]>([])

// Fetch order details
const fetchOrderDetails = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/orders/${orderId}`)
    
    if (response.success) {
      order.value = response.order
      // Fetch vouchers after order details are loaded
      await fetchVouchers()
    } else {
      throw new Error(response.message || 'Failed to fetch order')
    }
  } catch (error: any) {
    console.error('Error fetching order:', error)
    // Handle error appropriately
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch order details on mount
onMounted(() => {
  if (orderId) {
    fetchOrderDetails()
  }
})

// Fetch vouchers for this order
const fetchVouchers = async () => {
  try {
    const response = await $fetch(`/api/orders/${orderId}/vouchers`)
    if (response.success) {
      vouchers.value = response.vouchers
      // QR codes are now generated automatically by the Qrcode component
    }
  } catch (error) {
    console.error('Error fetching vouchers:', error)
  }
}

// Get vouchers for a specific order item
const getVouchersForItem = (item: any) => {
  if (!vouchers.value.length) return []
  
  console.log('🔍 getVouchersForItem called with item:', item)
  console.log('🔍 Available vouchers:', vouchers.value)
  
  // Find vouchers that match this item's specifications
  const matchedVouchers = vouchers.value.filter(v => {
    const hoursMatch = v.hours === item.hours
    const usersMatch = v.numberOfUsers === item.numberOfUsers
    const priceMatch = Number(v.retailPrice) === Number(item.unitPrice)
    
    console.log(`🔍 Voucher ${v.voucherNumber}: hours=${v.hours}==${item.hours}(${hoursMatch}), users=${v.numberOfUsers}==${item.numberOfUsers}(${usersMatch}), price=${v.retailPrice}==${item.unitPrice}(${priceMatch})`)
    
    return hoursMatch && usersMatch && priceMatch
  })
  
  console.log('🔍 Matched vouchers:', matchedVouchers)
  return matchedVouchers.slice(0, item.quantity)
}

// QR codes are now generated automatically by the Qrcode component

// Download voucher as PDF
const downloadVoucher = async (voucher: any) => {
  try {
    // Create voucher content for download
    const voucherContent = `
      UFO Networks WiFi Voucher
      
      Voucher Number: ${voucher.voucherNumber}
      PIN: ${voucher.pin}
      Duration: ${voucher.hours} Hours
      Users: ${voucher.numberOfUsers} Concurrent
      Location: ${order.value?.items[0]?.location?.name || 'Selected Location'}
      Valid Until: ${formatDate(voucher.expiryDate)}
      Status: ${voucher.status}
      ${voucher.redeemedAt ? `Redeemed: ${formatDate(voucher.redeemedAt)}` : ''}
      
      Instructions:
      1. Go to the selected UFO Networks location
      2. Connect to the WiFi network
      3. Enter the PIN above when prompted
      4. Enjoy your internet access!
      
      Thank you for choosing UFO Networks!
    `
    
    // Create blob and download
    const blob = new Blob([voucherContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voucher-${voucher.voucherNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading voucher:', error)
  }
}

// Print voucher
const printVoucher = (voucher: any) => {
  try {
    // Create print window content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>UFO Networks Voucher - ${voucher.voucherNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .voucher { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1f2937; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .pin { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
            .instructions { margin-top: 20px; font-size: 14px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="voucher">
            <div class="header">
              <div class="logo">UFO Networks</div>
              <div>WiFi Voucher</div>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span>Voucher Number:</span>
                <span>${voucher.voucherNumber}</span>
              </div>
              <div class="detail-row">
                <span>Duration:</span>
                <span>${voucher.hours} Hours</span>
              </div>
              <div class="detail-row">
                <span>Users:</span>
                <span>${voucher.numberOfUsers} Concurrent</span>
              </div>
              <div class="detail-row">
                <span>Location:</span>
                <span>${order.value?.items[0]?.location?.name || 'Selected Location'}</span>
              </div>
              <div class="detail-row">
                <span>Valid Until:</span>
                <span>${formatDate(voucher.expiryDate)}</span>
              </div>
              ${voucher.redeemedAt ? `
              <div class="detail-row">
                <span>Status:</span>
                <span style="color: #059669; font-weight: bold;">✓ Redeemed on ${formatDate(voucher.redeemedAt)}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="pin">PIN: ${voucher.pin}</div>
            
            <div class="instructions">
              <strong>Instructions:</strong><br>
              1. Go to the selected UFO Networks location<br>
              2. Connect to the WiFi network<br>
              3. Enter the PIN above when prompted<br>
              4. Enjoy your internet access!
            </div>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  } catch (error) {
    console.error('Error printing voucher:', error)
  }
}

// Meta tags
useHead({
  title: `Order Confirmation - UFO Networks`,
  meta: [
    { name: 'description', content: 'Your WiFi voucher order has been confirmed successfully.' }
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
