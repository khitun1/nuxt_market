<script setup lang="ts">
import { useDeviceStore } from "@store/device";
import type { Type } from "~/types/type";
import type { Brand } from "~/types/brand";
import { useBasketStore } from "@store/basket";

const searchDevice = ref("");
const searchType = ref<Type | string>("");
const searchBrand = ref<Brand | string>("");

const deviceStore = useDeviceStore();

await deviceStore.getDevicesApi();
await deviceStore.getTypesApi();
await deviceStore.getBrandsApi();

const basketStore = useBasketStore();

const open = async (id: number) => {
  await navigateTo({
    path: "/device",
    query: {
      id,
    },
  });
};

const addItem = async (deviceId: number) => {
  await basketStore.addItem(deviceId);
};

const removeItem = async (deviceId: number) => {
  await basketStore.removeItem(deviceId);
};

const test = async () => {
  await deviceStore.getDevicesByName(searchDevice.value);
};

const getDevices = async () => {
  await deviceStore.getDevicesApi(searchType.value.id, searchBrand.value.id);
};

const clearFilters = async () => {
  searchBrand.value = "";
  searchType.value = "";
  searchDevice.value = "";
  await deviceStore.getDevicesApi();
};

useSeoMeta({
  title: 'Home | Nuxt Store',
  ogTitle: 'Home | Nuxt Store',
  description: 'Welcome to our electronics store. Best products at great prices.',
  ogDescription: 'Welcome to our electronics store. Best products at great prices.',
})
</script>

<template>
  <div class="container">
    <h1 class="visually-hidden">Nuxt Store Electronics Catalog</h1>
    
    <section id="search-section" aria-label="Product search">
      <form id="searchForm" @submit.prevent="test">
        <InputText
          id="search"
          v-model="searchDevice"
          placeholder="Enter product name..."
          tabindex="0"
          list="devicesList"
        />
        <datalist id="devicesList">
          <template v-for="device in deviceStore.devices" :key="device.name">
            <option v-if="searchDevice">
              {{ device.name }}
            </option>
          </template>
        </datalist>
        <Button label="Search" icon="pi pi-search" type="submit" tabindex="0" />
      </form>
    </section>

    <section id="filters-section" aria-label="Product filters">
      <div id="filters">
        <div>
          <label for="searchType">Type:</label>
          <select id="searchType" v-model="searchType" @change="getDevices">
            <option value="">All types</option>
            <option
              v-for="type in deviceStore.getTypes"
              :key="type.id"
              :value="type"
            >
              {{ type.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="searchBrand">Brand:</label>
          <select id="searchBrand" v-model="searchBrand" @change="getDevices">
            <option value="">All brands</option>
            <option
              v-for="brand in deviceStore.getBrands"
              :key="brand.id"
              :value="brand"
            >
              {{ brand.name }}
            </option>
          </select>
        </div>
        <div>
          <Button label="Clear" tabindex="0" @click="clearFilters" />
        </div>
      </div>
    </section>

    <section id="products-section" aria-label="Product list">
      <div class="grid">
        <ClientOnly>
          <DeviceCard
            v-for="device in deviceStore.devices"
            :id="device.id"
            :key="device.id"
            tabindex="0"
            :name="device.name"
            :price="device.price"
            :img="device.img"
            :rating="device.rating"
            @open="() => open(device.id)"
            @add-to-cart="() => addItem(device.id)"
            @remove-item="() => removeItem(device.id)"
          />
        </ClientOnly>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
$red: red;

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.container {
  padding-bottom: 20px;
}

.grid {
  margin-top: 20px;
  width: 95%;
  margin-left: 2.5%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 800px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

#searchForm {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 93%;
  margin-left: 5%;

  button {
    height: fit-content;
  }

  #search {
    width: 90%;
    box-shadow: 2px 2px 5px #ffffff;
  }
}

#filters {
  display: flex;
  flex-direction: row;
  background: #2c2c2c;
  width: fit-content;
  justify-content: space-between;
  height: 70px;
  padding: 5px;
  border-radius: 10px;
  margin-left: 5%;
  margin-top: 20px;
  align-items: center;
  div:not(:last-child) {
    margin-right: 50px;
    button {
      height: fit-content;
      padding: 5px;
    }
  }
}
</style>
