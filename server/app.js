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

app.get("/penartisans", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .query("SELECT * FROM dbo.artisans WHERE verified = 0");
    await pool.close();

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
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
  const { username, user_ID, role, postal_code, phone_no } = req.body;

  try {
    const pool = await connectDB();
    // Check if the user already exists

    await pool.request().input("username", username).input("user_ID", user_ID)
      .query(`
        INSERT INTO dbo.users 
        (username, user_ID)
        VALUES 
        (@username, @user_ID)
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
      .query("SELECT role FROM dbo.users WHERE user_ID = @user_ID");

    if (result.recordset.length === 0) {
      res.json({ exists: false });
    } else {
      const role = result.recordset[0].role;
      res.json({ exists: true, role });
    }
  } catch (err) {
    console.error("Error checking user_ID:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

app.delete("/deleteartisan/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("username", username)
      .query("DELETE FROM dbo.artisans WHERE username = @username");
    await pool.close();

    res.json({ message: `Deleted artisan with username: ${username}` });
  } catch (err) {
    console.error("❌ Failed to delete artisan:", err);
    res.status(500).json({ error: "DB deletion failed", details: err.message });
  }
});

app.put("/verifyartisan/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("username", username)
      .input("verified", 1)
      .query(
        "UPDATE dbo.artisans SET verified = @verified WHERE username = @username"
      );
    await pool.close();

    res.json({ message: `Verified artisan with username: ${username}` });
  } catch (err) {
    console.error("❌ Failed to verify artisan:", err);
    res.status(500).json({ error: "DB update failed", details: err.message });
  }
});

// --- Server Listen ---
app.listen(PORT, () => {
  console.log("🚀 Server Listening on PORT:", PORT);
});
