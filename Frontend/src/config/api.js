// JavaScript version of api.ts for setupProxy.js
const BASE_URL = "";

const API_CONFIG = {
  BASE_URL,
  ENDPOINTS: {
    DONATIONS: "/api/Donations",
    CAMPAIGNS: "/api/Campaigns",
    REPORTS: "/api/Reports",
    VACANCIES: "/api/Vacancy",
    CONTACT: "/api/Contact",
  },
  CONTACT_EMAIL: "dima.shavronskyi@gmail.com",
};

module.exports = { API_CONFIG };
