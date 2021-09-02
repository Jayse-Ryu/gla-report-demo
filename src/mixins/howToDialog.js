export default {
  data: () => ({
    mixHowToOption: null,
    mixHowToDialog: false,
  }),

  methods: {
    mixToggleHowTo(option) {
      this.mixHowToOption = option;
      this.mixHowToDialog = true;
    },
  },
};
