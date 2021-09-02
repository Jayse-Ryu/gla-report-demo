<template>
  <svg
    :height="size"
    :width="size"
    :viewBox="`0 0 ${size} ${size}`"
  >
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="size / 2"
      stroke-width="0"
      :fill="color"
    />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dy=".3em"
      :font-size="fontSize"
      font-weight="bold"
      fill="#fff"
    >
      {{ value }}
    </text>
  </svg>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },

    color: {
      type: String,
      default: '#AEB8FE',
    },

    size: {
      type: Number,
      default: 26,
    },

    fontSize: {
      type: String,
      default: '8pt',
    },
  },
};
</script>
