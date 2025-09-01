<template>
  <div id="landing" class="min-h-screen bg-white">
    <!-- Header Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2 group">
              <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <i class="pi pi-wifi text-white text-lg"></i>
              </div>
              <span class="text-2xl font-bold text-secondary group-hover:text-primary transition-colors">UFO Networks</span>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-1">
            <NuxtLink to="/" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Home</NuxtLink>
            <NuxtLink to="/vouchers" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Vouchers</NuxtLink>
            <NuxtLink to="/locations" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Locations</NuxtLink>
            <NuxtLink to="/agents" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Agents</NuxtLink>
            <NuxtLink to="/advertise" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Advertise</NuxtLink>
            <NuxtLink to="/contact" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Contact</NuxtLink>
          </nav>

          <!-- CTA Buttons -->
          <div class="hidden lg:flex items-center space-x-3">
            <Button label="Sign In" class="px-6 py-2.5 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl font-medium transition-all" text />
            <Button label="Get Started" class="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-900 font-medium shadow-lg hover:shadow-xl transition-all" />
          </div>

          <!-- Mobile Menu Button -->
          <div class="lg:hidden">
            <Button @click="toggleMobileMenu" class="p-3 text-secondary hover:bg-gray-50 rounded-xl transition-all" text>
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
            </Button>
          </div>
        </div>

        <!-- Mobile Navigation Overlay -->
        <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl z-40">
          <nav class="container mx-auto px-6 py-8 space-y-1">
            <NuxtLink to="/" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Home</NuxtLink>
            <NuxtLink to="/vouchers" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Vouchers</NuxtLink>
            <NuxtLink to="/locations" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Locations</NuxtLink>
            <NuxtLink to="/agents" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Agents</NuxtLink>
            <NuxtLink to="/advertise" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Advertise</NuxtLink>
            <NuxtLink to="/contact" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Contact</NuxtLink>
            
            <div class="pt-6 space-y-3">
              <Button label="Sign In" class="w-full px-6 py-3 text-secondary border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-lg transition-all" text @click="mobileMenuOpen = false" />
              <Button label="Get Started" class="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-900 font-medium text-lg shadow-lg transition-all" @click="mobileMenuOpen = false" />
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden py-32">
      <!-- Background Images -->
      <div class="absolute inset-0">
        <!-- Primary Hero Image -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000" 
             style="background-image: url('/images/heroone.jpg');">
          <!-- Modern gradient overlay with light blue opacity and darker overlay -->
          <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(239,246,255,0.5) 30%, rgba(24,95,249,0.3) 70%, rgba(0,0,0,0.1) 100%);"></div>
        </div>
        
        <!-- Secondary Hero Image (for variety/animation) -->
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 animate-fade-alternate scale-105 transition-transform duration-1000" 
             style="background-image: url('/images/herotwo.jpg');">
          <!-- Modern gradient overlay with light blue opacity and darker overlay -->
          <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(239,246,255,0.5) 30%, rgba(45,48,64,0.3) 70%, rgba(0,0,0,0.1) 100%);"></div>
        </div>
      </div>

      <!-- Floating geometric elements -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl animate-float"></div>
        <div class="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-xl animate-float-delayed"></div>
        <div class="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl animate-float"></div>
      </div>

      <!-- Hero Content -->
      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-6xl mx-auto text-center">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 mb-6">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span class="text-sm font-medium text-secondary">Live in 45+ locations across Zimbabwe</span>
          </div>

          <!-- Main heading -->
          <h1 class="text-4xl md:text-6xl font-bold text-secondary leading-tight mb-6">
            <span class="block">Fast, Reliable</span>
            <span class="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">WiFi Anywhere</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-secondary/80 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
            Connect instantly with secure vouchers. Buy online or from our trusted agents across Zimbabwe.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button class="px-8 py-3 bg-primary text-white rounded-2xl hover:bg-primary-900 shadow-2xl hover:shadow-primary/25 font-semibold text-lg transition-all transform hover:scale-105">
              <span>Start Browsing Now</span>
              <i class="pi pi-arrow-right ml-2"></i>
            </Button>
            <Button class="px-8 py-3 bg-white/90 text-secondary border border-gray-200 rounded-2xl hover:bg-white shadow-xl font-semibold text-lg transition-all transform hover:scale-105" text>
              <span>Learn More</span>
            </Button>
          </div>

          <!-- Modern Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:scale-105">
              <div class="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">45+</div>
              <div class="text-secondary/70 font-medium">Active Hotspots</div>
              <div class="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mt-3"></div>
            </div>
            <div class="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:scale-105">
              <div class="text-3xl md:text-4xl font-bold text-secondary mb-2 group-hover:scale-110 transition-transform">10K+</div>
              <div class="text-secondary/70 font-medium">Happy Users</div>
              <div class="w-12 h-1 bg-gradient-to-r from-secondary to-transparent rounded-full mt-3"></div>
            </div>
            <div class="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:scale-105">
              <div class="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">99.9%</div>
              <div class="text-secondary/70 font-medium">Network Uptime</div>
              <div class="w-12 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mt-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-[#eff4ff]">
      <div class="container mx-auto px-4 py-12 md:py-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-secondary">How It Works</h2>
        <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-secondary font-semibold">For Customers</div>
            </template>
            <template #content>
              <ul class="space-y-2 text-secondary">
                <li>• Buy a voucher (online or from an agent)</li>
                <li>• Get your PIN instantly</li>
                <li>• Connect at any UFO hotspot</li>
              </ul>
            </template>
          </Card>
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-secondary font-semibold">For Agents</div>
            </template>
            <template #content>
              <ul class="space-y-2 text-secondary">
                <li>• Register and get verified</li>
                <li>• Buy discounted voucher packs</li>
                <li>• Resell to customers for cash</li>
              </ul>
            </template>
          </Card>
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-secondary font-semibold">For Advertisers</div>
            </template>
            <template #content>
              <ul class="space-y-2 text-secondary">
                <li>• Choose a package</li>
                <li>• Post your ad creative</li>
                <li>• Show on our Success Page</li>
              </ul>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Coverage Map Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-secondary mb-10">Coverage Map</h2>
        <div class="max-w-6xl mx-auto">
          <div class="bg-[#eff4ff] rounded-3xl p-8 custom-card-shadow">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold text-secondary mb-2">Available in 45+ Locations</h3>
              <p class="text-secondary/80">From Harare to Bulawayo, connect anywhere across Zimbabwe</p>
            </div>
            
            <!-- Interactive Map Container -->
            <div class="relative">
              <div id="zimbabwe-map" class="w-full h-96 rounded-2xl overflow-hidden shadow-lg"></div>
              
              <!-- Map Legend -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div class="flex items-center space-x-2 text-sm text-secondary">
                  <div class="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Active Hotspot</span>
                </div>
                <div class="flex items-center space-x-2 text-sm text-secondary mt-1">
                  <div class="w-3 h-3 bg-secondary rounded-full"></div>
                  <span>Coming Soon</span>
                </div>
              </div>
              
              <!-- Location Counter -->
              <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <div class="text-sm text-secondary">
                  <span class="font-semibold text-primary">45</span> Active Locations
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Button label="Find Nearest Hotspot" class="bg-primary text-white rounded-xl hover:bg-primary-900" />
              <Button label="View All Locations" class="bg-secondary text-white rounded-xl hover:opacity-90" text />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Voucher Packages -->
    <section class="bg-[#eff4ff]">
      <div class="container mx-auto px-4 py-12 md:py-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-secondary">Voucher Packages</h2>
        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-primary font-bold">1 Hour</div>
            </template>
            <template #content>
              <div class="text-4xl font-bold text-secondary">$0.50</div>
              <ul class="mt-4 space-y-1 text-secondary">
                <li>• 1 hour access</li>
                <li>• Up to 3 devices</li>
                <li>• Valid 24 hours</li>
              </ul>
              <Button label="Buy Now" class="mt-6 w-full bg-primary text-white rounded-xl hover:bg-primary-900" />
            </template>
          </Card>

          <Card class="border-2 border-primary rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-primary font-bold">5 Hours</div>
            </template>
            <template #content>
              <div class="text-4xl font-bold text-secondary">$2.00</div>
              <ul class="mt-4 space-y-1 text-secondary">
                <li>• 5 hours access</li>
                <li>• Up to 5 devices</li>
                <li>• Valid 48 hours</li>
              </ul>
              <Button label="Buy Now" class="mt-6 w-full bg-primary text-white rounded-xl hover:bg-primary-900" />
            </template>
          </Card>

          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-secondary font-bold">1 Day</div>
            </template>
            <template #content>
              <div class="text-4xl font-bold text-secondary">$5.00</div>
              <ul class="mt-4 space-y-1 text-secondary">
                <li>• 24 hours access</li>
                <li>• Up to 8 devices</li>
                <li>• Valid 7 days</li>
              </ul>
              <Button label="Buy Now" class="mt-6 w-full bg-secondary text-white rounded-xl hover:opacity-90" />
            </template>
          </Card>

          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-primary font-bold">Weekly</div>
            </template>
            <template #content>
              <div class="text-4xl font-bold text-secondary">$25.00</div>
              <ul class="mt-4 space-y-1 text-secondary">
                <li>• 7 days unlimited</li>
                <li>• Up to 10 devices</li>
                <li>• Valid 30 days</li>
              </ul>
              <Button label="Buy Now" class="mt-6 w-full bg-primary text-white rounded-xl hover:bg-primary-900" />
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Agent & Advertising CTA -->
    <section class="bg-[#eff4ff]">
      <div class="container mx-auto px-4 py-12 md:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-secondary font-bold">Become a UFO Agent</div>
            </template>
            <template #content>
              <p class="text-secondary">Buy at a discount, sell at retail and earn on every sale. Real-time stock and a simple dashboard.</p>
              <Button label="Register as Agent" class="mt-6 bg-secondary text-white rounded-xl hover:opacity-90" />
            </template>
          </Card>
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #title>
              <div class="text-secondary font-bold">Advertise With UFO</div>
            </template>
            <template #content>
              <p class="text-secondary">Your brand on our Success Page seen by thousands daily. Flexible monthly packages.</p>
              <Button label="View Ad Packages" class="mt-6 bg-primary text-white rounded-xl hover:bg-primary-900" />
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center text-secondary mb-10">What Our Users Say</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #content>
              <div class="text-center">
                <div class="text-4xl mb-4">⭐</div>
                <p class="text-secondary mb-4">"UFO Networks made it so easy to get WiFi anywhere in Harare. The vouchers are affordable and work perfectly!"</p>
                <div class="font-semibold text-secondary">- Sarah M.</div>
                <div class="text-sm text-secondary/70">Customer</div>
              </div>
            </template>
          </Card>
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #content>
              <div class="text-center">
                <div class="text-4xl mb-4">💼</div>
                <p class="text-secondary mb-4">"As an agent, I'm earning good money selling UFO vouchers. The system is simple and reliable."</p>
                <div class="font-semibold text-secondary">- John D.</div>
                <div class="text-sm text-secondary/70">Agent</div>
              </div>
            </template>
          </Card>
          <Card class="border border-secondary/10 rounded-2xl custom-card-shadow">
            <template #content>
              <div class="text-center">
                <div class="text-4xl mb-4">📱</div>
                <p class="text-secondary mb-4">"Advertising with UFO has increased our brand visibility significantly. Great ROI!"</p>
                <div class="font-semibold text-secondary">- TechCorp Ltd</div>
                <div class="text-sm text-secondary/70">Advertiser</div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-secondary/10">
      <div class="container mx-auto px-4 py-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-secondary">© 2024 UFO Networks</div>
          <div class="flex items-center gap-6 text-secondary">
            <a href="#" class="hover:text-primary">Terms</a>
            <a href="#" class="hover:text-primary">Privacy</a>
            <a href="#" class="hover:text-primary">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'

