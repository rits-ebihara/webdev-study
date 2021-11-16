<template>
  <button type="button" @click="onClickFn">{{ caption }}</button>
</template>
<script lang="ts">
import Vue from "vue";
type Props = {
  caption: string;
  onClickFn: () => void; // onClick とすると、DOMの
};
export default {
  props: {
    caption: {
      type: String,
      required: true,
    },
    onClickFn: {
      type: Function,
      required: true,
    },
  },
} as Vue.Component<Props>;
</script>

<style lang="scss" scoped>
button {
  background-color: #3399ff;
  border: 1px solid blue;
  margin: 0 1em;
  padding: 0.5em 1em;
}
</style>
