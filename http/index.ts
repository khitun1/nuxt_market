export const $api = $fetch.create({
  onRequest({ options }) {
    const config = useRuntimeConfig();
    options.baseURL = config.public.backendUrl;
  },
  credentials: "include",
});
