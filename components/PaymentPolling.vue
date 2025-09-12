<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <!-- Payment Status -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-2xl text-blue-600">payment</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
        <p class="text-sm text-gray-600">Please wait while we confirm your payment...</p>
      </div>

      <!-- Timer -->
      <div class="text-center mb-6">
        <div class="text-3xl font-bold text-blue-600 mb-2">{{ formatTime(remainingTime) }}</div>
        <p class="text-sm text-gray-500">Time remaining</p>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

                   <!-- Status Messages -->
             <div class="space-y-3 mb-6">
               <div v-if="currentStatus === 'pending'" class="flex items-center space-x-3 text-blue-600">
                 <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 <span class="text-sm">Checking payment status...</span>
               </div>
               <div v-if="currentStatus === 'success'" class="flex items-center space-x-3 text-green-600">
                 <span class="material-icons text-lg">check_circle</span>
                 <span class="text-sm">Payment confirmed!</span>
               </div>
               <div v-if="currentStatus === 'failed'" class="flex items-center space-x-3 text-red-600">
                 <span class="material-icons text-lg">error</span>
                 <span class="text-sm">Payment failed</span>
               </div>
               
               <!-- Current Status Display -->
               <div class="bg-gray-50 rounded-lg p-3">
                 <p class="text-sm text-gray-600 mb-1">Current Status:</p>
                 <p class="font-medium text-gray-900">{{ currentPaymentStatus }}</p>
               </div>
             </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <button
          v-if="currentStatus === 'pending'"
          @click="stopPolling"
          class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          v-if="currentStatus === 'success'"
          @click="proceedToSuccess"
          class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue
        </button>
        <button
          v-if="currentStatus === 'failed'"
          @click="retryPayment"
          class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Instructions for Mobile Payments -->
      <div v-if="paymentMethod === 'mobile' && currentStatus === 'pending'" class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 class="font-medium text-blue-900 mb-2">Mobile Payment Instructions</h4>
        <p class="text-sm text-blue-800">{{ instructions }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PaymentPollingProps {
  pollUrl: string
  paymentReference: string
  orderId: string
  paymentMethod: 'web' | 'mobile'
  instructions?: string
  total: number
}

const props = defineProps<PaymentPollingProps>()
const emit = defineEmits<{
  success: [orderId: string]
  failed: [error: string]
  cancelled: []
}>()

// State
const currentStatus = ref<'pending' | 'success' | 'failed'>('pending')
const currentPaymentStatus = ref('Pending')
const remainingTime = ref(300) // 5 minutes in seconds
const progressPercentage = ref(100)
const pollInterval = ref<NodeJS.Timeout | null>(null)
const statusCheckInterval = ref<NodeJS.Timeout | null>(null)

// Computed
const maxTime = 300 // 5 minutes

// Methods
const startPolling = () => {
  // Start timer countdown
  const timer = setInterval(() => {
    remainingTime.value--
    progressPercentage.value = (remainingTime.value / maxTime) * 100
    
    if (remainingTime.value <= 0) {
      clearInterval(timer)
      handleTimeout()
    }
  }, 1000)

  // Start status checking
  statusCheckInterval.value = setInterval(checkPaymentStatus, 5000) // Check every 5 seconds
}

const checkPaymentStatus = async () => {
  try {
    const response = await $fetch('/api/payments/paynow/status', {
      method: 'POST',
      body: {
        pollUrl: props.pollUrl,
        paymentReference: props.paymentReference
      }
    })

    if (response.success) {
      // Update current payment status
      currentPaymentStatus.value = response.status
      
      if (response.status === 'Paid' || response.status === 'Awaiting Delivery') {
        handleSuccess()
      } else if (response.status === 'Cancelled' || response.status === 'Disputed' || response.status === 'Failed') {
        handleFailure(response.status)
      }
      // If still pending, continue polling
    }
  } catch (error) {
    console.error('Error checking payment status:', error)
    // Continue polling on error
  }
}

const handleSuccess = () => {
  console.log('PaymentPolling: handleSuccess called, orderId:', props.orderId)
  currentStatus.value = 'success'
  stopPolling()
  // Wait 2 seconds before proceeding to success page
  setTimeout(() => {
    console.log('PaymentPolling: Emitting success event with orderId:', props.orderId)
    emit('success', props.orderId)
  }, 2000)
}

const handleFailure = (status: string) => {
  currentStatus.value = 'failed'
  stopPolling()
  emit('failed', `Payment ${status.toLowerCase()}`)
}

const handleTimeout = () => {
  currentStatus.value = 'failed'
  stopPolling()
  emit('failed', 'Payment timeout - please try again')
}

const stopPolling = () => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
    pollInterval.value = null
  }
  if (statusCheckInterval.value) {
    clearInterval(statusCheckInterval.value)
    statusCheckInterval.value = null
  }
}

const proceedToSuccess = () => {
  emit('success', props.orderId)
}

const retryPayment = () => {
  emit('failed', 'retry')
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Lifecycle
onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>
