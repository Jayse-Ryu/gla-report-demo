<template>
  <svg
    height="10"
    width="10"
    viewBox="0 0 10 10"
  >
    <circle
      cx="5"
      cy="5"
      r="5"
      stroke-width=".5"
      :fill="fillColor"
    />
  </svg>
</template>

<script>
export default {
  props: {
    top: {
      type: Boolean,
      default: false,
    },
    bottom: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    fillColor() {
      if (this.top) return '#85E04A';
      if (this.bottom) return '#F0BC35';
      return 'transparent';
    },
  },
};
</script>
