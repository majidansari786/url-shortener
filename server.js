const express = require("express");
const app = express();
const userRoute = require("./routers/userRoute");
const shortenRoute = require("./routers/shortnerRoute");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

const {
  client,
  httpRequestCounter,
  httpRequestDuration
} = require("./metrics");

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
      },
      duration
    );
  });

  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("URL SHORTNER API");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/url", shortenRoute);

// Static
app.use(express.static(path.join(__dirname, "public")));

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Frontend
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "login.html"));
});

// Start server
app.listen(8000, () => {
  console.log("Server running on port 8000");
});