<script>
import Counter from './Counter.vue';

export default {
  components: { Counter },
};
</script>

<style scoped>
.root {
  border: 1px solid red;
}
</style>

<template>
  <div class="root">
    <p>Hello, World!{{ id }}</p>
    <counter />
  </div>
</template>
