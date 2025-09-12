<template>
  <NuxtLayout name="home">
    <div id="landing" class="min-h-screen">

    <!-- Hero -->
    <section class="relative overflow-hidden py-20 md:py-32 mb-0" style="background-color: #185ff9;">
      <!-- Phone Images on Right -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Phone One - Shows with "Fast, Reliable WiFi Anywhere" -->
        <div class="absolute bottom-0 right-0 h-full flex items-end animate-phone-slide-1">
          <img src="/images/phoneone.png" alt="Phone" class="h-full w-auto opacity-90 object-contain" />
        </div>
        
        <!-- Phone Two - Shows with "Feeling Browsy? Come Browse & Surf With Us" -->
        <div class="absolute bottom-0 right-0 h-full flex items-end animate-phone-slide-2">
          <img src="/images/phonetwo.png" alt="Phone" class="h-full w-auto opacity-90 object-contain" />
        </div>
      </div>

      <!-- Hero Content -->
      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-4xl">
          <div class="text-left">
              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-8">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span class="text-sm font-medium text-white">
                  Live in {{ stats?.locations?.active || 0 }}+ locations across Zimbabwe
                </span>
              </div>

              <!-- Main heading with typewriter effect -->
              <div class="mb-4">
                <h1 class="text-5xl md:text-7xl font-bold text-white leading-[0.9]">
                  <div id="typewriter-heading" class="min-h-[1.2em]"></div>
                </h1>
              </div>

              <!-- Subtitle -->
              <p class="text-xl md:text-2xl text-white/90 font-medium leading-relaxed mb-10 max-w-2xl">
                Connect instantly with secure vouchers. Buy online or from our trusted agents across Zimbabwe.
              </p>

              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row items-start gap-4 mb-12">
                <NuxtLink to="/vouchers">
                  <Button class="group px-10 py-4 bg-primary text-white rounded-2xl hover:bg-primary-900 shadow-2xl hover:shadow-primary/30 font-semibold text-lg transition-all transform hover:scale-105">
                    <span>Start Browsing Now</span>
                    <i class="pi pi-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                  </Button>
                </NuxtLink>
                <NuxtLink to="/locations">
                  <Button class="px-10 py-4 bg-white/20 text-white border-2 border-white/30 rounded-2xl hover:bg-white/30 hover:border-white/50 shadow-xl font-semibold text-lg transition-all transform hover:scale-105" text>
                    <span>Find Locations</span>
                    <i class="pi pi-map-marker ml-3"></i>
                  </Button>
                </NuxtLink>
              </div>

              <!-- Trust Indicators -->
              <div class="flex flex-wrap items-center justify-start gap-4 text-sm">
                <div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <i class="pi pi-shield text-green-400"></i>
                  <span class="text-white/90">Secure & Encrypted</span>
                </div>
                <div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <i class="pi pi-clock text-blue-300"></i>
                  <span class="text-white/90">Instant Connection</span>
                </div>
                <div class="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <i class="pi pi-users text-purple-300"></i>
                  <span class="text-white/90">Multi-Device Support</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-black py-20">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p class="text-xl text-white/70 max-w-2xl mx-auto">Simple steps to get connected with UFO Networks</p>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <!-- Customer Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <!-- Blue half circles on card -->
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-60 group-hover:opacity-80 transition-all duration-300 transform translate-x-8 -translate-y-8"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full opacity-40 group-hover:opacity-60 transition-all duration-300 transform -translate-x-8 translate-y-8"></div>
              <!-- Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              
              <!-- Content -->
              <h3 class="text-2xl font-bold text-secondary mb-4">For Customers</h3>
              <ul class="space-y-3 text-secondary/80">
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Buy a voucher online or from an agent</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Get your PIN instantly</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Connect at any UFO hotspot</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Agent Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <!-- Emerald half circles on card -->
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full opacity-60 group-hover:opacity-80 transition-all duration-300 transform translate-x-8 -translate-y-8"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-40 group-hover:opacity-60 transition-all duration-300 transform -translate-x-8 translate-y-8"></div>
              <!-- Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                </svg>
              </div>
              
              <!-- Content -->
              <h3 class="text-2xl font-bold text-secondary mb-4">For Agents</h3>
              <ul class="space-y-3 text-secondary/80">
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Register and get verified</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Buy discounted voucher packs</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Resell to customers for cash</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Advertiser Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-200/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <!-- Purple half circles on card -->
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full opacity-60 group-hover:opacity-80 transition-all duration-300 transform translate-x-8 -translate-y-8"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full opacity-40 group-hover:opacity-60 transition-all duration-300 transform -translate-x-8 translate-y-8"></div>
              <!-- Icon -->
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                </svg>
              </div>
              
              <!-- Content -->
              <h3 class="text-2xl font-bold text-secondary mb-4">For Advertisers</h3>
              <ul class="space-y-3 text-secondary/80">
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Choose a package</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Post your ad creative</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Show on our Success Page</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="full-section-with-slider stats-slider relative overflow-hidden min-h-screen">
      <div class="full-size-container bg-cover stats-container relative min-h-screen">
        <!-- Background Images -->
        <div class="section-banner bg-cover absolute inset-0 hidden md:block" style="background-image: url('/images/top.jpg');"></div>
        <div class="mobile-section-banner bg-cover absolute inset-0 block md:hidden" style="background-image: url('/images/top.jpg');"></div>
        
        <!-- Dark overlay for better text contrast -->
        <div class="absolute inset-0 bg-black/50"></div>
        
        <!-- Stats Heading -->
        <div class="stats-heading-sec relative z-10 py-24">
          <div class="stats-heading-container text-center">
            <h2 class="text-5xl md:text-7xl font-bold">
              <span class="text-white">Our achievements</span><br>
              <span class="text-blue-400">in numbers</span>
            </h2>
          </div>
        </div>

        <!-- Bottom Shadow -->
        <div class="bottom-shadow absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

        <!-- Stats Data Container -->
        <div class="bottom-data-container relative z-10 pb-24">
          <div class="card-container">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
              
              <!-- Active Locations Stat -->
              <div class="each-card text-center group bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div class="w-32 h-32 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h5 class="block-heading text-3xl md:text-4xl font-bold text-white mb-4">{{ stats?.locations?.active || 0 }}+ Active Locations</h5>
                <div class="block-content-text text-white/80 text-lg">across Zimbabwe</div>
              </div>

              <!-- Happy Users Stat -->
              <div class="each-card text-center group bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div class="w-32 h-32 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h5 class="block-heading text-3xl md:text-4xl font-bold text-white mb-4">{{ formatNumber(stats?.users?.total || 0) }}+ Happy Users</h5>
                <div class="block-content-text text-white/80 text-lg">connected daily</div>
              </div>

              <!-- Network Uptime Stat -->
              <div class="each-card text-center group bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div class="w-32 h-32 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h5 class="block-heading text-3xl md:text-4xl font-bold text-white mb-4">{{ stats?.uptime || 99.9 }}% Network Uptime</h5>
                <div class="block-content-text text-white/80 text-lg">reliable connection</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Coverage Map Section -->
    <section class="relative min-h-screen overflow-hidden">
      <!-- Full-screen Map -->
      <div id="zimbabwe-map" class="absolute inset-0 w-full h-full"></div>
      
      <!-- Dark overlay for better text contrast -->
      <div class="absolute inset-0 bg-black/20"></div>
      
      <!-- Section Header Overlay -->
      <div class="absolute top-0 left-0 right-0 z-10 pt-16 pb-8">
        <div class="container mx-auto px-6">
          <div class="text-center">
            <h2 class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Coverage Map</h2>
            <p class="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">Connect anywhere across Zimbabwe with our extensive network</p>
          </div>
        </div>
      </div>
      
      <!-- Map Header Overlay -->
      <div class="absolute top-32 left-1/2 transform -translate-x-1/2 z-10">
        <div class="text-center">
          <div class="inline-flex items-center px-8 py-4 bg-white/95 backdrop-blur-sm rounded-full text-secondary font-semibold mb-4 shadow-2xl border border-white/50">
            <svg class="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            {{ mapLocations.filter(l => l.type === 'active').length }}+ Active Locations
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">From Harare to Bulawayo</h3>
          <p class="text-white/80 drop-shadow-md">Connect anywhere across Zimbabwe</p>
        </div>
      </div>
      
      <!-- Map Legend Overlay -->
      <div class="absolute top-40 right-6 z-10">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50">
          <h4 class="text-lg font-semibold text-secondary mb-4">Network Status</h4>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm animate-pulse"></div>
              <span class="text-sm font-medium text-secondary">Active Hotspot</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-5 h-5 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full shadow-sm"></div>
              <span class="text-sm font-medium text-secondary">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Location Counter Overlay -->
      <div class="absolute bottom-32 left-6 z-10">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-white/50">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <div class="text-lg font-bold text-secondary">{{ mapLocations.filter(l => l.type === 'active').length }} Active</div>
              <div class="text-sm text-secondary/70">Locations</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons Overlay -->
      <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <Button class="group px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-2xl hover:shadow-3xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
            <span>Find Nearest Hotspot</span>
            <svg class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </Button>
          <Button class="px-10 py-5 bg-white/95 text-secondary border-2 border-white/50 rounded-2xl hover:bg-white hover:border-blue-500 shadow-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105" text>
            <span>View All Locations</span>
            <svg class="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
          </Button>
        </div>
      </div>
    </section>

    <!-- Voucher Packages -->
    <section class="relative py-20 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style="background-image: url('/images/heroone.jpg');"></div>
        <div class="absolute inset-0 bg-blue-900/10"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-secondary mb-4">Voucher Packages</h2>
          <p class="text-xl text-secondary/70 max-w-2xl mx-auto">Choose the perfect plan for your browsing needs</p>
        </div>

        <!-- Packages Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          
          <!-- Dynamic Package Cards -->
          <div 
            v-for="(pkg, index) in voucherPackages" 
            :key="pkg.id"
            class="group relative"
          >
            <!-- Background Glow -->
            <div 
              class="absolute inset-0 rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-300"
              :class="index === 1 ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20' : 'bg-gradient-to-br from-blue-500/10 to-blue-600/10'"
            ></div>
            
            <!-- Package Card -->
            <div 
              class="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              :class="index === 1 ? 'border-2 border-blue-500' : 'border border-blue-200/50'"
            >
              
              <!-- Popular Badge (for second package) -->
              <div v-if="index === 1" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              
              <!-- Package Header -->
              <div class="text-center mb-6" :class="index === 1 ? 'mt-4' : ''">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <!-- Dynamic Icon based on package type -->
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="pkg.packageType === 'hour'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                    <path v-else-if="pkg.packageType === 'day'" fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                    <path v-else fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold text-secondary mb-2">{{ pkg.name }}</h3>
                <div class="text-4xl font-bold text-blue-600 mb-2">${{ pkg.price.toFixed(2) }}</div>
                <p class="text-secondary/70 text-sm">{{ pkg.description }}</p>
              </div>
              
              <!-- Features -->
              <ul class="space-y-3 mb-8">
                <li 
                  v-for="feature in pkg.features" 
                  :key="feature"
                  class="flex items-center gap-3"
                >
                  <div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">{{ feature }}</span>
                </li>
              </ul>
              
              <!-- Availability Status -->
              <div v-if="!pkg.isAvailable" class="mb-4">
                <div class="bg-gray-100 text-gray-600 text-center py-2 px-4 rounded-lg text-sm">
                  Currently Unavailable
                </div>
              </div>
              
              <!-- CTA Button -->
              <NuxtLink v-if="pkg.isAvailable" to="/vouchers">
                <Button 
                  class="w-full rounded-2xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                >
                  Buy Now
                </Button>
              </NuxtLink>
              <Button 
                v-else
                class="w-full rounded-2xl shadow-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
                disabled
              >
                Unavailable
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agent & Advertising CTA -->
    <section class="relative py-20 overflow-hidden" style="background-color: #185ff9;">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>
      
      <div class="container mx-auto px-6 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Network</h2>
          <p class="text-xl text-white/80 max-w-2xl mx-auto">Partner with UFO Networks and grow your business</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          <!-- Agent Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
            <div class="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              
              <!-- Card Header -->
              <div class="text-center mb-6">
                <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
                <h3 class="text-3xl font-bold text-secondary mb-2">Become a UFO Agent</h3>
                <p class="text-secondary/70">Join our network of trusted partners</p>
              </div>
              
              <!-- Features -->
              <ul class="space-y-4 mb-8">
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Buy at discount, sell at retail</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Real-time stock management</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Simple dashboard & analytics</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Earn on every sale</span>
                </li>
              </ul>
              
              <!-- CTA Button -->
              <Button class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 shadow-xl hover:shadow-2xl font-semibold transition-all duration-300 transform hover:scale-105">
                Register as Agent
              </Button>
            </div>
          </div>

          <!-- Advertiser Card -->
          <div class="group relative">
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl blur-lg opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
            <div class="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              
              <!-- Card Header -->
              <div class="text-center mb-6">
                <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h3 class="text-3xl font-bold text-secondary mb-2">Advertise With UFO</h3>
                <p class="text-secondary/70">Reach thousands of daily users</p>
              </div>
              
              <!-- Features -->
              <ul class="space-y-4 mb-8">
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Success Page placement</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Thousands of daily views</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Flexible monthly packages</span>
                </li>
                <li class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span class="text-secondary/80">Targeted local audience</span>
                </li>
              </ul>
              
              <!-- CTA Button -->
              <Button class="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 shadow-xl hover:shadow-2xl font-semibold transition-all duration-300 transform hover:scale-105">
                View Ad Packages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <div class="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
            <span class="text-sm font-medium text-primary">Testimonials</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-secondary mb-6">
            What Our Users Say
          </h2>
          <p class="text-xl text-secondary/70 max-w-2xl mx-auto">
            Real stories from customers, agents, and advertisers who trust UFO Networks
          </p>
        </div>

        <!-- Testimonial Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <!-- Customer Testimonial -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <!-- Quote Icon -->
              <div class="absolute -top-4 left-8">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Rating Stars -->
              <div class="flex justify-center mb-6">
                <div class="flex space-x-1">
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Testimonial Text -->
              <p class="text-secondary/80 text-lg leading-relaxed mb-6 italic">
                "UFO Networks made it so easy to get WiFi anywhere in Harare. The vouchers are affordable and work perfectly!"
              </p>

              <!-- Author Info -->
              <div class="flex items-center justify-center">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <div class="font-semibold text-secondary">Sarah M.</div>
                  <div class="text-sm text-secondary/60">Customer</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agent Testimonial -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <!-- Quote Icon -->
              <div class="absolute -top-4 left-8">
                <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Rating Stars -->
              <div class="flex justify-center mb-6">
                <div class="flex space-x-1">
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Testimonial Text -->
              <p class="text-secondary/80 text-lg leading-relaxed mb-6 italic">
                "As an agent, I'm earning good money selling UFO vouchers. The system is simple and reliable."
              </p>

              <!-- Author Info -->
              <div class="flex items-center justify-center">
                <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-lg">JD</span>
                </div>
                <div>
                  <div class="font-semibold text-secondary">John D.</div>
                  <div class="text-sm text-secondary/60">Agent</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advertiser Testimonial -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <!-- Quote Icon -->
              <div class="absolute -top-4 left-8">
                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Rating Stars -->
              <div class="flex justify-center mb-6">
                <div class="flex space-x-1">
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Testimonial Text -->
              <p class="text-secondary/80 text-lg leading-relaxed mb-6 italic">
                "Advertising with UFO has increased our brand visibility significantly. Great ROI!"
              </p>

              <!-- Author Info -->
              <div class="flex items-center justify-center">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-lg">TC</span>
                </div>
                <div>
                  <div class="font-semibold text-secondary">TechCorp Ltd</div>
                  <div class="text-sm text-secondary/60">Advertiser</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import Typewriter from 'typewriter-effect/dist/core'

