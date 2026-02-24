const express = require("express");
const app = express();
const userRoute = require("./routers/userRoute");
const shortenRoute = require("./routers/shortnerRoute");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const apiLimiter = require("./middleware/rate-limit");
const fs = require("fs");
const path = require("path");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(apiLimiter);

const startServer = async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("URL SHORTNER API");
  });

  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/url", shortenRoute);

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

app.use(express.static(path.join(__dirname, "public")));

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "login.html"));
});

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
