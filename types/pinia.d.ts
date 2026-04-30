import "pinia";
import type { ToastServiceMethods } from "primevue/toastservice";

declare module "pinia" {
  export interface PiniaCustomProperties {
    toast: ToastServiceMethods;
  }
}
