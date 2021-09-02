<template>
  <div id="mapChart">
    <v-row
      :class="$vuetify.breakpoint.mdAndUp ? 'mx-n1' : 'mx-0'"
    >
      <v-col
        cols="12"
        md="10"
        class="px-0"
      >
        <div class="mx-n2">
          <highcharts
            :key="`map_${$i18n.locale}_${darkMode}_${$vuetify.breakpoint.smAndDown}`"
            class="hc mx-n1"
            :class="$vuetify.breakpoint.name"
            :options="chartOptions"
            style="width: 100%;"
          />
        </div>
      </v-col>

      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="2"
        class="pr-0"
      >
        <v-item-group v-model="selectedQuadrantLocal">
          <!-- Quadrant not realign by language -->
          <v-row
            class="mt-2 mx-0"
            style="direction: ltr !important;"
          >
            <v-col
              v-for="i in 4"
              :key="i"
              cols="6"
              class="pa-1"
            >
              <v-item v-slot="{ active, toggle }">
                <v-btn
                  class="pa-0 elevation-0"
                  block
                  :style="{ borderColor: active ? null : '#749FC2' }"
                  :color="active
                    ? (darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(116, 159, 194, 0.3)')
                    : (darkMode ? 'rgba(255, 255, 255, 0.1)' : null)"
                  @click="toggle"
                />
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import highchartsMore from 'highcharts/highcharts-more';
import commonDisplay from '@/mixins/commonDisplay';
import glaStructure from '@/mixins/glaStructure';

// https://github.com/highcharts/highcharts-vue/issues/73#issuecomment-486190632
if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  exportingInit(Highcharts);
}

