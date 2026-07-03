<template>
  <header class="siteHeader">
    <nav
      class="nav"
      aria-label="Main navigation"
    >
      <NuxtLink
        class="navLink"
        to="/shop"
      >Jewelry</NuxtLink>
      <NuxtLink
        class="brand"
        to="/"
      >
        <img
          class="logo"
          src="/images/last-weekend-procreate-small.png"
          alt="Last Weekend"
        >
      </NuxtLink>
      <NuxtLink
        class="navLink"
        to="/info"
      >Info</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.siteHeader {
  padding: 28px 24px 16px;
}

.nav {
  align-items: center;
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr auto 1fr;
  margin: 0 auto;
  max-width: var(--max-page);
}

.brand,
.navLink {
  font-family: var(--font-label);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 36px;
  width: auto;
  object-fit: contain;
}

.navLink:last-child {
  justify-self: end;
}

@media (max-width: 640px) {
  .siteHeader {
    padding: 16px 16px 12px;
  }

  .logo {
    height: 28px;
  }

  .brand,
  .navLink {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
}
</style>
