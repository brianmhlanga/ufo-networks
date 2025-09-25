<template>
  <NuxtLayout name="home">
    <div id="locations-page" class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="relative overflow-hidden py-20 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/happy.jpg');">
        <!-- Dark overlay for better text contrast -->
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Badge -->
            <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span class="text-sm font-medium text-gray-800">{{ totalLocations }} Active Locations</span>
            </div>

            <!-- Main heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              <span class="block">Find WiFi</span>
              <span class="block bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">Near You</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              Connect instantly at any of our locations across Zimbabwe. Browse available vouchers and get connected in seconds.
            </p>

            <!-- Search Bar -->
            <div class="max-w-2xl mx-auto mb-8">
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text"
                  placeholder="Search locations, towns, or provinces..." 
                  class="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-white/30 focus:border-white/60 transition-colors outline-none bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-600"
                />
                <i class="pi pi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg"></i>
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

            <!-- Location Features -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Nationwide Coverage</h3>
                <p class="text-white/80 text-sm">Locations across Zimbabwe</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Instant Connection</h3>
                <p class="text-white/80 text-sm">Connect in seconds</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Reliable Service</h3>
                <p class="text-white/80 text-sm">High-speed internet</p>
              </div>
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
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            <div 
              v-for="location in filteredLocations" 
              :key="location.id"
              class="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full min-h-[280px] relative"
            >
              <!-- Card Header with Gradient -->
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white relative overflow-hidden h-24 flex items-center">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div class="relative z-10 w-full">
                  <h3 class="text-lg font-bold mb-1 group-hover:text-blue-100 transition-colors truncate">
                    {{ location.name }}
                  </h3>
                  <div class="flex items-center text-sm text-blue-100">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span class="truncate">{{ location.town }}, {{ location.province }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-4 flex flex-col h-full">
                <!-- Action Button -->
                <div class="mt-auto">
                  <button 
                    @click="goToVouchers(location.id)"
                    class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                    </svg>
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            </div>
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
    return `${baseClasses} bg-blue-600 text-white shadow-lg`
  } else {
    return `${baseClasses} bg-white/90 text-gray-800 hover:bg-white border border-white/30 backdrop-blur-sm`
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
