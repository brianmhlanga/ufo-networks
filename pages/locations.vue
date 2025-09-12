<template>
  <NuxtLayout name="home">
    <div id="locations-page" class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="relative overflow-hidden py-12 bg-gradient-to-br from-[#eff4ff] to-white">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Badge -->
            <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span class="text-sm font-medium text-secondary">{{ totalLocations }} Active Locations</span>
            </div>

            <!-- Main heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-secondary leading-tight mb-6">
              <span class="block">Find WiFi</span>
              <span class="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Near You</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl text-secondary/80 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              Connect instantly at any of our locations across Zimbabwe. Browse available vouchers and get connected in seconds.
            </p>

            <!-- Search Bar -->
            <div class="max-w-2xl mx-auto mb-8">
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text"
                  placeholder="Search locations, towns, or provinces..." 
                  class="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-primary transition-colors outline-none"
                />
                <i class="pi pi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
              </div>
            </div>

            <!-- Filter Buttons -->
            <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Button 
                v-for="province in provinces" 
                :key="province"
                :label="province" 
                :class="getProvinceButtonClass(province)"
                @click="toggleProvince(province)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Locations Grid -->
      <section class="py-8 bg-white">
        <div class="container mx-auto px-6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-16">
            <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-secondary/70">Loading locations...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredLocations.length === 0" class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="pi pi-map-marker text-3xl text-gray-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-secondary mb-2">No locations found</h3>
            <p class="text-secondary/70 mb-6">Try adjusting your search or filter criteria</p>
            <Button label="Clear Filters" @click="clearFilters" class="bg-primary text-white rounded-xl" />
          </div>

          <!-- Locations Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            <Card 
              v-for="location in filteredLocations" 
              :key="location.id"
              class="group border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-full min-h-[400px]"
            >
              <template #content>
                <div class="p-6 flex flex-col h-full">
                  <!-- Location Header -->
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-secondary mb-1 group-hover:text-primary transition-colors">
                        {{ location.name }}
                      </h3>
                      <div class="flex items-center text-sm text-secondary/70 mb-2">
                        <span class="mr-1">📍</span>
                        <span>{{ location.town }}, {{ location.province }}</span>
                      </div>
                      <div class="text-xs text-secondary/60 bg-gray-100 px-2 py-1 rounded-full inline-block">
                        {{ location.code }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold text-primary">{{ location.totalVouchers }}</div>
                      <div class="text-xs text-secondary/70">Available</div>
                    </div>
                  </div>

                  <!-- Voucher Types -->
                  <div class="mb-6 flex-1">
                    <h4 class="text-sm font-semibold text-secondary mb-3">Available Vouchers</h4>
                    <div class="space-y-2">
                      <div 
                        v-for="voucher in location.voucherTypes.slice(0, 3)" 
                        :key="`${voucher.hours}-${voucher.numberOfUsers}`"
                        class="flex items-center justify-between bg-gray-50 rounded-xl p-3"
                      >
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span class="text-primary text-sm">⏰</span>
                          </div>
                          <div>
                            <div class="font-medium text-secondary">
                              {{ voucher.hours }}H, {{ voucher.numberOfUsers }} Users
                            </div>
                            <div class="text-xs text-secondary/60">
                              {{ voucher.availableCount }} available
                            </div>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="font-bold text-primary">${{ voucher.retailPrice }}</div>
                        </div>
                      </div>
                      
                      <!-- Show more indicator -->
                      <div v-if="location.voucherTypes.length > 3" class="text-center">
                        <span class="text-sm text-secondary/60">
                          +{{ location.voucherTypes.length - 3 }} more voucher types
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <div class="mt-auto">
                    <Button 
                      label="Order Now" 
                      class="w-full bg-primary text-white rounded-xl hover:bg-primary-900 font-semibold py-3 transition-all"
                      @click="goToVouchers(location.id)"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Results Summary -->
          <div v-if="!loading && filteredLocations.length > 0" class="text-center mt-12">
            <p class="text-secondary/70">
              Showing {{ filteredLocations.length }} of {{ totalLocations }} locations
            </p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-gradient-to-br from-primary to-secondary">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Can't find your location?
          </h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            We're constantly expanding our network. Contact us to request WiFi coverage in your area.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button label="Request Coverage" class="px-8 py-3 bg-white text-primary rounded-xl hover:bg-gray-50 font-semibold" />
            <Button label="Contact Support" class="px-8 py-3 bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 font-semibold" text />
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'

// Reactive data
const locations = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedProvince = ref(null)

// Computed properties
const totalLocations = computed(() => locations.value?.length || 0)

const provinces = computed(() => {
  if (!locations.value || locations.value.length === 0) return []
  const uniqueProvinces = [...new Set(locations.value.map(loc => loc.province))]
  return uniqueProvinces.sort()
})

const filteredLocations = computed(() => {
  if (!locations.value || locations.value.length === 0) return []
  
  let filtered = locations.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(location => 
      location.name.toLowerCase().includes(query) ||
      location.town.toLowerCase().includes(query) ||
      location.province.toLowerCase().includes(query) ||
      location.area?.toLowerCase().includes(query)
    )
  }

  // Filter by province
  if (selectedProvince.value) {
    filtered = filtered.filter(location => location.province === selectedProvince.value)
  }

  return filtered
})