export default {
  name: 'MapChart',

  components: {
    highcharts: Chart,
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

    data: {
      type: Object,
      default: null,
    },
  },

  data() {
    const that = this;

    return {
      chartOptions: {
        chart: {
          type: 'scatter',
          backgroundColor: 'transparent',
          events: {
            load() {
              that.renderCallback(this);
            },
            redraw() {
              that.renderCallback(this, true);
            },
          },
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        exporting: {
          buttons: {
            contextButton: {
              enabled: false,
            },
          },
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          title: {
            useHTML: true,
            text: that.$t('competencyMap.selfRank'),
            style: {
              fontSize: '9pt',
              color: that.darkMode ? '#ffffff' : '',
            },
          },
          labels: {
            useHTML: true,
            style: {
              fontSize: '8pt',
              color: that.darkMode ? '#ffffff' : '',
            },
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true,
          min: -1,
          max: 101,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dot',
          tickPositions: [0, 30, 70, 100],
          plotLines: [
            {
              color: '#C4C4C4',
              width: 1,
              value: 50,
            },
            {
              color: '#C4C4C4',
              width: 1,
              value: 100,
            },
          ],
        },
        yAxis: {
          title: {
            useHTML: true,
            text: that.$t('competencyMap.respondentRank'),
            style: {
              fontSize: '9pt',
              color: that.darkMode ? '#ffffff' : '',
            },
          },
          labels: {
            useHTML: true,
            style: {
              fontSize: '8pt',
              color: that.darkMode ? '#ffffff' : '',
            },
            x: -5,
          },
          lineWidth: 1,
          min: -1,
          max: 101,
          gridLineDashStyle: 'Dot',
          tickPositions: [0, 30, 70, 100],
          plotLines: [
            {
              color: '#C4C4C4',
              width: 1,
              value: 50,
            },
            {
              color: '#C4C4C4',
              width: 1,
              value: 100,
            },
            // Label
            {
              width: 0,
              value: 100,
              label: {
                formatter() {
                  const dark = that.darkMode ? 'dark' : '';
                  return `<div class="label ${dark}">${that.$t('competencyBrief.blindSpots')}</div>`;
                },
                y: 20,
                style: {
                  color: '#5E5E5E',
                  fontSize: '9pt',
                },
              },
            },
            {
              width: 0,
              value: 100,
              label: {
                formatter() {
                  const dark = that.darkMode ? 'dark' : '';
                  return `<div class="label ${dark}">${that.$t('competencyBrief.strength')}</div>`;
                },
                align: 'right',
                y: 20,
                x: -15,
                style: {
                  color: '#5E5E5E',
                  fontSize: '9pt',
                },
              },
            },
            {
              width: 0,
              value: 0,
              label: {
                formatter() {
                  const dark = that.darkMode ? 'dark' : '';
                  return `<div class="label ${dark}">${that.$t('competencyBrief.unknown')}</div>`;
                },
                y: -10,
                style: {
                  color: '#5E5E5E',
                  fontSize: '9pt',
                },
              },
            },
            {
              width: 0,
              value: 0,
              label: {
                formatter() {
                  const dark = that.darkMode ? 'dark' : '';
                  return `<div class="label ${dark}">${that.$t('competencyBrief.hiddenStrength')}</div>`;
                },
                align: 'right',
                x: -15,
                y: -10,
                style: {
                  color: '#5E5E5E',
                  fontSize: '9pt',
                },
              },
            },
          ],
        },
        plotOptions: {
          series: {
            dataLabels: {
              allowOverlap: false,
            },
          },
          scatter: {
            marker: {
              radius: 11,
              symbol: 'circle',
              lineWidth: 1,
            },
            tooltip: {
              // Empty format needed to hide header
              headerFormat: '<!--<b>{series.name}</b><br>-->',
              pointFormatter() {
                return `<b>${that.$t(`survey.pages.multiple.categories.${this.key}`)}</b><br/>${that.$t('relationships.self')}: ${Math.round(this.x)}<br/>${that.$t('relationships.all_respondents')}: ${Math.round(this.y)}`;
              },
            },
            dataLabels: {
              enabled: true,
              crop: false,
              overflow: 'allow',
              align: 'center',
              verticalAlign: 'middle',
              format: '{point.labelText}',
              style: {
                fontSize: '10px',
                textOutline: 'none',
                color: 'white',
              },
            },
          },
        },

        // Init series must needed for redraw
        series: [],
      },
    };
  },

  computed: {
    ...mapState({
      selectedQuadrant: (state) => state.interaction.selectedQuadrant,
      highlightedCompetency: (state) => state.interaction.highlightedCompetency,
      selectedCompetency: (state) => state.interaction.selectedCompetency,
    }),

    selectedQuadrantLocal: {
      get() {
        return this.selectedQuadrant;
      },
      set(newValue) {
        this.setSelectedQuadrant(newValue);
        this.highlightedCompetencies(this.report.competency_map);
      },
    },
  },

  watch: {
    '$i18n.locale': {
      immediate: true,
      handler() {
        this.chartOptions.xAxis.title.text = this.$t('competencyMap.selfRank');
        this.chartOptions.yAxis.title.text = this.$t('competencyMap.respondentRank');
      },
    },

    data: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue) {
          this.implementSeries();
        }
      },
    },

    selectedQuadrant: {
      immediate: true,
      handler() {
        this.implementSeries();
      },
    },

    selectedCompetency: {
      immediate: true,
      handler() {
        this.implementSeries();
      },
    },

    darkMode: {
      immediate: true,
      handler() {
        this.implementSeries();
      },
    },

    '$vuetify.breakpoint.name': {
      immediate: true,
      handler(newValue) {
        if (['xs', 'sm'].includes(newValue)) {
          this.chartOptions.xAxis.labels.style.fontSize = '7pt';
          this.chartOptions.yAxis.labels.style.fontSize = '7pt';
        } else {
          this.chartOptions.xAxis.labels.style.fontSize = '8pt';
          this.chartOptions.yAxis.labels.style.fontSize = '8pt';
        }
      },
    },
  },

  methods: {
    ...mapMutations('interaction', [
      'setSelectedQuadrant',
    ]),

    ...mapActions('interaction', [
      'highlightedCompetencies',
    ]),

    implementSeries() {
      const series = [];
      // Make it redraw
      if (this.chartOptions?.series[0]?.data) {
        this.chartOptions.series[0].data = [];
      }
      let highlighted = [];
      if (typeof this.selectedQuadrant === 'number') {
        highlighted = Object.keys(this.highlightedCompetency).map((key) => key);
      }
      [
        'assure_success',
        'continuous_change',
        'engaging_people',
        'boundaryless_inclusion',
        'communication',
      ].forEach((cluster, clusterIndex) => {
        series.push({
          name: this.$t(`survey.pages.multiple.title.${cluster}`),
          color: this.mixColorSet[cluster],
          overflow: 'allow',
          data: this.data[cluster].map((el, index) => {
            let colorOption = this.darkMode ? '#a0a0a0' : '#c1c1c1';
            let dept = 1;
            // Colored highlighted comps or a selected.
            if ((!this.selectedCompetency
              && (typeof this.selectedQuadrant !== 'number'
              || highlighted.includes(el.competency)))
              || (this.selectedCompetency
                && this.selectedCompetency.competency === el.competency)) {
              // Null mean follow cluster color
              colorOption = null;
              dept = 2;
            }
            return {
              name: this.$t(`survey.pages.multiple.categories.${el.competency}`),
              key: el.competency,
              x: el.self,
              y: el.all_rater,
              color: colorOption,
              labelText: el.number,
              labelrank: (clusterIndex * 10) + index,
              zIndex: dept,
            };
          }),
        });
      });

      this.chartOptions.series = series;
    },

    renderCallback(chart, redraw) {
      const that = this;
      const ren = chart.renderer;
      const width = chart.plotBox.width / 2.0;
      const height = chart.plotBox.height / 2.0 + 1;

      if (redraw && document.getElementById('customQuadrant')) {
        document.getElementById('customQuadrant').remove();
      }
      /**
       * Quadrant index position is
       * 0 1
       * 2 3
      * */
      const addRect = ((position) => {
        ren.rect(...position, 1)
          .attr({
            id: 'customQuadrant',
            fill: 'rgba(68, 170, 213, 0.3)',
            zIndex: 0,
          })
          .add();
      });
      switch (that.selectedQuadrant) {
        case 0:
          addRect([chart.plotBox.x, chart.plotBox.y, width, height]);
          break;
        case 1:
          addRect([chart.plotBox.x + width, chart.plotBox.y, width, height]);
          break;
        case 2:
          addRect([chart.plotBox.x, chart.plotBox.y + height, width, height]);
          break;
        case 3:
          addRect([chart.plotBox.x + width, chart.plotBox.y + height, width, height]);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  #mapChart {
    .hc {
      width: 100%;
      height: 450px;
      padding-right: 0;
      overflow: visible !important;
      &.sm {
        height: 380px;
      }
      &.xs {
        height: 300px;
      }
    }
  }
</style>

<style lang="scss">
  #mapChart {
    // To not cut 0% or 100% label
    .highcharts-container {
      overflow: visible !important;
      .highcharts-root {
        overflow: visible !important;
      }
    }

    .label {
      &.dark {
        fill: white !important;
      }
    }
  }
</style>
