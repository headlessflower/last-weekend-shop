<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

defineProps<{
  products: Product[]
}>()

const formatPrice = (priceCents: number) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(priceCents / 100)
}
</script>

<template>
  <section
    class="grid"
    aria-label="Available jewelry"
  >
    <article
      v-for="product in products"
      :key="product.id"
      class="card"
    >
      <NuxtLink
        class="imageLink"
        :to="`/product/${product.slug}`"
      >
        <img
          class="image"
          :src="product.mainImageUrl"
          :alt="product.mainImageAlt"
          loading="lazy"
        >
      </NuxtLink>
      <div class="details">
        <NuxtLink
          class="title"
          :to="`/product/${product.slug}`"
        >{{ product.title }}</NuxtLink>
        <p class="price">
          {{ formatPrice(product.priceCents) }}
        </p>
        <p
          v-if="product.status === 'sold' || product.stock < 1"
          class="sold"
        >
          Sold
        </p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 76px 56px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.card {
  min-width: 0;
}

.imageLink {
  align-items: center;
  aspect-ratio: 1 / 1.18;
  display: flex;
  justify-content: center;
  text-decoration: none;
}

.image {
  max-height: 100%;
  object-fit: contain;
  width: 100%;
}

.details {
  font-family: var(--font-label);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.5;
  margin-top: 18px;
  text-transform: uppercase;
}

.title {
  text-decoration: none;
}

.price,
.sold {
  color: var(--color-muted);
  margin: 4px 0 0;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid {
    gap: 48px;
    grid-template-columns: 1fr;
  }
}
</style>
