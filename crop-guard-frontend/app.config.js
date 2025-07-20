// app.config.js
export default {
  extra: {
    MODE: process.env.MODE,
    DEV_BASE_URL: process.env.DEV_BASE_URL,
    PROD_BASE_URL: process.env.PROD_BASE_URL,
  },
};
