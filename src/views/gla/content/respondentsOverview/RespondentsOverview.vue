<template>
  <MainCol style="max-width: 1000px;">
    <div
      class="body-1 font-weight-bold pb-2 mb-5"
      :class="darkMode ? null : 'primary--text'"
      :style="{
        borderBottom: $vuetify.breakpoint.smAndDown ? '1px solid' : null,
        borderColor: darkMode ? 'white' : '#003865',
      }"
    >
      {{ $t('respondentsOverview.pageTitle') }}
    </div>

    <div>
      {{ $t('respondentsOverview.descriptionTable') }}
    </div>

    <v-simple-table
      v-if="overview"
      class="RespondentsOverviewTable my-10"
      :class="{ rtl: $vuetify.rtl }"
      dense
    >
      <template #default>
        <thead>
          <tr>
            <th>
            </th>
            <th
              class="text-center categoryCol"
              :class="{mobileMode: $vuetify.breakpoint.smAndDown}"
              style="white-space: pre-line;"
            >
              {{ $t('respondentsOverview.reportN') }}
            </th>
            <th
              class="text-center categoryCol"
              :class="{mobileMode: $vuetify.breakpoint.smAndDown}"
              style="white-space: pre-line;"
            >
              {{ $t('respondentsOverview.nominatedN') }}
            </th>
            <th
              class="text-center categoryCol"
              :class="{mobileMode: $vuetify.breakpoint.smAndDown}"
              style="white-space: pre-line;"
            >
              {{ $t('respondentsOverview.responseRate') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(group, key) in groups"
            :key="key"
          >
            <td
              class="text-end font-weight-bold respondentOverviewValue"
              :class="{mobileMode: $vuetify.breakpoint.smAndDown}"
            >
              {{ group.label }}
            </td>
            <td
              class="text-center respondentOverviewValue"
              :class="{mobileMode: $vuetify.breakpoint.smAndDown}"
            >
              {{ overview[group.code] ? overview[group.code].report_n : 0 }}
            </td>
            <td
              class="text-center respondentOverviewValue"
              :class="{mobileMode: $vuetify.breakpoint.smAndDown}"
            >
              {{ overview[group.code] ? overview[group.code].nominated_n : 0 }}
            </td>
            <td
              class="text-center respondentOverviewValue"
              :class="{mobileMode: $vuetify.breakpoint.smAndDown}"
            >
              {{ overview[group.code] ? (overview[group.code].response_rate*100).toFixed(2) : 0 }}%
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div
      class="mb-10"
      style="white-space: pre-line;"
    >
      {{ $t('respondentsOverview.descriptionData') }}
    </div>
  </MainCol>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';

export default {
  name: 'SignificantGap',

  mixins: [
    commonDisplay,
  ],

  props: {
    report: {
      type: Object,
      default: null,
    },
  },

  computed: {
    overview() {
      let obj;
      if (this.report?.overview) {
        obj = this.report.overview;
      }
      return obj;
    },

    groups() {
      return [
        {
          code: 'self',
          label: this.$t('relationships.self'),
        },
        {
          code: 'manager',
          label: this.$t('relationships.managers'),
        },
        {
          code: 'direct_report',
          label: this.$t('relationships.direct_reports'),
        },
        {
          code: 'peer',
          label: this.$t('relationships.peers'),
        },
        {
          code: 'other',
          label: this.$t('relationships.others'),
        },
        {
          code: 'total',
          label: this.$t('common.total'),
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
  .pageIndex {
    .pageTitle {
      font-weight: bold;
      font-size: 17px;
    }

    .content {
      font-size: 11px;
      white-space: pre-line;
    }
  }

  .RespondentsOverviewTable {
    background: transparent;

    tbody {
      tr:hover {
        background: rgba(161, 161, 161, 0.2) !important;
      }
    }

    tr {
      th {
        height: 50px !important;
        white-space: pre;

        border-bottom: thin solid #a1a1a1 !important;
        border-top: thin solid #a1a1a1 !important;
        border-left: thin solid #a1a1a1 !important;

        &.categoryCol {
          width: 23%;
        }

        &:last-child {
          border-right: thin solid #a1a1a1 !important;
        }
      }

      td {
        border-bottom: thin solid #a1a1a1 !important;
        border-left: thin solid #a1a1a1 !important;
        height: 40px !important;

        &:last-child {
          border-right: thin solid #a1a1a1 !important;
        }
      }
    }

    &.rtl {
      th,
      td {
        &:last-child {
          border-right: 0 !important;
        }

        &:first-child {
          border-right: thin solid #a1a1a1 !important;
        }
      }
    }

    .categoryCol {
      &.mobileMode {
        font-size: 10px;
      }
    }

    .respondentOverviewValue {
      &.mobileMode {
        font-size: 11px;
      }
    }
  }
</style>
