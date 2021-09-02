<template>
  <div id="compBanner">
    <v-row
      v-if="['page', 'drawer'].includes(mode)"
      class="mx-n3"
    >
      <v-col
        v-if="$vuetify.breakpoint.smAndDown"
        cols="12"
      >
        <div
          class="caption font-weight-medium"
          :class="darkMode ? 'white--text' : 'primary--text'"
        >
          {{ $t('interactive.selectClusterToView') }}
        </div>

        <v-select
          v-model="selectedCluster"
          :items="clusterSelectList"
          dense
          hide-details
          class="font-weight-bold text--primary body-2"
          :class="darkMode ? null : 'lightMode'"
        />
      </v-col>
      <template v-if="data">
        <v-col
          v-for="(value, cluster) in formattedData"
          :key="cluster"
          :cols="mode === 'page' ? '12' : '12'"
          :sm="mode === 'page' ? '12' : '12'"
          :md="mode === 'page' ? '4' : '12'"
          :lg="mode === 'page' ? 'auto' : '12'"
          :style="$vuetify.breakpoint.lgAndUp ? 'width: calc(100% / 5);' : null"
        >
          <div
            v-if="$vuetify.breakpoint.mdAndUp"
            class="subtitle-1 font-weight-bold"
            :class="[
              darkMode ? null : 'primary--text',
              userPlanType === 'free' ? 'text--disabled' : null,
            ]"
            style="line-height: 1rem;"
          >
            {{ $t(`survey.pages.multiple.title.${cluster}`) }}
          </div>

          <draggable
            :group="{
              name: mode === 'view' ? cluster : value,
              pull: 'clone',
              put: mode === 'view',
            }"
            class="list-group"
            :style="{
              minWidth: '100%',
              height: value && value.length ? null : '35px',
              border: value && value.length ? null : '2px dashed rgba(100, 100, 100, 0.5)',
              borderRadius: value && value.length ? null : '8px',
            }"
            :list="value"
            v-bind="dragOptions"
            :empty-insert-threshold="50"
            :sort="mode === 'view'"
            :disabled="$vuetify.breakpoint.smAndDown"
            @start="drag = true"
            @end="drag = false"
            @change="checkDragItem($event, cluster)"
          >
            <transition-group
              type="transition"
              :name="!drag ? 'flip-list' : null"
              :style="{
                display: value && value.length ? null : 'block',
                minWidth: '100%',
                minHeight: value && value.length ? null : '35px',
              }"
            >
              <div
                v-for="(item, key) in value"
                :key="`btn${cluster}${key}`"
                class="competencyDragHandle d-flex"
              >
                <v-btn
                  rounded
                  outlined
                  class="my-1 py-1 justify-start align-center"
                  height="38"
                  :color="mixColorSet[cluster]"
                  :style="{
                    paddingLeft: '6px',
                    paddingRight: '6px',
                    maxWidth: 255,
                    width: mode === 'view' ? 'calc(100% - 30px)' : '100%',
                    borderColor: darkMode ? 'white' : '#003865',
                    backgroundColor: (selectedCompetency
                      && selectedCompetency.competency === item.competency)
                      ? `${mixColorSet[cluster]}55` : null,
                  }"
                  :disabled="userPlanType === 'free'"
                  @click="clickCompetency(item, $event)"
                >
                  <div style="width: 24px; height: 24px;">
                    <CircleColor
                      :value="item.number"
                      :color="userPlanType !== 'free' && (typeof selectedQuadrant !== 'number'
                        || formattedHighlight.includes(item.competency))
                        ? mixColorSet[cluster] : '#c1c1c1'"
                      :size="24"
                      font-size="9px"
                    />
                  </div>
                  <div
                    class="px-2 text-left"
                    :class="formattedHighlight.includes(item.competency)
                      ? 'font-weight-bold' : 'font-weight-regular'"
                    style="font-size: 10px;"
                    :style="{
                      color: darkMode ? 'white' : 'black',
                    }"
                  >
                    {{ $t(`survey.pages.multiple.categories.${item.competency}`) }}
                  </div>
                </v-btn>

                <v-btn
                  v-if="mode === 'view'"
                  icon
                  @click="removeFromView(cluster, item.competency)"
                >
                  x
                </v-btn>
              </div>
            </transition-group>
          </draggable>
        </v-col>
      </template>
    </v-row>

    <v-row v-else>
      <draggable
        style="position: relative;"
        handle=".handle"
        :group="{
          name: mode === 'view' ? 'cluster' : 'value',
          pull: 'clone',
          put: mode === 'view',
        }"
        class="list-group"
        :style="{
          minWidth: '100%',
          height: viewData && viewData.length ? null : '35px',
          paddingTop: viewData && viewData.length ? null : '58px',
        }"
        :list="viewData"
        v-bind="dragOptions"
        :empty-insert-threshold="50"
        :sort="mode === 'view'"
        @start="drag = true"
        @end="drag = false"
        @change="checkDragItem($event)"
      >
        <template v-if="viewData && viewData.length">
          <v-col
            v-for="(comp, index) in viewData"
            :key="`view_${index}`"
            class="py-1"
          >
            <div
              class="caption font-weight-bold"
              :class="darkMode ? null : 'primary--text'"
            >
              {{ $t(`competencyBrief.${comp.brief_group}`) }}
            </div>
            <div
              :key="`btn${index}`"
              class="competencyDragHandle d-flex"
            >
              <v-btn
                rounded
                outlined
                class="my-1 pa-1 justify-start"
                :color="mixColorSet[comp.cluster]"
                :style="{
                  width: mode === 'view' ? 'calc(100% - 60px)' : '100%',
                  borderColor: darkMode ? 'white' : '#003865',
                  backgroundColor: (selectedCompetency
                    && selectedCompetency.competency === comp.competency)
                    ? `${mixColorSet[comp.cluster]}55` : null,
                }"
                @click="clickCompetency(comp)"
              >
                <CircleColor
                  :value="comp.number"
                  :color="(typeof selectedQuadrant !== 'number'
                    || formattedHighlight.includes(comp.competency))
                    ? mixColorSet[comp.cluster] : '#c1c1c1'"
                  :size="20"
                  font-size="9px"
                />
                <div
                  class="px-2"
                  :class="formattedHighlight.includes(comp.competency)
                    ? 'font-weight-bold' : 'font-weight-regular'"
                  style="font-size: 8px;"
                  :style="{
                    color: darkMode ? 'white' : 'black',
                  }"
                >
                  {{ $t(`survey.pages.multiple.categories.${comp.competency}`) }}
                </div>
              </v-btn>

              <div class="d-flex flex-nowrap justify-space-between align-center">
                <v-icon
                  class="handle px-2 mr-3"
                  style="cursor: ns-resize;"
                  size="20"
                >
                  mdi-drag-horizontal-variant
                </v-icon>

                <v-btn
                  v-if="mode === 'view'"
                  icon
                  small
                  width="26"
                  height="26"
                  @click="removeFromView(comp)"
                >
                  <v-icon small>
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </template>

        <!-- Dummy skeleton -->
        <div
          v-else
          class="text--disabled px-3 pt-2 subtitle-2"
          style="position: absolute; top: 0;"
        >
          <i>
            {{ $t('common.dragAndDropDesc') }}
          </i>
          <div
            v-for="i in 2"
            :key="`dummyComp_${i}`"
            class="my-3 py-1 px-1 d-flex align-center"
            style="width: 100%; height: 37px; border: 2px dashed #a1a1a1; border-radius: 24px;"
          >
            <div
              class="mr-2"
              style="width: 24px; height: 24px; border: 2px dashed #a1a1a1; border-radius: 100%;"
            ></div>
            <span class="caption">
              {{ $t('common.competency') }} {{ i }}
            </span>
          </div>
        </div>
      </draggable>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import commonDisplay from '@/mixins/commonDisplay';
