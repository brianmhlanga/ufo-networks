<template>
  <NuxtLayout name="home">
    <div id="contact-page" class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="relative overflow-hidden py-20 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/contact.jpg');">
        <!-- Dark overlay for better text contrast -->
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Badge -->
            <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span class="text-sm font-medium text-gray-800">Get in Touch</span>
            </div>

            <!-- Main heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              <span class="block">Contact</span>
              <span class="block bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">UFO Networks</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              Have questions about our WiFi vouchers or need support? We're here to help you stay connected.
            </p>

            <!-- Contact Features -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Email Support</h3>
                <p class="text-white/80 text-sm">24/7 email assistance</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Phone Support</h3>
                <p class="text-white/80 text-sm">Direct phone assistance</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">WhatsApp</h3>
                <p class="text-white/80 text-sm">Quick chat support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Content -->
      <section class="py-16">
        <div class="container mx-auto px-6">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <!-- Contact Information -->
              <div class="space-y-8">
                <div>
                  <h2 class="text-3xl font-bold text-secondary mb-6">Get in Touch</h2>
                  <p class="text-secondary/80 text-lg leading-relaxed mb-8">
                    Whether you need help with voucher purchases, technical support, or want to become an agent, 
                    our team is ready to assist you.
                  </p>
                </div>

                <!-- Contact Cards -->
                <div class="space-y-6">
                  <!-- Email -->
                  <div class="flex items-start space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50">
                    <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-secondary mb-2">Email Support</h3>
                      <p class="text-secondary/70 mb-3">Get help via email</p>
                      <a href="mailto:support@ufonetworks.com" class="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        support@ufonetworks.com
                      </a>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl border border-green-200/50">
                    <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-secondary mb-2">Phone Support</h3>
                      <p class="text-secondary/70 mb-3">Call us directly</p>
                      <a href="tel:+263773456789" class="text-green-600 hover:text-green-700 font-medium transition-colors">
                        +263 77 345 6789
                      </a>
                    </div>
                  </div>

                  <!-- WhatsApp -->
                  <div class="flex items-start space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl border border-green-200/50">
                    <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-secondary mb-2">WhatsApp</h3>
                      <p class="text-secondary/70 mb-3">Quick chat support</p>
                      <a href="https://wa.me/263773456789" class="text-green-600 hover:text-green-700 font-medium transition-colors">
                        Chat with us
                      </a>
                    </div>
                  </div>

                  <!-- Business Hours -->
                  <div class="flex items-start space-x-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200/50">
                    <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-secondary mb-2">Business Hours</h3>
                      <p class="text-secondary/70 mb-1">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p class="text-secondary/70">Saturday: 9:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Form -->
              <div class="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                <h2 class="text-2xl font-bold text-secondary mb-6">Send us a Message</h2>
                
                <form @submit.prevent="submitForm" class="space-y-6">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-secondary mb-2">Full Name *</label>
                    <InputText
                      id="name"
                      v-model="form.name"
                      placeholder="Enter your full name"
                      class="w-full"
                      :class="{ 'p-invalid': submitted && !form.name }"
                    />
                    <small v-if="submitted && !form.name" class="p-error">Name is required.</small>
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-secondary mb-2">Email Address *</label>
                    <InputText
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="Enter your email"
                      class="w-full"
                      :class="{ 'p-invalid': submitted && !form.email }"
                    />
                    <small v-if="submitted && !form.email" class="p-error">Email is required.</small>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-secondary mb-2">Phone Number</label>
                    <InputText
                      id="phone"
                      v-model="form.phone"
                      placeholder="Enter your phone number"
                      class="w-full"
                    />
                  </div>

                  <!-- Subject -->
                  <div>
                    <label for="subject" class="block text-sm font-medium text-secondary mb-2">Subject *</label>
                    <Dropdown
                      id="subject"
                      v-model="form.subject"
                      :options="subjectOptions"
                      placeholder="Select a subject"
                      class="w-full"
                      :class="{ 'p-invalid': submitted && !form.subject }"
                    />
                    <small v-if="submitted && !form.subject" class="p-error">Subject is required.</small>
                  </div>

                  <!-- Message -->
                  <div>
                    <label for="message" class="block text-sm font-medium text-secondary mb-2">Message *</label>
                    <Textarea
                      id="message"
                      v-model="form.message"
                      placeholder="Tell us how we can help you..."
                      rows="5"
                      class="w-full"
                      :class="{ 'p-invalid': submitted && !form.message }"
                    />
                    <small v-if="submitted && !form.message" class="p-error">Message is required.</small>
                  </div>

                  <!-- Submit Button -->
                  <Button
                    type="submit"
                    label="Send Message"
                    class="w-full bg-primary hover:bg-primary-900 text-white rounded-xl font-semibold py-3 transition-all"
                    :loading="submitting"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-secondary mb-4">Frequently Asked Questions</h2>
              <p class="text-secondary/80 text-lg">Quick answers to common questions</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-secondary mb-3">How do I purchase vouchers?</h3>
                <p class="text-secondary/70">You can buy vouchers online through our website or contact any of our verified agents for in-person purchases.</p>
              </div>

              <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-secondary mb-3">What payment methods do you accept?</h3>
                <p class="text-secondary/70">We accept mobile money (EcoCash, OneMoney), bank transfers, and cash payments through our agents.</p>
              </div>

              <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-secondary mb-3">How do I become an agent?</h3>
                <p class="text-secondary/70">Contact us through any of our channels above, and we'll guide you through the agent application process.</p>
              </div>

              <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 class="text-lg font-semibold text-secondary mb-3">What if I have technical issues?</h3>
                <p class="text-secondary/70">Our technical support team is available during business hours to help resolve any connectivity issues.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { useToast } from 'primevue/usetoast'

// Set layout
definePageMeta({
  layout: 'home'
})

// Toast instance
const toast = useToast()

// Form data
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const submitted = ref(false)
const submitting = ref(false)

// Subject options
const subjectOptions = ref([
  { label: 'General Inquiry', value: 'general' },
  { label: 'Voucher Support', value: 'voucher' },
  { label: 'Technical Support', value: 'technical' },
  { label: 'Agent Application', value: 'agent' },
  { label: 'Business Partnership', value: 'partnership' },
  { label: 'Other', value: 'other' }
])

// Form submission
const submitForm = async () => {
  submitted.value = true

  // Validation
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    return
  }

  submitting.value = true

  try {
    // Here you would typically send the form data to your backend
    // For now, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    toast.add({
      severity: 'success',
      summary: 'Message Sent',
      detail: 'Thank you for contacting us! We\'ll get back to you soon.',
      life: 5000
    })

    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
    submitted.value = false

  } catch (error) {
    console.error('Error submitting form:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to send message. Please try again.',
      life: 5000
    })
  } finally {
    submitting.value = false
  }
}

// Meta tags
useHead({
  title: 'Contact UFO Networks – Get Support & Help',
  meta: [
    { name: 'description', content: 'Contact UFO Networks for WiFi voucher support, technical help, or to become an agent. We\'re here to help you stay connected.' },
    { name: 'keywords', content: 'contact, support, help, UFO Networks, WiFi vouchers, Zimbabwe' }
  ]
})
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#contact-page {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: 'Poppins', sans-serif;
}

/* Custom button styles */
.custom-primary-button {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.custom-primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Form styling */
.p-inputtext, .p-dropdown, .p-inputtextarea {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.p-inputtext:focus, .p-dropdown:focus, .p-inputtextarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.p-invalid {
  border-color: #ef4444 !important;
}

.p-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
