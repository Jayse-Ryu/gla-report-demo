<template>
  <div
    id="summaryChartWrap"
    class="chart"
  >
    <div class="mb-4">
      <div class="d-flex justify-space-between align-center">
        <span class="subtitle-2 font-weight-bold">
          {{ $t(`survey.pages.multiple.categories.${competency}`) }}
          ({{ $t(`survey.pages.multiple.title.${cluster}`) }})
        </span>
      </div>

      <div
        v-if="userPlanType === 'focused'"
        class="mt-3 caption"
      >
        {{ $t('howToRead.competencyOverview.pleaseNote') }}
      </div>
    </div>

    <div
      :style="{overflowX : $vuetify.breakpoint.smAndDown ? 'auto' : null}"
    >
      <div
        style="width: 100%;"
        :style="{
          minWidth: $vuetify.breakpoint.smAndDown ? '800px' : null,
          paddingBottom: $vuetify.breakpoint.smAndDown ? '15px' : null,
        }"
      >
        <highcharts
          v-if="initiated"
          :key="`summary_${competency}_${$i18n.locale}_${darkMode}`"
          class="hc-compOverview mx-n2"
          :options="chartOptions"
        />

        <!-- We need to force the direction to ltr in the table component
        to match the upper chart -->
        <v-simple-table
          class="competencyOverviewTable mt-n3"
          style="direction: ltr"
          dense
        >
          <template #default>
            <thead>
              <tr>
                <th>
                </th>
                <th
                  v-for="(group, key) in groups"
                  :key="key"
                  class="text-center font-weight-bold groupLabel px-0"
                  :class="userPlanType === 'focused' ? `focused-${group.code}` : group.code"
                >
                  {{ $t(`relationships.${group.label}`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- N -->
              <tr class="nRow">
                <td
                  class="text-end font-weight-bold pr-1 pr-3 numberRow"
                >
                  N
                </td>

                <td
                  v-for="(group, gKey) in groups"
                  :key="gKey"
                  class="font-weight-bold py-1 numberRow"
                  :style="{
                    background: userPlanType === 'focused' ? 'transparent' : null,
                  }"
                >
                  <div
                    class="ml-1"
                    :style="{
                      paddingLeft: userPlanType === 'focused' ? '48%' : '4%',
                    }"
                  >
                    {{ (summary.data && summary.data[group.code] && summary.data[group.code].N)
                      ? summary.data[group.code].N : 0 }}
                  </div>
                </td>
              </tr>

              <template v-if="!['free', 'focused'].includes(userPlanType)">
                <!-- Valid Responses -->
                <tr
                  v-for="(range, key) in ranges"
                  :key="key"
                >
                  <td
                    class="text-end CompGraphYAxis px-0 pr-1 d-flex align-center justify-end"
                  >
                    <div style="font-size: 10px;">
                      {{ $t(`survey.pages.multiple.options.${range.score}`) }}

                      <span class="font-weight-bold px-1">
                        {{ range.score }}
                      </span>
                    </div>
                  </td>

                  <td
                    v-for="(group, gKey) in groups"
                    :key="gKey"
                    class="text-left pt-1"
                  >
                    <PercentageBackground
                      :value="summary.data[group.code][range.key]
                        ? summary.data[group.code][range.key] : 0"
                      :total="summary.data[group.code].N"
                    />
                  </td>
                </tr>

                <!-- NI / NR -->
                <tr>
                  <td
                    class="text-end CompGraphYAxis px-0 pr-3 d-flex align-center justify-end"
                  >
                    <div
                      class="label"
                    >
                      {{ $t('common.no_information') }} / <br /> {{ $t('common.no_response') }}
                    </div>
                  </td>

                  <td
                    v-for="(group, gKey) in groups"
                    :key="gKey"
                    class="text-left pt-1"
                  >
                    <PercentageBackground
                      :value="summary.data[group.code]['no_info_ct']
                        && summary.data[group.code]['no_response_ct']
                        ? summary.data[group.code]['no_info_ct']
                          + summary.data[group.code]['no_response_ct'] : 0"
                      :total="summary.data[group.code].N"
                      :n-i-n-r="true"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>
  </div>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import highchartsMore from 'highcharts/highcharts-more';
import glaStructure from '@/mixins/glaStructure';
import PercentageBackground from '@/views/gla/content/common/PercentageBackground.vue';

// https://github.com/highcharts/highcharts-vue/issues/73#issuecomment-486190632
if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  exportingInit(Highcharts);
}