// Reactive data
const stats = ref<any>(null)
const mapLocations = ref<any[]>([])
const voucherPackages = ref<any[]>([])
const loading = ref(true)

// Fetch homepage statistics
const fetchStats = async () => {
  try {
    const response = await $fetch('/api/stats/homepage')
    if (response.success) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Error fetching homepage stats:', error)
  }
}

// Fetch map locations
const fetchMapLocations = async () => {
  try {
    const response = await $fetch('/api/locations/map')
    if (response.success) {
      mapLocations.value = response.data
    }
  } catch (error) {
    console.error('Error fetching map locations:', error)
  }
}

// Fetch voucher packages
const fetchVoucherPackages = async () => {
  try {
    const response = await $fetch('/api/voucher-types/packages')
    if (response.success) {
      voucherPackages.value = response.data
    }
  } catch (error) {
    console.error('Error fetching voucher packages:', error)
  } finally {
    loading.value = false
  }
}

// Format numbers for display
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchMapLocations(),
    fetchVoucherPackages()
  ])
  
  // Initialize typewriter effect
  setTimeout(() => {
    const typewriterElement = document.getElementById('typewriter-heading')
    if (typewriterElement) {
      const typewriter = new Typewriter(typewriterElement, {
        loop: true,
        delay: 75,
        cursor: '',
        cursorClassName: 'hidden'
      })
      
      typewriter
        .typeString('<span class="block">Fast, Reliable</span><span class="block bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent">WiFi Anywhere</span>')
        .pauseFor(2000)
        .deleteAll()
        .typeString('<span class="block">Feeling Browsy?</span><span class="block bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent">Come Browse and Surf With Us</span>')
        .pauseFor(2000)
        .start()
    }
  }, 500)
  
  // Wait for Leaflet to load
  setTimeout(() => {
    if (typeof L !== 'undefined') {
      initZimbabweMap()
    }
  }, 100)
})

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

