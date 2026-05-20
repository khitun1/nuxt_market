<template>
  <header>
    <NavBar />
  </header>
  <main>
    <NuxtPage />
  </main>
  <footer class="footer">
    <div class="footer-content">
      <p>
        &copy; {{ new Date().getFullYear() }} Nuxt Store. Электроника по лучшим
        ценам.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import "primeicons/primeicons.css";

useSeoMeta({
  title: "Nuxt Store — Электроника по лучшим ценам",
  ogTitle: "Nuxt Store — Магазин электроники",
  description: "Широкий выбор смартфонов, ноутбуков и аксессуаров с доставкой.",
  ogDescription: "Покупайте электронику по выгодным ценам в нашем магазине.",
  ogImage: "https://vibekodik.ru/og-image.png",
  twitterCard: "summary_large_image",
});
</script>

<style>
.footer {
  margin-top: 40px;
  padding: 20px;
  background-color: #1e1e1e;
  color: #fff;
  text-align: center;
  border-top: 1px solid #333;
}
</style>
