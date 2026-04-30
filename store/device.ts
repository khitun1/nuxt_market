import { defineStore, type StoreDefinition } from "pinia";
import { $api } from "~/http";
import type { DeviceState } from "~/types/states";
import type { Type } from "~/types/type";
import type { Brand } from "~/types/brand";
import type { Device, DeviceInfo } from "~/types/device";
import type { FetchError } from "ofetch";

type DeviceGetters = {
  getTypes: () => Type[];
  getBrands: () => Brand[];
  getDevices: () => Device[];
};

interface DeviceActions {
  createType(name: string): Promise<true | undefined>;
  getTypesApi(): Promise<void>;
  getBrandsApi(): Promise<void>;
  createBrand(name: string): Promise<true | undefined>;
  createDevice(form: FormData): Promise<true | undefined>;
  getDevicesApi(type?: number, brand?: number): Promise<true | undefined>;
  getDevicesByName(name: string): Promise<true | undefined>;
  getDeviceApi(deviceId: number): Promise<true | undefined>;
}

export const useDeviceStore: StoreDefinition<
  "deviceStore",
  DeviceState,
  DeviceGetters,
  DeviceActions
> = defineStore<"deviceStore", DeviceState, DeviceGetters, DeviceActions>(
  "deviceStore",
  {
    state: (): DeviceState => ({
      types: [],
      brands: [],
      devices: [],
      device: null,
      deviceInfo: [],
      isInitialized: false,
    }),

    getters: {
      getTypes(): Type[] {
        return this.types;
      },

      getBrands(): Brand[] {
        return this.brands;
      },

      getDevices(): Device[] {
        return this.devices;
      },
    },

    actions: {
      async createType(name: string): Promise<true | undefined> {
        try {
          await $api("type/create", {
            method: "POST",
            body: {
              name,
            },
          });
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

      async getTypesApi(): Promise<void> {
        try {
          this.types = await $api("type/getAll");
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

      async getBrandsApi(): Promise<void> {
        try {
          this.brands = await $api("brand/getAll");
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

      async createBrand(name: string): Promise<true | undefined> {
        try {
          await $api("brand/create", {
            method: "POST",
            body: {
              name,
            },
          });
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

      async createDevice(form: FormData): Promise<true | undefined> {
        try {
          await $api("device/create", {
            method: "POST",
            body: form,
          });
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

      async getDevicesApi(
        type?: number,
        brand?: number,
      ): Promise<true | undefined> {
        try {
          // this.devices = [
          //     {
          //         id: 1,
          //         name: 'iPhone XR',
          //         price: 900,
          //         rating: 4.5,
          //         img: 'https://cataas.com/cat',
          //         typeId: 1,
          //         brandId: 1,
          //     },
          // {
          //     id: 2,
          //     name: 'iPhone SE',
          //     price: 900,
          //     rating: 0,
          //     img: 'https://cataas.com/cat',
          //     typeId: 1,
          //     brandId: 1,
          // },
          // {
          //     id: 3,
          //     name: 'iPhone 14',
          //     price: 900,
          //     rating: 0,
          //     img: 'https://cataas.com/cat',
          //     typeId: 1,
          //     brandId: 1,
          // },
          // {
          //     id: 4,
          //     name: 'iPhone 15',
          //     price: 900,
          //     rating: 0,
          //     img: 'https://cataas.com/cat',
          //     typeId: 1,
          //     brandId: 1,
          // },
          // {
          //     id: 5,
          //     name: 'iPhone 16',
          //     price: 900,
          //     rating: 0,
          //     img: 'https://cataas.com/cat',
          //     typeId: 1,
          //     brandId: 1,
          // }
          // ]
          const headers = useRequestHeaders(["cookie"]) as Record<
            string,
            string
          >;
          this.devices = await $api("device/getAll", {
            headers,
            query: {
              type,
              brand,
            },
          });
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

      async getDevicesByName(name: string): Promise<true | undefined> {
        try {
          this.devices = await $api("device/getByName", {
            query: {
              name,
            },
          });
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

      async getDeviceApi(deviceId: number): Promise<true | undefined> {
        try {
          const res = await $api<{ device: Device; info: DeviceInfo[] }>(
            "device/getOne",
            {
              query: {
                deviceId,
              },
            },
          );
          this.device = res.device;
          this.deviceInfo = res.info;
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
    },
  },
);
