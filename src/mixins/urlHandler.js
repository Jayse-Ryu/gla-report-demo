import glaApi from '@/api/gla/report';

export default {
  data: () => ({
    mixLoadingPdf: false,
    mixPdfFile: null,
  }),

  methods: {
    updateReportUrl(data) {
      this.$emit('update_report_url', data);
    },

    async getPdfUrl() {
      try {
        this.mixLoadingPdf = true;
        const data = await glaApi.getReportPdf(this.$route.params.id, this.selfGla);
        this.mixPdfFile = data;
        if (data.status === 'report_generating') {
          setTimeout(() => {
            this.getPdfUrl();
          }, 10000);
        } else {
          this.mixLoadingPdf = false;

          if (data.status === 'success') {
            this.updateReportUrl(data.report_s3_url);
          }
        }
      } catch (err) {
        console.log('error while fetching PDF file');
      }
    },
  },
};
