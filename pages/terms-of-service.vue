<template>
  <NuxtLayout name="home">
    <div id="terms-page" class="min-h-screen bg-white">
      <section class="relative overflow-hidden py-20 bg-gradient-to-br from-[#185ff9] to-[#2d3040]">
        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-6">
              <span class="text-sm font-medium text-gray-800">Legal</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Terms of Service
            </h1>
            <p class="text-lg text-white/90 max-w-2xl mx-auto">
              Please read these terms carefully before using UFO Networks services.
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
                <li v-for="section in termsOfServiceSections" :key="section.number">
                  <a
                    :href="`#section-${section.number}`"
                    class="text-primary hover:text-primary-900 transition-colors"
                  >
                    {{ section.number }}. {{ section.title }}
                  </a>
                </li>
              </ol>
            </nav>

            <div class="space-y-12">
              <article
                v-for="section in termsOfServiceSections"
                :id="`section-${section.number}`"
                :key="section.number"
                class="scroll-mt-32"
              >
                <h2 class="text-2xl font-bold text-secondary mb-6 pb-3 border-b border-gray-200">
                  {{ section.number }}. {{ section.title }}
                </h2>
                <TermsItems :items="section.items" />
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
import { termsOfServiceSections, type TermsItem } from '~/configs/terms-of-service'

const TermsItems = defineComponent({
  name: 'TermsItems',
  props: {
    items: {
      type: Array as PropType<TermsItem[]>,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    return () => h(
      'div',
      { class: props.depth === 0 ? 'space-y-4' : 'mt-3 space-y-3' },
      props.items.map((item) =>
        h('div', { key: item.number, class: 'terms-item' }, [
          h(
            'p',
            {
              class: [
                'text-secondary/80 leading-relaxed',
                item.emphasis ? 'font-semibold uppercase text-secondary' : '',
              ],
            },
            [
              h('span', { class: 'font-semibold text-secondary mr-2' }, `${item.number}`),
              item.text,
            ],
          ),
          item.subItems?.length
            ? h(TermsItems, { items: item.subItems, depth: props.depth + 1 })
            : null,
        ]),
      ),
    )
  },
})

useHead({
  title: 'Terms of Service – UFO Networks',
  meta: [
    {
      name: 'description',
      content: 'Terms and conditions of use for UFO Networks WiFi services, website, and related products.',
    },
  ],
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#terms-page {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: 'Poppins', sans-serif;
}

.terms-item {
  padding-left: 0;
}

.terms-item .terms-item {
  padding-left: 1.25rem;
  border-left: 2px solid #e5e7eb;
}
</style>
