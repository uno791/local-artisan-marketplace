const express = require("express");
const cors = require("cors");
const { connectDB } = require("./dbConfig");

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send("✅ API is live and running!");
});

app.get("/status", (req, res) => {
  res.json({ status: "Running" });
});

// Users Fetch 
app.get("/users", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM dbo.users");
    await pool.close();

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

// --- Existing Products Fetch ---
app.get("/allproducts", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM dbo.products");
    await pool.close();

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

// Username validatcoa check
app.get("/api/users/exists", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("username", username)
      .query("SELECT COUNT(*) AS count FROM dbo.users WHERE username = @username");
    await pool.close();

    const exists = result.recordset[0].count > 0;
    res.json({ exists });
  } catch (err) {
    console.error("❌ Username check failed:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

// Create user
app.post("/api/users/create", async (req, res) => {
  const {
    username,
    user_ID,
    first_name,
    last_name,
    role,
    postal_code,
    phone_no,
  } = req.body;

  if (!username || !user_ID) {
    return res.status(400).json({ error: "username and userID are required" });
  }

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("username", username)
      .input("user_ID", user_ID)
      .input("first_name", first_name || null)
      .input("last_name", last_name || null)
      .input("role", role || null)
      .input("postal_code", postal_code || null)
      .input("phone_no", phone_no || null)
      .query(`
        INSERT INTO dbo.users 
        (username, user_ID, first_name, last_name, role, postal_code, phone_no)
        VALUES 
        (@username, @user_ID, @first_name, @last_name, @role, @postal_code, @phone_no)
      `);
    await pool.close();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Failed to create user:", err);
    res.status(500).json({ error: "DB insert failed", details: err.message });
  }
});

// --- Server Listen ---
app.listen(PORT, () => {
  console.log("🚀 Server Listening on PORT:", PORT);
});
