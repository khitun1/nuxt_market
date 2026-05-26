import { useUserStore } from "@store";

export default defineNuxtRouteMiddleware(async () => {
  const store = useUserStore();

  if (store.user === null || !store.user.isAdmin) {
    return navigateTo("/");
  }
});
