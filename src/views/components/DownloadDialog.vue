<template>
  <v-dialog
    id="downloadDialog"
    v-model="showLocal"
    max-width="700"
  >
    <v-card>
      <v-card-title class="font-weight-bold">
        {{ $t('download.title') }}
      </v-card-title>

      <v-card-text>
        <div>
          {{ $t('download.pleaseSelectLanguage') }}
        </div>

        <v-autocomplete
          v-model="selectedLanguage"
          :items="filteredLanguages"
          item-text="value"
          item-value="key"
          style="width: 300px;"
        />
      </v-card-text>

      <v-card-actions class="justify-center pb-4">
        <v-btn
          dark
          color="primary lighten-2"
          rounded
          :loading="loading"
          @click="clickDownload()"
        >
          {{ $t('download.download') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import dialog from '@/mixins/dialog';
import pdfApi from '@/api/pdf/gla';
import urlHandler from '@/mixins/urlHandler';

export default {
  name: 'DownloadDialog',

  mixins: [
    dialog,
    urlHandler,
  ],

  props: {
    selfGla: {
      type: Boolean,
      default: false,
    },

    report: {
      type: Object,
      default: null,
    },

    languages: {
      type: Array,
      default() {
        return [];
      },
    },

    publicPassword: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    loading: false,
    selectedLanguage: null,
  }),

  computed: {
    filteredLanguages() {
      // Remove RTL languages for pdf generation
      const langs = this.languages.filter((l) => l.key !== 'ar');
      return langs;
    },
  },

  watch: {
    show(show) {
      if (show) {
        if (this.mixPdfFile?.report_s3_url?.original_lang_generation) {
          this.selectedLanguage = this.mixPdfFile.report_s3_url.original_lang_generation;
        } else {
          this.selectedLanguage = 'en';
        }
      }
    },

    mixLoadingPdf: {
      immediate: true,
      handler(newValue) {
        this.$emit('changeLoadingPdf', newValue);
      },
    },
  },

  created() {
    this.getPdfUrl();
  },

  methods: {
    async clickDownload() {
      if (!this.mixPdfFile?.report_s3_url[this.selectedLanguage]) {
        await this.generatePDF();
      }

      this.downloadFile(this.mixPdfFile.report_s3_url[this.selectedLanguage]);
    },

    downloadFile(url) {
      try {
        const a = document.createElement('a');
        a.href = url;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } catch (err) {
        console.log(err);
      }
    },

    async generatePDF() {
      try {
        this.loading = true;
        const params = { lang: this.selectedLanguage };
        const response = await pdfApi.generateGLAReport(
          this.report.uuid, this.selfGla, params,
        );
        if (response?.report_s3_url) {
          this.mixPdfFile.report_s3_url = response.report_s3_url;
        }
      } catch (err) {
        console.log(err);
        if (err.msg) this.$toast.error(err.msg);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
