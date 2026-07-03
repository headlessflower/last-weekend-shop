<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

const route = useRoute()

const { data: product, error } = await useFetch<Product>(`/api/products/${route.params.slug}`)

const transformOrigin = ref('center center')

const handleMouseMove = (e: MouseEvent) => {
  const container = e.currentTarget as HTMLElement
  const rect = container.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  transformOrigin.value = `${x}% ${y}%`
}

const handleMouseLeave = () => {
  transformOrigin.value = 'center center'
}
</script>

<template>
  <div class="page">
    <p
      v-if="error || !product"
      class="message"
    >
      This piece could not be found.
    </p>
    <template v-else>
      <ProductPurchase
        class="purchase"
        :product="product"
      />
      <figure class="figure">
        <div
          class="imageWrapper"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
        >
          <img
            class="image"
            :src="product.mainImageUrl"
            :alt="product.mainImageAlt"
            :style="{ transformOrigin }"
          >
        </div>
      </figure>
      <div class="relatedContainer">
        <RelatedProducts :product-slug="product.slug" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: 48px;
  grid-template-columns: minmax(320px, 0.85fr) minmax(0, 1.15fr);
  margin: 0 auto;
  max-width: var(--max-page);
  min-height: calc(100vh - 90px);
  padding: 54px 24px 100px;
}

.purchase {
  align-self: center;
}

.figure {
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 72vh;
}

.imageWrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f2f0;
  cursor: zoom-in;
}

.image {
  max-height: 92vh;
  object-fit: contain;
  width: 100%;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.imageWrapper:hover .image {
  transform: scale(2);
}

.relatedContainer {
  grid-column: 1 / -1;
}

.message {
  grid-column: 1 / -1;
  text-align: center;
}

@media (max-width: 900px) {
  .page {
    grid-template-columns: 1fr;
  }

  .figure {
    min-height: auto;
    order: -1;
  }
}
</style>
