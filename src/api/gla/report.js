import qs from 'qs';
import client from './client';
import clientSelf from './clientSelfGLA';

const setClient = (selfGla) => {
  let base = client;
  if (selfGla) { base = clientSelf; }
  return base;
};

export default {
  async getPublicStatus(id, selfGla) {
    const base = setClient(selfGla);
    const response = await base.get(`assessment/${id}/public/report/public-status/`);
    return response.data;
  },

  async getPublicReport(id, password, selfGla) {
    const base = setClient(selfGla);
    const response = await base.get(`assessment/${id}/public/report/?password=${password}`);
    return response.data;
  },

  async setPublicReportStatus(id, data, selfGla) {
    const base = setClient(selfGla);
    const response = await base.patch(`assessment/${id}/report/public-status/`, data);
    return response.data;
  },

  async currentUser(selfGla) {
    const base = setClient(selfGla);
    const response = await base.get('account/current-user/');
    return response.data;
  },

  async getReport(id, selfGla) {
    const base = setClient(selfGla);
    const response = await base.get(`assessment/${id}/report/`);
    return response.data;
  },

  async getReportAdmin(id, selfGla, params) {
    const base = setClient(selfGla);
    const response = await base.get(`mam/assessment/${id}/report/${qs.stringify(params, { addQueryPrefix: true })}`);
    return response.data;
  },

  async getSuperReport(params, selfGla) {
    const base = setClient(selfGla);
    const response = await base.get(`mam/assessment/super/report/${qs.stringify(params, { addQueryPrefix: true })}`);
    return response.data;
  },

  async generateSuperReport() {
    const response = await client.post('mam/assessment/super/report/');
    return response.data;
  },

  async generateDemographicSuperReport(data) {
    const response = await client.post('mam/assessment/super/report/demographics/', data);
    return response.data;
  },

  async getReportPdf(id, selfGla) {
    const base = setClient(selfGla);
    const response = await base.get(`assessment/${id}/report/upload-status/`);
    return response.data;
  },

  async generateReportDataMAM(uuid, data) {
    const response = await client.post(`mam/assessment/${uuid}/report/`, data);
    return response.data;
  },

  async getLanguage(selfGla) {
    const base = setClient(selfGla);
    const response = await base.get('common/language/');
    return response.data;
  },

  async getCountry() {
    const response = await client.get('common/country/');
    return response.data;
  },

  /**
   * Generate PDF file on Node.js server
   * @param {*} uuid
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
