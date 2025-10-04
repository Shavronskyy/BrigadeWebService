const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Environment-based API URL configuration
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
  const ENVIRONMENT = process.env.REACT_APP_ENV || "development";
  const IS_DEBUG = process.env.REACT_APP_DEBUG === "true";

  console.log(`[setupProxy] Environment: ${ENVIRONMENT}`);
  console.log(`[setupProxy] API Base URL: ${API_BASE_URL}`);
  console.log(`[setupProxy] Debug mode: ${IS_DEBUG}`);

  // Only set up proxy in development mode
  if (ENVIRONMENT === "development" && API_BASE_URL) {
    console.log(`[setupProxy] Setting up proxy for development environment`);

    app.use(
      "/api",
      createProxyMiddleware({
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false, // Allow self-signed certificates in development
        ignorePath: false,
        logLevel: IS_DEBUG ? "debug" : "warn",
        onProxyReq: (proxyReq, req, res) => {
          if (IS_DEBUG) {
            console.log(
              `[Proxy] Proxying ${req.method} ${req.url} to ${proxyReq.path}`
            );
          }
        },
        onProxyRes: (proxyRes, req, res) => {
          if (IS_DEBUG) {
            console.log(
              `[Proxy] Response: ${proxyRes.statusCode} for ${req.url}`
            );
          }
        },
        onError: (err, req, res) => {
          console.error("Proxy error:", err.message);
          if (!res.headersSent) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end("Proxy error: " + err.message);
          }
        },
      })
    );
  } else {
    console.log(`[setupProxy] Production mode - no proxy configured`);
  }
};
