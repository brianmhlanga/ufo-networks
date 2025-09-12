<template>
    <NuxtLayout name="agent">
        <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Buy Vouchers</h1>
        <p class="text-gray-600">Purchase voucher entitlements by type and location</p>
      </div>
    </div>

    <!-- Voucher Types Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="voucherType in availableVoucherTypes" :key="`${voucherType.hours}-${voucherType.numberOfUsers}`" 
           class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <!-- Voucher Type Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span class="material-icons text-green-600 text-xl">wifi</span>
            </div>
            <div>
              <h4 class="text-xl font-semibold text-gray-900">{{ voucherType.hours }}H</h4>
              <p class="text-sm text-gray-500">{{ voucherType.numberOfUsers }} Users</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Total Available</p>
            <p class="text-2xl font-bold text-green-600">{{ voucherType.totalAvailable }}</p>
          </div>
        </div>

        <!-- Pricing -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Retail Price:</span>
            <span class="text-sm text-gray-900 line-through">${{ voucherType.retailPrice }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Your Price:</span>
            <span class="text-xl font-bold text-green-600">${{ voucherType.agentPrice }}</span>
          </div>
          <div v-if="voucherType.discountPercentage > 0" class="mt-2">
            <span class="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
              {{ voucherType.discountPercentage }}% OFF
            </span>
          </div>
        </div>

        <!-- Quantity Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                     <InputText 
                      type="number"
             v-model="voucherType.quantity" 
             :min="0" 
             :max="voucherType.totalAvailable"
             class="w-full"
             :step="1"
           />
          <p class="text-xs text-gray-500 mt-1">
            Total available across all locations: {{ voucherType.totalAvailable }}
          </p>
        </div>

        <!-- Total Cost -->
        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Total Cost:</span>
            <span class="text-lg font-bold text-green-600">${{ (voucherType.quantity * voucherType.agentPrice).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Purchase Button -->
        <Button 
          label="Purchase Entitlement" 
          icon="add_shopping_cart"
          :disabled="voucherType.quantity <= 0 || voucherType.quantity > voucherType.totalAvailable"
          class="w-full bg-green-600 hover:bg-green-700"
          @click="purchaseVouchers(voucherType)"
        />
      </div>
    </div>

    

         <!-- Purchase Summary Modal -->
     <Dialog v-model:visible="showPurchaseModal" modal header="Confirm Purchase" :style="{ width: '600px' }">
       <div v-if="selectedPurchase" class="space-y-6">
         <!-- Purchase Summary -->
         <div class="bg-gray-50 rounded-lg p-4">
           <h4 class="font-medium text-gray-900 mb-3">Purchase Summary</h4>
           <div class="space-y-2 text-sm">
             <div class="flex justify-between">
               <span class="text-gray-600">Voucher Type:</span>
               <span class="text-gray-900">{{ selectedPurchase.hours }}H, {{ selectedPurchase.numberOfUsers }} Users</span>
             </div>
             <div class="flex justify-between">
               <span class="text-gray-600">Quantity:</span>
               <span class="text-gray-900">{{ selectedPurchase.quantity }}</span>
             </div>
             <div class="flex justify-between">
               <span class="text-gray-600">Retail Price:</span>
               <span class="text-gray-900 line-through">${{ selectedPurchase.retailPrice }}</span>
             </div>
             <div class="flex justify-between">
               <span class="text-gray-600">Your Price:</span>
               <span class="text-gray-900">${{ selectedPurchase.agentPrice }}</span>
             </div>
             <div class="flex justify-between">
               <span class="text-gray-600">Discount:</span>
               <span class="text-green-600 font-medium">{{ selectedPurchase.discountPercentage }}% OFF</span>
             </div>
             <div class="flex justify-between border-t pt-2">
               <span class="font-medium text-gray-900">Total Cost:</span>
               <span class="font-bold text-green-600">${{ selectedPurchase.totalCost }}</span>
             </div>
           </div>
         </div>

         <!-- Payment Details Form -->
         <div class="space-y-4">
           <h4 class="font-medium text-gray-900">Payment Details</h4>
           
           <!-- Email Input -->
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
             <InputText 
               v-model="paymentEmail" 
               type="email" 
               placeholder="your@email.com" 
               class="w-full"
               required
             />
           </div>

           <!-- Phone Input -->
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
             <InputText 
               v-model="paymentPhone" 
               type="tel" 
               placeholder="077 123 4567" 
               class="w-full"
             />
           </div>

           <!-- Payment Method Selection -->
           <div>
             <label class="block text-sm font-medium text-gray-700 mb-3">Payment Method *</label>
             <div class="space-y-3">
               <div class="flex items-center space-x-4">
                 <div class="flex items-center space-x-2">
                   <input 
                     type="radio" 
                     id="paynow-web" 
                     v-model="paymentMethod" 
                     value="web" 
                     class="text-green-600 focus:ring-green-600"
                   />
                   <label for="paynow-web" class="text-sm font-medium text-gray-700">Paynow Website</label>
                 </div>
                 <div class="flex items-center space-x-2">
                   <input 
                     type="radio" 
                     id="paynow-mobile" 
                     v-model="paymentMethod" 
                     value="mobile" 
                     class="text-green-600 focus:ring-green-600"
                   />
                   <label for="paynow-mobile" class="text-sm font-medium text-gray-700">Mobile Money (Ecocash/OneMoney)</label>
                 </div>
               </div>
               
               <!-- Mobile Money Fields -->
               <div v-if="paymentMethod === 'mobile'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Phone *</label>
                   <InputText 
                     v-model="mobilePhone" 
                     type="tel" 
                     placeholder="077 123 4567" 
                     class="w-full"
                     required
                   />
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Provider *</label>
                   <Select 
                     v-model="mobileProvider" 
                     :options="mobileProviderOptions" 
                     optionLabel="label" 
                     optionValue="value"
                     placeholder="Select Provider" 
                     class="w-full"
                     required
                   />
                 </div>
               </div>
             </div>
           </div>
         </div>

         <!-- Important Note -->
         <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
           <div class="flex items-start space-x-3">
             <span class="material-icons text-blue-600 mt-0.5">info</span>
             <div class="text-sm text-blue-700">
               <p class="font-medium mb-1">Important Note:</p>
               <p>You're purchasing an entitlement(Stock) to {{ selectedPurchase.quantity }} vouchers. 
               Vouchers will only be assigned when you record a sale.</p>
             </div>
           </div>
         </div>
       </div>

       <template #footer>
         <div class="flex justify-end space-x-3">
           <Button label="Cancel" severity="secondary" @click="showPurchaseModal = false" />
           <Button 
             label="Proceed to Payment" 
             icon="payment"
             class="bg-green-600 hover:bg-green-700"
             :loading="purchasing"
             @click="confirmPurchase"
           />
         </div>
       </template>
     </Dialog>



      <!-- Payment Polling Modal -->
      <PaymentPolling
        v-if="showPaymentPolling && paymentPollingData"
        :poll-url="paymentPollingData.pollUrl"
        :payment-reference="paymentPollingData.paymentReference"
        :order-id="paymentPollingData.orderId"
        :payment-method="paymentPollingData.paymentMethod"
        :instructions="paymentPollingData.instructions"
        :total="paymentPollingData.total"
        @success="handlePaymentSuccess"
        @failed="handlePaymentFailed"
        @cancelled="handlePaymentCancelled"
      />

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
const availableVoucherTypes = ref<any[]>([])
const showPurchaseModal = ref(false)
const selectedPurchase = ref<any>(null)
const purchasing = ref(false)

// Payment state
const paymentMethod = ref('web')
const mobilePhone = ref('')
const mobileProvider = ref('')
const paymentEmail = ref('')
const paymentPhone = ref('')
const showPaymentPolling = ref(false)
const paymentPollingData = ref<any>(null)



// Mobile provider options
const mobileProviderOptions = ref([
  { label: 'Ecocash', value: 'ecocash' },
  { label: 'OneMoney', value: 'onemoney' }
])





// Fetch available voucher types
const fetchAvailableVoucherTypes = async () => {
  try {
    const response = await $fetch('/api/agent/available-vouchers')
    
    if (response.success) {
      // Process the data to group by voucher type
      const voucherTypeMap = new Map()
      
      response.data.forEach((location: any) => {
        location.voucherTypes.forEach((type: any) => {
          const key = `${type.hours}-${type.numberOfUsers}`
          
          if (!voucherTypeMap.has(key)) {
            voucherTypeMap.set(key, {
              hours: type.hours,
              numberOfUsers: type.numberOfUsers,
              retailPrice: type.retailPrice,
              agentPrice: type.agentPrice,
              discountPercentage: type.discountPercentage,
              totalAvailable: 0,
              quantity: 0
            })
          }
          
          const voucherType = voucherTypeMap.get(key)
          voucherType.totalAvailable += type.availableCount
        })
      })
      
      availableVoucherTypes.value = Array.from(voucherTypeMap.values())
    }
  } catch (error) {
    console.error('Error fetching available vouchers:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load available vouchers',
      life: 3000
    })
  }
}





// Handle voucher purchase
const purchaseVouchers = (voucherType: any) => {
  if (voucherType.quantity <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select a quantity greater than 0',
      life: 3000
    })
    return
  }

  selectedPurchase.value = {
    hours: voucherType.hours,
    numberOfUsers: voucherType.numberOfUsers,
    quantity: voucherType.quantity,
    retailPrice: voucherType.retailPrice,
    agentPrice: voucherType.agentPrice,
    discountPercentage: voucherType.discountPercentage,
    totalCost: (voucherType.quantity * voucherType.agentPrice).toFixed(2)
  }
  
     // Pre-fill payment details from user session
   const user = session.user.value as any
   if (user) {
     paymentEmail.value = user.email || ''
     paymentPhone.value = user.phone || ''
   }
  
  showPurchaseModal.value = true
}