import glaStructure from '@/mixins/glaStructure';
import CircleColor from '@/views/gla/content/common/CircleColor.vue';
import draggable from 'vuedraggable';

export default {
  name: 'CompetencyBanners',

  components: {
    CircleColor,
    draggable,
  },

  mixins: [
    commonDisplay,
    glaStructure,
  ],

  props: {
    // page, drawer, view
    mode: {
      type: String,
      default: 'page',
    },

    report: {
      type: Object,
      default: null,
    },

    data: {
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

  data: () => ({
    drag: false,
    selectedCluster: 'assure_success',
  }),

  computed: {
    ...mapState({
      selectedQuadrant: (state) => state.interaction.selectedQuadrant,
      highlightedCompetency: (state) => state.interaction.highlightedCompetency,
      selectedCompetency: (state) => state.interaction.selectedCompetency,
      savedToView: (state) => state.interaction.savedToView,
    }),

    clusterSelectList() {
      return this.clusters
        .map((el) => ({ text: this.$t(`survey.pages.multiple.title.${el}`), value: el }))
        .filter((el) => el.value !== 'verbatim');
    },

    formattedData() {
      let result = this.data;
      if (this.$vuetify.breakpoint.smAndDown) {
        result = {};
        const target = Object.keys(this.data).find((el) => el === this.selectedCluster);
        result[this.selectedCluster] = [...this.data[target]];
      }
      return result;
    },

    dragOptions() {
      const option = {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
      if (this.mode === 'view') {
        option.ghostClass = null;
      }
      return option;
    },

    savedToViewLocal: {
      get() { return this.savedToView; },
      set(newValue) {
        this.setSavedToView(newValue);
      },
    },

    formattedHighlight() {
      const arr = [];
      if (typeof this.selectedQuadrant === 'number' && this.highlightedCompetency) {
        Object.keys(this.highlightedCompetency).forEach((key) => {
          arr.push(key);
        });
      }
      return arr;
    },

    viewData() {
      const keyName = {
        blind_spot: 'blindSpots',
        strengths: 'strength',
        unknown: 'unknown',
        hidden_strengths: 'hiddenStrength',
      };
      let result = [];
      if (this.mode === 'view' && this.report?.competency_brief) {
        result = this.savedToViewLocal.map((el) => {
          const formattedItem = {
            ...el,
            cluster: null,
            brief_group: null,
          };
          Object.keys(this.report.competency_brief).forEach((key) => {
            this.report.competency_brief[key].forEach((comp) => {
              if (comp.competency === el.competency) {
                formattedItem.cluster = comp.cluster;
                formattedItem.brief_group = keyName[key];
              }
            });
          });
          return formattedItem;
        });
      }
      return result;
    },
  },

  methods: {
    ...mapMutations('interaction', [
      'setSelectedQuadrant',
      'setSelectedCompetency',
      'setSavedToView',
    ]),

    clickCompetency(item, event) {
      if (this.selectedCompetency
        && this.selectedCompetency.competency === item.competency) {
        this.setSelectedCompetency(null);
      } else {
        if (typeof selectedQuadrant === 'number'
          || !this.formattedHighlight.includes(item.competency)) {
          this.setSelectedQuadrant(null);
        }
        this.setSelectedCompetency(item);

        if (this.mode === 'drawer') {
          if (this.$route.path.includes('public/')
            && !['publicGlaOverview', 'publicSlaOverview'].includes(this.$route.name)) {
            const prefix = this.selfGla ? 'Sla' : 'Gla';
            this.$router.push({ name: `public${prefix}Overview` });
            this.mixScrollToItem('#competencyOverview', true);
          } else if (!this.$route.path.includes('public/')
            && !['glaOverview', 'slaOverview'].includes(this.$route.name)) {
            const prefix = this.selfGla ? 'sla' : 'gla';
            this.$router.push({ name: `${prefix}Overview` });
            this.mixScrollToItem('#competencyOverview', true);
          }
        }
      }

      if (this.$vuetify.breakpoint.smAndDown) {
        event.currentTarget.blur();
      }
    },

    checkDragItem(e) {
      const formatData = [...this.viewData];
      /**
      * Since drag library changed the item immediately,
      * some handling needed
      * */
      Object.keys(e).forEach((key) => {
        if (['added', 'moved'].includes(key)) {
          const matched = formatData.filter((el) => el.competency === e[key].element.competency);
          if (matched && matched.length > 1) {
            [...Array(matched.length - 1).keys()].forEach(() => {
              const index = formatData
                .findIndex((el) => el.competency === e[key].element.competency);
              if (index !== -1) {
                formatData.splice(index, 1);
              }
            });
          }
        }
      });
      this.setSavedToView(formatData);
    },

    removeFromView(competency) {
      const formatData = [...this.viewData];
      const index = formatData.findIndex((el) => el.competency === competency.competency);
      if (index !== -1) { formatData.splice(index, 1); }
      this.setSavedToView(formatData);
    },
  },
};
</script>

<style lang="scss">
  #compBanner {
    .v-btn {
      height: unset;

      .v-btn__content {
        width: 100%;
        white-space: normal;
        word-break: break-word;
      }
    }

    .v-select {
      &.lightMode {
        .v-select__selections {
          color: var(--v-primary-base);
        }
      }
    }
  }
</style>
