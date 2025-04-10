require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: "local-artisan-marketplace-server.database.windows.net",
  database: "local-artisan-marketplace",
  options: {
    encrypt: true,
  },
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Connected to Azure SQL via AAD!");
    return pool;
  } catch (err) {
    console.error("❌ Database connection error:", err);
    throw err;
  }
}

module.exports = { connectDB, sql };
