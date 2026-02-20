const { Client } = require("pg");
const dotenv = require("dotenv");

require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "college",
  password: process.env.Db_pass,
  port: 5432,
  max: 20, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
try {
  pool
    .connect()
    .then(() => console.log("Pg connected"))
    .catch((err) => console.error(err));
} catch (err) {
  console.error(err);
}

module.exports = pool;
