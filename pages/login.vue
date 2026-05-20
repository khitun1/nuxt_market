<script setup lang="ts">
import { useUserStore } from "@store";

const store = useUserStore();

useSeoMeta({
  title: "Login / Register | Nuxt Store",
  ogTitle: "Login / Register | Nuxt Store",
  description:
    "Log in to your Nuxt Store account to manage orders and your cart.",
  ogDescription:
    "Log in to your Nuxt Store account to manage orders and your cart.",
  robots: "noindex, nofollow",
});
</script>

<template>
  <LoginForm
    v-if="store.getAuthPage === 'login'"
    @change-form="() => store.changeAuthPage('signUp')"
  />
  <SignUpForm v-else @change-form="() => store.changeAuthPage('login')" />
</template>

<style scoped></style>