export default {
  name: 'CompetencyOverview',

  components: {
    highcharts: Chart,
    PercentageBackground,
  },

  mixins: [
    commonDisplay,
    glaStructure,
  ],

  props: {
    summary: {
      type: Object,
      default: null,
    },

    userPlanType: {
      type: String,
      default: 'free',
    },
  },

  data() {
    const that = this;

    return {
      initiated: false,
      mounted: false,
      ranges: [
        { score: 5, key: 'highly_satisfied_ct', label: 'Highly Satisfied' },
        { score: 4, key: 'satisfied_ct', label: 'Satisfied' },
        { score: 3, key: 'neither_ct', label: 'Neither Satisfied nor Dissatisfied' },
        { score: 2, key: 'dissatisfied_ct', label: 'Dissatisfied' },
        { score: 1, key: 'highly_dissatisfied_ct', label: 'Highly Dissatisfied' },
      ],
      chartOptions: {
        chart: {
          type: 'column',
          // scrollablePlotArea: {
          //   minWidth: 800,
          //   scrollPositionX: 1,
          // },
          backgroundColor: 'transparent',
          marginLeft: 125,
          style: { fontFamily: 'Montserrat' },
          events: {
            render() {
              Highcharts.objectEach(this.yAxis[0].ticks, (tick) => {
                if (tick.pos === 1) { // Highly Dissatisfied
                  tick.label.attr({
                    y: 145,
                  });
                }
                // if (tick.pos === 3) { // Neither
                //   tick.label.attr({
                //     y: 60,
                //   });
                // }
                // if (tick.pos === 5) { // Highly Satisfied
                //   tick.label.attr({
                //     y: 15,
                //   });
                // }
              });

              Highcharts.objectEach(this.xAxis[0].ticks, (tick) => {
                if (tick.pos >= 0) {
                  tick.label.attr({
                    y: 165,
                  });
                }
              });
            },
          },
        },

        credits: {
          enabled: false,
        },

        title: {
          text: undefined,
        },

        legend: {
          enabled: false,
        },

        exporting: {
          buttons: {
            contextButton: {
              enabled: false,
            },
          },
        },

        xAxis: {
          tickWidth: 0,
          gridLineColor: '#c1c1c1',
          gridLineWidth: 1,
          lineColor: '#c1c1c1',
          categories: [
            // Breakout groups text
          ],
          labels: {
            useHTML: true,
            formatter() {
              const dark = that.darkMode;
              switch (that.categories[this.value]) {
                case 'Self':
                  return `<div class="percentileRow ${dark ? 'dark' : null}">${that.summary.data.self?.percentile ? `${that.summary.data.self.percentile.toFixed()}%` : '0%'}</div>`;
                case 'Managers':
                  return `<div class="percentileRow ${dark ? 'dark' : null}">${that.summary.data.manager?.percentile ? `${that.summary.data.manager.percentile.toFixed()}%` : '0%'}</div>`;
                case 'Direct Reports':
                  return `<div class="percentileRow ${dark ? 'dark' : null}">${that.summary.data.direct_report?.percentile ? `${that.summary.data.direct_report.percentile.toFixed()}%` : '0%'}</div>`;
                case 'Peers':
                  return `<div class="percentileRow ${dark ? 'dark' : null}">${that.summary.data.peer?.percentile ? `${that.summary.data.peer.percentile.toFixed()}%` : '0%'}</div>`;
                case 'Others':
                  return `<div class="percentileRow ${dark ? 'dark' : null}">${that.summary.data.other?.percentile ? `${that.summary.data.other.percentile.toFixed()}%` : '0%'}</div>`;
                case 'All Respondents':
                  return `<div class="percentileRow ${dark ? 'dark' : null}">${that.summary.data.all_rater?.percentile ? `${that.summary.data.all_rater.percentile.toFixed()}%` : '0%'}</div>`;
                default:
                  return '0%';
              }
            },
            x: that.userPlanType === 'focused' ? -59 : -34,
            style: {
              fontWeight: 'bold',
              paddingTop: '4px',
            },
          },
          title: {
            useHTML: true,
            text: `<div class="percentileRowTitle">${that.$t('competencyOverview.percentileRank')}</div>`,
            textAlign: 'left',
            align: 'low',
            x: -105,
            y: -11,
            style: {
              fontSize: 12,
              fontWeight: 'bold',
              opacity: 0.8,
              color: that.darkMode ? '#ffffff' : '',
            },
          },
        },

        yAxis: {
          min: 1,
          max: 5,
          tickInterval: 1,
          title: '',
          gridLineDashStyle: 'Dash',
          gridLineColor: 'rgba(150, 150, 150, 0.5)',
          lineColor: '#c1c1c1',
          labels: {
            useHTML: false,
            style: {
              // textOverflow: 'none',
              width: 100,
            },
            formatter() {
              const dark = that.darkMode ? 'dark' : '';
              switch (this.value) {
                case 1:
                  return `<div class="d-flex align-center justify-end text-end CompGraphYAxis ${dark}">
                  <div class="label">${that.$t('survey.pages.multiple.options.1')}</div>
                  <div class="scoreBadge" dx="5">1</div>
                  </div>`;
                case 2:
                  return `<div class="d-flex align-center justify-end text-end CompGraphYAxis ${dark}">
                  <div class="label">${that.$t('survey.pages.multiple.options.2')}</div>
                  <div class="scoreBadge" dx="5">2</div>
                  </div>`;
                case 3:
                  return `<div class="d-flex align-center justify-end text-end CompGraphYAxis ${dark}" y="68">
                  <div class="label">${that.$t('survey.pages.multiple.options.3')}</div>
                  <div class="scoreBadge" dx="5">3</div>
                  </div>`;
                case 4:
                  return `<div class="d-flex align-center justify-end text-end CompGraphYAxis ${dark}">
                  <div class="label">${that.$t('survey.pages.multiple.options.4')}</div>
                  <div class="scoreBadge" dx="5">4</div>
                  </div>`;
                case 5:
                  return `<div class="d-flex align-center justify-end text-end CompGraphYAxis ${dark}">
                  <div class="label">${that.$t('survey.pages.multiple.options.5')}</div>
                  <div class="scoreBadge" dx="5">5</div>
                  </div>`;
                default:
                  return this.value;
              }
            },
          },
          plotLines: [{
            color: '#E51D7A',
            width: 2,
            value: that.summary.data.self.avg || 0,
            zIndex: 5,
          }],
        },

        plotOptions: {
          column: {
            pointPadding: 0.2,
            groupPadding: 0.05,
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              formatter() {
                return (Math.round(this.y * 100) / 100).toFixed(2);
              },
              inside: true,
              style: {
                textOutline: 'none',
              },
            },
            tooltip: {
              // Empty format needed to hide header
              headerFormat: '',
            },
          },
        },

        series: [
          {
            name: 'Respondent Group Average',
            color: '#19ACAA',
            pointWidth: that.userPlanType === 'focused' ? 90 : 45,
            data: [
              // Breakout groups avg
            ],
            animation: {
              duration: 600,
            },
          },
          {
            name: 'Norm Group Average',
            color: '#134074',
            pointWidth: that.userPlanType === 'focused' ? 90 : 45,
            data: [
              // Breakout groups Norm avg
            ],
            animation: {
              duration: 600,
            },
          },
        ],
      },
    };
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

    categories() {
      const list = ['Self'];
      if (!['free', 'focused'].includes(this.userPlanType)) {
        list.push(
          'Managers',
          'Direct Reports',
          'Peers',
          'Others',
        );
      }
      list.push('All Respondents');
      return list;
    },

    dataAvg() {
      const list = [];
      if (this.summary.data && this.groups) {
        this.groups.forEach((key) => {
          if (this.groups.some((el) => el.code === key.code)) {
            if (this.summary.data[key.code].avg) {
              const formattedAvg = Math.round(this.summary.data[key.code].avg * 100) / 100;
              list.push(formattedAvg);
            } else {
              list.push(0);
            }
          }
        });
      }
      return list;
    },

    dataNormAvg() {
      const list = [];
      if (this.summary.data && this.groups) {
        this.groups.forEach((key) => {
          if (this.groups.some((el) => el.code === key.code)) {
            if (this.summary.data[key.code].norm_avg) {
              const formattedAvg = Math.round(this.summary.data[key.code].norm_avg * 100) / 100;
              list.push(formattedAvg);
            } else {
              list.push(0);
            }
          }
        });
      }
      return list;
    },

    selfAvg() {
      let avg = 0;
      if (this.summary?.data?.self?.avg) {
        avg = this.summary.data.self.avg;
      }
      return avg;
    },
  },

  watch: {
    summary: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.chartOptions.yAxis.plotLines[0].value = this.selfAvg;
        }
      },
    },

    darkMode: {
      immediate: true,
      handler(newValue) {
        const color = {
          dark: '#4080DC',
          light: '#134074',
        };
        if (newValue) {
          this.chartOptions.series[1].color = color.dark;
        } else {
          this.chartOptions.series[1].color = color.light;
        }
      },
    },
  },

  mounted() {
    if (this.groups && this.categories && this.dataAvg && this.dataNormAvg) {
      this.initChart();
    }
  },

  methods: {
    initChart() {
      this.chartOptions.xAxis.category = this.categories;
      this.chartOptions.series[0].data = this.dataAvg;
      this.chartOptions.series[1].data = this.dataNormAvg;
      this.initiated = true;
    },
  },
};
</script>

