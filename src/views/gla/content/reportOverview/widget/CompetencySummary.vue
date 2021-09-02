<template>
  <div>
    <template
      v-if="formattedSummary"
    >
      <SummaryChart
        :summary="formattedSummary"
        :user-plan-type="userPlanType"
        class="mb-7"
      />
      <SummaryMatrix
        :report="report"
        :summary="formattedSummary"
        :user-plan-type="userPlanType"
      />
    </template>
    <template v-else>
      <div
        class="py-3 text-center"
        :class="$vuetify.breakpoint.smAndDown ? 'caption' : null"
        style="opacity: 0.6;"
      >
        <i>
          {{ $t('interactive.summaryPlaceholder') }}
        </i>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import glaStructure from '@/mixins/glaStructure';
import SummaryChart from './components/competencySummary/SummaryChart.vue';
import SummaryMatrix from './components/competencySummary/SummaryMatrix.vue';

export default {
  name: 'CompetencySummary',

  components: {
    SummaryChart,
    SummaryMatrix,
  },

  mixins: [
    glaStructure,
  ],

  props: {
    report: {
      type: Object,
      default: null,
    },

    userPlanType: {
      type: String,
      default: 'free',
    },
  },

  computed: {
    ...mapState({
      selectedCompetency: (state) => state.interaction.selectedCompetency,
    }),

    formattedSummary() {
      let summary;
      let cluster;
      let competency;
      let questions;

      if (this.report && this.selectedCompetency) {
        this.surveyStructure.some((el) => {
          const target = el.competencies
            .find((comp) => comp.competency === this.selectedCompetency.competency);
          if (target) {
            cluster = el.cluster;
            competency = target.competency;
            questions = target.questions;
            return target;
          }
          return false;
        });

        if (competency && this.report[competency]) {
          summary = {
            cluster,
            competency,
            questions,
            data: this.report[competency],
          };
        }
      }

      return summary;
    },
  },
};
</script>
