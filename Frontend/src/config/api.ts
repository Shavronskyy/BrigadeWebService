const BASE_URL = "";

export const API_CONFIG = {
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

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => {
  const base = API_CONFIG.BASE_URL.replace(/\/$/, ""); // прибрати кінцевий слеш
  return `${base}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

export default { API_CONFIG, getApiUrl };
