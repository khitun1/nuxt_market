<script setup lang="ts">
import { useUserStore } from "@store";

const store = useUserStore();

useSeoMeta({
  title: 'Вход / Регистрация | Nuxt Store',
  ogTitle: 'Вход / Регистрация | Nuxt Store',
  description: 'Войдите в свой аккаунт Nuxt Store, чтобы управлять заказами и корзиной.',
  ogDescription: 'Войдите в свой аккаунт Nuxt Store, чтобы управлять заказами и корзиной.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <LoginForm
    v-if="store.getAuthPage === 'login'"
    @change-form="() => store.changeAuthPage('signUp')"
  />
  <SignUpForm v-else @change-form="() => store.changeAuthPage('login')" />
</template>

<style scoped></style>
