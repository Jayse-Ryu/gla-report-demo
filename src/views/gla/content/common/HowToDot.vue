<template>
  <svg
    height="13"
    width="13"
    viewBox="0 0 20 20"
  >
    <circle
      cx="10"
      cy="10"
      r="10"
      fill="#E51D7A"
    />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dy=".3em"
      fill="white"
    >
      {{ value }}
    </text>
  </svg>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
};
</script>
