// TODO find a better way to fix cycling import
import axios from 'axios';
import store from '../store';
import router from '../router';

const errorResponseInterceptor = (error) => {
  console.log('error interceptor', error);

  if (!error.response) return Promise.reject(error);

  // there is only one role on mam dashboard so 401 and 403 are treated same way:
  // logout and redirect to login page
  if (
    error.response.config.url !== 'pub/logout/' // avoid infinite loop
    && [401, 403].includes(error.response.status)
  ) {
    console.log(error.response.status);
    if (store.getters['account/isAuthenticate']) {
      axios({
        method: 'POST',
        withCredentials: true,
        headers: { Accept: 'application/json' },
        url: `${process.env.VUE_APP_CAS_API_HOST}/pub/logout/`,
      }).then((response) => {
        console.log(response);
        store.commit('account/logoutUser');
        router.push({ name: 'login' });
      }).catch((e) => {
        console.log(e);
        store.commit('account/logoutUser');
        router.push({ name: 'login' });
      });
    }
  }

  const err = error;
  err.msg = error.message || 'An error occurred.';
  // Error formatting
  if (error.response && error.response.data) {
    // General handled error
    if (error.response.data.error) {
      if (Array.isArray(error.response.data.error)) {
        [err.msg] = error.response.data.error;
      } else {
        err.msg = error.response.data.error;
      }
      if (error.response.data.key) {
        if (Array.isArray(error.response.data.key)) {
          [err.msg] = error.response.data.key;
        } else {
          err.msg = error.response.data.key;
        }
      }
    } else if (error.response.data.non_field_errors) {
      [err.msg] = err.response.data.non_field_errors;
    } else if (error.response.data.detail) {
      if (Array.isArray(error.response.data.error)) {
        [err.msg] = err.response.data.detail;
      } else {
        err.msg = err.response.data.detail;
      }
    } else if (error.response.data.information) {
      [err.msg] = error.response.data.information;
    } else if (error.response.status !== 500
      && Object.keys(err.response.data).length > 0) {
      err.field = err.response.data;
    }

    // field validation error (for form inline error message)
    if (error.response.data.field) {
      let requestFields = [];
      let filteredFields = [];
      const responseFields = Object.keys(error.response.data.field);
      if (err.response.config.data instanceof FormData) {
        // When request payload is formData, data will be empty object
        requestFields = [...(err.response.config.data).keys()];
      } else if (err.response.config.data && Object.entries(err.response.config.data).length > 0) {
        requestFields = Object.keys(JSON.parse(err.response.config.data));
      }
      if (requestFields && requestFields.length) {
        filteredFields = requestFields.filter((el) => responseFields.includes(el));
      } else {
        filteredFields = responseFields;
      }
      if (filteredFields && filteredFields.length) {
        // Request and Response fields are matched at least one
        if (typeof error.response.data.field[responseFields[0]] === 'string') {
          err.msg = error.response.data.field[responseFields[0]];
        } else if (Array.isArray(error.response.data.field[responseFields[0]])) {
          err.msg = error.response.data.field[responseFields[0]].join(', ');
        } else if (typeof error.response.data.field[responseFields[0]] === 'object') {
          const msgs = [];
          Object.keys(error.response.data.field[responseFields[0]])
            .forEach((key) => msgs.push(error.response.data.field[responseFields[0]][key]));
          err.msg = msgs.join(', ');
        }
        err.field = error.response.data.field;
      } else if (responseFields && responseFields.length) {
        // Request and Response were not matched, but Response exist.
        [err.msg] = error.response.data.field[responseFields[0]];
      } else {
        // Else
        err.msg = 'Validation error';
      }
    }

    // Already submitted
    if (error.response.status === 406) {
      err.code = 406;
    }

    if (error.response.data.key) {
      err.key = error.response.data.key;
    }
  }

  // Default error message
  if (!err.msg && !err.field) {
    err.msg = 'An error occurred. Please try again later.';
  }
  return Promise.reject(err);
};

export default errorResponseInterceptor;
