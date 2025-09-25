<template>
  <NuxtLayout name="home">
    <div id="landing" class="min-h-screen">

    <!-- Hero Slider -->
    <section class="relative overflow-hidden min-h-screen">
      <ClientOnly>
        <swiper-container 
          ref="heroSwiperRef"
          class="hero-swiper h-screen"
          effect="fade"
          :autoplay-delay="5000"
          loop
          navigation
          pagination
          :speed="1000"
        >
          <!-- Slide 1 -->
          <swiper-slide class="relative">
            <!-- Background Image with Fade Effect -->
            <div class="absolute inset-0">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent z-10"></div>
              <img src="/images/slider1.jpg" alt="UFO Networks" class="w-full h-full object-cover object-right" />
        </div>
        
            <!-- Content -->
            <div class="relative z-20 h-full flex items-center">
              <div class="container mx-auto px-6">
                <div class="max-w-2xl">
                  <!-- Badge -->
                  <div class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-8">
                    <div class="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span class="text-sm font-medium text-white">
                      Live in {{ (stats && stats.locations && stats.locations.active) || 0 }}+ locations across Zimbabwe
                    </span>
        </div>

                  <!-- Main heading -->
                  <h1 class="text-5xl md:text-7xl font-bold text-white leading-[0.9] mb-6">
                    <span class="block">Fast, Reliable</span>
                    <span class="block bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent">WiFi Anywhere</span>
                  </h1>

                  <!-- Subtitle -->
                  <p class="text-xl md:text-2xl text-white/90 font-medium leading-relaxed mb-10 max-w-xl">
                    Connect instantly with secure vouchers. Buy online or from our trusted agents across Zimbabwe.
                  </p>

                  <!-- CTA Buttons -->
                  <div class="flex flex-col sm:flex-row items-start gap-6 mb-12">
                    <NuxtLink to="/vouchers">
                      <Button class="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-3xl shadow-2xl hover:shadow-blue-500/25 font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <!-- Animated background -->
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <!-- Shine effect -->
                        <div class="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full blur-xl group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></div>
                        <span class="relative z-10 flex items-center">
                          Start Browsing Now
                          <i class="pi pi-arrow-right ml-3 group-hover:translate-x-2 transition-transform duration-300"></i>
                        </span>
                      </Button>
                    </NuxtLink>
                    <NuxtLink to="/locations">
                      <Button class="group relative px-12 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-3xl hover:bg-white/20 hover:border-white/50 shadow-xl hover:shadow-white/10 font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <!-- Glass effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span class="relative z-10 flex items-center">
                          Find Locations
                          <i class="pi pi-map-marker ml-3 group-hover:scale-110 transition-transform duration-300"></i>
                        </span>
                      </Button>
                    </NuxtLink>
      </div>

                  <!-- Trust Indicators -->
                  <div class="flex flex-wrap items-center justify-start gap-4 text-sm">
                    <div class="group flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                      <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-shield text-white text-sm"></i>
                      </div>
                      <span class="text-white font-medium">Secure & Encrypted</span>
                    </div>
                    <div class="group flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                      <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-clock text-white text-sm"></i>
                      </div>
                      <span class="text-white font-medium">Instant Connection</span>
                    </div>
                    <div class="group flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                      <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-users text-white text-sm"></i>
                      </div>
                      <span class="text-white font-medium">Multi-Device Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>

          <!-- Slide 2 -->
          <swiper-slide class="relative">
            <!-- Background Image with Fade Effect -->
            <div class="absolute inset-0">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent z-10"></div>
              <img src="/images/slider2.jpg" alt="UFO Networks" class="w-full h-full object-cover object-right" />
            </div>
            
            <!-- Content -->
            <div class="relative z-20 h-full flex items-center">
              <div class="container mx-auto px-6">
                <div class="max-w-2xl">
              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-8">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span class="text-sm font-medium text-white">
                      Join thousands of satisfied users
                </span>
              </div>

                  <!-- Main heading -->
                  <h1 class="text-5xl md:text-7xl font-bold text-white leading-[0.9] mb-6">
                    <span class="block">Feeling Browsy?</span>
                    <span class="block bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent">Come Browse & Surf With Us</span>
                </h1>

              <!-- Subtitle -->
                  <p class="text-xl md:text-2xl text-white/90 font-medium leading-relaxed mb-10 max-w-xl">
                    Experience lightning-fast internet with our premium WiFi vouchers. Perfect for work, study, or entertainment.
              </p>

              <!-- CTA Buttons -->
                  <div class="flex flex-col sm:flex-row items-start gap-6 mb-12">
                <NuxtLink to="/vouchers">
                      <Button class="group relative px-12 py-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white rounded-3xl shadow-2xl hover:shadow-emerald-500/25 font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <!-- Animated background -->
                        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <!-- Shine effect -->
                        <div class="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full blur-xl group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></div>
                        <span class="relative z-10 flex items-center">
                          Get Connected
                          <i class="pi pi-arrow-right ml-3 group-hover:translate-x-2 transition-transform duration-300"></i>
                        </span>
                  </Button>
                </NuxtLink>
                <NuxtLink to="/locations">
                      <Button class="group relative px-12 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-3xl hover:bg-white/20 hover:border-white/50 shadow-xl hover:shadow-white/10 font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                        <!-- Glass effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span class="relative z-10 flex items-center">
                          View Packages
                          <i class="pi pi-shopping-cart ml-3 group-hover:scale-110 transition-transform duration-300"></i>
                        </span>
                  </Button>
                </NuxtLink>
              </div>

              <!-- Trust Indicators -->
              <div class="flex flex-wrap items-center justify-start gap-4 text-sm">
                    <div class="group flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
                      <div class="w-8 h-8 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-wifi text-white text-sm"></i>
                </div>
                      <span class="text-white font-medium">High-Speed Internet</span>
                </div>
                    <div class="group flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                      <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-mobile text-white text-sm"></i>
                </div>
                      <span class="text-white font-medium">Mobile Friendly</span>
              </div>
                    <div class="group flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-md rounded-full px-6 py-3 border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20">
                      <div class="w-8 h-8 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-star text-white text-sm"></i>
          </div>
                      <span class="text-white font-medium">Premium Quality</span>
        </div>
      </div>
          </div>
        </div>
      </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </section>

    <!-- How It Works -->
    <section class="bg-gray-50 py-24">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <i class="pi pi-cog text-blue-600"></i>
            Process
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It 
            <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Works</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Simple, elegant solutions for everyone in the 
            <span class="font-semibold text-gray-800">UFO Networks</span> ecosystem
          </p>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <!-- Customer Card -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Image Box -->
              <div class="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden">
                <img src="/images/people.jpg" alt="Customers using WiFi" class="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div class="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                </div>
                <!-- Floating pill -->
                <div class="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                  WiFi Access
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-8">
                <div class="flex items-center gap-3 mb-6">
                  <h3 class="text-2xl font-bold text-gray-900">For Customers</h3>
                  <div class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Stay Connected
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Purchase a voucher online or from an authorized agent</p>
                      <span class="text-blue-600 text-xs font-medium">Multiple Options</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-blue-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Receive your access PIN instantly via SMS or email</p>
                      <span class="text-blue-600 text-xs font-medium">Instant Delivery</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-blue-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Connect seamlessly at any UFO Networks hotspot</p>
                      <span class="text-blue-600 text-xs font-medium">Nationwide Coverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agent Card -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Image Box -->
              <div class="relative h-48 bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden">
                <img src="/images/top.jpg" alt="Business agents" class="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div class="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
                </svg>
                </div>
                <!-- Floating pill -->
                <div class="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Business
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-8">
                <div class="flex items-center gap-3 mb-6">
                  <h3 class="text-2xl font-bold text-gray-900">For Agents</h3>
                  <div class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Earn Money
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Complete registration and verification process</p>
                      <span class="text-blue-600 text-xs font-medium">Quick & Easy Setup</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-blue-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Purchase discounted voucher packages in bulk</p>
                      <span class="text-blue-600 text-xs font-medium">Bulk Discounts</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-blue-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Resell to customers and earn competitive margins</p>
                      <span class="text-blue-600 text-xs font-medium">High Profits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advertiser Card -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Image Box -->
              <div class="relative h-48 bg-gradient-to-br from-gray-800 to-black overflow-hidden">
                <img src="/images/suits.jpg" alt="Marketing and advertising" class="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div class="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" clip-rule="evenodd"></path>
                </svg>
                </div>
                <!-- Floating pill -->
                <div class="absolute top-4 right-4 bg-gray-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Marketing
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-8">
                <div class="flex items-center gap-3 mb-6">
                  <h3 class="text-2xl font-bold text-gray-900">For Advertisers</h3>
                  <div class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    Reach Customers
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-gray-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Select from our range of advertising packages</p>
                      <span class="text-gray-600 text-xs font-medium">Flexible Options</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-gray-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Submit your creative content for approval</p>
                      <span class="text-gray-600 text-xs font-medium">Easy Upload</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-gray-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <p class="text-gray-600 leading-relaxed font-medium">Reach customers on our success pages</p>
                      <span class="text-gray-600 text-xs font-medium">High Visibility</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="relative py-24 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/top.jpg');"></div>
        <!-- Dark overlay for better text contrast -->
      <div class="absolute inset-0 bg-black/60"></div>
      
      <div class="container mx-auto px-6 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <i class="pi pi-chart-line text-white"></i>
            Statistics
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Our 
            <span class="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Achievements</span>
            </h2>
          <p class="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Trusted by thousands across Zimbabwe with 
            <span class="font-semibold text-white">reliable connectivity</span>
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              <!-- Active Locations Stat -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Icon Header -->
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-center">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="bg-blue-500/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Coverage
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-8 text-center">
                <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {{ (stats && stats.locations && stats.locations.active) || 0 }}+
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Active Locations</h3>
                <p class="text-gray-600 leading-relaxed">across Zimbabwe</p>
              </div>
            </div>
              </div>

              <!-- Happy Users Stat -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Icon Header -->
              <div class="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-center">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="bg-blue-500/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Users
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-8 text-center">
                <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {{ formatNumber((stats && stats.users && stats.users.total) || 0) }}+
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Happy Users</h3>
                <p class="text-gray-600 leading-relaxed">connected daily</p>
              </div>
            </div>
              </div>

              <!-- Network Uptime Stat -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <!-- Icon Header -->
              <div class="bg-gradient-to-br from-gray-800 to-black p-8 text-center">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="bg-gray-600/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Reliability
                </div>
              </div>

              <!-- Content -->
              <div class="p-8 text-center">
                <div class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {{ (stats && stats.uptime) || 99.9 }}%
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Network Uptime</h3>
                <p class="text-gray-600 leading-relaxed">reliable connection</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Coverage Map Section -->
    <section class="bg-gray-50 py-24">
        <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <i class="pi pi-map text-blue-600"></i>
            Coverage
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Network 
            <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Coverage</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect anywhere across Zimbabwe with our 
            <span class="font-semibold text-gray-800">extensive network</span>
          </p>
        </div>
      
        <!-- Map Container -->
        <div class="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
          <!-- Map -->
          <div id="zimbabwe-map" class="h-96 md:h-[500px] w-full"></div>
          
          <!-- Map Overlay Info -->
          <div class="absolute top-6 left-6 z-10">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-lg font-bold text-gray-900">{{ mapLocations.filter(l => l.type === 'active').length }}+</div>
                  <div class="text-sm text-gray-600">Active Locations</div>
                </div>
              </div>
            </div>
          </div>
      
          <!-- Map Legend -->
          <div class="absolute top-6 right-6 z-10">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
              <h4 class="text-sm font-semibold text-gray-900 mb-3">Network Status</h4>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full animate-pulse"></div>
                  <span class="text-xs font-medium text-gray-700">Active Hotspot</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                  <span class="text-xs font-medium text-gray-700">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/locations">
            <Button class="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              <span class="flex items-center">
                Find Nearest Hotspot
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </span>
            </Button>
          </NuxtLink>
          <NuxtLink to="/locations">
            <Button class="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-blue-500 shadow-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105" text>
              <span class="flex items-center">
                View All Locations
                <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                </svg>
              </span>
            </Button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Voucher Packages -->
    <section class="bg-white py-24">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <i class="pi pi-shopping-cart text-blue-600"></i>
            Packages
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Voucher 
            <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Packages</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your 
            <span class="font-semibold text-gray-800">browsing needs</span>
          </p>
        </div>

        <!-- Packages Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          
          <!-- Dynamic Package Cards -->
          <div 
            v-for="(pkg, index) in voucherPackages" 
            :key="pkg.id"
            class="group"
          >
            <!-- Package Card -->
            <div 
              class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              :class="index === 1 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''"
            >
              
              <!-- Popular Badge (for second package) -->
              <div v-if="index === 1" class="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 text-sm font-semibold">
                Most Popular
              </div>
              
              <!-- Package Header -->
              <div class="p-8 text-center">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <!-- Dynamic Icon based on package type -->
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="pkg.packageType === 'hour'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                    <path v-else-if="pkg.packageType === 'day'" fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                    <path v-else fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ pkg.name }}</h3>
                <div class="text-3xl font-bold text-blue-600 mb-2">${{ pkg.price.toFixed(2) }}</div>
                <p class="text-gray-600 text-sm leading-relaxed">{{ pkg.description }}</p>
              </div>
              
              <!-- Features -->
              <div class="px-8 pb-6">
                <ul class="space-y-3">
                  <li 
                    v-for="feature in pkg.features" 
                    :key="feature"
                    class="flex items-start gap-3"
                  >
                    <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">{{ feature }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- CTA Button -->
              <div class="p-8 pt-0">
                <NuxtLink v-if="pkg.isAvailable" to="/vouchers">
                  <Button 
                    class="w-full rounded-xl shadow-sm hover:shadow-md font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  >
                    Buy Now
                  </Button>
                </NuxtLink>
                <Button 
                  v-else
                  class="w-full rounded-xl shadow-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                >
                  Unavailable
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Join Our Network -->
    <section class="bg-gray-50 py-24">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <i class="pi pi-users text-blue-600"></i>
            Partnership
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our 
            <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Network</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Partner with UFO Networks and 
            <span class="font-semibold text-gray-800">grow your business</span>
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          <!-- Agent Card -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              
              <!-- Card Header -->
              <div class="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-center">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
                <div class="bg-blue-500/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold inline-block mb-4">
                  Agent Program
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Become a UFO Agent</h3>
                <p class="text-white/80 text-sm">Join our network of trusted partners</p>
              </div>
              
              <!-- Content -->
              <div class="p-8">
              <!-- Features -->
              <ul class="space-y-4 mb-8">
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Buy at discount, sell at retail</span>
                </li>
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Real-time stock management</span>
                </li>
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Simple dashboard & analytics</span>
                </li>
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Earn on every sale</span>
                </li>
              </ul>
              
              <!-- CTA Button -->
                <Button class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-sm hover:shadow-md font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-800">
                Register as Agent
              </Button>
              </div>
            </div>
          </div>

          <!-- Advertiser Card -->
          <div class="group">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              
              <!-- Card Header -->
              <div class="bg-gradient-to-br from-gray-800 to-black p-8 text-center">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="bg-gray-600/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold inline-block mb-4">
                  Advertising
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Advertise With UFO</h3>
                <p class="text-white/80 text-sm">Reach thousands of daily users</p>
              </div>
              
              <!-- Content -->
              <div class="p-8">
              <!-- Features -->
              <ul class="space-y-4 mb-8">
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Success Page placement</span>
                </li>
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Thousands of daily views</span>
                </li>
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Flexible monthly packages</span>
                </li>
                  <li class="flex items-start gap-3">
                    <div class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <span class="text-gray-600 text-sm leading-relaxed">Targeted local audience</span>
                </li>
              </ul>
              
              <!-- CTA Button -->
                <Button class="w-full bg-gradient-to-r from-gray-800 to-black text-white rounded-xl shadow-sm hover:shadow-md font-semibold transition-all duration-300 hover:from-gray-900 hover:to-gray-800">
                View Ad Packages
              </Button>
              </div>
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
          <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <i class="pi pi-quote-left text-blue-600"></i>
            Testimonials
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our 
            <span class="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Users Say</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Real stories from customers, agents, and advertisers who 
            <span class="font-semibold text-gray-800">trust UFO Networks</span>
          </p>
        </div>

        <!-- Testimonial Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <!-- Customer Testimonial -->
          <div class="group relative h-full">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <!-- Quote Icon -->
              <div class="absolute -top-4 left-8">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
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
              <p class="text-gray-600 text-lg leading-relaxed mb-6 italic flex-grow">
                "UFO Networks made it so easy to get WiFi anywhere in Harare. The vouchers are affordable and work perfectly!"
              </p>

              <!-- Author Info -->
              <div class="flex items-center justify-center mt-auto">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">Sarah M.</div>
                  <div class="text-sm text-gray-600">Customer</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agent Testimonial -->
          <div class="group relative h-full">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <!-- Quote Icon -->
              <div class="absolute -top-4 left-8">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
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
              <p class="text-gray-600 text-lg leading-relaxed mb-6 italic flex-grow">
                "As an agent, I'm earning good money selling UFO vouchers. The system is simple and reliable."
              </p>

              <!-- Author Info -->
              <div class="flex items-center justify-center mt-auto">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-lg">JD</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">John D.</div>
                  <div class="text-sm text-gray-600">Agent</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advertiser Testimonial -->
          <div class="group relative h-full">
            <div class="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
              <!-- Quote Icon -->
              <div class="absolute -top-4 left-8">
                <div class="w-8 h-8 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center">
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
              <p class="text-gray-600 text-lg leading-relaxed mb-6 italic flex-grow">
                "Advertising with UFO has increased our brand visibility significantly. Great ROI!"
              </p>

              <!-- Author Info -->
              <div class="flex items-center justify-center mt-auto">
                <div class="w-12 h-12 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center mr-4">
                  <span class="text-white font-bold text-lg">TC</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">TechCorp Ltd</div>
                  <div class="text-sm text-gray-600">Advertiser</div>
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

