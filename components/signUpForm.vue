<script setup lang="ts">
import { useUserStore } from "@store";
import { useToast } from "primevue/usetoast";
import type { Router } from "vue-router";

const store = useUserStore();
const login = ref("");
const password = ref("");
const seller = ref(false);
const toast = useToast();

const emit = defineEmits(["changeForm"]);

const sendForm = async (): Promise<void> => {
  const router: Router = useRouter();
  const res: true | undefined = await store.signUp(
    login.value,
    password.value,
    seller.value,
  );
  if (!res) {
    toast.add({
      severity: "warn",
      summary: "Error",
      detail: "Login is already exists",
      life: 3000,
    });
  } else {
    await router.push("/");
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row">
    <Toast />
    <form
      class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5"
      @submit.prevent="sendForm"
    >
      <div class="flex flex-col gap-2">
        <label for="username"> Username </label>
        <InputText id="username" v-model="login" type="text" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password"> Password </label>
        <InputText id="password" v-model="password" type="password" />
      </div>
      <div class="flex flex-row gap-4">
        <label for="seller"> Seller </label>
        <Checkbox v-model="seller" input-id="seller" binary />
      </div>
      <div class="flex">
        <Button
          label="Sign up"
          icon="pi pi-user-plus"
          class="w-full max-w-[17.35rem] mx-auto"
          type="submit"
        />
      </div>
    </form>
    <div class="w-full md:w-2/12">
      <Divider layout="vertical" class="!hidden md:!flex font-bold">
        OR
      </Divider>
      <Divider
        layout="horizontal"
        class="!flex md:!hidden font-bold"
        align="center"
      >
        OR
      </Divider>
    </div>
    <div class="w-full md:w-5/12 flex items-center justify-center py-5">
      <Button
        label="Log in"
        icon="pi pi-user"
        severity="success"
        class="w-full max-w-[17.35rem] mx-auto changeForm"
        @click="emit('changeForm')"
      />
    </div>
  </div>
</template>

<style scoped></style>
