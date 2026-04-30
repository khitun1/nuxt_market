import { useUserStore } from "@store";
import { useBasketStore } from "@store/basket";

export default defineNuxtRouteMiddleware(async () => {
  const headers = useRequestHeaders(["cookie"]) as Record<string, string>;

  const store = useUserStore();
  const basketStore = useBasketStore();

  if (!store.isInitialized) {
    await store.auth(headers);
  }

  if (!basketStore.isInitialized) {
    await basketStore.createBasket(headers);
    await basketStore.getBasketId(headers);
  }
});
