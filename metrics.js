// metrics.js
const client = require("prom-client");

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Request duration",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

const shortenCounter = new client.Counter({
  name: "url_shorten_total",
  help: "URLs shortened",
});

const redirectCounter = new client.Counter({
  name: "url_redirect_total",
  help: "Redirects",
});

module.exports = {
  client,
  httpRequestCounter,
  httpRequestDuration,
  shortenCounter,
  redirectCounter,
};