// Confirm purchase
const confirmPurchase = async () => {
  if (!selectedPurchase.value) return

  try {
    purchasing.value = true
    
    // Validate payment details
    if (!paymentEmail.value) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email is required for payment.',
        life: 5000
      })
      return
    }

    if (paymentMethod.value === 'mobile' && (!mobilePhone.value || !mobileProvider.value)) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Mobile phone and provider are required for mobile payments.',
        life: 5000
      })
      return
    }
    
    // Get user data from existing session
    const user = session.user.value as any
    console.log('User session data:', user)
    console.log('User ID:', user?.id)
    
    // Create order with Paynow integration
    const requestBody = {
      isAgentOrder: true,
      agentId: user?.id,
      customerEmail: paymentEmail.value,
      customerPhone: paymentPhone.value || '',
      paymentMethod: paymentMethod.value,
      mobilePhone: paymentMethod.value === 'mobile' ? mobilePhone.value : undefined,
      mobileProvider: paymentMethod.value === 'mobile' ? mobileProvider.value : undefined,
      items: [{
        hours: selectedPurchase.value.hours,
        numberOfUsers: selectedPurchase.value.numberOfUsers,
        quantity: selectedPurchase.value.quantity,
        unitPrice: selectedPurchase.value.agentPrice
      }]
    }
    
    console.log('Sending order creation request with body:', requestBody)
    
    const orderResponse = await $fetch('/api/orders/create', {
      method: 'POST',
      body: requestBody
    })

           if (orderResponse.success) {
        if (orderResponse.shouldRedirect && orderResponse.redirectUrl) {
          // For web payments, redirect to Paynow website (same as vouchers.vue)
          // Store order info in localStorage for webhook fallback
          localStorage.setItem('pendingAgentOrder', JSON.stringify({
            orderId: orderResponse.orderId,
            agentId: user?.id,
            paymentMethod: paymentMethod.value
          }))
          window.location.href = orderResponse.redirectUrl
        } else {
         // For mobile payments, show payment polling component (same as vouchers.vue)
         showPaymentPolling.value = true
         paymentPollingData.value = {
           pollUrl: orderResponse.pollUrl,
           paymentReference: orderResponse.paymentReference,
           orderId: orderResponse.orderId,
           paymentMethod: paymentMethod.value,
           instructions: orderResponse.instructions,
           total: orderResponse.total
         }
       }
       
       // Close purchase modal
       showPurchaseModal.value = false
       selectedPurchase.value = null
       
       // Refresh data
       await fetchAvailableVoucherTypes()
     }
  } catch (error: any) {
    console.error('Purchase error:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.data?.message || 'Failed to complete purchase',
      life: 3000
    })
  } finally {
    purchasing.value = false
  }
}





