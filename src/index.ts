// api ----------------------------------
import api from './application/api';
// schedule -----------------------------
import batch from './application/batch';

export default {
  port: 3000,
  fetch: api.fetch, // application entry point
  batch, // batch entry point
};