// Mobile menu state - using Nuxt's auto-imported ref
const mobileMenuOpen = ref(false)

// const toggleMobileMenu = () => {
//   mobileMenuOpen.value = !mobileMenuOpen.value
// }

// Meta tags for SEO
useHead({
  title: 'UFO Networks – Fast, Affordable WiFi Anywhere',
  meta: [
    { name: 'description', content: 'Buy WiFi vouchers online or from agents. Connect at any UFO hotspot.' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' }
  ],
  script: [
    { src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js' }
  ]
})

// Map initialization
onMounted(() => {
  // Wait for Leaflet to load
  setTimeout(() => {
    if (typeof L !== 'undefined') {
      initZimbabweMap()
    }
  }, 100)
})

const initZimbabweMap = () => {
  try {
    // Zimbabwe coordinates (center)
    const zimbabweCenter = [-19.0154, 29.1549]
    
    // Initialize map
    const map = L.map('zimbabwe-map').setView(zimbabweCenter, 7)
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map)
    
    // Dummy locations across Zimbabwe
    const locations = [
      { name: 'Harare Central', coords: [-17.8252, 31.0335], type: 'active', address: 'CBD, Harare' },
      { name: 'Bulawayo Mall', coords: [-20.1486, 28.5801], type: 'active', address: 'City Centre, Bulawayo' },
      { name: 'Mutare Station', coords: [-18.9726, 32.6709], type: 'active', address: 'Railway Station, Mutare' },
      { name: 'Gweru Plaza', coords: [-19.4563, 29.8148], type: 'active', address: 'Main Street, Gweru' },
      { name: 'Kwekwe Market', coords: [-18.9281, 29.8148], type: 'active', address: 'Central Market, Kwekwe' },
      { name: 'Kadoma Centre', coords: [-18.3333, 29.9167], type: 'active', address: 'Town Centre, Kadoma' },
      { name: 'Chinhoyi Hub', coords: [-17.3667, 30.2000], type: 'active', address: 'University Area, Chinhoyi' },
      { name: 'Marondera Square', coords: [-18.1833, 31.5500], type: 'active', address: 'Town Square, Marondera' },
      { name: 'Chegutu Plaza', coords: [-18.1333, 30.1333], type: 'active', address: 'Main Street, Chegutu' },
      { name: 'Bindura Mall', coords: [-17.3000, 31.3333], type: 'active', address: 'City Centre, Bindura' },
      { name: 'Chitungwiza Hub', coords: [-18.0000, 31.0500], type: 'active', address: 'Town Centre, Chitungwiza' },
      { name: 'Epworth Centre', coords: [-17.8833, 31.1500], type: 'active', address: 'Main Street, Epworth' },
      { name: 'Ruwa Station', coords: [-17.9167, 31.2333], type: 'active', address: 'Railway Station, Ruwa' },
      { name: 'Norton Plaza', coords: [-17.8833, 30.7000], type: 'active', address: 'Town Centre, Norton' },
      { name: 'Chivhu Market', coords: [-19.0167, 30.9000], type: 'active', address: 'Central Market, Chivhu' },
      { name: 'Masvingo Centre', coords: [-20.0667, 30.8333], type: 'active', address: 'City Centre, Masvingo' },
      { name: 'Zvishavane Hub', coords: [-20.3333, 30.0333], type: 'active', address: 'Town Centre, Zvishavane' },
      { name: 'Shurugwi Plaza', coords: [-19.6667, 30.0000], type: 'active', address: 'Main Street, Shurugwi' },
      { name: 'Gokwe Centre', coords: [-18.2167, 28.9333], type: 'active', address: 'Town Centre, Gokwe' },
      { name: 'Plumtree Station', coords: [-20.4833, 27.8167], type: 'active', address: 'Railway Station, Plumtree' },
      { name: 'Beitbridge Hub', coords: [-22.2167, 30.0000], type: 'active', address: 'Border Post, Beitbridge' },
      { name: 'Chiredzi Centre', coords: [-21.0500, 31.6667], type: 'active', address: 'Town Centre, Chiredzi' },
      { name: 'Triangle Plaza', coords: [-20.1667, 31.0167], type: 'active', address: 'Industrial Area, Triangle' },
      { name: 'Chipinge Hub', coords: [-20.2000, 32.6167], type: 'active', address: 'Town Centre, Chipinge' },
      { name: 'Kariba Hub', coords: [-16.5167, 28.8000], type: 'active', address: 'Lakeside, Kariba' },
      { name: 'Karoi Centre', coords: [-16.8167, 29.6167], type: 'active', address: 'Town Centre, Karoi' },
      { name: 'Banket Plaza', coords: [-17.3833, 30.4000], type: 'active', address: 'Town Centre, Banket' },
      { name: 'Glendale Centre', coords: [-17.3500, 31.0667], type: 'active', address: 'Town Centre, Glendale' },
      { name: 'Mvurwi Hub', coords: [-17.6500, 30.8500], type: 'active', address: 'Town Centre, Mvurwi' },
      { name: 'Shamva Centre', coords: [-17.3167, 31.5500], type: 'active', address: 'Town Centre, Shamva' },
      { name: 'Mazowe Hub', coords: [-17.5167, 30.9667], type: 'active', address: 'Farming Area, Mazowe' },
      { name: 'Goromonzi Plaza', coords: [-17.8000, 31.3667], type: 'active', address: 'Town Centre, Goromonzi' },
      { name: 'Wedza Centre', coords: [-18.6333, 31.5667], type: 'active', address: 'Town Centre, Wedza' },
      { name: 'Murehwa Hub', coords: [-17.6500, 31.7833], type: 'active', address: 'Town Centre, Murehwa' },
      { name: 'Mudzi Plaza', coords: [-17.0167, 32.4167], type: 'active', address: 'Border Area, Mudzi' },
      { name: 'UMP Hub', coords: [-17.8833, 31.0500], type: 'active', address: 'University Area, Chitungwiza' },
      { name: 'Harare Airport', coords: [-17.9319, 31.0928], type: 'active', address: 'Airport Terminal, Harare' },
      { name: 'Bulawayo Airport', coords: [-20.0174, 28.6177], type: 'active', address: 'Airport Terminal, Bulawayo' },
      { name: 'Victoria Falls', coords: [-17.9243, 25.8572], type: 'coming-soon', address: 'Tourist Centre, Victoria Falls' },
      { name: 'Hwange Centre', coords: [-18.3667, 26.5000], type: 'coming-soon', address: 'Town Centre, Hwange' },
      { name: 'Lupane Hub', coords: [-18.9333, 27.8000], type: 'coming-soon', address: 'Town Centre, Lupane' },
      { name: 'Tsholotsho Plaza', coords: [-19.7667, 27.7000], type: 'coming-soon', address: 'Town Centre, Tsholotsho' }
    ]
    
    // Add markers for each location
    locations.forEach(location => {
      const iconColor = location.type === 'active' ? '#185ff9' : '#2d3040'
      const iconSize = location.type === 'active' ? [25, 25] : [20, 20]
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: ${iconSize[0]}px; height: ${iconSize[1]}px; background-color: ${iconColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: iconSize,
        iconAnchor: [iconSize[0]/2, iconSize[1]/2]
      })
      
      const marker = L.marker(location.coords, { icon: customIcon }).addTo(map)
      
      // Add popup with location info
      marker.bindPopup(`
        <div class="text-center">
          <h3 class="font-bold text-lg mb-2">${location.name}</h3>
          <p class="text-gray-600 mb-2">${location.address}</p>
          <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            location.type === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }">
            ${location.type === 'active' ? '🟢 Active' : '🟡 Coming Soon'}
          </div>
        </div>
      `)
    })
    
    // Add Zimbabwe border
    const zimbabweBorder = [
      [-22.2167, 30.0000], // Beitbridge
      [-22.2167, 32.0000], // Eastern border
      [-18.0000, 33.0000], // Northeast
      [-16.5000, 32.0000], // North
      [-16.5000, 28.0000], // Northwest
      [-18.0000, 27.0000], // West
      [-20.0000, 26.0000], // Southwest
      [-22.2167, 30.0000]  // Back to start
    ]
    
    L.polygon(zimbabweBorder, {
      color: '#185ff9',
      weight: 2,
      fillColor: '#185ff9',
      fillOpacity: 0.1
    }).addTo(map)
  } catch (error) {
    console.error('Error in map initialization:', error)
  }
}
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#landing {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  --blue-50: #eff6ff;
  --blue-50-rgb: 239, 246, 255;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Apply Poppins to all elements */
