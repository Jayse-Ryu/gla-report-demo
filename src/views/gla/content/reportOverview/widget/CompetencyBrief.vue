<template>
  <div class="chart">
    <!-- Brief Cards -->
    <v-item-group v-model="selectedQuadrantLocal">
      <!-- Quadrant not realign by language -->
      <v-row
        align="stretch"
        style="direction: ltr !important;"
      >
        <v-col
          v-for="(cat, index) in category"
          :key="`cat${index}`"
          cols="12"
          sm="6"
        >
          <v-item v-slot="{ active, toggle }">
            <v-card
              class="fill-height"
              outlined
              :style="{ borderColor: active ? null : '#749FC2' }"
              :color="active
                ? (darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(116, 159, 194, 0.2)')
                : (darkMode ? 'rgba(50, 50, 50, 0.1)' : null)"
              :ripple="false"
              @click="[toggle(), toggleCapture($event)]"
            >
              <v-card-title
                class="subtitle-1 font-weight-bold pb-2"
                :class="[
                  darkMode ? null : 'primary--text',
                  $vuetify.breakpoint.smAndDown ? 'pt-2' : null,
                ]"
              >
                {{ $t(`competencyBrief.${cat.name}`) }}
              </v-card-title>
              <v-card-text
                :class="$vuetify.breakpoint.smAndDown ? 'pb-2' : null"
              >
                <div v-if="formattedData[cat.key].length > 0">
                  <div
                    v-for="(item, key) in formattedData[cat.key]"
                    :key="key"
                    class="my-2"
                  >
                    <div class="d-flex align-start">
                      <div class="mr-2">
                        <CircleColor
                          :value="item.number"
                          :color="mixColorSet[item.cluster]"
                          :export-fit="[25, 25]"
                        />
                      </div>
                      <div>
                        <div
                          class="text-capitalize"
                          :class="darkMode ? 'white--text' : 'primary--text'"
                          style="font-size: 0.6rem; line-height: 0.6rem;"
                        >
                          {{ $t(`survey.pages.multiple.title.${item.cluster}`) }}
                        </div>
                        <span
                          class="body-2"
                          :class="darkMode ? 'white--text' : 'black--text'"
                          style="font-weight: 500;"
                        >
                          {{ $t(`survey.pages.multiple.categories.${item.competency}`) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="caption"
                >
                  <i>{{ $t('common.noDataDisplay') }}</i>
                </div>
              </v-card-text>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>

    <!-- Brief Description -->
    <div
      v-if="$vuetify.breakpoint.mdAndUp"
      class="mt-3"
      style="min-height: 100px;"
    >
      <v-row
        v-if="selectedQuadrantData"
      >
        <v-col
          cols="12"
          sm="4"
        >
          <div
            class="caption font-weight-bold"
            :class="darkMode ? null : 'primary--text'"
          >
            {{ $t(`competencyBrief.${selectedQuadrantData.name}`) }}
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="8"
        >
          <div
            class="caption"
            :class="darkMode ? null : 'primary--text'"
          >
            {{ $t(`competencyBrief.${selectedQuadrantData.name}Description`) }}
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import commonDisplay from '@/mixins/commonDisplay';
import glaStructure from '@/mixins/glaStructure';
import CircleColor from '../../common/CircleColor.vue';

export default {
  name: 'CompetencyBrief',

  components: {
    CircleColor,
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
    return {
      mounted: false,
      category: [
        { key: 'blind_spot', name: 'blindSpots' },
        { key: 'strengths', name: 'strength' },
        { key: 'unknown', name: 'unknown' },
        { key: 'hidden_strengths', name: 'hiddenStrength' },
      ],
    };
  },

  computed: {
    ...mapState({
      selectedQuadrant: (state) => state.interaction.selectedQuadrant,
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

    formattedData() {
      const data = {};

      if (this.report?.competency_brief) {
        this.category.forEach((category) => {
          data[category.key] = this.report.competency_brief[category.key]
            .slice().reverse().slice(0, 3).sort((a, b) => a.number - b.number);
        });
      }

      return data;
    },

    selectedQuadrantData() {
      let data;
      if (typeof this.selectedQuadrantLocal === 'number') {
        data = this.category[this.selectedQuadrantLocal];
      }
      return data;
    },
  },

  methods: {
    ...mapMutations('interaction', [
      'setSelectedQuadrant',
    ]),

    ...mapActions('interaction', [
      'highlightedCompetencies',
    ]),

    toggleCapture(e) {
      if (this.$vuetify.breakpoint.smAndDown) {
        e.currentTarget.blur();
      }
    },
  },
};
</script>
