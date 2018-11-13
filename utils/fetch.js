const axios = require('axios');
const FormData = require('form-data');
const config = require('../config');

const { baselinkerApi: api, baselinkerToken: token } = config;

module.exports = (method, parameters = {}) => new Promise((resolve, reject) => {
  const form = new FormData();
  form.append('token', token);
  form.append('method', method);
  form.append('parameters', JSON.stringify(parameters));
  axios
    .post(api, form, {
      headers: form.getHeaders(),
    })
    .then(resolve)
    .catch(reject);
});