// Reactive data
const stats = ref<any>({ 
  locations: { active: 0 }, 
  users: { total: 0 }, 
  uptime: 99.9 
})
const mapLocations = ref<any[]>([])
const voucherPackages = ref<any[]>([])
const loading = ref(true)

// Swiper ref
const heroSwiperRef = ref<any>(null)

// Fetch homepage statistics
const fetchStats = async () => {
  try {
    const response = await $fetch('/api/stats/homepage')
    if (response && response.success) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Error fetching homepage stats:', error)
    // Keep default stats structure on error
    stats.value = { 
      locations: { active: 0 }, 
      users: { total: 0 }, 
      uptime: 99.9 
    }
  }
}

// Fetch map locations
const fetchMapLocations = async () => {
  try {
    const response = await $fetch('/api/locations/map')
    if (response && response.success) {
      mapLocations.value = response.data
    }
  } catch (error) {
    console.error('Error fetching map locations:', error)
    mapLocations.value = []
  }
}

// Fetch voucher packages
const fetchVoucherPackages = async () => {
  try {
    const response = await $fetch('/api/voucher-types/packages')
    if (response && response.success) {
      voucherPackages.value = response.data
    }
  } catch (error) {
    console.error('Error fetching voucher packages:', error)
    voucherPackages.value = []
  } finally {
    loading.value = false
  }
}

