import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { $api } from "~/http";
import { useBasketStore } from "@store/basket";
import type { ToastServiceMethods } from "primevue/toastservice";

// testing components
// it("check click", async () => {
//   const component = await mountSuspended(Info);
//
//   const btn = component.find("button");
//   const p = component.find(".test");
//
//   expect(p.text()).toBe("");
//
//   await btn.trigger("click");
//   expect(p.text()).toBe("12");
//
//   await btn.trigger("click");
//   expect(p.text()).toBe("1212");
// });

//testing functions
// it("find data", async () => {
//   const component = await mountSuspended(Info);
//
//   expect(component.vm.sum(1, 2)).toBe(4);
// });

vi.mock("~/http", () => ({
  $api: vi.fn(),
}));

describe("Basket store", () => {
  let basketStore: ReturnType<typeof useBasketStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    basketStore = useBasketStore();
    basketStore.toast = { add: vi.fn() } as unknown as ToastServiceMethods;
    vi.mocked($api).mockClear();
  });

  describe("Basket store - getDeviceId", () => {
    it("success", async () => {
      vi.mocked($api).mockResolvedValue({
        devices: [1, 1, 2, 3, 5, 8],
        idBasket: 42,
      });

      await basketStore.getBasketId();

      expect(basketStore.id).toBe(42);
      expect(basketStore.devicesId).toEqual([1, 1, 2, 3, 5, 8]);
      expect(basketStore.isInitialized).toBeTruthy();
    });

    it("error", async () => {
      vi.mocked($api).mockRejectedValue(new Error("Technical error"));

      await basketStore.getBasketId();

      expect(basketStore.id).toBeNull();
      expect(basketStore.devicesId).toEqual([]);
      expect(basketStore.toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          detail: "Failed to load basket.",
        }),
      );
      expect(basketStore.isInitialized).toBeTruthy();
    });
  });

  describe("Basket store - addItem", () => {
    it("success", async () => {
      const devices = [1, 3, 5, 7, 11];

      vi.mocked($api).mockResolvedValue({ devices });

      await basketStore.addItem(11);

      expect(basketStore.devicesId).toEqual(devices);
      expect(basketStore.id).toBeNull();
    });

    it("error", async () => {
      vi.mocked($api).mockRejectedValue(new Error("Technical error"));

      await basketStore.addItem(11);

      expect(basketStore.devicesId).toEqual([]);
      expect(basketStore.id).toBeNull();
      expect(basketStore.toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          detail: "Failed to add item to basket.",
        }),
      );
    });
  });

  describe("Basket store - clear", () => {
    it("success", async () => {
      vi.mocked($api).mockResolvedValue({});

      await basketStore.clear();

      expect(basketStore.id).toBeNull();
      expect(basketStore.devicesId).toEqual([]);
    });

    it("error", async () => {
      vi.mocked($api).mockRejectedValue(new Error("Technical error"));

      await basketStore.clear();

      expect(basketStore.toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "error",
          detail: "Failed to clear basket.",
        }),
      );
    });
  });
});
