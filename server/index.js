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
    let result = await pool.request().query(`
      SELECT 
      [company]
      ,[companyname]
      ,[parkcd]
      ,[取得日]
      ,[取得日時]
      ,[県名]
      ,[市町村名]
      ,[駐車場名]
      ,[URL]
      ,[緯度]
      ,[経度]
      ,[住所]
      ,[台数等]
      ,[車両制限]
      ,[入出庫可能時間]
      ,[駐車場写真のURL]
      ,[料金ファイル]
      ,[登録日時]
      ,[ryokin]
      ,[ryokin_changed]
       FROM VParkInfo`);
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

  console.log('getRyokin parckd = ' + parkcd);

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("parkcd", sql.NVarChar, parkcd)
      .query(`
     SELECT  
       [parkcd]
      ,[getinfodate]
      ,[parkname]
      ,[url]
      ,[taisyoname1]
      ,[maxprice_desc1]
      ,[maxprice_detail1]
      ,[normalprice_desc1]
      ,[normalprice_detail1]
      ,[taisyoname2]
      ,[maxprice_desc2]
      ,[maxprice_detail2]
      ,[normalprice_desc2]
      ,[normalprice_detail2]
      ,[taisyoname3]
      ,[maxprice_desc3]
      ,[maxprice_detail3]
      ,[normalprice_desc3]
      ,[normalprice_detail3]
      ,[taisyoname4]
      ,[maxprice_desc4]
      ,[maxprice_detail4]
      ,[normalprice_desc4]
      ,[normalprice_detail4]
      ,[taisyoname5]
      ,[maxprice_desc5]
      ,[maxprice_detail5]
      ,[normalprice_desc5]
      ,[normalprice_detail5]
        FROM 
          VParkinfo_ryokin_DISP
        WHERE 
          parkcd = @parkcd
        ORDER BY 
          getinfodate DESC
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
