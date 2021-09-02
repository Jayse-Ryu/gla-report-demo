<template>
  <MainCol id="highLowWrap">
    <div
      class="body-1 font-weight-bold pb-2 mb-8"
      :class="darkMode ? null : 'primary--text'"
      :style="{
        borderBottom: $vuetify.breakpoint.smAndDown ? '1px solid' : null,
        borderColor: darkMode ? 'white' : '#003865',
      }"
    >
      <div class="d-flex justify-space-between align-end">
        {{ category === "top"
          ? $t('highLowItems.titleHigh')
          : $t('highLowItems.titleLow')
        }}

        <v-btn
          class="px-1"
          text
          small
          @click="mixToggleHowTo([`${category === 'top' ? 'HighestItem' : 'LowestItem'}`])"
        >
          {{ $t('interactive.howToRead') }}
          <v-icon
            class="px-1"
            size="15"
          >
            mdi-alert-circle-outline
          </v-icon>
        </v-btn>
      </div>

      <div
        v-if="userPlanType === 'focused'"
        class="mt-3 caption"
        :class="darkMode ? 'white--text' : 'black--text'"
      >
        {{ $t('common.focusedNote') }}
      </div>
    </div>

    <v-item-group
      v-if="$vuetify.breakpoint.mdAndUp"
      v-model="selectedGroupIndex"
      mandatory
    >
      <v-row class="flex-wrap mb-5">
        <v-col
          v-for="(group, index) in highLowGroups"
          :key="`g_${index}`"
        >
          <v-item v-slot="{ active, toggle }">
            <v-btn
              class="text-capitalize"
              :color="active ? 'secondary' : darkMode ? 'white' : 'primary'"
              :outlined="!active"
              rounded
              :disabled="group.disable"
              block
              @click="toggle"
            >
              <div class="font-weight-bold">
                {{ group.name }}
              </div>
            </v-btn>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>

    <template v-if="selectedGroupData">
      <div
        v-if="$vuetify.breakpoint.smAndDown"
      >
        <div
          class="caption pb-2"
          :class="darkMode ? 'white--text' : 'primary--text'"
        >
          {{ $t('interactive.selectRespondentGroup') }}
        </div>
        <v-select
          v-model="selectedGroupIndex"
          :items="highLowGroups"
          item-value="index"
          item-text="name"
          item-disabled="disable"
          dense
          outlined
          rounded
          class="font-weight-bold body-2"
          :class="darkMode ? 'darkMode' : 'lightMode'"
        />
      </div>

      <!-- Desktop mode -->
      <v-simple-table
        v-if="$vuetify.breakpoint.mdAndUp"
        ref="highLowItemsTable"
        :key="`table_${highLowGroups[selectedGroupIndex].key}`"
        class="HighLowTable deskMode"
        :dark="darkMode"
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th
                v-for="i in 7"
                :key="`customTh${i}`"
                class="text-center font-weight-medium py-2 px-1"
                :style="{
                  width: ![1, 7].includes(i) ? '75px' : null,
                }"
              >
                <span v-if="![1, 7].includes(i)">
                  {{ $t(`survey.pages.multiple.options.${i - 1}`) }}
                </span>
                <span v-else-if="i === 7">
                  {{ $t('common.average') }}
                </span>
              </th>
            </tr>
          </thead>

          <tbody v-if="selectedGroupData[category] && selectedGroupData[category].length">
            <tr
              v-for="(question, qKey) in selectedGroupData[category]"
              :key="qKey"
            >
              <td
                class="py-3 px-1 d-flex align-center"
              >
                <HighLowDot
                  :top="category === 'top'
                    && otherGroupItems.includes(parseInt(question, 10))"
                  :bottom="category === 'bottom'
                    && otherGroupItems.includes(parseInt(question, 10))"
                  class="mx-1"
                  style="min-width: 10px;"
                />
                <div class="pl-2">
                  <div class="font-weight-bold">
                    {{ $t(`survey.pages.multiple.categories.${clusterName[question].competency}`) }}
                    ({{ $t(`survey.pages.multiple.title.${clusterName[question].cluster}`) }})
                  </div>
                  <div>
                    {{ question }}. {{ $t(`survey.pages.multiple.questions.q${question}`) }}
                  </div>
                </div>
              </td>

              <td
                v-for="(countKey, i) in countKeys"
                :key="i"
                class="text-center py-2 pb-1"
              >
                <PercentageBackground
                  :value="report[question][highLowGroups[selectedGroupIndex].key][countKey]"
                  :total="report[question][highLowGroups[selectedGroupIndex].key].N"
                />
              </td>

              <td class="text-center font-weight-bold">
                <span>
                  {{ report[question][highLowGroups[selectedGroupIndex].key].avg.toFixed(2) }}
                </span>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="7">
                <div class="d-flex justify-center py-3">
                  No data to display
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <!-- Mobile mode -->
      <template v-else>
        <div
          v-for="(question, qKey) in selectedGroupData[category]"
          :key="qKey"
          class="mb-4"
          style="border: solid #c4c4c4; border-width: 4px 1px 1px;"
          :style="{
            borderColor: darkMode ? 'white' : '#003865 #c4c4c4 #c4c4c4',
          }"
        >
          <div class="py-3 px-2 d-flex">
            <div class="mx-2">
              <HighLowDot
                :top="category === 'top'
                  && otherGroupItems.includes(parseInt(question, 10))"
                :bottom="category === 'bottom'
                  && otherGroupItems.includes(parseInt(question, 10))"
                class="mx-1"
                style="min-width: 10px;"
              />
            </div>
            <div>
              <div class="font-weight-bold body-2">
                {{ $t(`survey.pages.multiple.categories.${clusterName[question].competency}`) }}
                ({{ $t(`survey.pages.multiple.title.${clusterName[question].cluster}`) }})
              </div>
              <div class="body-2">
                {{ question }}. {{ $t(`survey.pages.multiple.questions.q${question}`) }}
              </div>
            </div>
          </div>

          <v-simple-table
            ref="highLowItemsTable"
            :key="`table_${highLowGroups[selectedGroupIndex].key}`"
            class="HighLowTable mobileMode"
            :dark="darkMode"
            dense
          >
            <template #default>
              <thead>
                <tr>
                  <th
                    v-for="i in 6"
                    :key="`customTh${i}`"
                    class="text-center font-weight-medium py-2 px-1"
                    style="width: calc(100% / 6);"
                    :style="{
                      borderColor: darkMode ? 'white' : '#c4c4c4',
                    }"
                  >
                    <span v-if="i !== 6">
                      {{ $t(`survey.pages.multiple.options.${i}`) }}
                    </span>
                    <span v-else>
                      {{ $t('common.average') }}
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    v-for="(countKey, i) in countKeys"
                    :key="i"
                    class="text-center py-2 pb-1"
                    :style="{
                      borderColor: darkMode ? 'white' : '#c4c4c4',
                    }"
                  >
                    <PercentageBackground
                      :value="report[question][highLowGroups[selectedGroupIndex].key][countKey]"
                      :total="report[question][highLowGroups[selectedGroupIndex].key].N"
                      :size="22"
                    />
                  </td>

                  <td class="text-center font-weight-bold">
                    <span>
                      {{ report[question][highLowGroups[selectedGroupIndex].key].avg.toFixed(2) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </template>
    </template>

    <HowToRead
      :option="mixHowToOption"
      :show.sync="mixHowToDialog"
      :user-plan-type="userPlanType"
    />
  </MainCol>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';
import glaStructure from '@/mixins/glaStructure';
import howToDialog from '@/mixins/howToDialog';
import PercentageBackground from '../common/PercentageBackground.vue';
import HighLowDot from '../common/HighLowDot.vue';
import HowToRead from '../common/HowToRead.vue';

export default {
  name: 'HighLowItems',

  filters: {
    round(value) {
      return Math.round(value);
    },
  },

  components: {
    PercentageBackground,
    HighLowDot,
    HowToRead,
  },

  mixins: [
    commonDisplay,
    glaStructure,
    howToDialog,
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

  data: () => ({
    countKeys: [
      'highly_dissatisfied_ct', 'dissatisfied_ct', 'neither_ct', 'satisfied_ct', 'highly_satisfied_ct',
    ],
    selectedGroupIndex: 4,
  }),

  computed: {
    highLowGroups() {
      const groups = ['manager', 'direct_report', 'peer', 'other', 'all_rater'];
      const namePutter = ((el) => {
        switch (el) {
          case 'all_rater':
            return this.$t('relationships.all_respondents');
          case 'direct_report':
            return this.$t('relationships.direct_reports');
          case 'manager':
            return this.$t('relationships.managers');
          case 'other':
            return this.$t('relationships.others');
          case 'peer':
            return this.$t('relationships.peers');
          default:
            return '';
        }
      });

      return groups.map((el, index) => {
        const name = namePutter(el);
        const flag = (this.report && this.report.high_low_data[el]
          && this.report.high_low_data[el][this.category]
          && this.report.high_low_data[el][this.category].length > 0);
        return {
          index, key: el, name, disable: !flag,
        };
      });
    },

    selectedGroupKey() {
      return this.highLowGroups[this.selectedGroupIndex].key;
    },

    category() {
      let name = 'top';
      if (this.$route.name.includes('Low')) {
        name = 'bottom';
      }
      return name;
    },

    clusterName() {
      const list = {};
      let cluster = '';
      let competency = '';

      if (
        this.report?.high_low_data[this.selectedGroupKey][this.category]
      ) {
        this.report.high_low_data[this.selectedGroupKey][this.category]
          .forEach((el) => {
            cluster = this.surveyStructure.find(
              (cl) => cl.competencies.some(
                (comp) => comp.questions.includes(`${el}`),
              ),
            );

            competency = cluster.competencies.find((comp) => comp.questions.includes(`${el}`));

            list[el] = {
              cluster: cluster.cluster,
              competency: competency.competency,
            };
          });
      }

      return list;
    },

    otherGroupItems() {
      let items = [];
      const groups = ['peer', 'direct_report', 'other', 'all_rater'];
      groups.filter((el) => el !== this.selectedGroupKey).forEach((group) => {
        if (this.report.high_low_data[group] && this.report.high_low_data[group][this.category]) {
          items = [...items, ...this.report.high_low_data[group][this.category]];
        }
      });
      return items;
    },

    selectedGroupData() {
      let report;

      if (this.highLowGroups && this.highLowGroups.length && this.selectedGroupKey) {
        if (this.report?.high_low_data[this.selectedGroupKey]) {
          report = this.report?.high_low_data[this.selectedGroupKey];
        }
      }

      return report;
    },
  },
};
</script>

<style lang="scss" scoped>
  .HighLowTable {
    background: transparent;

    tbody {
      tr:hover {
        background: rgba(161, 161, 161, 0.2) !important;
      }
    }

    tr {
      &:last-child {
        td {
          border-bottom: thin solid rgba(0, 0, 0, 0.12);
        }
      }

      th {
        border-top: 3px solid #003865;
        font-size: 10px !important;
        line-height: 1.2;
        min-height: 50px !important;
        word-break: break-word;

        &:not(:last-child) {
          background-color: rgba(220, 220, 220, 0.1);
        }

        &:last-child {
          background-color: rgba(150, 150, 150, 0.1);
        }
      }

      td {
        height: unset !important;

        &:last-child {
          background-color: rgba(196, 196, 196, 0.1);
        }
      }
    }

    &.mobileMode {
      tr {
        th {
          border-top: 1px solid;
          font-size: 7px !important;
          &:not(:last-child) {
            border-right: 1px solid;
          }
        }

        td {
          &:not(:last-child) {
            border-right: 1px solid;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  #highLowWrap {
    .v-select {
      &.lightMode {
        .v-select__selections {
          color: var(--v-primary-base);
        }
      }
    }
  }
</style>
