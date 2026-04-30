<script setup lang="ts">
import type { Device } from "~/types/device";
import { useDeviceStore } from "@store/device";
import { useBasketStore } from "@store/basket";

const deviceStore = useDeviceStore();
const basketStore = useBasketStore();
await deviceStore.getDevicesApi();

const total = computed(() =>
  devicesInCart.value.reduce((sum, p) => sum + p.price * defineAmount(p.id), 0),
);

const devicesInCart = computed(() => {
  const uniqueIds = new Set(basketStore.devicesId);
  return deviceStore.getDevices.filter((device) => uniqueIds.has(device.id));
});

const defineAmount = (id: number) =>
  basketStore.devicesId.filter((b) => b === id).length;

const defineTotalByDevice = (device: Device) =>
  basketStore.devicesId.filter((b) => b === device.id).length * device.price;

// const updateCart = async() => {
//   devicesInCart.value = [];
//   total.value = 0;
//
//   const unique = new Set(basketStore.devicesId);
//
//   for (const i of unique) {
//     const obj = deviceStore.getDevices.find(p => p.id === i);
//     if (obj) {
//       devicesInCart.value.push(obj);
//     }
//   }
//
//   for(const p of devicesInCart.value) {
//     total.value += p.price * defineAmount(p.id);
//   }
// }

// await updateCart();

const deletePosition = async (id: number) => {
  await basketStore.delete(id);
  // await updateCart();
};

const addItem = async (deviceId: number) => {
  await basketStore.addItem(deviceId);
};

const removeItem = async (deviceId: number) => {
  await basketStore.removeItem(deviceId);
};

const clear = async () => {
  await basketStore.clear();
  // await updateCart();
};
</script>

<template>
  <ClientOnly>
    <OrderList
      v-model="devicesInCart"
      data-key="id"
      breakpoint="575px"
      scroll-height="20rem"
    >
      <template #option="{ option, selected }">
        <div class="flex flex-wrap p-1 items-center gap-4 w-full">
          <img
            class="w-12 shrink-0 rounded"
            :src="option.img"
            :alt="option.name"
          />
          <span class="font-medium text-sm">
            {{ option.name }}
          </span>
          <span class="font-bold sm:ml-8"> ${{ option.price }} </span>
          <span
            :class="[
              'text-sm',
              {
                'text-surface-500 dark:text-surface-400': !selected,
                'text-inherit': selected,
              },
            ]"
          >
            <button
              class="order-list__edit-button"
              @click.stop="() => removeItem(option.id)"
            >
              -
            </button>
            {{ defineAmount(option.id) }}
            <button
              class="order-list__edit-button"
              @click.stop="() => addItem(option.id)"
            >
              +
            </button>
          </span>
          <span
            :class="[
              'text-sm',
              {
                'text-surface-500 dark:text-surface-400': !selected,
                'text-inherit': selected,
              },
            ]"
          >
            {{ "$ " + defineTotalByDevice(option) }}
          </span>
          <button
            class="cart__button-delete"
            @click.stop="() => deletePosition(option.id)"
          >
            <Avatar shape="circle" icon="pi pi-trash" class="mr-2" />
          </button>
        </div>
      </template>
    </OrderList>
    <Button class="mt-10 ml-20 w-80" @click.stop="clear">Clear</Button>
    <h2 class="ml-80 mt-5">{{ "total: $" + total }}</h2>
  </ClientOnly>
</template>

<style scoped>
.order-list__edit-button {
  border-radius: 50%;
  height: fit-content;
  width: 15px;
  &:hover {
    background: green;
  }
}
</style>
