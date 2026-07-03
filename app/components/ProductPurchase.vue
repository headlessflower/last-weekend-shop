<script setup lang="ts">
import type { Product } from '~~/shared/types/product'

const props = defineProps<{
  product: Product
}>()

const checkoutError = ref('')
const isCheckingOut = ref(false)

const isAvailable = computed(() => {
  return props.product.status === 'active' && props.product.stock > 0
})

const formatPrice = (priceCents: number) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(priceCents / 100)
}

const createCheckoutSession = async () => {
  checkoutError.value = ''
  isCheckingOut.value = true

  try {
    const response = await $fetch<{ checkoutUrl: string }>('/api/checkout/create', {
      method: 'POST',
      body: {
        productId: props.product.id,
      },
    })

    window.location.href = response.checkoutUrl
  }
  catch {
    checkoutError.value = 'This piece could not be checked out. It may have just sold.'
  }
  finally {
    isCheckingOut.value = false
  }
}
</script>

<template>
  <section
    class="purchase"
    aria-label="Purchase details"
  >
    <h1 class="title">
      {{ product.title }}
    </h1>
    <p class="description">
      {{ product.description }}
    </p>
    <p class="stock">
      <span v-if="isAvailable">One available</span>
      <span v-else>Sold</span>
    </p>
    <button
      class="button"
      type="button"
      :disabled="!isAvailable || isCheckingOut"
      @click="createCheckoutSession"
    >
      <span v-if="isCheckingOut">checking availability</span>
      <span v-else-if="isAvailable">buy · {{ formatPrice(product.priceCents) }}</span>
      <span v-else>sold</span>
    </button>
    <p
      v-if="checkoutError"
      class="error"
      role="alert"
    >
      {{ checkoutError }}
    </p>
  </section>
</template>

<style scoped>
.purchase {
  margin: 0 auto;
  max-width: 620px;
  text-align: center;
}

.title {
  font-family: var(--font-label);
  font-size: 0.92rem;
  line-height: 1.4;
  margin: 0 0 18px;
  text-transform: uppercase;
}

.description,
.stock,
.error {
  font-size: 0.95rem;
  line-height: 1.7;
}

.stock {
  color: var(--color-muted);
  margin: 30px 0;
}

.button {
  background: var(--color-ink);
  border: 0;
  color: var(--color-paper);
  font-family: var(--font-label);
  font-size: 0.78rem;
  font-weight: 800;
  min-height: 54px;
  padding: 0 28px;
  text-transform: lowercase;
  width: 100%;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.error {
  color: #9b1c1c;
}
</style>
