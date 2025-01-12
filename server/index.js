const express = require("express");
const sql = require("mssql");
const cors = require('cors');

// 環境変数を読み込む
require("dotenv").config({ path: "./00_dbinfo.env" });

// アプリケーションを作成
const app = express();
const port = 3000;

// データベース設定
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // 暗号化を無効化
  },
};

// CORS を適用（特定のオリジンを許可する場合）
const corsOptions = {
  origin: 'http://localhost:8080', // フロントエンドのURL
  methods: ['GET', 'POST'], // 必要なメソッドを許可
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// API エンドポイント
app.get("/api/getParkingData", async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query("SELECT * FROM VParkInfo");
    res.json(result.recordset);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
});


// 料金データを取得するエンドポイント
app.get("/api/getRyokin", async (req, res) => {
  const { parkcd } = req.query;

  if (!parkcd) {
    return res.status(400).send("parkcd is required");
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("parkcd", sql.NVarChar, parkcd)
      .query(`
        SELECT 
          parkcd,
          getinfodate,
          getinfotime,
          SEQ,
          maxprice_desc,
          maxprice_detail,
          normalprice_desc,
          normalprice_detail
        FROM 
          VParkinfo_ryokin
        WHERE 
          parkcd = @parkcd
        ORDER BY 
          getinfodate DESC,
          SEQ ASC;
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).send("Failed to fetch data");
  }
});

// サーバー起動
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
