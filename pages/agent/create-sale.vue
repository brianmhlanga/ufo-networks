<template>
  <NuxtLayout name="agent">
    <div class="space-y-6">
      <!-- Page Header (stacks on mobile) -->
      <div class="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-4">
          <div class="min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Create Sale</h1>
            <p class="text-gray-500 mt-1 text-sm sm:text-base">Record a voucher sale to a customer</p>
          </div>
          <!-- Bluetooth thermal printer (auto-print after sale) -->
          <div class="flex items-center gap-2 bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-2.5 min-h-[44px] flex-shrink-0">
          <template v-if="!bluetoothSupported">
            <span class="material-icons text-lg text-amber-500">bluetooth_disabled</span>
            <span class="text-sm text-gray-600">Use Chrome/Edge to auto-print</span>
          </template>
          <template v-else-if="bluetoothConnected">
            <span class="material-icons text-lg text-green-600">bluetooth_connected</span>
            <span class="max-w-[120px] truncate text-sm text-green-700">{{ bluetoothDevice?.name || 'Printer' }}</span>
            <span class="text-sm text-green-600 font-medium">Connected</span>
          </template>
          <template v-else>
            <span class="material-icons text-lg text-gray-400">bluetooth</span>
            <span class="text-sm text-gray-500">Connect to auto-print after sale</span>
            <Button size="small" label="Connect printer" class="bg-blue-600 hover:bg-blue-700" :loading="bluetoothConnecting" @click="connectBluetoothPrinter">
              <span class="material-icons text-sm mr-1">bluetooth</span>
              Connect
            </Button>
          </template>
        </div>
      </div>
      </div>

      <!-- Sale Form -->
      <div class="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8">
        <form @submit.prevent="createSale" class="space-y-6">
          <!-- Location Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <Select 
              v-model="selectedLocation" 
              :options="locations" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select a location" 
              class="w-full"
              required
              @change="onLocationChange"
            />
          </div>

          <!-- Voucher Type Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Voucher Type *</label>
            <Select 
              v-model="selectedVoucherType" 
              :options="availableVoucherTypes" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select voucher type" 
              class="w-full"
              required
              @change="onVoucherTypeChange"
            />
          </div>

          <!-- Quantity Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
            <InputNumber 
              v-model="quantity" 
              :min="1" 
              :max="maxAvailableQuantity"
              class="w-full"
              showButtons
              :step="1"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              Maximum available: {{ maxAvailableQuantity }}
            </p>
          </div>

          <!-- Sale Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sale Price per Voucher *</label>
            <InputNumber 
              v-model="salePrice" 
              :min="0.01" 
              :max="999.99"
              mode="currency" 
              currency="USD" 
              locale="en-US"
              class="w-full"
              required
            />
          </div>

          <!-- Customer Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <InputText 
                v-model="customerName" 
                placeholder="Customer name" 
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
              <InputText 
                v-model="customerPhone" 
                type="tel" 
                placeholder="077 123 4567" 
                class="w-full"
              />
            </div>
          </div>

          <!-- Total Amount Display -->
          <div class="bg-white rounded-xl shadow-md border border-gray-100 p-5">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-700">Total Amount</span>
              <span class="text-2xl font-bold text-emerald-600">${{ totalAmount.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Availability Check Results -->
          <div v-if="availabilityCheck" class="bg-white rounded-xl shadow-md border border-gray-100 p-5 border-l-4 border-l-emerald-500">
            <h4 class="font-semibold text-gray-900 mb-3">Availability Check</h4>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex justify-between">
                <span>Vouchers in stock:</span>
                <span class="font-medium">{{ availabilityCheck.vouchersInStock }}</span>
              </div>
              <div class="flex justify-between">
                <span>Your entitlements:</span>
                <span class="font-medium">{{ availabilityCheck.agentEntitlements }}</span>
              </div>
              <div class="flex justify-between">
                <span>Already sold:</span>
                <span class="font-medium">{{ availabilityCheck.alreadySold }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-3 mt-2">
                <span class="font-medium text-gray-900">Available for sale</span>
                <span class="font-bold text-emerald-600">{{ availabilityCheck.availableForSale }}</span>
              </div>
            </div>
          </div>

          <!-- Submit Button (touch-friendly on mobile) -->
          <div class="flex justify-end">
            <Button 
              type="submit"
              label="Create Sale" 
              icon="add_shopping_cart"
              class="bg-green-600 hover:bg-green-700 min-h-[44px] touch-manipulation"
              :loading="creating"
              :disabled="!canCreateSale"
            />
          </div>
        </form>
      </div>

      <!-- Success Modal with Vouchers -->
      <Dialog 
        v-model:visible="showSuccessModal" 
        header="Sale Created Successfully!" 
        :style="{ width: '90vw', maxWidth: '1200px' }"
        :closable="true"
        class="voucher-success-modal"
        :modal="true"
        :dismissableMask="false"
      >
        <div v-if="createdVouchers.length > 0" class="space-y-6">
          <!-- Sale Summary -->
          <div class="bg-white rounded-xl shadow-md border border-gray-100 p-5 border-l-4 border-l-emerald-500">
            <h4 class="font-semibold text-gray-900 mb-3">Sale Summary</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-500 block text-xs uppercase tracking-wide">Customer</span>
                <span class="font-medium text-gray-900">{{ createdSaleSummary?.customerName || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-gray-500 block text-xs uppercase tracking-wide">Phone</span>
                <span class="font-medium text-gray-900">{{ createdSaleSummary?.customerPhone || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-gray-500 block text-xs uppercase tracking-wide">Quantity</span>
                <span class="font-medium text-gray-900">{{ createdVouchers.length }}</span>
              </div>
              <div>
                <span class="text-gray-500 block text-xs uppercase tracking-wide">Total Amount</span>
                <span class="font-semibold text-emerald-600">${{ createdSaleSummary ? createdSaleSummary.totalAmount.toFixed(2) : '0.00' }}</span>
              </div>
            </div>
          </div>

          <!-- Vouchers Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="voucher in createdVouchers" 
              :key="voucher.id"
              class="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow duration-200"
            >
              <!-- Voucher Header -->
              <div class="text-center mb-4">
                <h5 class="font-semibold text-gray-900 mb-1">WiFi Voucher</h5>
                <p class="text-sm text-gray-600">{{ voucher.location.name }}</p>
              </div>

              <!-- QR Code -->
              <div class="flex justify-center mb-4">
                <Qrcode 
                  :value="voucher.voucherNumber"
                  :size="120"
                  level="M"
                  class="border border-gray-200 rounded-lg shadow-sm"
                />
              </div>

              <!-- Voucher Details -->
              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Voucher #:</span>
                  <span class="font-mono text-xs font-medium">{{ voucher.voucherNumber }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">PIN:</span>
                  <span class="font-mono text-xs font-medium">{{ voucher.pin }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Type:</span>
                  <span class="font-medium">{{ voucher.hours }}H, {{ voucher.numberOfUsers }}U</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Expiry:</span>
                  <span class="font-medium">{{ formatDate(voucher.endDate) }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <Button 
                  size="small"
                  severity="secondary"
                  class="flex-1 h-8 text-xs"
                  :loading="printingVouchers.has(voucher.id)"
                  :disabled="printingVouchers.has(voucher.id)"
                  @click="printVoucher(voucher)"
                >
                  <span class="material-icons text-sm mr-1">print</span>
                  {{ printingVouchers.has(voucher.id) ? 'Printing...' : 'Print' }}
                </Button>
                <Button 
                  size="small"
                  severity="secondary"
                  class="flex-1 h-8 text-xs"
                  @click="downloadVoucher(voucher)"
                >
                  <span class="material-icons text-sm mr-1">download</span>
                  Download
                </Button>
              </div>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div class="flex flex-wrap justify-center gap-3 pt-6 border-t border-gray-200">
            <Button 
              severity="success"
              class="flex items-center"
              @click="printAllVouchers"
            >
              <span class="material-icons mr-2">print</span>
              Print All Vouchers
            </Button>
            <Button 
              severity="secondary"
              class="flex items-center"
              @click="downloadAllVouchers"
            >
              <span class="material-icons mr-2">download</span>
              Download All
            </Button>
            <Button 
              severity="info"
              class="flex items-center"
              @click="closeSuccessModal"
            >
              <span class="material-icons mr-2">check</span>
              Done
            </Button>
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
const locations = ref<any[]>([])
const availableVoucherTypes = ref<any[]>([])
const selectedLocation = ref<string>('')
const selectedVoucherType = ref<string>('')
const quantity = ref<number>(1)
const salePrice = ref(0)
const customerName = ref('')
const customerPhone = ref('')
const creating = ref(false)
const availabilityCheck = ref<any>(null)
const showSuccessModal = ref(false)
const createdVouchers = ref<any[]>([])
const createdSaleSummary = ref<{ customerName: string; customerPhone: string; salePrice: number; totalAmount: number } | null>(null)
const printing = ref(false)
const printingAll = ref(false)
const printingVouchers = ref<Set<string>>(new Set())

// Bluetooth thermal printer (same as sales page)
const PRINTER_PAPER_WIDTH_KEY = 'ufo-printer-paper-width'
const printer = useBluetoothPrinter()
const bluetoothSupported = printer.isSupported
const bluetoothDevice = printer.device
const bluetoothConnected = printer.isConnected
const bluetoothConnecting = ref(false)
const printerPaperWidth = ref(32)
if (import.meta.client) {
  const saved = localStorage.getItem(PRINTER_PAPER_WIDTH_KEY)
  if (saved) { const n = parseInt(saved, 10); if (n === 32 || n === 42) printerPaperWidth.value = n }
}
async function connectBluetoothPrinter() {
  bluetoothConnecting.value = true
  try {
    await printer.requestDevice()
    if (printer.error.value && !String(printer.error.value).includes('cancelled')) {
      toast.add({ severity: 'warn', summary: 'Printer', detail: String(printer.error.value), life: 5000 })
    }
  } finally {
    bluetoothConnecting.value = false
  }
}

// Computed
const totalAmount = computed(() => quantity.value * salePrice.value)

const maxAvailableQuantity = computed(() => {
  if (!availabilityCheck.value) return 0
  return availabilityCheck.value.availableForSale
})

const canCreateSale = computed(() => {
  return selectedLocation.value && 
         selectedVoucherType.value && 
         quantity.value > 0 && 
         salePrice.value > 0 &&
         availabilityCheck.value &&
         quantity.value <= availabilityCheck.value.availableForSale
})

// Fetch locations
const fetchLocations = async () => {
  try {
    const response = await $fetch('/api/locations')
    if (response.success) {
      locations.value = response.data
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load locations',
      life: 3000
    })
  }
}

// Fetch voucher types for selected location
const fetchVoucherTypes = async () => {
  if (!selectedLocation.value) return
  
  try {
    const response = await $fetch(`/api/locations/${selectedLocation.value}/voucher-types`)
    if (response.success) {
      availableVoucherTypes.value = response.data.map((type: any) => ({
        label: `${type.hours}H, ${type.numberOfUsers} Users - $${type.retailPrice}`,
        value: `${type.hours}-${type.numberOfUsers}`,
        hours: type.hours,
        numberOfUsers: type.numberOfUsers,
        retailPrice: type.retailPrice
      }))
    }
  } catch (error) {
    console.error('Error fetching voucher types:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load voucher types',
      life: 3000
    })
  }
}

// Check availability when location or voucher type changes
const checkAvailability = async () => {
  if (!selectedLocation.value || !selectedVoucherType.value) {
    availabilityCheck.value = null
    return
  }

  try {
    const [hours, numberOfUsers] = selectedVoucherType.value.split('-').map(Number)
    
    const response = await $fetch('/api/agent/check-availability', {
      method: 'POST',
      body: {
        locationId: selectedLocation.value,
        hours,
        numberOfUsers
      }
    })

    if (response.success) {
      availabilityCheck.value = response.data
    }
  } catch (error) {
    console.error('Error checking availability:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to check availability',
      life: 3000
    })
  }
}

// Event handlers
const onLocationChange = () => {
  selectedVoucherType.value = ''
  quantity.value = 1
  availabilityCheck.value = null
  fetchVoucherTypes()
}

const onVoucherTypeChange = () => {
  quantity.value = 1
  checkAvailability()
}

// Create sale
const createSale = async () => {
  if (!canCreateSale.value) return

  try {
    creating.value = true
    
    const [hours, numberOfUsers] = selectedVoucherType.value.split('-').map(Number)
    
    const response = await $fetch('/api/agent/create-sale', {
      method: 'POST',
      body: {
        locationId: selectedLocation.value,
        hours,
        numberOfUsers,
        quantity: quantity.value,
        salePrice: salePrice.value,
        customerName: customerName.value,
        customerPhone: customerPhone.value,
        totalAmount: totalAmount.value
      }
    })

    if (response.success) {
      const vouchers = response.data.vouchers || []
      const summary = {
        customerName: customerName.value,
        customerPhone: customerPhone.value,
        salePrice: salePrice.value,
        totalAmount: totalAmount.value
      }
      createdSaleSummary.value = summary
      createdVouchers.value = vouchers
      showSuccessModal.value = true

      // Reset form
      selectedLocation.value = ''
      selectedVoucherType.value = ''
      quantity.value = 1
      salePrice.value = 0
      customerName.value = ''
      customerPhone.value = ''
      availabilityCheck.value = null
      availableVoucherTypes.value = []

      // Auto-print to Bluetooth printer if connected
      if (bluetoothConnected.value && vouchers.length > 0) {
        autoPrintVouchers(vouchers, summary)
      }
    }
  } catch (error: any) {
    console.error('Error creating sale:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.data?.message || 'Failed to create sale',
      life: 5000
    })
  } finally {
    creating.value = false
  }
}

// Voucher utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Build sale object for receipt (uses createdSaleSummary when in success modal)
function saleForReceipt(voucher: any) {
  const summary = createdSaleSummary.value
  return {
    voucher: {
      voucherNumber: voucher.voucherNumber,
      pin: voucher.pin,
      hours: voucher.hours,
      numberOfUsers: voucher.numberOfUsers,
      endDate: voucher.endDate,
      location: voucher.location
    },
    buyerNote: summary?.customerName ?? customerName.value ?? null,
    buyerPhone: summary?.customerPhone ?? customerPhone.value ?? null,
    soldPrice: summary?.salePrice ?? salePrice.value,
    createdAt: new Date().toISOString()
  }
}

// Auto-print all vouchers to Bluetooth after successful sale (runs in background)
async function autoPrintVouchers(
  vouchers: any[],
  _summary: { customerName: string; customerPhone: string; salePrice: number; totalAmount: number }
) {
  if (!bluetoothConnected.value || vouchers.length === 0) return
  const { encodeVoucherReceipt } = await import('~/utils/escpos-voucher')
  for (let i = 0; i < vouchers.length; i++) {
    try {
      const sale = saleForReceipt(vouchers[i])
      const data = encodeVoucherReceipt(sale, printerPaperWidth.value)
      await printer.printRaw(data)
      if (i < vouchers.length - 1) await new Promise(r => setTimeout(r, 400))
    } catch (e) {
      console.error('Auto-print error:', e)
      toast.add({
        severity: 'error',
        summary: 'Print',
        detail: `Could not auto-print voucher ${i + 1}: ${e instanceof Error ? e.message : 'Error'}`,
        life: 5000
      })
    }
  }
  toast.add({
    severity: 'success',
    summary: 'Printed',
    detail: `${vouchers.length} voucher(s) sent to printer`,
    life: 3000
  })
}

// Print individual voucher (Bluetooth if connected, else toast to connect)
const printVoucher = async (voucher: any) => {
  if (bluetoothConnected.value) {
    try {
      printingVouchers.value.add(voucher.id)
      const { encodeVoucherReceipt } = await import('~/utils/escpos-voucher')
      const sale = saleForReceipt(voucher)
      const data = encodeVoucherReceipt(sale, printerPaperWidth.value)
      await printer.printRaw(data)
      toast.add({ severity: 'success', summary: 'Printed', detail: 'Voucher sent to printer', life: 3000 })
    } catch (error) {
      console.error('Error printing voucher:', error)
      toast.add({ severity: 'error', summary: 'Print Error', detail: error instanceof Error ? error.message : 'Failed to print', life: 3000 })
    } finally {
      printingVouchers.value.delete(voucher.id)
    }
    return
  }
  toast.add({
    severity: 'warn',
    summary: 'Print',
    detail: 'Connect a Bluetooth printer above to print vouchers',
    life: 5000
  })
}

// Print all vouchers (Bluetooth)
const printAllVouchers = async () => {
  if (!bluetoothConnected.value) {
    toast.add({ severity: 'warn', summary: 'Print', detail: 'Connect a Bluetooth printer above to print', life: 5000 })
    return
  }
  try {
    printingAll.value = true
    const { encodeVoucherReceipt } = await import('~/utils/escpos-voucher')
    for (let i = 0; i < createdVouchers.value.length; i++) {
      const voucher = createdVouchers.value[i]
      const sale = saleForReceipt(voucher)
      const data = encodeVoucherReceipt(sale, printerPaperWidth.value)
      await printer.printRaw(data)
      if (i < createdVouchers.value.length - 1) await new Promise(r => setTimeout(r, 400))
    }
    toast.add({ severity: 'success', summary: 'Printed', detail: 'All vouchers sent to printer', life: 3000 })
  } catch (error) {
    console.error('Error printing all vouchers:', error)
    toast.add({ severity: 'error', summary: 'Print Error', detail: error instanceof Error ? error.message : 'Failed to print some vouchers', life: 3000 })
  } finally {
    printingAll.value = false
  }
}

// Generate voucher HTML content
const generateVoucherHTML = (voucher: any) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UFO Networks Voucher - ${voucher.voucherNumber}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1d5caa 0%, #2d3040 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .voucher {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .voucher::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1d5caa, #2d3040);
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1d5caa;
            margin-bottom: 10px;
        }
        .tagline {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }
        .voucher-number {
            background: #f8f9fa;
            border: 2px dashed #1d5caa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .voucher-number h2 {
            margin: 0;
            color: #1d5caa;
            font-size: 28px;
            letter-spacing: 2px;
        }
        .pin-section {
            background: #1d5caa;
            color: white;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
        }
        .pin-label {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        .pin-code {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .details {
            text-align: left;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #333;
        }
        .detail-value {
            color: #666;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
        }
        .qr-placeholder {
            width: 80px;
            height: 80px;
            background: #f0f0f0;
            border: 2px dashed #ccc;
            border-radius: 8px;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 10px;
        }
        @media print {
            body { background: white; }
            .voucher { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="voucher">
        <div class="logo">UFO Networks</div>
        <div class="tagline">Fast WiFi Anywhere</div>
        
        <div class="voucher-number">
            <h2>${voucher.voucherNumber}</h2>
        </div>
        
        <div class="pin-section">
            <div class="pin-label">ACCESS PIN</div>
            <div class="pin-code">${voucher.pin}</div>
        </div>
        
        <div class="qr-placeholder">
            QR Code<br>${voucher.voucherNumber}
        </div>
        
        <div class="details">
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${voucher.location.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${voucher.hours} hours</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Users:</span>
                <span class="detail-value">${voucher.numberOfUsers} devices</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Expires:</span>
                <span class="detail-value">${formatDate(voucher.endDate)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Customer:</span>
                <span class="detail-value">${customerName.value || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${customerPhone.value || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Price:</span>
                <span class="detail-value">$${salePrice.value}</span>
            </div>
        </div>
        
        <div class="footer">
            <p>Valid until ${formatDate(voucher.endDate)}</p>
            <p>Present this voucher at ${voucher.location.name}</p>
        </div>
    </div>
</body>
</html>
  `
}

// Download individual voucher
const downloadVoucher = (voucher: any) => {
  const htmlContent = generateVoucherHTML(voucher)
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `voucher-${voucher.voucherNumber}.html`
  a.click()
  window.URL.revokeObjectURL(url)

  toast.add({
    severity: 'success',
    summary: 'Download Success',
    detail: 'Voucher downloaded successfully',
    life: 3000
  })
}

// Generate multiple vouchers HTML content
const generateAllVouchersHTML = () => {
  const vouchersHTML = createdVouchers.value.map(voucher => generateVoucherHTML(voucher)).join('<div style="page-break-before: always;"></div>')
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UFO Networks Vouchers - ${new Date().toISOString().split('T')[0]}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1d5caa 0%, #2d3040 100%);
            min-height: 100vh;
        }
        .voucher {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
            text-align: center;
            position: relative;
            overflow: hidden;
            margin: 20px auto;
        }
        .voucher::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1d5caa, #2d3040);
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1d5caa;
            margin-bottom: 10px;
        }
        .tagline {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }
        .voucher-number {
            background: #f8f9fa;
            border: 2px dashed #1d5caa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .voucher-number h2 {
            margin: 0;
            color: #1d5caa;
            font-size: 28px;
            letter-spacing: 2px;
        }
        .pin-section {
            background: #1d5caa;
            color: white;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
        }
        .pin-label {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 5px;
        }
        .pin-code {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .details {
            text-align: left;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #333;
        }
        .detail-value {
            color: #666;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
        }
        .qr-placeholder {
            width: 80px;
            height: 80px;
            background: #f0f0f0;
            border: 2px dashed #ccc;
            border-radius: 8px;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 10px;
        }
        @media print {
            body { background: white; }
            .voucher { box-shadow: none; }
        }
    </style>
</head>
<body>
    ${vouchersHTML}
</body>
</html>
  `
}

// Download all vouchers
const downloadAllVouchers = () => {
  const htmlContent = generateAllVouchersHTML()
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vouchers-${new Date().toISOString().split('T')[0]}.html`
  a.click()
  window.URL.revokeObjectURL(url)

  toast.add({
    severity: 'success',
    summary: 'Download Success',
    detail: 'All vouchers downloaded',
    life: 3000
    })
}

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
  createdVouchers.value = []
  createdSaleSummary.value = null
}

// Fetch data on mount
onMounted(() => {
  fetchLocations()
})

// Meta tags
useHead({
  title: 'Create Sale - Agent Dashboard',
  meta: [
    { name: 'description', content: 'Record a voucher sale to a customer.' }
  ]
})
</script>

<style scoped>
.voucher-success-modal {
  max-height: 90vh;
  overflow-y: auto;
}

.voucher-success-modal :deep(.p-dialog-content) {
  padding: 1.5rem;
}

.voucher-success-modal :deep(.p-dialog) {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}
.voucher-success-modal :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 1rem 1rem 0 0;
  padding: 1.25rem 1.5rem;
}

.voucher-success-modal :deep(.p-dialog-header-icon) {
  color: white;
}

.voucher-success-modal :deep(.p-dialog-header-icon:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Custom scrollbar for the modal */
.voucher-success-modal :deep(.p-dialog-content)::-webkit-scrollbar {
  width: 8px;
}

.voucher-success-modal :deep(.p-dialog-content)::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.voucher-success-modal :deep(.p-dialog-content)::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.voucher-success-modal :deep(.p-dialog-content)::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
