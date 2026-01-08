<script setup lang="ts">
const services = [
  { name: 'JAMB Original Result', description: 'Print your official JAMB result slip.', price: '₦5,000', icon: 'heroicons:academic-cap' },
  { name: 'Admission Letter', description: 'Official admission letter for enrollment.', price: '₦4,000', icon: 'heroicons:document-text' },
  { name: 'Admission Status Check', description: 'Check JAMB CAPS admission status.', price: '₦2,000', icon: 'heroicons:check-circle' },
  { name: 'Result Notification', description: 'Instant result release alerts.', price: '₦1,500', icon: 'heroicons:bell-alert' },
  { name: 'O’Level Upload Status', description: 'Verify JAMB O’Level upload.', price: '₦2,500', icon: 'heroicons:cloud-upload' },
]
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">

    <!-- HERO -->
    <section class="bg-primary text-white py-28 text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">
        EDUOASIS
      </h1>
      <p class="text-xl max-w-3xl mx-auto opacity-90 mb-10">
        Secure and reliable platform for JAMB services in Nigeria.
      </p>

      <div class="flex justify-center gap-6">
        <NuxtLink to="/register" class="btn-primary px-10 py-4 text-lg">
          Create Account
        </NuxtLink>
        <NuxtLink to="/login" class="btn-secondary px-10 py-4 text-lg">
          Login
        </NuxtLink>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="py-20 px-6">
      <h2 class="text-4xl font-bold text-center text-primary mb-14">
        Our Services
      </h2>

      <div class="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div v-for="s in services" :key="s.name" class="card p-8 text-center">
          <Icon :name="s.icon" class="text-6xl text-primary mb-6" />
          <h3 class="text-xl font-semibold mb-3">{{ s.name }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ s.description }}</p>
          <p class="text-2xl font-bold text-primary mb-6">{{ s.price }}</p>
          <NuxtLink to="/register" class="btn-primary w-full py-3">
            Request
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="bg-gray-100 dark:bg-gray-800 py-20 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-primary mb-6">
          About JAMB Fortal
        </h2>
        <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          JAMB Fortal helps Nigerian students access official JAMB services
          quickly and securely without stress or middlemen.
        </p>
      </div>
    </section>
    <!-- DEVELOPER SECTION -->
    <section class="py-20 px-6 bg-gray-100 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        <!-- Developer Image -->
        <div class="flex-shrink-0 w-full lg:w-1/3">
          <img 
            src="https://www.shutterstock.com/image-photo/busy-focused-professional-african-young-600nw-2555990861.jpg" 
            alt="Anas Muhammad - Lead Developer & Founder" 
            class="rounded-2xl shadow-2xl w-full object-cover"
          />
        </div>
        
        <!-- Developer Info -->
        <div class="lg:w-2/3 space-y-6">
          <h2 class="text-4xl font-bold text-primary">Meet the Developer</h2>
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">Anas Muhammad</h3>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Lead Developer & Founder
          </p>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            A passionate Nigerian edtech developer with over 10 years of experience. Anas built 
            <span class="font-semibold text-primary">JAMB Fortal</span> from the ground up to solve real problems faced by students — 
            making education services digital, secure, and stress-free.
          </p>
          <p class="text-gray-500 dark:text-gray-400 italic mt-4">
            "Every student deserves easy access to their future." — Anas
          </p>
        </div>

      </div>
    </section>

        <!-- CONTACT -->
    <section class="py-20 px-6">
      <h2 class="text-4xl font-bold text-center text-primary mb-12">
        Contact Us
      </h2>

      <div class="max-w-4xl mx-auto card p-10">
        <a-form layout="vertical">
          <a-form-item label="Full Name">
            <a-input placeholder="Enter your full name" size="large" />
          </a-form-item>

          <a-form-item label="Email Address">
            <a-input type="email" placeholder="Enter your email address" size="large" />
          </a-form-item>

          <a-form-item label="Phone Number">
            <a-input type="tel" placeholder="Enter your phone number" size="large" />
          </a-form-item>

          <a-form-item label="Message">
            <a-textarea rows="5" placeholder="How can we help you?" size="large" />
          </a-form-item>

          <a-form-item>
            <a-button html-type="submit" class="w-full">
              Send Message
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </section>


    <!-- FOOTER -->
    <footer class="bg-primary text-white py-10 text-center">
      <p class="font-semibold text-lg">JAMB Fortal</p>
      <p class="opacity-80 mt-2">
        © 2026 JAMB Fortal. All rights reserved.
      </p>

      <div class="mt-6 flex justify-center gap-6">
        <NuxtLink to="/login">Login</NuxtLink>
        <NuxtLink to="/register">Register</NuxtLink>
        <NuxtLink to="/forgot-password">Forgot Password</NuxtLink>
      </div>
    </footer>

  </div>
</template>
