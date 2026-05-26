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
        &copy; {{ new Date().getFullYear() }} Nuxt Store. Electronics at the
        best prices.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import "primeicons/primeicons.css";

useSeoMeta({
  title: "Nuxt Store — Electronics at the best prices",
  ogTitle: "Nuxt Store — Electronics Store",
  description:
    "Wide selection of smartphones, laptops and accessories with delivery.",
  ogDescription: "Buy electronics at great prices in our store.",
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
