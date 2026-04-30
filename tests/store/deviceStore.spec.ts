import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDeviceStore } from "@store/device";
import { createPinia, setActivePinia } from "pinia";
import { $api } from "~/http";
import type { Device, DeviceInfo } from "~/types/device";
import type { ToastServiceMethods } from "primevue/toastservice";

vi.mock("~/http", () => ({
  $api: vi.fn(),
}));

describe("Device store", () => {
  let deviceStore: ReturnType<typeof useDeviceStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    deviceStore = useDeviceStore();
    deviceStore.toast = { add: vi.fn() } as unknown as ToastServiceMethods;
    vi.mocked($api).mockClear();
  });

  describe("Devices store - getDeviceApi", () => {
    it("success", async () => {
      const device: Device = {
        id: 42,
        name: "fridge",
        price: 999,
        rating: 5.0,
        img: "link",
        typeId: 2,
        brandId: 3,
      };

      const deviceInfo: DeviceInfo[] = [
        {
          id: 1,
          title: "123",
          description: "456",
        },
        {
          id: 2,
          title: "qqq",
          description: "www",
        },
      ];

      vi.mocked($api).mockResolvedValue({
        device,
        info: deviceInfo,
      });
      await deviceStore.getDeviceApi(42);

      expect(deviceStore.device).toEqual(device);
      expect(deviceStore.deviceInfo).toEqual(deviceInfo);
    });

    it("error", async () => {
      const message = "Request failed";

      vi.mocked($api).mockRejectedValue({
        message,
      });
      await deviceStore.getDeviceApi(42);

      expect(deviceStore.toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          detail: message,
        }),
      );
    });
  });
});
