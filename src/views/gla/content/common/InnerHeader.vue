<template>
  <MainCol>
    <v-row
      v-if="$vuetify.breakpoint.mdAndUp"
      class="mb-6"
    >
      <v-col
        cols="6"
        class="d-flex align-center"
      >
        <div
          style="cursor: pointer;"
          @click="openLink"
        >
          <v-img
            v-if="!darkMode"
            src="@/assets/logo.png"
            width="72px"
            alt="GCG Logo"
            contain
            eager
          />
          <v-img
            v-else
            src="@/assets/logo_white.png"
            width="70px"
            alt="GCG Logo"
            contain
            eager
          />
        </div>
      </v-col>
      <v-col
        cols="6"
        class="d-flex justify-end"
      >
        <!-- Wrapper div for prevent stretching image in flex -->
        <div
          style="cursor: pointer;"
          @click="openLink"
        >
          <v-img
            v-if="!darkMode"
            src="@/assets/company_slogan.png"
            width="151px"
            alt="GCG Logo"
            contain
            eager
          />
          <v-img
            v-else
            src="@/assets/company_slogan_white.png"
            width="151px"
            alt="GCG Logo"
            contain
            eager
          />
        </div>
      </v-col>
    </v-row>

    <div
      v-if="report && report.leader"
      class="mb-4"
      :class="darkMode ? null : 'primary--text'"
    >
      <span :class="$vuetify.breakpoint.smAndDown ? 'body-1 font-weight-medium' : 'title'">
        <i18n path="header.reportTitleFor">
          <template #leader>
            <b class="title font-weight-bold">
              <br v-if="$vuetify.breakpoint.smAndDown" />
              <span>
                {{ `${report.leader.first_name ? report.leader.first_name : ''}` }}
                {{ `${report.leader.last_name ? report.leader.last_name : ''}` }}
              </span>
            </b>
          </template>
        </i18n>
      </span>
    </div>
  </MainCol>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';

export default {
  name: 'InnerHeader',

  mixins: [commonDisplay],

  props: {
    report: {
      type: Object,
      default: null,
    },
  },

  computed: {
    reportLeaderTitle() {
      let title;

      if (this.report?.leader && (this.report.leader.first_name || this.report.leader.last_name)) {
        const name = `${this.report.leader.first_name} ${this.report.leader.last_name}`;
        title = this.$t('header.reportOfLeader', { leader: name });
      }

      return title;
    },
  },

  methods: {
    openLink() {
      // window.open('http://globalcoachgroup.com/', '_blank');
      this.$toast.info('The link disconnected for demo.');
    },
  },
};
</script>
