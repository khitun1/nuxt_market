<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@store";
import { useBasketStore } from "@store/basket";

const store = useUserStore();
const basketStore = useBasketStore();

interface ItemNavBar {
  label: string;
  icon: string;
  to: string;
}

const items = ref<ItemNavBar[]>([
  {
    label: "Home",
    icon: "pi pi-home",
    to: "/",
  },
  {
    label: "Add device",
    icon: "pi pi-plus-circle",
    to: "addDevice",
  },
  {
    label: "Contact us",
    icon: "pi pi-envelope",
    to: "info",
  },
]);

const signOut = async (): Promise<void> => {
  await store.signOut();
  const router = useRouter();

  await router.push("/");
};
</script>

<template>
  <nav aria-label="Main navigation">
    <Menubar :model="items">
      <template #item="{ item }">
        <span
          v-if="
            item.label !== 'Add device' || (store.login && store.user?.isAdmin)
          "
          :class="item.icon"
        />
        <NuxtLink
          v-if="
            item.label !== 'Add device' || (store.login && store.user?.isAdmin)
          "
          :to="item.to"
          class="ml-1 mr-5"
          tabindex="0"
        >
          {{ item.label }}
        </NuxtLink>
      </template>
      <template #end>
        <div class="flex items-center">
          <NuxtLink
            :to="{ path: 'cart', query: { id: store.user?.id } }"
            class="pi pi-cart-plus mr-5"
            tabindex="0"
          >
            {{ basketStore.getDevices.length }}
          </NuxtLink>
          <div v-if="store.user">
            <Avatar shape="circle" icon="pi pi-user" class="mr-2" />
            <span class="mr-5">
              {{ store.user.login }}
            </span>
            <Button
              label="Sign out"
              icon="pi pi-sign-out"
              class="h-8"
              tabindex="0"
              @click="signOut"
            />
          </div>
          <div v-else class="[&_button]:h-[35px] [&_button]:mr-[10px]">
            <NuxtLink to="login">
              <Button tabindex="0" @click="() => store.changeAuthPage('login')">
                Log in
              </Button>
            </NuxtLink>
            <NuxtLink to="login">
              <Button
                tabindex="0"
                @click="() => store.changeAuthPage('signUp')"
              >
                Sign up
              </Button>
            </NuxtLink>
          </div>
        </div>
      </template>
    </Menubar>
  </nav>
</template>

<style scoped></style>
