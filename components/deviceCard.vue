<script setup lang="ts">
import { useBasketStore } from "@store/basket";

const props = defineProps({
  name: { type: String, required: true },
  img: {
    type: String,
    default: "123",
  },
  rating: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  id: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["open", "addToCart", "removeItem"]);

const basketStore = useBasketStore();

const defineAmount = () =>
  basketStore.devicesId.filter((b) => b === props.id).length;
</script>

<template>
  <Card class="device-card" @click="emit('open')">
    <template #header>
      <img :src="props.img" alt="device image" />
    </template>
    <template #title>
      <h2>
        {{ props.name }}
      </h2>
    </template>
    <template #subtitle>
      <progress id="device-card__progress" max="5" :value="props.rating" />
      <span class="absolute ml-2">
        {{ props.rating }}
      </span>
    </template>
    <template #content>
      <p>{{ props.price }}$</p>
    </template>
    <template #footer>
      <Button
        class="w-full flex-row justify-between p-0"
        tabindex="0"
        @click.stop="emit('addToCart')"
      >
        <button
          class="hover:bg-[#008024] h-[100%] w-[30%]"
          @click.stop="emit('removeItem')"
        >
          {{ defineAmount() === 0 ? "" : "-" }}
        </button>
        <span>
          {{ defineAmount() === 0 ? "to cart" : defineAmount() }}
        </span>
        <button class="hover:bg-[#008024] h-[100%] w-[30%]">
          {{ defineAmount() === 0 ? "" : "+" }}
        </button>
      </Button>
    </template>
  </Card>
</template>

<style scoped>
#device-card__progress {
  width: 25px;
  height: 25px;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );

  &::-webkit-progress-value {
    background: gold;
  }
}

.device-card {
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 250px;
  height: fit-content;
  margin-bottom: 20px;
  background: #5e5e5e;
  box-shadow: 2px 2px 5px #ffffff;
  &:hover {
    cursor: pointer;
  }
  img {
    width: 250px;
    height: 270px;
    border-radius: 10px;
  }
  h2 {
    margin-top: -10px;
  }
}
</style>
