<script setup lang="ts">
import { useDeviceStore } from "@store/device";

const deviceStore = useDeviceStore();
const route = useRoute();
await deviceStore.getDeviceApi(Number(route.query.id));

useSeoMeta({
  title: () => `${deviceStore.device?.name || 'Товар'} | Nuxt Store`,
  ogTitle: () => `${deviceStore.device?.name || 'Товар'} | Nuxt Store`,
  description: () => `Купить ${deviceStore.device?.name || 'товар'} по выгодной цене в Nuxt Store.`,
  ogDescription: () => `Купить ${deviceStore.device?.name || 'товар'} по выгодной цене в Nuxt Store.`,
})
</script>

<template>
  <div>
    <h1>{{ deviceStore.device?.name }}</h1>
    <ol v-for="info in deviceStore.deviceInfo" :key="info.id">
      <li>{{ info.title }}: {{ info.description }}</li>
    </ol>
  </div>
</template>

<style scoped></style>
