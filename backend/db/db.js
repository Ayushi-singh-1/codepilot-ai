const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "codepilot",
  password: "Ayushi@135",
  port: 5432,
});

module.exports = pool;