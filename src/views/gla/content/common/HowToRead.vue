<template>
  <v-dialog
    v-model="showLocal"
    max-width="900"
  >
    <template v-if="formattedSource">
      <!-- Tab header -->
      <v-tabs
        v-model="tab"
        background-color="primary"
        dark
        fixed-tabs
      >
        <v-tabs-slider />
        <v-tab
          v-for="(src, index) in formattedSource"
          :key="`source_${index}`"
        >
          <span v-if="src.no_title">
            {{ $t(`howToRead.${src.name}.subtitle`) }}
          </span>
          <span v-else>
            {{ $t(`howToRead.${src.name}.title`) }}
          </span>
        </v-tab>

        <v-spacer />

        <v-btn
          icon
          class="my-2 mx-2"
          @click="showLocal = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-tabs>

      <!-- Tab items -->
      <v-tabs-items
        v-model="tab"
      >
        <v-tab-item
          v-for="(src, index) in formattedSource"
          :key="index"
          :value="index"
        >
          <v-card v-if="src">
            <v-card-title>
              <span v-if="!src.no_title">
                {{ $t(`howToRead.${src.name}.title`) }}
              </span>
            </v-card-title>
            <v-card-text>
              <div class="subtitle-2 mb-4">
                {{ $t(`howToRead.${src.name}.subtitle`) }}
              </div>

              <template v-if="src.description === 1">
                <div class="mb-2">
                  {{ $t(`howToRead.${src.name}.description`) }}
                </div>
              </template>
              <template v-else>
                <div
                  v-for="i in src.description"
                  :key="`howToDesc_${i}`"
                  class="mb-2"
                >
                  {{ $t(`howToRead.${src.name}.description${i}`) }}
                </div>
              </template>

              <div v-if="src.note">
                {{ $t(`howToRead.${src.name}.pleaseNote`) }}
              </div>

              <div class="py-3 px-8">
                <v-img
                  :src="require(`@/assets/howToRead/${src.image}`)"
                  max-width="600"
                  min-height="400"
                  class="mx-auto"
                  contain
                />
              </div>

              <template v-if="src.point">
                <div
                  v-for="p in src.point"
                  :key="`point_${p.key}`"
                >
                  <!--toString(36).toUpperCase()-->
                  <div class="d-flex mb-4">
                    <v-avatar
                      class="mx-2 white--text"
                      color="primary"
                      size="24"
                    >
                      {{ p.text }}
                    </v-avatar>
                    <div class="content">
                      <span class="font-weight-bold">
                        {{ $t(`howToRead.${src.name}.point${p.key}Title`) }}:
                      </span>
                      <span>
                        {{ $t(`howToRead.${src.name}.point${p.key}`) }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-dialog>
</template>

<script>
import dialog from '@/mixins/dialog';

export default {
  name: 'HowToRead',

  mixins: [
    dialog,
  ],

  props: {
    option: {
      type: Array,
      default: null,
    },

    userPlanType: {
      type: String,
      default: 'free',
    },
  },

  data: () => ({
    tab: 0,
  }),

  computed: {
    formattedSource() {
      const src = [];
      const simplified = ['free', 'focused'].includes(this.userPlanType);
      const source = {
        percentileRadar: {
          image: 'PercentileRadar.jpg',
          description: 1,
          point: [
            { key: 'A', text: 'A' },
            { key: 'B', text: 'B' },
          ],
        },
        competencyOverview: {
          image: simplified ? 'CompetencyOverviewFocused.jpg' : 'CompetencyOverview.jpg',
          description: 1,
          point: simplified
            ? [
              { key: 'A', text: 'A' },
              { key: 'B', text: 'B' },
              { key: 'C', text: 'C' },
              { key: 'D', text: 'D' },
              { key: 'E', text: 'E' },
            ]
            : [
              { key: 'A', text: 'A' },
              { key: 'B', text: 'B' },
              { key: 'C', text: 'C' },
              { key: 'D', text: 'D' },
              { key: 'E', text: 'E' },
              { key: 'F', text: 'F' },
            ],
          note: simplified,
        },
        itemMatrix: {
          no_title: true,
          image: simplified ? 'ItemMatrixFocused.jpg' : 'ItemMatrix.jpg',
          description: 1,
          point: [
            { key: 'A', text: 'A' },
            { key: 'B', text: 'B' },
            { key: 'C', text: 'C' },
            { key: 'D', text: 'D' },
            { key: 'E', text: 'E' },
          ],
        },
        HighestItem: {
          image: 'HighestItems.jpg',
          description: 2,
          point: [
            { key: 'A', text: 'A' },
            { key: 'C', text: 'B' },
            { key: 'D', text: 'C' },
          ],
        },
        LowestItem: {
          image: 'LowestItems.jpg',
          description: 2,
          point: [
            { key: 'A', text: 'A' },
            { key: 'C', text: 'B' },
            { key: 'D', text: 'C' },
          ],
        },
        significantGap: {
          image: 'SignificantGaps.jpg',
          description: 2,
          point: [
            { key: 'A', text: 'A' },
            { key: 'B', text: 'B' },
            { key: 'D', text: 'C' },
          ],
        },
      };

      if (this.option && this.option.length) {
        this.option.forEach((el) => {
          if (source[el]) {
            const obj = source[el];
            obj.name = el;
            src.push(obj);
          }
        });
      }

      return src;
    },
  },

  watch: {
    showLocal(newValue) {
      if (newValue) {
        this.tab = 0;
      }
    },
  },
};
</script>
