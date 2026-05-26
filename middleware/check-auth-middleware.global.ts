import { useUserStore } from "@store";
import { useBasketStore } from "@store/basket";

export default defineNuxtRouteMiddleware(async () => {
  const headers = useRequestHeaders(["cookie"]) as Record<string, string>;

  const store = useUserStore();
  const basketStore = useBasketStore();

  const promises = [];

  if (!store.isInitialized) {
    promises.push(store.auth(headers));
  }

  if (!basketStore.isInitialized) {
    promises.push(basketStore.createBasket(headers));
    promises.push(basketStore.getBasketId(headers));
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }
});
