const pool = require("./db/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Database Connected!");
    console.log(res.rows);
  }

  pool.end();
});