// Methods
const fetchLocations = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/locations/with-vouchers')
    
    if (response && response.success) {
      locations.value = response.data || []
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    locations.value = []
  } finally {
    loading.value = false
  }
}

const goToVouchers = (locationId) => {
  navigateTo(`/vouchers?location=${locationId}`)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedProvince.value = null
}

const getProvinceButtonClass = (province) => {
  const baseClasses = 'px-4 py-2 rounded-xl font-medium transition-all'
  const isSelected = selectedProvince.value === province
  
  if (isSelected) {
    return `${baseClasses} bg-primary text-white shadow-lg`
  } else {
    return `${baseClasses} bg-white/80 text-secondary hover:bg-gray-50 border border-gray-200`
  }
}

const toggleProvince = (province) => {
  selectedProvince.value = selectedProvince.value === province ? null : province
}

// Meta tags
useHead({
  title: 'UFO Networks Locations – Find WiFi Near You',
  meta: [
    { name: 'description', content: 'Find UFO Networks WiFi locations across Zimbabwe. Browse available vouchers and connect instantly.' }
  ]
})

// Lifecycle
onMounted(() => {
  fetchLocations()
})
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#locations-page {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Apply Poppins to all elements */
#locations-page * {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Utilities bound to palette */
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-secondary\/80 { color: color-mix(in srgb, var(--secondary) 80%, white); }
.text-secondary\/70 { color: color-mix(in srgb, var(--secondary) 70%, white); }
.text-secondary\/60 { color: color-mix(in srgb, var(--secondary) 60%, white); }
.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }
.bg-primary-900 { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.bg-primary\/10 { background-color: color-mix(in srgb, var(--primary) 10%, transparent); }

/* Hover effects */
.hover\:text-primary:hover { color: var(--primary); }
.hover\:bg-primary-900:hover { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\:bg-white\/30:hover { background-color: color-mix(in srgb, white 30%, transparent); }

/* Gradients */
.from-primary { --tw-gradient-from: var(--primary); --tw-gradient-to: rgb(255 255 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.to-secondary { --tw-gradient-to: var(--secondary); }

/* Transitions */
.transition-colors { transition: color 0.15s ease-in-out; }
.transition-all { transition: all 0.15s ease-in-out; }

/* Transform utilities */
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.hover\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }

/* Glass morphism effects */
.backdrop-blur-sm { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }

/* Additional color utilities */
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-50 { background-color: #f9fafb; }
.border-gray-200 { border-color: #e5e7eb; }
.bg-green-500 { background-color: #10b981; }

/* Shadow utilities */
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
.hover\:shadow-2xl:hover { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }

/* Animation */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
