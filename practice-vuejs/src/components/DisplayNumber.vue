<template>
  <span>{{ num }}</span>
</template>

<script lang="ts">
import Vue from "vue";
type Props = {
  num: number;
};

export default {
  props: {
    num: {
      type: Number,
      required: true,
    },
  },
} as Vue.Component<Props>;
</script>
