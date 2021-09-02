<template>
  <MainCol
    id="verbatim"
    style="max-width: 1000px;"
  >
    <div
      class="body-1 font-weight-bold mb-5 pb-2"
      :class="darkMode ? null : 'primary--text'"
      :style="{
        borderBottom: $vuetify.breakpoint.smAndDown ? '1px solid' : null,
        borderColor: darkMode ? 'white' : '#003865',
      }"
    >
      {{ $t('verbatim.title') }}
    </div>

    <div
      class="body-2"
      :class="[
        $vuetify.breakpoint.smAndDown ? 'mb-7' : 'mb-5',
      ]"
    >
      <div class="mb-4">
        {{ $t('verbatim.intro') }}
      </div>

      <div v-if="userPlanType === 'focused'">
        {{ $t('verbatim.pleaseNote') }}
      </div>
    </div>

    <template v-if="report && formattedVerbatim">
      <!-- By qNumber -->
      <div
        v-for="(qNumber, index) in Object.keys(formattedVerbatim)"
        :key="`key_${index}`"
      >
        <div
          class="verbatimQuestion font-weight-bold mt-5 py-3 px-4 d-flex"
          :class="$vuetify.breakpoint.smAndDown ? 'body-2' : 'body-1'"
          style="border-top: 2px solid;"
          :style="{
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#003865',
          }"
        >
          <span>
            {{ qNumber }}.
            {{ $t(`survey.pages.verbatim.questions.c${qNumber - 72}`) }}
          </span>
        </div>

        <!-- By data of v-qNumber -->
        <div
          v-for="(row, rIndex) in formattedVerbatim[qNumber]"
          :key="rIndex"
          class="mt-6"
        >
          <div
            class="font-weight-bold teal--text mt-5 body-2"
          >
            {{ row.group.label }}
          </div>

          <!-- By verbatim data -->
          <template v-if="row.data && row.data.length">
            <div
              v-for="(verbatim, vKey) in row.data"
              :key="vKey"
              class="body-2"
              :class="$vuetify.breakpoint.smAndDown ? 'pt-5' : 'pt-3'"
            >
              <div style="white-space: pre-line; word-break: break-word;">
                {{ verbatim.edited_answer ? verbatim.edited_answer : verbatim.answer }}
              </div>

              <v-divider
                v-if="vKey < row.data.length - 1"
                :class="$vuetify.breakpoint.smAndDown ? 'mt-5' : 'mt-3'"
                :style="{
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.4)'
                }"
              />
            </div>

            <v-divider
              v-if="rIndex < formattedVerbatim[qNumber].length - 1"
              :class="$vuetify.breakpoint.smAndDown ? 'mt-5' : 'mt-3'"
              style="border-top-width: 2px"
              :style="{
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.4)'
              }"
            />
          </template>
          <!-- /By verbatim data -->
        </div>
        <!-- /By data of v-qNumber -->

        <v-divider
          :class="$vuetify.breakpoint.smAndDown ? 'my-5' : 'my-2'"
          style="border-top-width: 2px"
          :style="{
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.4)'
          }"
        />
      </div>
      <!-- /By qNumber -->
    </template>
  </MainCol>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';

export default {
  name: 'Verbatim',

  mixins: [commonDisplay],

  props: {
    report: {
      type: Object,
      default: null,
    },

    selfGla: {
      type: Boolean,
      default: false,
    },

    userPlanType: {
      type: String,
      default: 'free',
    },
  },

  computed: {
    formattedVerbatim() {
      const verbatim = {};
      const groups = [
        { code: 'self', label: this.$t('relationships.self'), order: 1 },
        { code: 'manager', label: this.$t('relationships.managers'), order: 2 },
        { code: 'direct_report', label: this.$t('relationships.direct_reports'), order: 2 },
        { code: 'peer', label: this.$t('relationships.peers'), order: 3 },
        { code: 'other', label: this.$t('relationships.others'), order: 4 },
        { code: 'all_rater', label: this.$t('relationships.all_respondents'), order: 5 },
      ];

      if (this.report?.verbatim) {
        // Object by question number
        Object.keys(this.report.verbatim).forEach((qNumber) => {
          const qData = this.report.verbatim[qNumber];
          let formatted = [];

          // List init by question
          let filteredGr = groups.filter((gr) => this.report.verbatim[qNumber][gr.code]);
          let isFiltered = false;
          if (this.selfGla && this.userPlanType === 'focused') {
            isFiltered = true;
            filteredGr = filteredGr.filter((el) => !['manager', 'direct_report', 'peer', 'other'].includes(el.code));
            filteredGr.push(groups.find((el) => el.code === 'all_rater'));
          }

          // Change data format
          Object.entries(qData).forEach((el) => {
            const [group, data] = el;
            const obj = { group: null, data: [] };
            if (isFiltered) {
              obj.group = groups.find((gr) => gr.code === 'all_rater');
              obj.data = [...data.filter((answer) => answer.edited_answer || answer.answer)];
            } else {
              obj.group = groups.find((gr) => gr.code === group);
              obj.data = [...data.filter((answer) => answer.edited_answer || answer.answer)];
            }
            formatted.push(obj);
          });
          formatted = formatted.sort((a, b) => a.group.order - b.group.order);
          verbatim[qNumber] = formatted;
        });
      }

      return verbatim;
    },
  },
};
</script>

<style lang="scss" scoped>
  #verbatim {
    .verbatimQuestion {
      background: rgba(196, 196, 196, 0.1);
    }
  }
</style>
