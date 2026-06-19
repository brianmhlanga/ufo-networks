<template>
  <NuxtLayout name="home">
    <div id="privacy-page" class="min-h-screen bg-white">
      <section class="relative overflow-hidden py-20 bg-gradient-to-br from-[#185ff9] to-[#2d3040]">
        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-6">
              <span class="text-sm font-medium text-gray-800">Legal</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Privacy Policy
            </h1>
            <p class="text-lg text-white/90 max-w-2xl mx-auto">
              How UFO Networks collects, uses, and protects your personal information.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto">
            <nav class="mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h2 class="text-lg font-semibold text-secondary mb-4">Contents</h2>
              <ol class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <li v-for="(section, index) in privacyPolicySections" :key="section.id">
                  <a
                    :href="`#section-${section.id}`"
                    class="text-primary hover:text-primary-900 transition-colors"
                  >
                    {{ index + 1 }}. {{ section.title }}
                  </a>
                </li>
              </ol>
            </nav>

            <div class="space-y-12">
              <article
                v-for="(section, index) in privacyPolicySections"
                :id="`section-${section.id}`"
                :key="section.id"
                class="scroll-mt-32"
              >
                <h2 class="text-2xl font-bold text-secondary mb-6 pb-3 border-b border-gray-200">
                  {{ index + 1 }}. {{ section.title }}
                </h2>

                <div class="space-y-4">
                  <p
                    v-for="(paragraph, pIndex) in section.paragraphs"
                    :key="`${section.id}-p-${pIndex}`"
                    class="text-secondary/80 leading-relaxed"
                  >
                    <template v-if="section.contactEmail && pIndex === (section.paragraphs?.length ?? 0) - 1">
                      {{ paragraph }}
                      <a
                        :href="`mailto:${section.contactEmail}`"
                        class="text-primary hover:text-primary-900 font-medium transition-colors ml-1"
                      >
                        {{ section.contactEmail }}
                      </a>
                    </template>
                    <template v-else>
                      {{ paragraph }}
                    </template>
                  </p>

                  <template v-for="(list, listIndex) in section.lists" :key="`${section.id}-list-${listIndex}`">
                    <p v-if="list.intro" class="text-secondary/80 leading-relaxed">{{ list.intro }}</p>
                    <ul class="list-disc pl-6 space-y-2 text-secondary/80 leading-relaxed">
                      <li v-for="(item, itemIndex) in list.items" :key="`${section.id}-item-${listIndex}-${itemIndex}`">
                        {{ item }}
                      </li>
                    </ul>
                  </template>

                  <p
                    v-for="(paragraph, cIndex) in section.closingParagraphs"
                    :key="`${section.id}-c-${cIndex}`"
                    class="text-secondary/80 leading-relaxed"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { primaryColor, secondaryColor } from '~/configs/colors'
import { privacyPolicySections } from '~/configs/privacy-policy'

useHead({
  title: 'Privacy Policy – UFO Networks',
  meta: [
    {
      name: 'description',
      content: 'Privacy Policy for UFO Networks WiFi hotspots, website, and related services.',
    },
  ],
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#privacy-page {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: 'Poppins', sans-serif;
}
</style>
