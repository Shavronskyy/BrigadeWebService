// Environment-based configuration
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || "10000");
const IS_DEBUG = process.env.REACT_APP_DEBUG === "true";
const ENVIRONMENT = process.env.REACT_APP_ENV || "development";

export const API_CONFIG = {
  BASE_URL,
  API_TIMEOUT,
  IS_DEBUG,
  ENVIRONMENT,
  ENDPOINTS: {
    AUTH: "/api/Auth",
    DONATIONS: "/api/Donations",
    CAMPAIGNS: "/api/Campaigns",
    REPORTS: "/api/Reports",
    VACANCIES: "/api/Vacancy",
    CONTACT: "/api/Contact",
  },
  CONTACT_EMAIL: "dima.shavronskyi@gmail.com",
};

// Log configuration for debugging
if (IS_DEBUG) {
  console.log("[API Config] Environment:", ENVIRONMENT);
  console.log("[API Config] Base URL:", BASE_URL);
  console.log("[API Config] Timeout:", API_TIMEOUT);
}

export const getApiUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS) => {
  const base = API_CONFIG.BASE_URL.replace(/\/$/, ""); // прибрати кінцевий слеш
  return `${base}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

const apiExports = { API_CONFIG, getApiUrl };
export default apiExports;
