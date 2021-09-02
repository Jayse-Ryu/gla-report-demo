export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    showLocal: {
      get() {
        return this.show;
      },
      set(newValue) {
        this.$emit('update:show', newValue);
      },
    },
  },
};
