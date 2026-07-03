<script setup lang="ts">
const isMenuOpen = ref(false)

watch(isMenuOpen, (isOpen) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

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

      <button
        class="menuBtn"
        type="button"
        aria-label="Open menu"
        @click="isMenuOpen = true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
          />
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
          />
        </svg>
      </button>

      <NuxtLink
        class="navLink"
        to="/info"
      >Info</NuxtLink>
    </nav>

    <Transition name="fade">
      <div
        v-if="isMenuOpen"
        class="mobileMenuOverlay"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <button
          class="closeBtn"
          type="button"
          aria-label="Close menu"
          @click="isMenuOpen = false"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <nav class="mobileNav">
          <NuxtLink
            class="mobileNavLink"
            to="/shop"
            @click="isMenuOpen = false"
          >Jewelry</NuxtLink>
          <NuxtLink
            class="mobileNavLink"
            to="/info"
            @click="isMenuOpen = false"
          >Info</NuxtLink>
        </nav>
      </div>
    </Transition>
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

.menuBtn {
  display: none;
  background: none;
  border: 0;
  color: var(--color-ink);
  padding: 8px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.menuBtn svg {
  width: 24px;
  height: 24px;
}

/* Mobile Overlay Styles */
.mobileMenuOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-paper);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.closeBtn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: 0;
  color: var(--color-ink);
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.closeBtn svg {
  width: 24px;
  height: 24px;
}

.mobileNav {
  display: flex;
  flex-direction: column;
  gap: 36px;
  align-items: center;
}

.mobileNavLink {
  font-family: var(--font-label);
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  color: var(--color-ink);
  transition: opacity 0.2s ease;
}

.mobileNavLink:hover {
  opacity: 0.65;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .siteHeader {
    padding: 16px 16px 12px;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    height: 28px;
  }

  .navLink {
    display: none;
  }

  .menuBtn {
    display: flex;
  }
}
</style>
