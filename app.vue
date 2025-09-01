<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// No JavaScript needed for this approach
</script>

<style>
/* Import Poppins font globally */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Better approach: Use viewport units and font scaling instead of zoom */
html {
  font-size: 90%; /* Scale down fonts to 90% */
}

/* Scale down common elements */
body {
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Scale down headings proportionally */
h1 { font-size: 2.25rem; } /* Instead of 2.5rem */
h2 { font-size: 1.8rem; }  /* Instead of 2rem */
h3 { font-size: 1.35rem; } /* Instead of 1.5rem */
h4 { font-size: 1.125rem; } /* Instead of 1.25rem */
h5 { font-size: 0.9rem; }  /* Instead of 1rem */
h6 { font-size: 0.75rem; } /* Instead of 0.875rem */

/* Scale down spacing */
.p-1 { padding: 0.225rem; } /* Instead of 0.25rem */
.p-2 { padding: 0.45rem; }  /* Instead of 0.5rem */
.p-3 { padding: 0.675rem; } /* Instead of 0.75rem */
.p-4 { padding: 0.9rem; }   /* Instead of 1rem */
.p-5 { padding: 1.125rem; } /* Instead of 1.25rem */
.p-6 { padding: 1.35rem; }  /* Instead of 1.5rem */

.m-1 { margin: 0.225rem; }
.m-2 { margin: 0.45rem; }
.m-3 { margin: 0.675rem; }
.m-4 { margin: 0.9rem; }
.m-5 { margin: 1.125rem; }
.m-6 { margin: 1.35rem; }

/* Scale down gaps */
.gap-1 { gap: 0.225rem; }
.gap-2 { gap: 0.45rem; }
.gap-3 { gap: 0.675rem; }
.gap-4 { gap: 0.9rem; }
.gap-5 { gap: 1.125rem; }
.gap-6 { gap: 1.35rem; }
.gap-8 { gap: 1.8rem; }
.gap-10 { gap: 2.25rem; }
.gap-12 { gap: 2.7rem; }

/* Scale down padding and margins for common components */
.px-4 { padding-left: 0.9rem; padding-right: 0.9rem; }
.py-4 { padding-top: 0.9rem; padding-bottom: 0.9rem; }
.px-6 { padding-left: 1.35rem; padding-right: 1.35rem; }
.py-6 { padding-top: 1.35rem; padding-bottom: 1.35rem; }
.px-8 { padding-left: 1.8rem; padding-right: 1.8rem; }
.py-8 { padding-top: 1.8rem; padding-bottom: 1.8rem; }

/* Scale down button padding */
.btn, button, .p-button {
  padding: 0.675rem 1.35rem; /* Instead of 0.75rem 1.5rem */
  font-size: 0.9rem;
}

/* Scale down input fields */
input, textarea, select {
  padding: 0.45rem 0.675rem; /* Instead of 0.5rem 0.75rem */
  font-size: 0.9rem;
}

/* Scale down card padding */
.card, .p-card {
  padding: 1.35rem; /* Instead of 1.5rem */
}

/* Scale down container max-widths */
.container {
  max-width: 90vw; /* Instead of 100vw */
}

/* Scale down grid gaps */
.grid {
  gap: 1.8rem; /* Instead of 2rem */
}

/* Scale down section padding */
section {
  padding: 1.8rem 0; /* Instead of 2rem 0 */
}

/* Scale down margins between sections */
section + section {
  margin-top: 1.8rem; /* Instead of 2rem */
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#__nuxt {
  height: 100%;
}

input.p-inputtext.p-component.p-filled.p-password-input {
    width: 100% !important;
}

input.p-inputtext.p-component.p-password-input {
    width: 100%;
}

#app {
  min-height: 100vh;
}
</style> 