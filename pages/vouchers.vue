<template>
  <NuxtLayout name="home">
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative overflow-hidden py-20 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/people.jpg');">
        <!-- Dark overlay for better text contrast -->
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Back to Home Link -->
            <div class="mb-6">
              <NuxtLink to="/" class="inline-flex items-center text-white/90 hover:text-white transition-colors">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
                </svg>
                Back to Home
              </NuxtLink>
            </div>

            <!-- Main heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              <span class="block">Order WiFi</span>
              <span class="block bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                Vouchers
              </span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              Get fast, reliable internet access at any UFO Networks location. Choose your location, select vouchers, and pay securely with Paynow.
            </p>

            <!-- Features -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Fast & Reliable</h3>
                <p class="text-white/80 text-sm">High-speed internet connection</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Multiple Locations</h3>
                <p class="text-white/80 text-sm">Available nationwide</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Secure Payment</h3>
                <p class="text-white/80 text-sm">Paynow integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">

      <!-- Order Form -->
      <div class="max-w-4xl mx-auto">
        <Card class="mb-8">
          <template #content>
            <form @submit.prevent="processOrder" class="space-y-6">
              <!-- Step 1: Location Selection -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-[#2d3040] mb-4 flex items-center">
                  <span class="w-6 h-6 bg-[#185ff9] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Select Location
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Province</label>
                    <Select 
                      v-model="selectedProvince" 
                      :options="provinceOptions" 
                      optionLabel="label" 
                      optionValue="value"
                      placeholder="Select Province" 
                      class="w-full"
                      @change="onProvinceChange"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Select 
                      v-model="selectedLocation" 
                      :options="locationOptions" 
                      optionLabel="label" 
                      optionValue="id"
                      placeholder="Select Location" 
                      class="w-full"
                      :disabled="!selectedProvince"
                      @change="onLocationChange"
                    />
                  </div>
                </div>
                <div v-if="selectedLocation" class="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <span class="material-icons text-blue-600">location_on</span>
                    <div>
                      <p class="font-medium text-[#2d3040]">{{ selectedLocationDetails?.name }}</p>
                      <p class="text-sm text-gray-600">{{ selectedLocationDetails?.town }}, {{ selectedLocationDetails?.province }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Customer Information -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-[#2d3040] mb-4 flex items-center">
                  <span class="w-6 h-6 bg-[#185ff9] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Customer Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <InputText 
                      v-model="customerEmail" 
                      type="email" 
                      placeholder="your@email.com" 
                      class="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                    <InputText 
                      v-model="customerPhone" 
                      type="tel" 
                      placeholder="+263 77 123 4567" 
                      class="w-full"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 3: Voucher Selection -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-[#2d3040] mb-4 flex items-center">
                  <span class="w-6 h-6 bg-[#185ff9] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Select Vouchers
                </h3>
                <div v-if="!selectedLocation" class="text-center py-8 text-gray-500">
                  Please select a location first to see available vouchers
                </div>
                <div v-else-if="loadingVouchers" class="text-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#185ff9] mx-auto"></div>
                  <p class="mt-2 text-gray-500">Loading available vouchers...</p>
                </div>
                <div v-else-if="availableVouchers.length === 0" class="text-center py-8 text-gray-500">
                  <span class="material-icons text-4xl text-gray-300 mb-4">wifi_off</span>
                  <p>No vouchers available at this location</p>
                  <p class="text-sm text-gray-400">Please try another location or check back later</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="voucher in availableVouchers" :key="voucher.id" class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4 class="font-medium text-[#2d3040]">{{ voucher.hours }} Hour WiFi Voucher</h4>
                        <p class="text-sm text-gray-600">{{ voucher.numberOfUsers }} concurrent users • Valid until {{ formatDate(voucher.endDate) }}</p>
                        <p class="text-lg font-bold text-[#185ff9] mt-1">${{ Number(voucher.retailPrice).toFixed(2) }}</p>
                      </div>
                      <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2">
                          <label class="text-sm font-medium text-gray-700">Quantity:</label>
                          <InputText 
                            v-model="voucher.quantity" 
                            type="number"
                            class="w-20"
                            :min="0" 
                            :max="voucher.availableCount"
                            @change="updateOrderSummary"
                          />
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ voucher.availableCount }} available
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 4: Order Summary -->
              <div v-if="orderSummary.totalItems > 0" class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-[#2d3040] mb-4 flex items-center">
                  <span class="w-6 h-6 bg-[#185ff9] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Order Summary
                </h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="space-y-3">
                    <div v-for="item in orderSummary.items" :key="item.id" class="flex justify-between items-center">
                      <span class="text-gray-700">{{ item.hours }} Hour Voucher × {{ item.quantity }}</span>
                      <span class="font-medium">${{ item.total.toFixed(2) }}</span>
                    </div>
                    <div class="border-t border-gray-200 pt-3">
                      <div class="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span class="text-[#185ff9]">${{ orderSummary.totalAmount.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 5: Payment Method -->
              <div v-if="orderSummary.totalItems > 0" class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-[#2d3040] mb-4 flex items-center">
                  <span class="w-6 h-6 bg-[#185ff9] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  Payment Method
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="paynow-web" 
                        v-model="paymentMethod" 
                        value="web" 
                        class="text-[#185ff9] focus:ring-[#185ff9]"
                      />
                      <label for="paynow-web" class="text-sm font-medium text-gray-700">Paynow Website</label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="paynow-mobile" 
                        v-model="paymentMethod" 
                        value="mobile" 
                        class="text-sm font-medium text-gray-700"
                      />
                      <label for="paynow-mobile" class="text-sm font-medium text-gray-700">Mobile Money (Ecocash/OneMoney)</label>
                    </div>
                  </div>
                  
                  <!-- Mobile Money Fields -->
                  <div v-if="paymentMethod === 'mobile'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
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

              <!-- Submit Button -->
              <div class="flex justify-center">
                <Button 
                  type="submit" 
                  :label="processingOrder ? 'Processing...' : 'Proceed to Payment'" 
                  :loading="processingOrder"
                  :disabled="orderSummary.totalItems === 0 || !selectedLocation || !customerEmail"
                  class="bg-[#185ff9] hover:bg-[#185ff9]/90 text-white px-8 py-3 text-lg font-medium"
                  size="large"
                />
              </div>
            </form>
          </template>
        </Card>

        <!-- How It Works -->
        <Card>
          <template #title>
            <h3 class="text-lg font-semibold text-[#2d3040]">How It Works</h3>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-2xl text-[#185ff9]">location_on</span>
                </div>
                <h4 class="font-medium text-[#2d3040] mb-2">1. Select Location</h4>
                <p class="text-sm text-gray-600">Choose the UFO Networks location where you want to use WiFi</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-2xl text-green-600">shopping_cart</span>
                </div>
                <h4 class="font-medium text-[#2d3040] mb-2">2. Choose Vouchers</h4>
                <p class="text-sm text-gray-600">Select the number and type of vouchers you need</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-2xl text-purple-600">payment</span>
                </div>
                <h4 class="font-medium text-[#2d3040] mb-2">3. Pay & Get PINs</h4>
                <p class="text-sm text-gray-600">Pay securely with Paynow and receive your voucher PINs</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Toast Notifications -->
    <Toast />

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
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>


// Toast
const toast = useToast()

// Form data
const selectedProvince = ref('')
const selectedLocation = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const paymentMethod = ref('web')
const mobilePhone = ref('')
const mobileProvider = ref('')

// State
const loadingVouchers = ref(false)
const processingOrder = ref(false)
const availableVouchers = ref<any[]>([])
const selectedLocationDetails = ref<any>(null)
const orderSummary = ref({
  totalItems: 0,
  totalAmount: 0,
  items: [] as any[]
})

// Payment polling state
const showPaymentPolling = ref(false)
const paymentPollingData = ref<any>(null)

// Options
const provinceOptions = ref([
  { label: 'Harare', value: 'Harare' },
  { label: 'Bulawayo', value: 'Bulawayo' },
  { label: 'Chitungwiza', value: 'Chitungwiza' },
  { label: 'Mutare', value: 'Mutare' },
  { label: 'Epworth', value: 'Epworth' },
  { label: 'Gweru', value: 'Gweru' },
  { label: 'Kwekwe', value: 'Kwekwe' },
  { label: 'Kadoma', value: 'Kadoma' },
  { label: 'Masvingo', value: 'Masvingo' },
  { label: 'Chinhoyi', value: 'Chinhoyi' },
  { label: 'Marondera', value: 'Marondera' },
  { label: 'Ruwa', value: 'Ruwa' },
  { label: 'Chegutu', value: 'Chegutu' },
  { label: 'Zvishavane', value: 'Zvishavane' },
  { label: 'Bindura', value: 'Bindura' },
  { label: 'Beitbridge', value: 'Beitbridge' },
  { label: 'Redcliff', value: 'Redcliff' },
  { label: 'Victoria Falls', value: 'Victoria Falls' },
  { label: 'Hwange', value: 'Hwange' },
  { label: 'Chiredzi', value: 'Chiredzi' },
  { label: 'Kariba', value: 'Kariba' },
  { label: 'Karoi', value: 'Karoi' },
  { label: 'Chipinge', value: 'Chipinge' },
  { label: 'Gokwe', value: 'Gokwe' },
  { label: 'Shurugwi', value: 'Shurugwi' },
  { label: 'Mazowe', value: 'Mazowe' },
  { label: 'Guruve', value: 'Guruve' },
  { label: 'Mt Darwin', value: 'Mt Darwin' },
  { label: 'Shamva', value: 'Shamva' },
  { label: 'Murehwa', value: 'Murehwa' },
  { label: 'Wedza', value: 'Wedza' },
  { label: 'Goromonzi', value: 'Goromonzi' },
  { label: 'Seke', value: 'Seke' },
  { label: 'Norton', value: 'Norton' },
  { label: 'Sanyati', value: 'Sanyati' },
  { label: 'Nembudziya', value: 'Nembudziya' },
  { label: 'Shangani', value: 'Shangani' },
  { label: 'Lupane', value: 'Lupane' },
  { label: 'Nkayi', value: 'Nkayi' },
  { label: 'Tsholotsho', value: 'Tsholotsho' },
  { label: 'Umguza', value: 'Umguza' },
  { label: 'Matobo', value: 'Matobo' },
  { label: 'Mangwe', value: 'Mangwe' },
  { label: 'Gwanda', value: 'Gwanda' },
  { label: 'Insiza', value: 'Insiza' },
  { label: 'Umzingwane', value: 'Umzingwane' },
  { label: 'Bubi', value: 'Bubi' },
  { label: 'Binga', value: 'Binga' }
])

const locationOptions = ref<any[]>([])
const mobileProviderOptions = ref([
  { label: 'Ecocash', value: 'ecocash' },
  { label: 'OneMoney', value: 'onemoney' }
])

// Methods
const onProvinceChange = async () => {
  selectedLocation.value = ''
  selectedLocationDetails.value = null
  availableVouchers.value = []
  orderSummary.value = { totalItems: 0, totalAmount: 0, items: [] }
  
  if (selectedProvince.value) {
    await fetchLocations()
  }
}

const onLocationChange = async () => {
  if (selectedLocation.value) {
    await fetchAvailableVouchers()
  }
}

const fetchLocations = async () => {
  try {
    const response:any = await $fetch('/api/locations', {
      params: { province: selectedProvince.value }
    })
    
    if (response.success) {
      locationOptions.value = response.data.map((location: any) => ({
        id: location.id,
        label: `${location.name} (${location.code})`
      }))
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch locations',
      life: 3000
    })
  }
}

const fetchAvailableVouchers = async () => {
  try {
    loadingVouchers.value = true
    const response:any = await $fetch('/api/vouchers/available', {
      params: { locationId: selectedLocation.value }
    })
    
    if (response.success) {
      availableVouchers.value = response.vouchers.map((voucher: any) => ({
        ...voucher,
        quantity: 0
      }))
      
      // Get location details
      const locationResponse = await $fetch(`/api/locations/${selectedLocation.value}`)
      if (locationResponse.success) {
        selectedLocationDetails.value = locationResponse.location
      }
    }
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch available vouchers',
      life: 3000
    })
  } finally {
    loadingVouchers.value = false
  }
}

const updateOrderSummary = () => {
  const items = availableVouchers.value
    .filter(v => v.quantity > 0)
    .map(v => ({
      id: v.id,
      hours: v.hours,
      numberOfUsers: v.numberOfUsers,
      quantity: v.quantity,
      unitPrice: Number(v.retailPrice),
      total: Number(v.retailPrice) * v.quantity
    }))
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.total, 0)
  
  orderSummary.value = { items, totalItems, totalAmount }
}

const processOrder = async () => {
  try {
    // Basic validation
    if (!customerEmail.value || !customerEmail.value.includes('@')) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please enter a valid email address',
        life: 3000
      })
      return
    }

    if (paymentMethod.value === 'mobile' && (!mobilePhone.value || !mobileProvider.value)) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields for mobile payment',
        life: 3000
      })
      return
    }

    if (orderSummary.value.totalItems === 0) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one voucher',
        life: 3000
      })
      return
    }

    processingOrder.value = true

    // Create order
    const orderData = {
      locationId: selectedLocation.value,
      customerEmail: customerEmail.value,
      customerPhone: customerPhone.value,
      items: orderSummary.value.items,
      paymentMethod: paymentMethod.value,
      mobilePhone: paymentMethod.value === 'mobile' ? mobilePhone.value : undefined,
      mobileProvider: paymentMethod.value === 'mobile' ? mobileProvider.value : undefined
    }

    const response:any = await $fetch('/api/orders/create', {
      method: 'POST',
      body: orderData
    })

    if (response.success) {
      if (response.shouldRedirect) {
        // For web payments, redirect to Paynow website
        window.location.href = response.redirectUrl
      } else {
        // For mobile payments, show payment polling component
        showPaymentPolling.value = true
        paymentPollingData.value = {
          pollUrl: response.pollUrl,
          paymentReference: response.paymentReference,
          orderId: response.orderId,
          paymentMethod: paymentMethod.value,
          instructions: response.instructions,
          total: response.total
        }
      }
    } else {
      throw new Error(response.message || 'Failed to create order')
    }

  } catch (error: any) {
    console.error('Error processing order:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to process order',
      life: 3000
    })
  } finally {
    processingOrder.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Payment polling event handlers
const handlePaymentSuccess = (orderId: string) => {
  showPaymentPolling.value = false
  // Redirect to success page
  navigateTo(`/vouchers-${orderId}`)
}

const handlePaymentFailed = (error: string) => {
  showPaymentPolling.value = false
  if (error === 'retry') {
    // Reset form and allow retry
    orderSummary.value = { totalItems: 0, totalAmount: 0, items: [] }
    availableVouchers.value.forEach(v => v.quantity = 0)
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

// Meta tags
useHead({
  title: 'Order WiFi Vouchers - UFO Networks',
  meta: [
    { name: 'description', content: 'Order WiFi vouchers for UFO Networks locations. Fast, reliable internet access with secure Paynow payment.' }
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

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
