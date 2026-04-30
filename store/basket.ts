import { defineStore, type StoreDefinition } from "pinia";
import type { BasketState } from "~/types/states";
import { $api } from "~/http";
import type { FetchError } from "ofetch";

type BasketGetters = {
  getDevices: () => number[];
};

interface BasketActions {
  getBasketId(headers?: Record<string, string>): Promise<true | undefined>;
  addItem(id: number): Promise<true | undefined>;
  removeItem(deviceId: number): Promise<true | undefined>;
  delete(deviceId: number): Promise<true | undefined>;
  clear(): Promise<true | undefined>;
  createBasket(headers?: Record<string, string>): Promise<true | undefined>;
}

export const useBasketStore: StoreDefinition<
  "basketStore",
  BasketState,
  BasketGetters,
  BasketActions
> = defineStore<"basketStore", BasketState, BasketGetters, BasketActions>(
  "basketStore",
  {
    state: (): BasketState => ({
      devicesId: [],
      id: null,
      isInitialized: false,
    }),

    getters: {
      getDevices(): number[] {
        return this.devicesId;
      },
    },

    actions: {
      async getBasketId(
        headers?: Record<string, string>,
      ): Promise<true | undefined> {
        try {
          const res = await $api<{ devices: number[]; idBasket: number }>(
            "basket/get",
            {
              headers,
            },
          );
          this.id = res.idBasket;
          this.devicesId = res.devices;
          return true;
        } catch (e) {
          this.id = null;
          this.devicesId = [];
          const fetchError = e as FetchError;
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: fetchError.message,
            life: 3000,
          });
        } finally {
          this.isInitialized = true;
        }
      },

      async addItem(deviceId: number): Promise<true | undefined> {
        try {
          const res = await $api<{ devices: number[] }>("basket/add", {
            method: "POST",
            body: {
              deviceId,
            },
          });
          this.devicesId = res.devices;
          return true;
        } catch (e) {
          const fetchError = e as FetchError;
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: fetchError.message,
            life: 3000,
          });
        }
      },

      async removeItem(deviceId: number): Promise<true | undefined> {
        try {
          const res = await $api<{ devices: number[] }>("basket/remove", {
            method: "DELETE",
            query: {
              deviceId,
              basketId: this.id,
            },
          });

          this.devicesId = res.devices;
          return true;
        } catch (e) {
          const fetchError = e as FetchError;
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: fetchError.message,
            life: 3000,
          });
        }
      },

      async delete(deviceId: number): Promise<true | undefined> {
        try {
          const res = await $api<{ devices: number[] }>("basket/delete", {
            method: "DELETE",
            query: {
              deviceId,
            },
          });
          this.devicesId = res.devices;
          return true;
        } catch (e) {
          const fetchError = e as FetchError;
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: fetchError.message,
            life: 3000,
          });
        }
      },

      async clear(): Promise<true | undefined> {
        try {
          await $api("basket/clear", {
            method: "DELETE",
            query: {
              basketId: this.id,
            },
          });
          this.devicesId = [];
          return true;
        } catch (e) {
          const fetchError = e as FetchError;
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: fetchError.message,
            life: 3000,
          });
        }
      },

      async createBasket(
        headers?: Record<string, string>,
      ): Promise<true | undefined> {
        try {
          const res = await $api<string | undefined | null>("basket/create", {
            headers,
          });
          const basketCookie = useCookie("basketId", {
            maxAge: 60 * 60 * 24 * 30,
          });
          basketCookie.value = res;
          return true;
        } catch (e) {
          const fetchError = e as FetchError;
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: fetchError.message,
            life: 3000,
          });
        } finally {
          this.isInitialized = true;
        }
      },
    },
  },
);
