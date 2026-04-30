import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import deviceCard from "~/components/deviceCard.vue";
import { createPinia, setActivePinia } from "pinia";
import { useBasketStore } from "@store/basket";

describe("Device card component", () => {
  const defaultProps = {
    name: "iPhone X",
    img: "image.png",
    rating: 4.2,
    price: 1000,
    id: 8,
  };

  it("props", async () => {
    const wrapper = await mountSuspended(deviceCard, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain(defaultProps.name);
    expect(wrapper.find("img").attributes("src")).toBe(defaultProps.img);
  });

  it("emit", async () => {
    const wrapper = await mountSuspended(deviceCard, {
      props: defaultProps,
    });

    await wrapper.find(".device-card").trigger("click");
    await wrapper.find("Button").trigger("click");
    // await wrapper.findAll("button")
    //     .find(b => b.text() === "-")?.trigger("click");

    expect(wrapper.emitted("open")).toBeTruthy();
    expect(wrapper.emitted("addToCart")).toBeTruthy();
    // expect(wrapper.emitted("removeItem")).toBeTruthy();
  });

  it("store", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useBasketStore();
    store.id = 42;
    store.devicesId = [1, 1, 8, 2, 3, 8, 5, 8, 42];

    const wrapper = await mountSuspended(deviceCard, {
      props: defaultProps,
      global: {
        plugins: [pinia],
      },
    });

    expect(wrapper.vm.defineAmount()).toBe(3);
  });
});
