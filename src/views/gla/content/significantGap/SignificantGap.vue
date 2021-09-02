<template>
  <MainCol id="significantWrap">
    <div
      class="body-1 font-weight-bold pb-2 mb-8"
      :class="darkMode ? null : 'primary--text'"
      :style="{
        borderBottom: $vuetify.breakpoint.smAndDown ? '1px solid' : null,
        borderColor: darkMode ? 'white' : '#003865',
      }"
    >
      <div class="d-flex justify-space-between align-end">
        {{ $t('significantGaps.title') }}

        <v-btn
          class="px-1"
          text
          small
          @click="mixToggleHowTo(['significantGap'])"
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
          v-for="(group, index) in significantGapGroups"
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
        :items="significantGapGroups"
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

    <!-- Desk Mode -->
    <v-simple-table
      v-if="$vuetify.breakpoint.mdAndUp"
      :key="`table_${significantGapGroups[selectedGroupIndex].key}`"
      class="significantGapTable"
      :class="{
        rtl: $vuetify.rtl,
        darkTable: darkMode
      }"
      :dark="darkMode"
      dense
    >
      <template #default>
        <thead>
          <tr>
            <th>
            </th>
            <th
              class="text-center font-weight-bold py-4"
              style="width: 80px;"
            >
              {{ $t(`significantGaps.tableHeader.${selectedGroupKey}`) }}
            </th>
            <th
              class="text-center font-weight-bold py-4"
              style="width: 80px;"
            >
              {{ $t('significantGaps.tableHeader.self') }}
            </th>
            <th
              class="text-center font-weight-bold py-4 gap"
              style="width: 80px;"
            >
              {{ $t('significantGaps.tableHeader.gap') }}
            </th>
          </tr>
        </thead>

        <tbody
          v-if="orderGaps && orderGaps.length"
        >
          <tr
            v-for="(d, key) in orderGaps"
            :key="key"
          >
            <td class="py-4 px-2">
              <div class="font-weight-bold">
                {{ $t(`survey.pages.multiple.categories.${clusterName[d.question].competency}`) }}
                ({{ $t(`survey.pages.multiple.title.${clusterName[d.question].cluster}`) }})
              </div>
              <div
                class="highLowQuestionLabel"
              >
                {{ d.question }}. {{ $t(`survey.pages.multiple.questions.q${d.question}`) }}
              </div>
            </td>

            <td class="text-center">
              <ArrowDown v-if="d.avg.status === 'is_low'" />
              <ArrowHigh v-if="d.avg.status === 'is_high'" />

              <span style="font-size: 12px;">
                {{ d.avg.value.toFixed(2) }}
              </span>
            </td>
            <td
              class="text-center"
            >
              <ArrowDown v-if="d.self.status === 'is_low'" />
              <ArrowHigh v-if="d.self.status === 'is_high'" />

              <span style="font-size: 12px;">
                {{ d.self.value.toFixed(2) }}
              </span>
            </td>
            <td
              class="font-weight-bold text-center gap"
              style="font-size: 12px;"
            >
              {{ d.gap.toFixed(2) }}
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

    <!-- Mobile Mode -->
    <template v-else-if="orderGaps && orderGaps.length">
      <div
        v-for="(d, key) in orderGaps"
        :key="`mobileGap${key}`"
        class="mb-4"
        style="border: solid #c4c4c4; border-width: 4px 1px 1px;"
        :style="{
          borderColor: darkMode ? 'white' : '#003865 #c4c4c4 #c4c4c4',
        }"
      >
        <div class="py-4 px-2">
          <div class="font-weight-bold body-2">
            {{ $t(`survey.pages.multiple.categories.${clusterName[d.question].competency}`) }}
            ({{ $t(`survey.pages.multiple.title.${clusterName[d.question].cluster}`) }})
          </div>
          <div
            class="highLowQuestionLabel body-2"
          >
            {{ d.question }}. {{ $t(`survey.pages.multiple.questions.q${d.question}`) }}
          </div>
        </div>

        <v-simple-table
          :key="`table_${significantGapGroups[selectedGroupIndex].key}`"
          class="significantGapTable mobile"
          :class="{ rtl: $vuetify.rtl }"
          :dark="darkMode"
          dense
        >
          <template #default>
            <thead>
              <tr>
                <th
                  class="text-center font-weight-bold py-4"
                  style="width: 33.33%;"
                  :style="{
                    borderColor: darkMode ? 'white' : '#c4c4c4',
                  }"
                >
                  {{ $t(`significantGaps.tableHeader.${selectedGroupKey}`) }}
                </th>
                <th
                  class="text-center font-weight-bold py-4"
                  style="width: 33.33%;"
                  :style="{
                    borderColor: darkMode ? 'white' : '#c4c4c4',
                  }"
                >
                  {{ $t('significantGaps.tableHeader.self') }}
                </th>
                <th
                  class="text-center font-weight-bold py-4 gap"
                  style="width: 33.33%;"
                  :style="{
                    borderColor: darkMode ? 'white' : '#c4c4c4',
                  }"
                >
                  {{ $t('significantGaps.tableHeader.gap') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  class="text-center py-5"
                  :style="{
                    borderColor: darkMode ? 'white' : '#c4c4c4',
                  }"
                >
                  <ArrowDown v-if="d.avg.status === 'is_low'" />
                  <ArrowHigh v-if="d.avg.status === 'is_high'" />

                  <span class="body-1">
                    {{ d.avg.value.toFixed(2) }}
                  </span>
                </td>
                <td
                  class="text-center py-5"
                  :style="{
                    borderColor: darkMode ? 'white' : '#c4c4c4',
                  }"
                >
                  <ArrowDown v-if="d.self.status === 'is_low'" />
                  <ArrowHigh v-if="d.self.status === 'is_high'" />

                  <span class="body-1">
                    {{ d.self.value.toFixed(2) }}
                  </span>
                </td>
                <td
                  class="font-weight-bold text-center gap body-1"
                  :style="{
                    borderColor: darkMode ? 'white' : '#c4c4c4',
                  }"
                >
                  {{ d.gap.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
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
import ArrowDown from '../common/ArrowDown.vue';
import ArrowHigh from '../common/ArrowHigh.vue';
import HowToRead from '../common/HowToRead.vue';

export default {
  name: 'SignificantGap',

  components: {
    ArrowDown,
    ArrowHigh,
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
      default: null,
    },
  },

  data: () => ({
    selectedGroupIndex: 4,
  }),

  computed: {
    significantGapGroups() {
      const groups = [
        { index: 0, key: 'self_vs_manager', display: 'managers' },
        { index: 1, key: 'self_vs_direct_report', display: 'direct_reports' },
        { index: 2, key: 'self_vs_peer', display: 'peers' },
        { index: 3, key: 'self_vs_other', display: 'others' },
        { index: 4, key: 'self_vs_all_rater', display: 'all_respondents' },
      ];

      return groups.map((el) => {
        const name = this.$t(`relationships.${el.display}`);
        const flag = (this.report && this.report[el.key]
          && Object.entries(this.report[el.key]).length > 0);
        return {
          index: el.index, key: el.key, name, disable: !flag,
        };
      });
    },

    selectedGroupKey() {
      return this.significantGapGroups[this.selectedGroupIndex].key;
    },

    clusterName() {
      const list = {};
      let cluster = '';
      let competency = '';

      if (this.report && this.report[this.selectedGroupKey]) {
        Object.keys(this.report[this.selectedGroupKey]).forEach((el) => {
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

    orderGaps() {
      let formattedData;
      let result;
      if (this.report && this.report[this.selectedGroupKey]) {
        formattedData = Object.entries(this.report[this.selectedGroupKey]).map((el) => ({
          question: parseInt(el[0], 10),
          avg: el[1].avg,
          self: el[1].self,
          gap: el[1].avg.value - el[1].self.value,
        }));

        if (this.userPlanType === 'focused') {
          result = formattedData.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
          result = result.splice(0, 5).sort((a, b) => {
            // Order by absolute gap
            if (Math.abs(a.gap.toFixed(2)) !== Math.abs(b.gap.toFixed(2))) {
              return Math.abs(b.gap.toFixed(2)) - Math.abs(a.gap.toFixed(2));
            }
            // or by positive first then negative
            if (Math.sign(a.gap) !== Math.sign(b.gap)) {
              return Math.sign(b.gap) - Math.sign(a.gap);
            }
            // or by question number
            return a.question - b.question;
          });
        } else {
          result = formattedData.sort((a, b) => {
            // Order by absolute gap
            if (Math.abs(a.gap.toFixed(2)) !== Math.abs(b.gap.toFixed(2))) {
              return Math.abs(b.gap.toFixed(2)) - Math.abs(a.gap.toFixed(2));
            }
            // or by positive first then negative
            if (Math.sign(a.gap) !== Math.sign(b.gap)) {
              return Math.sign(b.gap) - Math.sign(a.gap);
            }
            // or by question number
            return a.question - b.question;
          });
        }
      }

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
  .significantPageTitle {
    font-size: 17px;
  }

  .content {
    font-size: 11px;
    white-space: pre-line;
  }

  .significantGapTable {
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
        background-color: rgba(196, 196, 196, 0.1);
        border-top: 2px solid #003865;
        font-size: 10px !important;
        line-height: 1.1;
        min-height: 55px !important;

        &:not(:first-child) {
          background-color: rgba(220, 220, 220, 0.1);
        }

        &.gap {
          background-color: rgba(150, 150, 150, 0.1);
        }
      }

      td {
        &:not(:first-child) {
          border-left: thin solid rgba(0, 0, 0, 0.12);
        }

        &.gap {
          background-color: rgba(196, 196, 196, 0.1);
        }
      }
    }

    &.rtl {
      tr {
        th,
        td {
          &:not(:last-child) {
            border-left: thin solid rgba(0, 0, 0, 0.12);
          }

          &:last-child {
            border-left: 0 !important;
          }
        }
      }
    }

    &.mobile {
      tr {
        th {
          border-top: 1px solid;
          font-weight: bold !important;
          font-size: 11px;
          &:not(:first-child) {
            border-left: thin solid;
          }
        }

        td {
          &:not(:first-child) {
            border-left: 1px solid;
          }
        }
      }
    }

    &.darkTable {
      tr {
        th, td {
          border-color: white !important;
        }
      }
    }
  }
</style>

<style lang="scss">
  #significantWrap {
    .v-select {
      &.lightMode {
        .v-select__selections {
          color: var(--v-primary-base);
        }
      }
    }
  }
</style>
