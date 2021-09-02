<template>
  <div>
    <!-- Desktop mod -->
    <v-simple-table
      v-if="$vuetify.breakpoint.mdAndUp"
      class="itemMatrixTable"
      :class="{ rtl: $vuetify.rtl }"
      dense
    >
      <template #default>
        <thead>
          <tr class="itemMatrixHeader">
            <th class="text-start font-weight-bold">
              {{ $t('itemMatrix.title') }}
            </th>
            <th
              v-for="(group, key) in groups"
              :key="key"
              class="font-weight-medium text-center px-0"
              style="width: 70px;"
            >
              {{ $t(`relationships.${group.label}`) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(question, key) in summary.questions"
            :key="key"
          >
            <td class="px-1 py-2">
              <div class="body-2 d-flex questionCell">
                <div
                  class="font-weight-bold mx-2"
                >
                  {{ question }}.
                </div>
                <div>
                  {{ $t(`survey.pages.multiple.questions.q${question}`) }}
                </div>
              </div>
            </td>
            <td
              v-for="(group, gKey) in groups"
              :key="gKey"
              class="py-2 px-0 text-center"
              :style="{
                borderColor: darkMode ? '#ffffff1f' : '#c4c4c4',
              }"
            >
              <div>
                <div class="font-weight-bold mb-1 avgScore">
                  <div v-if="report[question][group.code].avg">
                    <ArrowDown v-if="report[question][group.code].status === 'is_low'" />
                    <ArrowHigh v-if="report[question][group.code].status === 'is_high'" />

                    <span>
                      {{ report[question][group.code].avg.toFixed(2) }}
                    </span>
                  </div>
                  <span
                    v-else
                    class="text--disabled"
                  >
                    N.R.
                  </span>
                </div>
                <div>
                  <!-- v-progress-circular doesn't render in pdf -->

                  <radial-progress-bar
                    v-if="report[question][group.code].percentile"
                    class="mx-auto"
                    :diameter="35"
                    :stroke-width="4"
                    :inner-stroke-width="3"
                    :start-color="darkMode ? '#39E3B0' : '#235085'"
                    :stop-color="darkMode ? '#39E3B0' : '#235085'"
                    :inner-stroke-color="darkMode ? '#E0E0E032' : '#E0E0E0ff'"
                    :completed-steps="report[question][group.code].percentile"
                    :total-steps="100"
                  >
                    <span
                      class="font-weight-bold"
                      style="font-size: 10px;"
                    >
                      {{ report[question][group.code].percentile.toFixed() }}
                    </span>
                  </radial-progress-bar>

                  <div
                    v-else
                    class="text--disabled"
                    style="height: 30px;"
                  >
                    -
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <!-- Mobile mode -->
    <template v-else>
      <div
        class="py-2 px-2 mb-4"
        style="border: solid; border-width: 3px 0 1px;"
        :style="{
          background: darkMode ? null : 'rgba(196, 196, 196, 0.1)',
          borderColor: darkMode ? 'white' : '#003865 #c4c4c4 #c4c4c4',
        }"
      >
        <div class="font-weight-bold">
          {{ $t('itemMatrix.title') }}
        </div>
      </div>

      <div
        v-for="(question, key) in summary.questions"
        :key="`mobileQuestion${key}`"
        class="mb-4"
        style="border: 1px solid #c4c4c4;"
        :style="{
          borderColor: darkMode ? 'white' : '#c4c4c4',
        }"
      >
        <div class="py-3 caption d-flex">
          <div class="font-weight-bold mx-2">
            {{ question }}.
          </div>
          <div>
            {{ $t(`survey.pages.multiple.questions.q${question}`) }}
          </div>
        </div>
        <v-simple-table
          class="itemMatrixTable"
          :class="{ rtl: $vuetify.rtl }"
          dense
        >
          <template #default>
            <thead>
              <tr class="itemMatrixHeader">
                <th
                  v-for="(group, groupKey) in groups"
                  :key="`mobileGroup${groupKey}`"
                  class="font-weight-medium text-center px-0"
                  style="width: 70px;"
                >
                  {{ $t(`relationships.${group.label}`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  v-for="(group, gKey) in groups"
                  :key="gKey"
                  class="py-2 px-0 text-center"
                  :style="{
                    borderColor: darkMode ? '#ffffff1f' : '#c4c4c4',
                  }"
                >
                  <div>
                    <div class="font-weight-bold mb-1 avgScore">
                      <div v-if="report[question][group.code].avg">
                        <ArrowDown v-if="report[question][group.code].status === 'is_low'" />
                        <ArrowHigh v-if="report[question][group.code].status === 'is_high'" />

                        <span>
                          {{ report[question][group.code].avg.toFixed(2) }}
                        </span>
                      </div>
                      <span
                        v-else
                        class="text--disabled"
                      >
                        N.R.
                      </span>
                    </div>
                    <div>
                      <radial-progress-bar
                        v-if="report[question][group.code].percentile"
                        class="mx-auto"
                        :diameter="35"
                        :stroke-width="4"
                        :inner-stroke-width="3"
                        :start-color="darkMode ? '#39E3B0' : '#235085'"
                        :stop-color="darkMode ? '#39E3B0' : '#235085'"
                        :inner-stroke-color="darkMode ? '#E0E0E032' : '#E0E0E0ff'"
                        :completed-steps="report[question][group.code].percentile"
                        :total-steps="100"
                      >
                        <span
                          class="font-weight-bold"
                          style="font-size: 10px;"
                        >
                          {{ report[question][group.code].percentile.toFixed() }}
                        </span>
                      </radial-progress-bar>

                      <div
                        v-else
                        class="text--disabled"
                        style="height: 30px;"
                      >
                        -
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </template>
  </div>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';
import glaStructure from '@/mixins/glaStructure';
import ArrowDown from '@/views/gla/content/common/ArrowDown.vue';
import ArrowHigh from '@/views/gla/content/common/ArrowHigh.vue';
import RadialProgressBar from './RadialProgressBar.vue';

export default {
  name: 'ItemMatrix',

  components: {
    RadialProgressBar,
    ArrowDown,
    ArrowHigh,
  },

  mixins: [
    commonDisplay,
    glaStructure,
  ],

  props: {
    report: {
      type: Object,
      default: null,
    },

    summary: {
      type: Object,
      default: null,
    },

    userPlanType: {
      type: String,
      default: 'free',
    },
  },

  computed: {
    cluster() {
      let cluster;
      if (this.summary?.cluster) {
        cluster = this.summary.cluster;
      }
      return cluster;
    },

    competency() {
      let competency;
      if (this.summary?.competency) {
        competency = this.summary.competency;
      }
      return competency;
    },

    groups() {
      const group = [{ code: 'self', label: 'self' }];

      if (!['free', 'focused'].includes(this.userPlanType)) {
        group.push(
          { code: 'manager', label: 'managers' },
          { code: 'direct_report', label: 'direct_reports' },
          { code: 'peer', label: 'peers' },
          { code: 'other', label: 'others' },
        );
      }
      group.push({ code: 'all_rater', label: 'all_respondents' });

      return group;
    },
  },
};
</script>

<style lang="scss" scoped>
  .itemMatrixTable {
    background-color: transparent;

    tbody {
      tr:hover {
        background: rgba(161, 161, 161, 0.2) !important;
      }
    }

    tr {
      &:not(:first-child) {
        height: 66px;
      }

      &:last-child td {
        border-bottom: thin solid rgba(0, 0, 0, 0.12);
      }

      td:not(:first-child) {
        border-left: thin solid rgba(0, 0, 0, 0.12);
      }

      th {
        background-color: rgba(196, 196, 196, 0.1);
        border-top: 2px solid #003865;
        font-size: 9px !important;
        line-height: 11px;
      }
    }

    &.rtl {
      tr {
        td {
          border-left: thin solid rgba(0, 0, 0, 0.12);

          &:last-child {
            border-left: 0 !important;
          }
        }
      }
    }

    .questionCell {
      font-size: 11px;
    }

    .avgScore {
      font-size: 12px;
    }
  }
</style>