#landing * {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Ensure Poppins is applied to specific elements */
h1, h2, h3, h4, h5, h6, p, span, div, button, a, input, textarea, select {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/***** Header styles *****/
header {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/***** Utilities bound to palette *****/
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-secondary\/80 { color: color-mix(in srgb, var(--secondary) 80%, white); }
.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }
.border-primary { border-color: var(--primary); }
.border-secondary { border-color: var(--secondary); }
.border-secondary\/10 { border-color: color-mix(in srgb, var(--secondary) 10%, transparent); }
.border-secondary\/20 { border-color: color-mix(in srgb, var(--secondary) 20%, transparent); }
.bg-primary-900 { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.bg-secondary\/5 { background-color: color-mix(in srgb, var(--secondary) 5%, transparent); }
.bg-white\/95 { background-color: color-mix(in srgb, white 95%, transparent); }

/* Hover effects */
.hover\:text-primary:hover { color: var(--primary); }
.hover\:bg-primary-900:hover { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.hover\:bg-secondary\/5:hover { background-color: color-mix(in srgb, var(--secondary) 5%, transparent); }

/* Gradients */
.from-primary { --tw-gradient-from: var(--primary); --tw-gradient-to: rgb(255 255 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.to-secondary { --tw-gradient-to: var(--secondary); }

/* Transitions */
.transition-colors { transition: color 0.15s ease-in-out; }

/* Tech Background Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(180deg); }
}

@keyframes fade-alternate {
  0%, 45% { opacity: 0; }
  50%, 95% { opacity: 1; }
  100% { opacity: 0; }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 4s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-fade-alternate {
  animation: fade-alternate 10s ease-in-out infinite;
}

/* Enhanced gradients with opacity */
.via-primary\/5 { --tw-gradient-to: rgb(255 255 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), color-mix(in srgb, var(--primary) 5%, transparent), var(--tw-gradient-to); }
.to-secondary\/10 { --tw-gradient-to: color-mix(in srgb, var(--secondary) 10%, transparent); }

/* Additional opacity utilities */
.bg-primary\/5 { background-color: color-mix(in srgb, var(--primary) 5%, transparent); }
.bg-primary\/10 { background-color: color-mix(in srgb, var(--primary) 10%, transparent); }
.bg-primary\/15 { background-color: color-mix(in srgb, var(--primary) 15%, transparent); }
.bg-primary\/20 { background-color: color-mix(in srgb, var(--primary) 20%, transparent); }
.bg-primary\/25 { background-color: color-mix(in srgb, var(--primary) 25%, transparent); }
.bg-secondary\/10 { background-color: color-mix(in srgb, var(--secondary) 10%, transparent); }
.bg-secondary\/15 { background-color: color-mix(in srgb, var(--secondary) 15%, transparent); }
.bg-secondary\/20 { background-color: color-mix(in srgb, var(--secondary) 20%, transparent); }
.border-primary\/20 { border-color: color-mix(in srgb, var(--primary) 20%, transparent); }
.border-primary\/30 { border-color: color-mix(in srgb, var(--primary) 30%, transparent); }
.border-primary\/40 { border-color: color-mix(in srgb, var(--primary) 40%, transparent); }
.border-primary\/50 { border-color: color-mix(in srgb, var(--primary) 50%, transparent); }
.text-secondary\/70 { color: color-mix(in srgb, var(--secondary) 70%, transparent); }

/* Background utilities for hero */
.bg-white\/50 { background-color: color-mix(in srgb, white 50%, transparent); }
.bg-white\/70 { background-color: color-mix(in srgb, white 70%, transparent); }
.bg-white\/80 { background-color: color-mix(in srgb, white 80%, transparent); }
.bg-white\/90 { background-color: color-mix(in srgb, white 90%, transparent); }

/* Drop shadow utilities */
.drop-shadow-sm { filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)); }

/* Modern gradient and shadow utilities */
.shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
.hover\:shadow-2xl:hover { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
.hover\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04); }
.hover\:shadow-primary\/25:hover { box-shadow: 0 25px 50px -12px color-mix(in srgb, var(--primary) 25%, transparent); }

/* Transform utilities */
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.hover\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }
.hover\:scale-110:hover { --tw-scale-x: 1.1; --tw-scale-y: 1.1; }
.scale-105 { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }

/* Modern spacing and layout */
.leading-\[0\.9\] { line-height: 0.9; }

/* Glass morphism effects */
.backdrop-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.backdrop-blur-sm { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }

/* Blur utilities */
.blur-xl { filter: blur(24px); }
.blur-2xl { filter: blur(40px); }

/* Additional color utilities */
.bg-green-500 { background-color: #10b981; }
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }
.bg-gray-50 { background-color: #f9fafb; }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }

/* Custom card shadow */
.custom-card-shadow {
  box-shadow: 0 5px 10px 0 rgba(41, 61, 102, 0.2);
}


</style>
