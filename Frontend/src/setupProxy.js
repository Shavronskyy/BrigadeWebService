const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Environment-based API URL configuration
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
  const ENVIRONMENT = process.env.REACT_APP_ENV || "development";
  const IS_DEBUG = process.env.REACT_APP_DEBUG === "true";

  // Only set up proxy in development mode
  if (ENVIRONMENT === "development" && API_BASE_URL) {
    app.use(
      "/api",
      createProxyMiddleware({
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false, // Allow self-signed certificates in development
        ignorePath: false,
        logLevel: IS_DEBUG ? "debug" : "warn",
        onError: (err, req, res) => {
          if (!res.headersSent) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end("Proxy error: " + err.message);
          }
        },
      })
    );
  }
};
