<script setup lang="ts">
import { useUserStore } from "@store";

const store = useUserStore();
</script>

<template>
  <LoginForm
    v-if="store.getAuthPage === 'login'"
    @change-form="() => store.changeAuthPage('signUp')"
  />
  <SignUpForm v-else @change-form="() => store.changeAuthPage('login')" />
</template>

<style scoped></style>
