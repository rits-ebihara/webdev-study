<template>
  <div>
    <IncrementalButton caption="-" :onClickFn="decrements" />
    <DisplayNumber :num="counter" />
    <IncrementalButton caption="+" :onClickFn="increments" />
  </div>
</template>

<script lang="ts">
import Vue, { ref } from "vue";
import DisplayNumber from "./DisplayNumber.vue";
import IncrementalButton from "./IncrementalButton.vue";

export default {
  components: {
    DisplayNumber,
    IncrementalButton,
  },
  setup: () => {
    const counter = ref(0);
    const increments = () => {
      counter.value++;
    };
    const decrements = () => {
      counter.value--;
    };
    return {
      counter,
      increments,
      decrements,
    };
  },
} as Vue.Component;
</script>
