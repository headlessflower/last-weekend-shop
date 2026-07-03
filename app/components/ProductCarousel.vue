<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

defineProps<{
  products: Product[]
}>()

const trackRef = ref<HTMLElement | null>(null)

const formatPrice = (priceCents: number) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(priceCents / 100)
}

const scrollLeft = () => {
  if (trackRef.value) {
    const cardWidth = trackRef.value.firstElementChild?.clientWidth || 300
    const gap = 24
    trackRef.value.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (trackRef.value) {
    const cardWidth = trackRef.value.firstElementChild?.clientWidth || 300
    const gap = 24
    trackRef.value.scrollBy({ left: cardWidth + gap, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="carouselContainer">
    <div
      ref="trackRef"
      class="track"
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

    <div class="controls">
      <button
        class="controlBtn"
        type="button"
        aria-label="Previous slide"
        @click="scrollLeft"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        class="controlBtn"
        type="button"
        aria-label="Next slide"
        @click="scrollRight"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.carouselContainer {
  position: relative;
  width: 100%;
}

.track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  padding: 10px 0;
}

.track::-webkit-scrollbar {
  display: none; /* WebKit */
}

.card {
  flex: 0 0 320px;
  scroll-snap-align: start;
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
  transform: scale(1.04);
}

.details {
  font-family: var(--font-label);
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.5;
  margin-top: 18px;
  text-transform: uppercase;
  position: relative;
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
  font-size: 0.65rem;
  color: var(--color-muted);
  border: 1px solid var(--color-line);
  padding: 2px 8px;
  width: fit-content;
  letter-spacing: 0.05em;
}

.controls {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
}

.controlBtn {
  background: none;
  border: 1px solid rgba(22, 22, 22, 0.15);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-ink);
  transition: all 0.3s ease;
  padding: 0;
}

.controlBtn:hover {
  background: var(--color-ink);
  border-color: var(--color-ink);
  color: var(--color-paper);
}

.controlBtn svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .card {
    flex: 0 0 85vw;
  }
}
</style>