const initZimbabweMap = () => {
  try {
    // Check if Leaflet is loaded
    if (typeof window === 'undefined' || typeof window.L === 'undefined') {
      console.warn('Leaflet not loaded yet')
      return
    }
    
    const L = window.L
    
    // Zimbabwe coordinates (center) - focused view
    const zimbabweCenter = [-19.0154, 29.1549]
    
    // Initialize map with Zimbabwe-focused bounds
    const map = L.map('zimbabwe-map', {
      center: zimbabweCenter,
      zoom: 7,
      minZoom: 6,
      maxZoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: false,
      dragging: true,
      touchZoom: true
    })
    
    // Add OpenStreetMap tiles with Zimbabwe-focused styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      className: 'zimbabwe-map-tiles'
    }).addTo(map)
    
    // Set Zimbabwe bounds to prevent panning outside
    const zimbabweBounds = L.latLngBounds(
      L.latLng(-22.5, 25.0), // Southwest corner
      L.latLng(-15.5, 33.5)  // Northeast corner
    )
    map.setMaxBounds(zimbabweBounds)
    
    // Use real locations from database
    const locations = mapLocations.value
    
    // Add markers for each location with enhanced styling
    locations.forEach(location => {
      const isActive = location.type === 'active'
      const iconColor = isActive ? '#3b82f6' : '#6b7280'
      const iconSize = isActive ? [30, 30] : [24, 24]
      const pulseColor = isActive ? '#3b82f6' : '#6b7280'
      
      const customIcon = L.divIcon({
        className: 'ufo-hotspot-marker',
        html: `
          <div class="hotspot-marker" style="
            width: ${iconSize[0]}px; 
            height: ${iconSize[1]}px; 
            background: linear-gradient(135deg, ${iconColor}, ${isActive ? '#1d4ed8' : '#4b5563'});
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 4px ${pulseColor}20;
            position: relative;
            animation: ${isActive ? 'pulse 2s infinite' : 'none'};
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: iconSize,
        iconAnchor: [iconSize[0]/2, iconSize[1]/2]
      })
      
      const marker = L.marker(location.coords, { icon: customIcon }).addTo(map)
      
      // Add enhanced popup with location info
      marker.bindPopup(`
        <div class="hotspot-popup" style="min-width: 220px; text-align: center;">
          <div style="
            background: linear-gradient(135deg, ${isActive ? '#3b82f6' : '#6b7280'}, ${isActive ? '#1d4ed8' : '#4b5563'});
            color: white;
            padding: 10px 14px;
            border-radius: 8px 8px 0 0;
            margin: -10px -10px 10px -10px;
            font-weight: bold;
            font-size: 15px;
          ">
            ${location.name}
          </div>
          <p style="color: #374151; margin: 8px 0; font-size: 13px; line-height: 1.4;">${location.address}</p>
          ${location.code ? `<p style="color: #6b7280; margin: 4px 0; font-size: 12px; font-family: monospace;">Code: ${location.code}</p>` : ''}
          ${isActive && location.availableVouchers > 0 ? `<p style="color: #059669; margin: 4px 0; font-size: 12px; font-weight: 600;">${location.availableVouchers} vouchers available</p>` : ''}
          <div style="
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
            ${isActive 
              ? 'background: #dcfce7; color: #166534;' 
              : 'background: #fef3c7; color: #92400e;'
            }
          ">
            ${isActive ? '🟢 Active Hotspot' : '🟡 Coming Soon'}
          </div>
        </div>
      `, {
        maxWidth: 280,
        className: 'ufo-popup'
      })
    })
    
  } catch (error) {
    console.error('Error in map initialization:', error)
  }
}
</script>

<style scoped>
/* Import WorkSans font */
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800;900&display=swap');

#landing {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  --blue-50: #eff6ff;
  --blue-50-rgb: 239, 246, 255;
  font-family: "WorkSans-Regular", "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Apply WorkSans to all elements */
#landing * {
  font-family: "WorkSans-Regular", "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Ensure WorkSans is applied to specific elements */
h1, h2, h3, h4, h5, h6, p, span, div, button, a, input, textarea, select {
  font-family: "WorkSans-Regular", "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
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

/* Hero Phone Animations */
@keyframes slide-in-right {
  0% { 
    transform: translateY(-50%) translateX(100%); 
    opacity: 0; 
  }
  100% { 
    transform: translateY(-50%) translateX(25%); 
    opacity: 0.9; 
  }
}

@keyframes slide-in-right-delayed {
  0% { 
    transform: translateY(-50%) translateX(100%); 
    opacity: 0; 
  }
  100% { 
    transform: translateY(-50%) translateX(25%); 
    opacity: 0.9; 
  }
}

/* Typewriter library styles */
.Typewriter__wrapper {
  display: inline-block;
}

.Typewriter__cursor {
  color: white;
  font-weight: bold;
}

/* Phone Image Animations */
@keyframes phone-slide-1 {
  0%, 40% { opacity: 1; transform: translateY(0); }
  50%, 100% { opacity: 0; transform: translateY(20px); }
}

@keyframes phone-slide-2 {
  0%, 40% { opacity: 0; transform: translateY(-20px); }
  50%, 90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
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

.animate-slide-in-right {
  animation: slide-in-right 1.5s ease-out forwards;
  animation-delay: 0.5s;
}

.animate-slide-in-right-delayed {
  animation: slide-in-right-delayed 1.5s ease-out forwards;
  animation-delay: 1.2s;
}

.animate-text-slide {
  animation: text-slide 8s ease-in-out infinite;
}

.animate-slide-text-1 {
  animation: slide-text-1 8s ease-in-out infinite;
}

.animate-slide-text-2 {
  animation: slide-text-2 8s ease-in-out infinite;
}

.animate-phone-slide-1 {
  animation: phone-slide-1 8s ease-in-out infinite;
}

.animate-phone-slide-2 {
  animation: phone-slide-2 8s ease-in-out infinite;
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

/* Map-specific styles */
.zimbabwe-map-tiles {
  filter: grayscale(20%) contrast(1.1) brightness(1.05);
}

/* Hotspot marker animations */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 8px rgba(59, 130, 246, 0.1);
  }
  100% {
    box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 4px rgba(59, 130, 246, 0.2);
  }
}

/* Popup styling */
.ufo-popup .leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.ufo-popup .leaflet-popup-tip {
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

/* Map container enhancements */
#zimbabwe-map {
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

/* Drop shadow utilities for text overlays */
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.drop-shadow-md {
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
}


</style>