<style lang="scss" scoped>
  .hc-compOverview {
    height: 200px;
  }

  .competencyOverviewTable {
    position: relative;

    .firstCol { // Style need to match charts, so dirty hard code for font style
      font-size: 9px;
    }

    tr {
      &:last-child {
        td {
          border-bottom: 2px solid rgba(161, 161, 161, 0.5) !important;

          &:not(:first-child) {
            background: rgba(196, 196, 196, 0.05);
          }
        }
      }

      &:not(:last-child) td:not(:first-child) {
        border-bottom: thin dashed rgba(161, 161, 161, 0.5) !important;
      }

      th {
        height: 27px !important;

        &:first-child {
          border-bottom-width: 0 !important;
        }

        &:not(:first-child) {
          border-top: 1px solid rgba(161, 161, 161, 0.5) !important;
          border-bottom: 1px solid rgba(161, 161, 161, 0.5) !important;
        }
      }

      td {
        height: 30px !important;

        &:first-child {
          border-bottom-width: 0 !important;
        }

        &:not(:first-child):not(:last-child) {
          border-right: thin solid rgba(161, 161, 161, 0.5) !important;
        }
      }

      &.nRow {
        td {
          height: 33px;

          &:not(:first-child) {
            border-bottom: thin solid rgba(161, 161, 161, 0.5) !important;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .hc-compOverview {
    .percentileRow {
      font-weight: bold;
      font-size: 11px;
      font-family: 'Montserrat', serif;
      color: #666666;

      &.dark { color: white; }
    }

    .percentileRowTitle {
      font-size: 11px;
      font-family: 'Montserrat', serif;
    }
  }

  .CompGraphYAxis {
    width: 115px;
    fill: #000000de;
    &.dark {
      color: white !important;
      fill: white !important;
    }
    .label {
      width: 100px;
      margin-right: 7px;
      font-size: 10px;
    }

    .scoreBadge {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      width: 2px;
      margin: 3px;
      line-height: 17px;
      font-weight: bold;
    }
  }

  .competencyOverviewTable {
    background-color: transparent !important;

    tbody {
      tr:hover {
        background: rgba(161, 161, 161, 0.2) !important;
      }
    }

    .numberRow {
      font-size: 10px !important;
    }

    .groupLabel {
      font-size: 10px !important;

      &.self {
        width: 16.6%;
      }

      &.focused-self {
        width: 50%;
      }

      &.manager {
        width: 16.6%;
      }

      &.direct_report {
        width: 16.6%;
      }

      &.peer {
        width: 16.6%;
      }

      &.other {
        width: 16.6%;
      }

      &.all_rater {
        width: 16.6%;
      }

      &.focused-all_rater {
        width: 50%;
      }
    }

    .score {
      height: 22px;
      /*width: 22px;*/
      line-height: 20px;
      border-radius: 50%;
      font-size: 11px;

      &.noValue {
        border: 0.7px solid #19ACAA;
      }

      &.lastRow {
        border-width: 0;
        color: #c1c1c1;
        background-color: rgba(161, 161, 161, 0.1);
      }
    }
  }
</style>
