import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import Cart from "~/pages/cart.vue";
import { createPinia, setActivePinia } from "pinia";
import { useDeviceStore } from "@store/device";
import { useBasketStore } from "@store/basket";
import { $api } from "~/http";
import type { VueWrapper } from "@vue/test-utils";

vi.mock("~/http", () => ({
  $api: vi.fn(),
}));

describe("Cart page", () => {
  let wrapper: VueWrapper<InstanceType<typeof Cart>>, pinia;
  let deviceStore: ReturnType<typeof useDeviceStore>;
  let basketStore: ReturnType<typeof useBasketStore>;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);

    deviceStore = useDeviceStore();
    deviceStore.getDevicesApi = vi.fn().mockResolvedValue([]);
    basketStore = useBasketStore();

    wrapper = await mountSuspended(Cart, {
      global: {
        plugins: [pinia],
      },
    });

    vi.clearAllMocks();
  });

  it("cart list", async () => {
    const mockDevices = [
      {
        id: 1,
        name: "iPhone",
        price: 999,
        rating: 4.2,
        img: "path1",
        typeId: 1,
        brandId: 2,
      },
      {
        id: 3,
        name: "macBook",
        price: 1500,
        rating: 4.5,
        img: "path2",
        typeId: 2,
        brandId: 2,
      },
    ];

    vi.mocked($api).mockResolvedValue({
      devices: [mockDevices[0]],
    });

    basketStore.devicesId = [1, 1, 2, 3, 4, 5, 3, 4, 3];

    deviceStore.devices = mockDevices;

    await nextTick();

    expect(wrapper.vm.devicesInCart).toEqual(mockDevices);
    expect(wrapper.text()).toContain(mockDevices[1].name);

    const item = wrapper
      .findAll("div")
      .find((i) => i.text().includes(mockDevices[1].name));
    const btn = item?.find(".cart__button-delete");
    await btn?.trigger("click");

    expect(wrapper.text()).not.toContain(mockDevices[1].name);
  });
});
