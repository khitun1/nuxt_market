import { defineNuxtPlugin } from "#app";
import type { Pinia, PiniaPluginContext } from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
  // Явно указываем тип для pinia
  const pinia = nuxtApp.$pinia as Pinia;

  if (pinia && typeof pinia.use === "function") {
    pinia.use(({ store }: PiniaPluginContext) => {
      // Проверяем наличие сервиса в глобальных свойствах
      const toastService = nuxtApp.vueApp.config.globalProperties.$toast;
      if (toastService) {
        store.toast = toastService;
      }
    });
  }
});