// Payment polling event handlers
const handlePaymentSuccess = async (orderId: string) => {
  console.log('handlePaymentSuccess called with orderId:', orderId)
  console.log('Current paymentMethod:', paymentMethod.value)
  console.log('Current selectedPurchase:', selectedPurchase.value)
  
  try {
    // Show recording status
    showPaymentPolling.value = true
    paymentPollingData.value = {
      ...paymentPollingData.value,
      status: 'Recording Agent Purchase...',
      instructions: 'Recording your voucher entitlements in the system...'
    }
    
    // For mobile payments, we need to manually create the AgentPurchase record
    // since the webhook won't be called
    if (paymentMethod.value === 'mobile') {
      console.log('Creating agent purchase for mobile payment success')
      
      // Get the order details to create the agent purchase
      const orderResponse:any = await $fetch(`/api/orders/${orderId}`)
      console.log('Order response:', orderResponse)
      
      if (orderResponse.success && orderResponse.order.agentId) {
        console.log('Creating agent purchase with orderId:', orderId, 'agentId:', orderResponse.order.agentId)
        
        // Create agent purchase record
        const createResponse = await $fetch('/api/agent/create-purchase-from-order', {
          method: 'POST',
          body: {
            orderId,
            agentId: orderResponse.order.agentId
          }
        })
        console.log('Agent purchase creation response:', createResponse)
        
        // Show success status
        paymentPollingData.value = {
          ...paymentPollingData.value,
          status: 'Successfully Recorded Agent Entitlement!',
          instructions: 'Your voucher entitlements have been recorded successfully. Redirecting...'
        }
        
        // Wait a moment for user to see the success message
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } else {
        console.log('Order not found or no agentId:', orderResponse)
        
        // If no agentId, try to get it from the user session
        const user = session.user.value as any
        console.log('User session data:', user)
        
        if (user?.id) {
          console.log('Using user ID from session:', user.id)
          
          // Create agent purchase record using session user ID
          const createResponse = await $fetch('/api/agent/create-purchase-from-order', {
            method: 'POST',
            body: {
              orderId,
              agentId: user.id
            }
          })
          console.log('Agent purchase creation response using session:', createResponse)
          
          // Show success status
          paymentPollingData.value = {
            ...paymentPollingData.value,
            status: 'Successfully Recorded Agent Entitlement!',
            instructions: 'Your voucher entitlements have been recorded successfully. Redirecting...'
          }
          
          // Wait a moment for user to see the success message
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    } else {
      console.log('Not a mobile payment, skipping agent purchase creation')
      
      // Show success status for web payments
      paymentPollingData.value = {
        ...paymentPollingData.value,
        status: 'Payment Successful!',
        instructions: 'Your payment was successful. Redirecting...'
      }
      
      // Wait a moment for user to see the success message
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  } catch (error) {
    console.error('Error creating agent purchase:', error)
    // Show error status
    paymentPollingData.value = {
      ...paymentPollingData.value,
      status: 'Error Recording Entitlement',
      instructions: 'There was an error recording your entitlements. Please contact support.'
    }
    
    // Wait a moment for user to see the error message
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  
  // Hide polling modal and redirect to success page
  showPaymentPolling.value = false
  
  // Redirect to success page with order details
  const total = selectedPurchase.value ? (selectedPurchase.value.quantity * selectedPurchase.value.agentPrice).toFixed(2) : '0.00'
  console.log('Redirecting to success page with total:', total)
  navigateTo(`/agent/purchase-success?orderId=${orderId}&total=${total}`)
}

const handlePaymentFailed = (error: string) => {
  showPaymentPolling.value = false
  if (error === 'retry') {
    // Reset form and allow retry
    resetForm()
  } else {
    toast.add({
      severity: 'error',
      summary: 'Payment Failed',
      detail: error,
      life: 5000
    })
  }
}

const handlePaymentCancelled = () => {
  showPaymentPolling.value = false
  toast.add({
    severity: 'info',
    summary: 'Payment Cancelled',
    detail: 'Your order has been cancelled',
    life: 3000
  })
}

// Reset form
const resetForm = () => {
  availableVoucherTypes.value.forEach(v => {
    v.quantity = 0
  })
  paymentMethod.value = 'web'
  mobilePhone.value = ''
  mobileProvider.value = ''
  paymentEmail.value = ''
  paymentPhone.value = ''
  showPaymentPolling.value = false
  paymentPollingData.value = null
}

// Fetch data on mount
onMounted(() => {
  fetchAvailableVoucherTypes()
})

// Meta tags
useHead({
  title: 'Buy Vouchers - Agent Dashboard',
  meta: [
    { name: 'description', content: 'Purchase voucher entitlements by type and location.' }
  ]
})
</script>
