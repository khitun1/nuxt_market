import type { User } from "~/types/user";
import type { Type } from "~/types/type";
import type { Brand } from "~/types/brand";
import type { Device, DeviceInfo } from "~/types/device";

export interface UserState {
  authPage: string;
  login: boolean;
  darkMode: boolean;
  user: User | null;
  isInitialized: boolean;
}

export interface DeviceState {
  types: Type[];
  brands: Brand[];
  devices: Device[];
  device: Device | null;
  deviceInfo: DeviceInfo[];
  isInitialized: boolean;
}

export interface BasketState {
  devicesId: number[];
  id: number | null;
  isInitialized: boolean;
}
