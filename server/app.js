const express = require("express");
const cors = require("cors");
const { connectDB } = require("./dbConfig");

const app = express();
app.use(cors());

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

//Get /specific product - fetch specific product by ID
app.get("/product/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .query(`SELECT * FROM dbo.products WHERE product_id = ${productId}`);
    await pool.close();

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Failed to fetch product:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

app.post("/check-user", async (req, res) => {
  const { username } = req.body;

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("username", username)
      .query("SELECT * FROM dbo.users WHERE username = @username");

    await pool.close();

    if (result.recordset.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("❌ Failed to check user:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

app.post("/adduser", async (req, res) => {
  const {
    username,
    user_ID,
    first_name,
    last_name,
    role,
    postal_code,
    phone_no,
  } = req.body;

  try {
    const pool = await connectDB();
    // Check if the user already exists

    await pool
      .request()
      .input("username", username)
      .input("user_ID", user_ID)
      .input("first_name", first_name || null)
      .input("last_name", last_name || null)
      .input("role", role || null)
      .input("postal_code", postal_code || null)
      .input("phone_no", phone_no || null).query(`
        INSERT INTO dbo.users 
        (username, user_ID, first_name, last_name, role, postal_code, phone_no)
        VALUES 
        (@username, @user_ID, @first_name, @last_name, @role, @postal_code, @phone_no)
      `);

    await pool.close();
    res.json({ message: "✅ User added successfully" });
  } catch (err) {
    console.error("❌ Failed to insert user:", err);
    res
      .status(500)
      .json({ error: "Database insert failed", details: err.message });
  }
});

app.post("/check-userid", async (req, res) => {
  const { user_ID } = req.body;

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("user_ID", user_ID)
      .query("SELECT 1 FROM dbo.users WHERE user_ID = @user_ID");

    const exists = result.recordset.length > 0;
    res.json({ exists });
  } catch (err) {
    console.error("Error checking user_ID:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// --- Server Listen ---
app.listen(PORT, () => {
  console.log("🚀 Server Listening on PORT:", PORT);
});
