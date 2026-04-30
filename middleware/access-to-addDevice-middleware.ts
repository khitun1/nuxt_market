import { useUserStore } from "@store";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useUserStore();

  if (store.user === null && from.path !== "/") {
    return navigateTo("/");
  }
});
