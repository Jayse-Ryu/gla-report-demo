<template>
  <div class="chart">
    <highcharts
      id="percentileRadarChart"
      :key="`radar_${$i18n.locale}_${darkMode}_${$vuetify.breakpoint.mdAndUp}`"
      class="hc"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import commonDisplay from '@/mixins/commonDisplay';
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import highchartsMore from 'highcharts/highcharts-more';
import glaStructure from '@/mixins/glaStructure';

// https://github.com/highcharts/highcharts-vue/issues/73#issuecomment-486190632
if (typeof Highcharts === 'object') {
  highchartsMore(Highcharts);
  exportingInit(Highcharts);
}

export default {
  name: 'CompetencyPercentileRadar',

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
  },

  data() {
    const that = this;

    return {
      mounted: false,
      windowData: {
        width: window.innerWidth,
      },
      chartOptions: {
        chart: {
          polar: true,
          backgroundColor: 'transparent',
          marginTop: 100,
          marginBottom: 150,
          marginLeft: 100,
          marginRight: 100,
          animation: false,
          style: {
            fontFamily: 'Montserrat',
          },
          events: {
            load() {
              that.renderCallback(this);
            },
            redraw() {
              that.renderCallback(this, true);
            },
          },
        },

        credits: {
          enabled: false,
        },

        title: {
          text: '',
        },

        pane: {
          startAngle: 0,
          endAngle: 360,
        },

        legend: {
          margin: 60,
          itemStyle: {
            color: '#515151',
          },
        },

        exporting: {
          buttons: {
            contextButton: {
              enabled: false,
            },
          },
        },

        tooltip: {
          useHTML: true,
          backgroundColor: 'rgba(250, 250, 250, 0.9)',
          style: {
            zIndex: 50,
          },
        },

        xAxis: {
          tickInterval: 1,
          min: 0,
          max: 15,
          gridLineColor: 'rgba(150, 150, 150, 0.3)',
          labels: {
            distance: 19,
            useHTML: false,
            formatter() {
              const tVal = this.value !== 15
                ? that.$t(`survey.pages.multiple.categories.${this.value}`)
                : '';
              return `<div style="color:${that.darkMode ? 'white' : 'black'}">${tVal}</div>`;
            },
            style: {
              // border: '1px solid black', // Help debug position
              fontSize: '7px',
              fontFamily: 'Montserrat',
              whiteSpace: 'normal',
            },
          },
          gridLineDashStyle: 'Dash',
          categories: [
            'dev_tech_savvy',
            'ensure_cs',
            'maintain_ca',
            'achieving_pm',
            'anticipate_opp',
            'leading_change',
            'dev_ppl',
            'build_partner',
            'share_leadership',
            'empower_ppl',
            'think_global',
            'appreciate_diversity',
            'demonstrate_integrity',
            'encourage_cd',
            'create_sv',
          ],
        },

        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 10,
          gridLineColor: 'rgba(150, 150, 150, 0.3)',
          labels: {
            useHTML: false,
            formatter() {
              const color = that.darkMode ? 'rgba(250, 250, 250, 0.8)' : 'rgba(0, 0, 0, 0.9)';
              return `<span style="color: ${color}">${this.value}</span>`;
            },
            style: {
              zIndex: 10,
            },
          },
        },

        plotOptions: {
          series: {
            pointStart: 0,
            pointInterval: 1,
          },
          column: {
            pointPadding: 0,
            groupPadding: 0,
          },
        },

        series: [
          {
            type: 'pie',
            borderWidth: 1,
            borderColor: '#A1A1A1',
            data: [
              [1, 'assure_success'],
              [1, 'continuous_change'],
              [1, 'engaging_people'],
              [1, 'boundaryless_inclusion'],
              [1, 'communication'],
            ],
            keys: ['y', 'name', 'dataLabels'],
            dataLabels: {
              enabled: false,
            },
            colors: ['transparent'],
            zIndex: -1,
            size: '137%',
            enableMouseTracking: false,
            showInLegend: false,
            style: {
              fontFamily: 'Montserrat',
            },
          },

          {
            type: 'line',
            name: 'Self',
            // color: '#19ACAA',
            marker: {
              // lineColor: '#19ACAA',
              lineWidth: 2,
              symbol: 'circle',
            },
            tooltip: {
              headerFormat: '<!--<b>{point.key}</b><br>-->',
              useHTML: true,
              pointFormatter() {
                return `<b>
                  ${that.$t(`survey.pages.multiple.categories.${this.category}`)}
                </b><br>
                <div>
                  <span style="font-weight: 500;">
                    ${that.$t('relationships.self')}:
                  </span>
                  <b>${this.y}</b>
                </div>`;
              },
            },
          },

          {
            type: 'line',
            name: 'All Respondents',
            // color: '#134074',
            marker: {
              // lineColor: '#134074',
              lineWidth: 2,
              symbol: 'circle',
            },
            tooltip: {
              headerFormat: '<!--<b>{series.name}</b><br>-->',
              useHTML: true,
              pointFormatter() {
                return `<b>
                  ${that.$t(`survey.pages.multiple.categories.${this.category}`)}
                </b><br>
                <div>
                  <span style="font-weight: 500;">
                    ${that.$t('relationships.respondents')}:
                  </span>
                  <b>${this.y}</b>
                </div>`;
              },
            },
          },

          {
            type: 'column',
            name: 'Column',
            color: 'rgba(68, 170, 213, 0.3)',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            pointPlacement: 'on',
            enableMouseTracking: false,
            showInLegend: false,
          },
        ],
      },
    };
  },

  computed: {
    ...mapState({
      highlightedCompetency: (state) => state.interaction.highlightedCompetency,
    }),
  },

  watch: {
    '$i18n.locale': {
      immediate: true,
      handler() {
        this.chartOptions.series[1].name = this.$t('relationships.self');
        this.chartOptions.series[2].name = this.$t('relationships.all_respondents');
      },
    },

    highlightedCompetency: {
      immediate: true,
      handler(newValue) {
        const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (newValue && Object.entries(newValue).length) {
          Object.keys(newValue).forEach((key) => {
            const competency = newValue[key];
            data[competency.number - 1] = 100;
          });
          this.chartOptions.series[3].data = data;
        } else {
          this.chartOptions.series[3].data = data;
        }
      },
    },

    darkMode: {
      immediate: true,
      handler(newValue) {
        const color = {
          dark: { s1: '#7BB0FF', s2: '#9A34FF' },
          light: { s1: '#19ACAA', s2: '#134074' },
        };
        if (newValue) {
          this.chartOptions.series[1].color = color.dark.s1;
          this.chartOptions.series[1].marker.lineColor = color.dark.s1;
          this.chartOptions.series[2].color = color.dark.s2;
          this.chartOptions.series[2].marker.lineColor = color.dark.s2;
          this.chartOptions.legend.itemStyle.color = '#f4f4f4';
        } else {
          this.chartOptions.series[1].color = color.light.s1;
          this.chartOptions.series[1].marker.lineColor = color.light.s1;
          this.chartOptions.series[2].color = color.light.s2;
          this.chartOptions.series[2].marker.lineColor = color.light.s2;
          this.chartOptions.legend.itemStyle.color = '#212121';
        }
      },
    },

    windowData: {
      deep: true,
      immediate: true,
      handler(windowData) {
        const innerWidth = windowData?.width || 0;
        const breakPoint = this.$vuetify.breakpoint.name;
        if (breakPoint === 'xs') {
          this.chartOptions.xAxis.labels.style.fontSize = 0;
          this.chartOptions.legend.itemStyle.fontWeight = 'regular';
          if (innerWidth < 400) {
            // ~400
            this.chartOptions.chart.marginLeft = 18;
            this.chartOptions.chart.marginRight = 18;
            this.chartOptions.chart.marginTop = 0;
            this.chartOptions.chart.marginBottom = 15;
            this.chartOptions.legend.itemStyle.fontSize = '9px';
            this.chartOptions.series[0].size = '114%';
          } else if (innerWidth >= 400 && innerWidth < 500) {
            // 400~500
            this.chartOptions.chart.marginLeft = 32;
            this.chartOptions.chart.marginRight = 32;
            this.chartOptions.chart.marginTop = 5;
            this.chartOptions.chart.marginBottom = 45;
            this.chartOptions.legend.itemStyle.fontSize = '9px';
            this.chartOptions.series[0].size = '108%';
          } else if (innerWidth >= 500 && innerWidth < 600) {
            // 500~600
            this.chartOptions.chart.marginLeft = 55;
            this.chartOptions.chart.marginRight = 55;
            this.chartOptions.chart.marginTop = 5;
            this.chartOptions.chart.marginBottom = 40;
            this.chartOptions.legend.itemStyle.fontSize = '9px';
            this.chartOptions.series[0].size = '107%';
          } else {
            // 600~xs
            this.chartOptions.chart.marginLeft = 70;
            this.chartOptions.chart.marginRight = 70;
            this.chartOptions.chart.marginTop = 10;
            this.chartOptions.chart.marginBottom = 20;
            this.chartOptions.legend.itemStyle.fontSize = '9px';
            this.chartOptions.series[0].size = '105%';
          }
        } else if (breakPoint === 'sm') {
          this.chartOptions.chart.marginLeft = 85;
          this.chartOptions.chart.marginRight = 85;
          this.chartOptions.chart.marginTop = 20;
          this.chartOptions.chart.marginBottom = 60;
          this.chartOptions.legend.itemStyle.fontWeight = 'bold';
          this.chartOptions.legend.itemStyle.fontSize = '12px';
          this.chartOptions.xAxis.labels.style.fontSize = 0;
          this.chartOptions.series[0].size = '103%';
        } else {
          this.chartOptions.chart.marginLeft = 100;
          this.chartOptions.chart.marginRight = 100;
          this.chartOptions.chart.marginTop = 100;
          this.chartOptions.chart.marginBottom = 150;
          this.chartOptions.legend.itemStyle.fontWeight = 'bold';
          this.chartOptions.legend.itemStyle.fontSize = '12px';
          this.chartOptions.xAxis.labels.style.fontSize = '7px';
          this.chartOptions.series[0].size = '137%';
        }
      },
    },
  },

  created() {
    const selfData = [];
    const allData = [];

    this.competencies.forEach((comp) => {
      selfData.push(Math.round(this.report[comp].self.percentile));
      allData.push(Math.round(this.report[comp].all_rater.percentile));
    });

    this.chartOptions.series[1].data = selfData;
    this.chartOptions.series[2].data = allData;

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      this.windowData.width = window.innerWidth;
    },
    /**
     * Curve label
     * Reposition competency position individually
     */
    renderCallback(chart, redraw) {
      // https://stackoverflow.com/questions/51978377/how-to-curve-every-data-labels-along-the-individual-segments-in-sunburst-chart
      const that = this;
      const ren = chart.renderer;
      const { shapeArgs } = chart.series[0].points[0];
      const cx = chart.plotLeft + chart.plotWidth / 2;
      const cy = chart.plotTop + chart.plotHeight / 2;
      let r = (shapeArgs.r - shapeArgs.innerR) + 12;
      if (this.$vuetify.breakpoint.name === 'sm') {
        r -= 33;
      } else if (this.$vuetify.breakpoint.name === 'xs') {
        r -= 31;
      }

      if (redraw) {
        if (document.getElementsByName('customPath1')) {
          document.getElementsByName('customPath1').forEach((el) => {
            el.remove();
          });
          document.getElementById('customPath1').remove();
        }

        if (document.getElementById('customPath2')) {
          document.getElementById('customPath2').remove();
        }
      }

      // Add a path for a text
      ren.path()
        .attr({
          id: 'customPath1',
          d: `M ${cx} ${cy // center
          } m 0 ${-r // start at top
          } a ${r} ${r} 0 1 1 0 ${r * 2 // 1st half
          } a ${r} ${r} 1 1 1 0 ${-(r * 2)}`, // 2nd half
        }).add(ren.defs);

      // Round line
      if (this.$vuetify.breakpoint.mdAndUp) {
        const r2 = r + 25;
        ren.path()
          .attr({
            id: 'customPath2',
            stroke: '#A1A1A1',
            'stroke-width': 1,
            zIndex: 3,
            d: `M ${cx} ${cy // center
            } m 0 ${-r2 // start at top
            } a ${r2} ${r2} 0 1 1 0 ${(r2 * 2) // 1st half
            } a ${r2} ${r2} 1 1 1 0 ${-(r2 * 2)}`, // 2nd half
          }).add();
      }

      // uncomment to see the circle path
      // ren.path()
      //   .attr({
      //     stroke: 'red',
      //     'stroke-width': 2,
      //     zIndex: 3,
      //     d: `M ${cx} ${cy // center
      //     } m 0 ${-r // start at top
      //     } a ${r} ${r} 0 1 1 0 ${r * 2 // 1st half
      //     } a ${r} ${r} 1 1 1 0 ${-(r * 2)}`, // 2nd half
      //   }).add();

      chart.series[0].points.forEach((point) => {
        const dataLabelText = point.name;
        const attr = {
          zIndex: 3, // place on top of a pie
          'text-anchor': 'middle', // center text in a slice (middle angle)
          style: 'font-size:13px; font-weight:500; font-family: "Montserrat"',
        };

        // TODO some day: rotate engaging people text
        // if (dataLabelText === 'engaging_people') {
        //   attr.transform = `translate(${center[0]} ${center[1]}) rotate (180)`;
        // }

        const label = ren.text(dataLabelText).attr(attr).add();
        const offset = `${(100 * (point.angle + Math.PI / 2)) / (Math.PI * 2)}%`;
        const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        const text = document.createTextNode(
          `${that.$t(`survey.pages.multiple.title.${label.textStr}`)}`,
        );

        textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#customPath1');
        textPath.setAttribute('startOffset', offset);
        textPath.setAttribute('name', 'customPath1');
        textPath.setAttribute('style', `fill: ${this.darkMode ? 'white' : 'black'}`);
        tspan.appendChild(text);
        textPath.appendChild(tspan);

        label.element.innerHTML = '';
        label.element.appendChild(textPath);
      });

      Highcharts.objectEach(chart.xAxis[0].ticks, (tick) => {
        switch (tick.pos) {
          case 0: // developing technological savvy
            tick.label.attr({
              align: 'left',
            });
            break;
          case 14: // Creating a shared vision
            tick.label.attr({
              align: 'right',
            });
            break;
          default:
            break;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .hc {
    @media (max-width: 400px) {
      height: 450px;
    }

    @media (min-width: 401px) and (max-width: 500px) {
      height: 490px;
    }

    @media (min-width: 501px) and (max-width: 600px) {
      height: 540px;
    }

    @media (min-width: 601px) {
      height: 665px;
    }
  }
</style>
