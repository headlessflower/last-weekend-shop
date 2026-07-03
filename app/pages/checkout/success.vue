<template>
  <section class="page">
    <h1>Thank you</h1>
    <p>Your order has been received. A confirmation email will be sent through Stripe.</p>
    <NuxtLink to="/shop">Return to shop</NuxtLink>
  </section>
</template>

<style scoped>
.page {
  margin: 0 auto;
  max-width: 720px;
  padding: 120px 24px;
  text-align: center;
}

h1 {
  font-family: var(--font-label);
  text-transform: uppercase;
}

p {
  line-height: 1.7;
}
</style>
