<template>
  <div
    id="publicGlaReport"
  >
    <v-overlay
      v-if="!ready"
      :value="true"
      :z-index="20"
    >
      <v-progress-circular
        height="25"
        style="width: 50vw;"
        color="#003865"
        rounded
        indeterminate
      />
    </v-overlay>

    <Password
      v-else-if="!publicReportData"
      :public-report-data.sync="publicReportData"
      :public-password.sync="publicPassword"
    />

    <GlaMain
      v-else
      :public-report-data="publicReportData"
      :public-password="publicPassword"
    />
  </div>
</template>

<script>
import glaApi from '@/api/gla/report';
import Password from './content/password/Password.vue';
import GlaMain from './GLAMain.vue';

export default {
  name: 'PublicGLA',

  components: {
    Password,
    GlaMain,
  },

  props: {
    selfGla: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    ready: false,
    publicPassword: '',
    publicStatus: null,
    publicReportData: null,
  }),

  async created() {
    await this.getPublicStatus();
    this.ready = true;
  },

  methods: {
    async getPublicStatus() {
      try {
        this.publicStatus = await glaApi.getPublicStatus(this.$route.params.id, this.selfGla);

        if (!this.publicStatus.is_public) {
          this.$router.push({ name: '404' });
          return;
        }

        if (!this.publicStatus.is_password_protected) {
          await this.getPublicReportData();
        }
      } catch (err) {
        console.log(err);
        this.$router.push({ name: '404' });
      }
    },

    async getPublicReportData() {
      try {
        const { id } = this.$route.params;
        this.publicReportData = await glaApi.getPublicReport(id, null, this.selfGla);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#publicGlaReport {
  min-height: 100vh;
}
</style>
