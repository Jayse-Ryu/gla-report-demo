<template>
  <svg
    :height="size"
    :width="size"
    viewBox="0 0 26 26"
  >
    <circle
      cx="13"
      cy="13"
      r="12"
      stroke-width="0"
      :stroke-opacity="opacity"
      :fill="fillColor"
      :fill-opacity="opacity"
    />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dy=".3em"
      font-size="8pt"
      font-weight="bold"
      :fill="darkMode ? 'white' : 'black'"
    >
      {{ value ? value : 0 }}
    </text>
  </svg>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';

export default {
  mixins: [
    commonDisplay,
  ],

  props: {
    value: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    NINR: {
      type: Boolean,
      default: false,
    },

    size: {
      type: Number,
      default: 26,
    },
  },

  computed: {
    fillColor() {
      if (this.value === 0 || this.NINR) {
        return this.darkMode ? '#ffffff16' : '#f2f2f2';
      }
      return '#19ACAA';
    },

    opacity() {
      if (this.value === 0 || this.NINR) {
        return this.darkMode ? '0.7' : '1';
      }
      return this.value / this.total;
    },
  },
};
</script>
