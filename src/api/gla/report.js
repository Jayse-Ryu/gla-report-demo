// import qs from 'qs';
import client from './client';
// import clientSelf from './clientSelfGLA';
import demoReportData from './demoReportData';

// const setClient = (selfGla) => {
//   let base = client;
//   if (selfGla) { base = clientSelf; }
//   return base;
// };

export default {
  // async getPublicStatus(id, selfGla) {
  //   const base = setClient(selfGla);
  //   const response = await base.get(`assessment/${id}/public/report/public-status/`);
  //   return response.data;
  // },

  // async getPublicReport(id, password, selfGla) {
  //   const base = setClient(selfGla);
  //   const response = await base.get(`assessment/${id}/public/report/?password=${password}`);
  //   return response.data;
  // },

  // async setPublicReportStatus(id, data, selfGla) {
  //   const base = setClient(selfGla);
  //   const response = await base.patch(`assessment/${id}/report/public-status/`, data);
  //   return response.data;
  // },

  // async currentUser(selfGla) {
  //   const base = setClient(selfGla);
  //   const response = await base.get('account/current-user/');
  //   return response.data;
  // },
  async currentUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const demoUser = {
          uuid: '7e5cecd8-bf4b-436d-95e7-d1bf6055e576',
          first_name: 'Demo1',
          last_name: 'Iamdemo',
          email: 'demo1@sccoaching.com',
          profile_image: null,
          time_zone: 'Asia/Seoul',
          is_staff: false,
          is_coach: false,
          meta_data: null,
          is_cas_user: true,
          is_tos_agreed: true,
          is_superuser: false,
          services: [{
            svc_name: 'GCG Platform', service_id: 'gcg_platform', svc_frontend_url: 'http://localhost:3006', created_at: '2021-02-03T08:19:37.102778Z',
          }, {
            svc_name: 'GLA service', service_id: 'gla360', svc_frontend_url: 'http://localhost:3004', created_at: '2020-06-03T05:29:29.993000Z',
          }, {
            svc_name: 'Self GLA 360', service_id: 'sl_gla360', svc_frontend_url: 'http://localhost:3013', created_at: '2021-05-14T07:45:09.538046Z',
          }],
          contact_id: null,
          chargebee_id: null,
          cronofy_data: null,
        };
        resolve(demoUser);
      }, Math.floor(Math.random() * 10));
    });
  },

  // async getReport(id, selfGla) {
  //   const base = setClient(selfGla);
  //   const response = await base.get(`assessment/${id}/report/`);
  //   return response.data;
  // },
  async getReport() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(demoReportData);
      }, Math.floor(Math.random() * 500));
    });
  },

  // async getReportAdmin(id, selfGla, params) {
  //   const base = setClient(selfGla);
  //   const response = await base.get(`mam/assessment/${id}/report/
  //   ${qs.stringify(params, { addQueryPrefix: true })}`);
  //   return response.data;
  // },
  async getReportAdmin() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(demoReportData);
      }, Math.floor(Math.random() * 500));
    });
  },

  // async getReportPdf(id, selfGla) {
  //   const base = setClient(selfGla);
  //   const response = await base.get(`assessment/${id}/report/upload-status/`);
  //   return response.data;
  // },
  async getReportPdf() {
    return new Promise((resolve) => {
      const demoData = {
        report_s3_url: null,
        status: 'success',
        initial_status: 'success',
        has_data: true,
        updated_at: '2021-08-31T05:26:01.537198Z',
      };
      setTimeout(() => {
        resolve(demoData);
      }, Math.floor(Math.random() * 100));
    });
  },

  // async getLanguage(selfGla) {
  //   const base = setClient(selfGla);
  //   const response = await base.get('common/language/');
  //   return response.data;
  // },
  async getLanguage() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const demoData = [
          { key: 'ar', value: 'Arabic', name_local: 'Arabic' },
          { key: 'zh_CN', value: 'Chinese Simplified', name_local: 'Chinese Simplified' },
          { key: 'zh_TW', value: 'Chinese Traditional', name_local: 'Chinese Traditional' },
          { key: 'nl', value: 'Dutch', name_local: 'Dutch' },
          { key: 'en', value: 'English', name_local: 'English' },
          { key: 'fr', value: 'French', name_local: 'French' },
          { key: 'de', value: 'German', name_local: 'German' },
          { key: 'ja', value: 'Japanese', name_local: 'Japanese' },
          { key: 'lt', value: 'Lithuanian', name_local: 'Lithuanian' },
          { key: 'pl', value: 'Polish', name_local: 'Polish' },
          { key: 'pt', value: 'Portuguese', name_local: 'Portuguese' },
          { key: 'es', value: 'Spanish', name_local: 'Spanish' },
        ];
        resolve(demoData);
      }, Math.floor(Math.random() * 100));
    });
  },

  /**
   * Generate PDF file on Node.js server
   * @param {*} uuid
   * @param type
   * @param filename
   */
  async generatePDFFile(uuid, type, filename) {
    const defaultBaseURL = client.defaults.baseURL;
    try {
      client.defaults.baseURL = process.env.VUE_APP_PDF_SERVER_HOST;
      const response = await client.post(`/gla/${uuid}/export/`, { type, filename });
      return response.data;
    } catch (err) {
      console.log('error API - generatePDFFile', err);
      throw err;
    } finally {
      client.defaults.baseURL = defaultBaseURL;
    }
  },
};
