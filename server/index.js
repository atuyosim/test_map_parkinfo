const express = require("express");
const sql = require("mssql");
require("dotenv").config({ path: "./00_dbinfo.env" });

const app = express();
const port = 3000;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
 options: {
    encrypt: false, // 暗号化を無効化
  },
};

app.get("/api/getParkingData", async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query("SELECT * FROM VParkInfo");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database query failed");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
