<script setup lang="ts">
import { useDeviceStore } from "@store/device";
import { useToast } from "primevue/usetoast";
import type { Device } from "~/types/device";
import type { Feature } from "~/types/feature";
import type { Ref } from "vue";

definePageMeta({
  middleware: ["access-to-add-device-middleware"],
});

const deviceStore = useDeviceStore();

await deviceStore.getTypesApi();
await deviceStore.getBrandsApi();

const device: Ref<Device> = ref<Device>({
  typeId: -1,
  brandId: -1,
  name: "",
  price: 0,
  rating: 0,
  img: null,
  id: -1,
});

const features: Ref<Feature[]> = ref<Feature[]>([
  {
    title: "",
    description: "",
  },
]);

const type = ref(deviceStore.getTypes[0]);
const brand = ref(deviceStore.getBrands[0]);

useSeoMeta({
  title: "Add Product | Admin Panel",
  robots: "noindex, nofollow",
});

const newType = ref("");
const newBrand = ref("");

const visibleType = ref(false);
const visibleBrand = ref(false);

const toast = useToast();

const createType = async (): Promise<void> => {
  const res: true | undefined = await deviceStore.createType(newType.value);
  if (!res) {
    toast.add({
      severity: "warn",
      summary: "Error",
      detail: "Type already exists",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Type have successfully created",
      life: 3000,
    });
    await deviceStore.getTypesApi();
  }
  visibleType.value = false;
  newType.value = "";
};

const createBrand = async (): Promise<void> => {
  const res: true | undefined = await deviceStore.createBrand(newBrand.value);
  if (!res) {
    toast.add({
      severity: "warn",
      summary: "Error",
      detail: "Brand already exists",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Brand have successfully created",
      life: 3000,
    });
    await deviceStore.getBrandsApi();
  }
  visibleBrand.value = false;
  newBrand.value = "";
};

const showType = (): void => {
  visibleType.value = true;
};

const addFeature = (): void => {
  features.value.push({
    title: "",
    description: "",
  });
};

const changePicture = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    device.value.img = input.files[0];
  }
};

const removeFeature = (i: Feature): void => {
  const index = features.value.indexOf(i);
  features.value.splice(index, 1);
};

const createDevice = async (): Promise<void> => {
  const form = new FormData();
  form.append("name", device.value.name);
  form.append("price", device.value.price.toString());
  form.append("rating", device.value.rating.toString());
  form.append("file", device.value.img ? device.value.img : "");
  form.append("typeId", type.value.id.toString());
  form.append("brandId", brand.value.id.toString());

  for (let i = 0; i < features.value.length; i++) {
    form.append("infoTitles", features.value[i].title);
    form.append("infoDescriptions", features.value[i].description);
  }

  const res: true | undefined = await deviceStore.createDevice(form);
  if (!res) {
    toast.add({
      severity: "warn",
      summary: "Error",
      detail: "Internal error",
      life: 3000,
    });
  } else {
    const file = document.getElementById("deviceImage") as HTMLInputElement;
    file.value = "";

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Device have successfully created",
      life: 3000,
    });
    device.value = {
      typeId: -1,
      brandId: -1,
      name: "",
      price: 0,
      rating: 0,
      img: null,
      id: -1,
    };
    features.value = [
      {
        title: "",
        description: "",
      },
    ];
    type.value = {
      id: -1,
      name: "",
    };
    brand.value = {
      id: -1,
      name: "",
    };
  }
};
</script>

<template>
  <div>
    <Toast />
    <form class="add-device" @submit.prevent="createDevice">
      <div>
        <label for="type"> Type: </label>
        <select id="type" v-model="type" required>
          <template v-for="t in deviceStore.getTypes" :key="t.id">
            <option v-if="deviceStore.getTypes.length !== 0" :value="t">
              {{ t.name }}
            </option>
            <option v-else disabled>None types</option>
          </template>
        </select>
        <Button id="showCreateType" tabindex="0" @click="showType">
          Add type
        </Button>
        <Dialog
          v-model:visible="visibleType"
          modal
          header="New type"
          :style="{ width: '25rem' }"
        >
          <form id="createTypeForm" @submit.prevent="createType">
            <div class="flex items-center gap-4 mb-4">
              <label for="typeName" class="font-semibold w-24"> Name: </label>
              <InputText
                id="typeName"
                v-model="newType"
                class="flex-auto"
                autocomplete="off"
                autofocus
                required
              />
            </div>
            <div class="flex justify-end gap-2">
              <Button
                id="createTypeBtn"
                label="Save"
                tabindex="0"
                type="submit"
              />
            </div>
          </form>
        </Dialog>
      </div>
      <div>
        <label for="brand"> Brand: </label>
        <select id="brand" v-model="brand" required>
          <template v-for="b in deviceStore.getBrands" :key="b.id">
            <option v-if="deviceStore.getBrands.length !== 0" :value="b">
              {{ b.name }}
            </option>
            <option v-else disabled>None brands</option>
          </template>
        </select>
        <Button tabindex="0" @click="visibleBrand = true"> Add brand </Button>
        <Dialog
          v-model:visible="visibleBrand"
          modal
          header="New brand"
          :style="{ width: '25rem' }"
        >
          <form @submit.prevent="createBrand">
            <div class="flex items-center gap-4 mb-4">
              <label for="brandName" class="font-semibold w-24"> Name: </label>
              <InputText
                id="brandName"
                v-model="newBrand"
                class="flex-auto"
                autocomplete="off"
                autofocus
                required
              />
            </div>
            <div class="flex justify-end gap-2">
              <Button label="Save" tabindex="0" type="submit" />
            </div>
          </form>
        </Dialog>
      </div>
      <div>
        <label for="deviceName"> Name: </label>
        <InputText
          id="deviceName"
          v-model="device.name"
          type="text"
          placeholder="Name"
          required
        />
        <label for="devicePrice"> Price: </label>
        <InputNumber
          v-model="device.price"
          :min="0"
          input-id="devicePrice"
          required
          class="mt-3"
        />

        <label for="deviceImage"> Image: </label>
        <input
          id="deviceImage"
          type="file"
          tabindex="0"
          required
          @change="changePicture"
        />
      </div>
      <div class="flex-col !items-start">
        <h2>Features:</h2>
        <div v-for="i in features" :key="i.title">
          <label :for="'featureTitle' + i.title"> Title: </label>
          <InputText
            :id="'featureTitle' + i.title"
            v-model="i.title"
            placeholder="Title"
            required
          />

          <label :for="'featureDescription' + i.description">
            Description:
          </label>
          <InputText
            :id="'featureDescription' + i.description"
            v-model="i.description"
            placeholder="Description"
            required
          />
          <Button
            v-if="i === features.at(-1)"
            tabindex="0"
            class="addFeature"
            @click="addFeature"
          >
            Add
          </Button>
          <Button
            v-else
            class="addFeature"
            tabindex="0"
            @click="() => removeFeature(i)"
          >
            Remove
          </Button>
        </div>
      </div>
      <Button tabindex="0" type="submit"> Create </Button>
    </form>
  </div>
</template>

<style scoped>
.add-device {
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  * {
    display: flex;
    justify-content: start;
    margin-bottom: 20px;
    align-items: center;
    margin-left: 20px;

    * {
      margin-right: 10px;
      height: fit-content;
    }
  }
}

button {
  width: fit-content;
  text-align: center;
  height: fit-content;
  padding: 5px;
}
</style>
