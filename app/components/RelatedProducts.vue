<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

const props = defineProps<{
  productSlug: string
}>()

const { data: relatedProducts } = await useFetch<Product[]>(`/api/products/${props.productSlug}/related`, {
  default: () => [],
})

const formatPrice = (priceCents: number) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(priceCents / 100)
}
</script>

<template>
  <section
    v-if="relatedProducts.length > 0"
    class="relatedSection"
    aria-label="Related pieces"
  >
    <h2 class="sectionTitle">
      Related Pieces
    </h2>
    <div class="grid">
      <article
        v-for="product in relatedProducts"
        :key="product.id"
        class="card"
      >
        <NuxtLink
          class="imageLink"
          :to="`/product/${product.slug}`"
        >
          <div class="imageWrapper">
            <img
              class="image"
              :src="product.mainImageUrl"
              :alt="product.mainImageAlt"
              loading="lazy"
            >
          </div>
        </NuxtLink>
        <div class="details">
          <NuxtLink
            class="title"
            :to="`/product/${product.slug}`"
          >{{ product.title }}</NuxtLink>
          <p class="price">
            {{ formatPrice(product.priceCents) }}
          </p>
          <span
            v-if="product.status === 'sold' || product.stock < 1"
            class="soldTag"
          >
            Sold
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.relatedSection {
  border-top: 1px solid rgba(22, 22, 22, 0.08);
  margin-top: 80px;
  padding-top: 60px;
}

.sectionTitle {
  font-family: var(--font-label);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 36px;
  color: var(--color-ink);
}

.grid {
  display: grid;
  gap: 40px 24px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.card {
  min-width: 0;
}

.imageLink {
  display: block;
  text-decoration: none;
  aspect-ratio: 1 / 1.18;
}

.imageWrapper {
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f2f0;
}

.image {
  max-height: 100%;
  object-fit: contain;
  width: 100%;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.imageLink:hover .image {
  transform: scale(1.05);
}

.details {
  font-family: var(--font-label);
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1.5;
  margin-top: 16px;
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
}

.title {
  text-decoration: none;
  color: var(--color-ink);
  transition: opacity 0.2s ease;
}

.title:hover {
  opacity: 0.7;
}

.price {
  color: var(--color-muted);
  margin: 4px 0 0;
}

.soldTag {
  margin-top: 8px;
  font-size: 0.62rem;
  color: var(--color-muted);
  border: 1px solid var(--color-line);
  padding: 1px 6px;
  width: fit-content;
  letter-spacing: 0.05em;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .relatedSection {
    margin-top: 60px;
    padding-top: 40px;
  }
}
</style>
