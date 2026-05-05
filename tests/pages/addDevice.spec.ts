import { describe, it, expect, beforeEach, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AddDevice from "~/pages/addDevice.vue";
import { createPinia, setActivePinia } from "pinia";
import { DOMWrapper, type VueWrapper } from "@vue/test-utils";
import { useDeviceStore } from "@store/device";
import type { ToastServiceMethods } from "primevue/toastservice";

describe("Add device page", () => {
  let wrapper: VueWrapper<InstanceType<typeof AddDevice>>, pinia;
  let deviceStore: ReturnType<typeof useDeviceStore>;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);

    deviceStore = useDeviceStore();
    deviceStore.createType = vi.fn();
    deviceStore.toast = { add: vi.fn() } as unknown as ToastServiceMethods;

    wrapper = await mountSuspended(AddDevice, {
      global: {
        plugins: [pinia],
      },
    });

    vi.clearAllMocks();
  });

  it("create type", async () => {
    const btn = wrapper.find("#showCreateType");
    await btn?.trigger("click");
    await nextTick();

    const nativeInput = document.querySelector("#typeName");
    expect(nativeInput).toBeTruthy();

    const input = new DOMWrapper(nativeInput);
    const myType = "my type";
    await input.setValue(myType);
    await input.trigger("input");

    expect(wrapper.vm.newType).toBe(myType);

    const nativeBtn2 = document.querySelector("#createTypeBtn");
    expect(nativeBtn2).toBeTruthy();

    const btn2 = new DOMWrapper(nativeBtn2);
    await btn2.trigger("click");

    expect(deviceStore.createType).toHaveBeenCalledWith(myType);
  });

  it("output types", async () => {
    deviceStore.types = [
      {
        id: 1,
        name: "Fridge",
      },
      {
        id: 2,
        name: "Phone",
      },
      {
        id: 3,
        name: "Headphones",
      },
    ];

    await nextTick();

    expect(wrapper.text()).toContain("Fridge");
    expect(wrapper.text()).toContain("Phone");
    expect(wrapper.text()).toContain("Headphones");
  });
});