// Format numbers for display
const formatNumber = (num: number) => {
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
  
  // Wait for Leaflet to load
  setTimeout(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
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
    if (typeof window === 'undefined' || typeof (window as any).L === 'undefined') {
      console.warn('Leaflet not loaded yet')
      return
    }
    
    const L = (window as any).L
    
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

/* Hero Swiper Styles */
.hero-swiper {
  width: 100%;
  height: 100vh;
}

.hero-swiper swiper-slide {
  position: relative;
  overflow: hidden;
}

.hero-swiper swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
}

/* Navigation Buttons */
.hero-swiper .swiper-button-next,
.hero-swiper .swiper-button-prev {
  color: white !important;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 50px !important;
  height: 50px !important;
  margin-top: -25px !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.hero-swiper .swiper-button-next:hover,
.hero-swiper .swiper-button-prev:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.hero-swiper .swiper-button-next:after,
.hero-swiper .swiper-button-prev:after {
  font-size: 18px !important;
  font-weight: bold;
}

.hero-swiper .swiper-button-next {
  right: 30px !important;
}

.hero-swiper .swiper-button-prev {
  left: 30px !important;
}

/* Pagination */
.hero-swiper .swiper-pagination {
  bottom: 30px !important;
}

.hero-swiper .swiper-pagination .swiper-pagination-bullet {
  background: rgba(255, 255, 255, 0.5) !important;
  opacity: 1 !important;
  width: 12px !important;
  height: 12px !important;
  margin: 0 8px !important;
  transition: all 0.3s ease;
}

.hero-swiper .swiper-pagination .swiper-pagination-bullet-active {
  background: white !important;
  transform: scale(1.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-swiper .swiper-button-next,
  .hero-swiper .swiper-button-prev {
    width: 40px !important;
    height: 40px !important;
    margin-top: -20px !important;
  }
  
  .hero-swiper .swiper-button-next:after,
  .hero-swiper .swiper-button-prev:after {
    font-size: 14px !important;
  }
  
  .hero-swiper .swiper-button-next {
    right: 20px !important;
  }
  
  .hero-swiper .swiper-button-prev {
    left: 20px !important;
  }
  
  .hero-swiper .swiper-pagination {
    bottom: 20px !important;
  }
}

/* Fade effect enhancement */
.hero-swiper swiper-slide {
  z-index: 0;
}

.hero-swiper swiper-slide.swiper-slide-active {
  z-index: 1;
}

/* Enhanced CTA Button Styles */
.hero-swiper .group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.hero-swiper .group:hover .group-hover\:translate-x-2 {
  transform: translateX(0.5rem);
}

.hero-swiper .group:hover .group-hover\:scale-150 {
  transform: scale(1.5);
}

.hero-swiper .group:hover .group-hover\:opacity-0 {
  opacity: 0;
}

.hero-swiper .group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Trust Pill Hover Effects */
.hero-swiper .group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Button Shadow Effects */
.hover\:shadow-blue-500\/25:hover {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25);
}

.hover\:shadow-emerald-500\/25:hover {
  box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
}

.hover\:shadow-green-500\/20:hover {
  box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.2);
}

.hover\:shadow-blue-500\/20:hover {
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
}

.hover\:shadow-purple-500\/20:hover {
  box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.2);
}

.hover\:shadow-amber-500\/20:hover {
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.2);
}

.hover\:shadow-emerald-500\/20:hover {
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.2);
}

.hover\:shadow-white\/10:hover {
  box-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.1);
}

</style>