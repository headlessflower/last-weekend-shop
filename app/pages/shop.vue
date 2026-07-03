<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

const { data: products, error } = await useFetch<Product[]>('/api/products', {
  default: () => [],
})
</script>

<template>
  <div class="page">
    <header class="intro">
      <h1>Jewelry</h1>
      <p>One-off pieces, released in small batches.</p>
    </header>
    <p
      v-if="error"
      class="message"
    >
      The shop could not be loaded.
    </p>
    <p
      v-else-if="products.length === 0"
      class="message"
    >
      No pieces are available right now.
    </p>
    <ProductGrid
      v-else
      :products="products"
    />
  </div>
</template>

<style scoped>
.page {
  margin: 0 auto;
  max-width: var(--max-page);
  padding: 70px 24px 120px;
}

.intro {
  display: grid;
  gap: 28px;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 520px);
  margin-bottom: 96px;
}

.intro h1 {
  font-family: var(--font-label);
  font-size: clamp(3rem, 8vw, 8.5rem);
  letter-spacing: 0.12em;
  line-height: 0.9;
  margin: 0;
  text-transform: uppercase;
}

.intro p,
.message {
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 800px) {
  .intro {
    grid-template-columns: 1fr;
    margin-bottom: 64px;
  }
}
</style>
