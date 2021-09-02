<template>
  <v-footer
    id="footerWrap"
    fixed
    height="80"
    :color="darkMode ? '#002A4C' : '#EEF4F9'"
    :dark="darkMode"
    class="pr-0"
    style="z-index: 10; box-sizing: border-box; overflow-y: auto;"
    :style="{
      paddingLeft: $vuetify.breakpoint.mdAndDown ? '0' : '56px',
    }"
  >
    <MainCol
      class="justify-center px-0"
    >
      <v-row
        class="mx-0 d-flex flex-wrap"
      >
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="darkModeLocal"
            dense
            hide-details
            rounded
            outlined
            :label="$t('interactive.theme')"
            class="caption"
            :style="{
              maxWidth: $vuetify.breakpoint.smAndDown ? null : '240px',
            }"
            :items="themeList"
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <v-row class="justify-end">
            <v-col
              cols="12"
              md="4"
              class="d-flex justify-end"
            >
              <v-select
                v-if="languages.length"
                v-model="currentLanguage"
                dense
                hide-details
                rounded
                outlined
                :style="{
                  maxWidth: $vuetify.breakpoint.smAndDown ? null : '240px',
                }"
                :label="$t('common.language')"
                class="caption"
                :items="languages"
                item-text="value"
                item-value="key"
              />
            </v-col>
            <v-col
              cols="12"
              md="auto"
              class="d-flex justify-end"
              align-self="end"
            >
              <v-btn
                rounded
                outlined
                height="40"
                :max-width="'100%'"
                :color="darkMode ? null : 'primary'"
                :block="$vuetify.breakpoint.mdAndDown"
                style="text-transform: capitalize;"
                class="caption font-weight-bold"
                :small="$vuetify.breakpoint.mdAndDown"
                :loading="loadingPdf"
                @click="downloadDialog = true"
              >
                {{ $t('interactive.download_pdf') }}
              </v-btn>
            </v-col>
            <v-col
              v-if="!isPublic"
              cols="12"
              md="auto"
              class="d-flex justify-end"
            >
              <v-btn
                rounded
                outlined
                height="40"
                :max-width="'100%'"
                :color="darkMode ? null : 'primary'"
                :block="$vuetify.breakpoint.mdAndDown"
                style="text-transform: capitalize;"
                class="caption font-weight-bold"
                @click="shareDialog = true"
              >
                {{ $t('interactive.share') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </MainCol>

    <ShareDialog
      :show.sync="shareDialog"
      :self-gla="selfGla"
      :report="report"
    />

    <DownloadDialog
      v-if="$vuetify.breakpoint.mdAndUp"
      :show.sync="downloadDialog"
      :self-gla="selfGla"
      :report="report"
      :languages="languages"
      :public-password="publicPassword"
      @changeLoadingPdf="changeLoadingPdf"
    />
  </v-footer>
</template>

<script>
import commonDisplay from '@/mixins/commonDisplay';
import ShareDialog from './ShareDialog.vue';
import DownloadDialog from './DownloadDialog.vue';

export default {
  name: 'Footer',

  components: {
    ShareDialog,
    DownloadDialog,
  },

  mixins: [
    commonDisplay,
  ],

  props: {
    selfGla: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    publicPassword: {
      type: String,
      default: '',
    },

    report: {
      type: Object,
      default: null,
    },

    languages: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    shareDialog: false,
    downloadDialog: false,
    loadingPdf: false,
  }),

  methods: {
    changeLoadingPdf(newValue) {
      this.loadingPdf = newValue;
    },
  },
};
</script>

<style lang="scss">
  #footerWrap {
    .v-btn__content {
      width: 100%;
      white-space: normal;
      word-break: break-word;
    }
  }
</style>
