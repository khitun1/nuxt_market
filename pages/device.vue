<script setup lang="ts">
import { useDeviceStore } from "@store/device";

const deviceStore = useDeviceStore();
const route = useRoute();
await deviceStore.getDeviceApi(Number(route.query.id));

useSeoMeta({
  title: () => `${deviceStore.device?.name || 'Product'} | Nuxt Store`,
  ogTitle: () => `${deviceStore.device?.name || 'Product'} | Nuxt Store`,
  description: () => `Buy ${deviceStore.device?.name || 'product'} at a great price in Nuxt Store.`,
  ogDescription: () => `Buy ${deviceStore.device?.name || 'product'} at a great price in Nuxt Store.`,
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
