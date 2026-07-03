<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

const { data: products, error } = await useFetch<Product[]>('/api/products', {
  default: () => [],
})
</script>

<template>
  <div class="page">
    <section class="hero">
      <h1 class="visually-hidden">
        Last Weekend
      </h1>
      <img
        class="heroLogo"
        src="/images/last-weekend-logo-full.png"
        alt="Last Weekend"
      >
      <p class="subtitle">
        One-of-a-kind jewelry pieces, hand-crafted in small batches.
      </p>
    </section>

    <section
      class="carouselSection"
      aria-label="Featured Collection"
    >
      <div
        v-if="error"
        class="message"
      >
        The collection could not be loaded.
      </div>
      <div
        v-else-if="products.length === 0"
        class="message"
      >
        No pieces available at the moment. Check back soon.
      </div>
      <ProductCarousel
        v-else
        :products="products"
      />
    </section>

    <section class="shopCTA">
      <NuxtLink
        class="shopBtn"
        to="/shop"
      >
        Explore full collection
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.page {
  margin: 0 auto;
  max-width: var(--max-page);
  padding: 60px 24px 120px;
}

.hero {
  text-align: center;
  margin-bottom: 80px;
}

.heroLogo {
  max-width: 480px;
  width: 100%;
  height: auto;
  margin: 0 auto 36px;
  display: block;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--color-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.carouselSection {
  margin-bottom: 80px;
}

.message {
  text-align: center;
  padding: 40px;
  color: var(--color-muted);
  font-size: 1.1rem;
}

.shopCTA {
  display: flex;
  justify-content: center;
}

.shopBtn {
  background: var(--color-ink);
  color: var(--color-paper);
  font-family: var(--font-label);
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 16px 36px;
  transition: all 0.3s ease;
}

.shopBtn:hover {
  opacity: 0.85;
}

@media (max-width: 640px) {
  .hero {
    margin-bottom: 48px;
  }

  .carouselSection {
    margin-bottom: 48px;
  }
}
</style>
