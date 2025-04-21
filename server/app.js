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

//Retrieve username
app.post("/get-username-by-id", async (req, res) => {
  const { user_ID } = req.body;

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("user_ID", user_ID)
      .query("SELECT username FROM dbo.users WHERE user_ID = @user_ID");
    await pool.close();

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "No user found" });
    }

    return res.json({ username: result.recordset[0].username });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.post("/add-to-cart", async (req, res) => {
  const { username, product_id } = req.body;

  if (!username || !product_id) {
    return res.status(400).json({ error: "Missing username or product_id" });
  }

  try {
    const pool = await connectDB();

    // Get current stock of the product
    const productResult = await pool
      .request()
      .input("product_id", product_id)
      .query(
        "SELECT stock_quantity FROM dbo.products WHERE product_id = @product_id"
      );

    if (productResult.recordset.length === 0) {
      await pool.close();
      return res.status(404).json({ error: "Product not found" });
    }

    const stockQuantity = productResult.recordset[0].stock_quantity;

    // Check if this product is already in the cart
    const cartCheck = await pool
      .request()
      .input("username", username)
      .input("product_id", product_id).query(`
        SELECT quantity 
        FROM dbo.cart_items 
        WHERE username = @username AND product_id = @product_id
      `);

    if (cartCheck.recordset.length > 0) {
      const currentQuantity = cartCheck.recordset[0].quantity;

      if (currentQuantity >= stockQuantity) {
        await pool.close();
        return res.status(400).json({ error: "Not enough stock available" });
      }

      // Update quantity in cart
      await pool
        .request()
        .input("username", username)
        .input("product_id", product_id).query(`
          UPDATE dbo.cart_items 
          SET quantity = quantity + 1 
          WHERE username = @username AND product_id = @product_id
        `);

      await pool.close();
      return res.json({ message: "Cart updated: quantity increased by 1" });
    }

    // Not in cart yet — insert new row
    await pool
      .request()
      .input("username", username)
      .input("product_id", product_id).query(`
        INSERT INTO dbo.cart_items (username, product_id, quantity, added_at)
        VALUES (@username, @product_id, 1, GETDATE())
      `);

    await pool.close();
    return res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error("❌ Failed to add to cart:", err);
    res.status(500).json({
      error: "Server error",
      message: err.message,
      stack: err.stack,
    });
    //res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.get("/cart/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const pool = await connectDB();
    const result = await pool.request().input("username", username).query(`
        SELECT ci.product_id, ci.quantity, ci.added_at,
               p.product_name, p.price, p.image_url, p.stock_quantity, p.username AS seller_username
        FROM dbo.cart_items ci
        JOIN dbo.products p ON ci.product_id = p.product_id
        WHERE ci.username = @username
      `);
    await pool.close();

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch cart items:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

app.put("/upd-cart-item", async (req, res) => {
  const { username, product_id, quantity } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("username", username)
      .input("product_id", product_id)
      .input("quantity", quantity).query(`
        UPDATE dbo.cart_items
        SET quantity = @quantity
        WHERE username = @username AND product_id = @product_id
      `);
    await pool.close();

    res.json({ message: "Quantity updated successfully." });
  } catch (err) {
    console.error("❌ Failed to update cart quantity:", err);
    res
      .status(500)
      .json({ error: "Failed to update quantity", details: err.message });
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
      .query("SELECT role, username FROM dbo.users WHERE user_ID = @user_ID");

    if (result.recordset.length === 0) {
      res.json({ exists: false });
    } else {
      const { role, username } = result.recordset[0];
      res.json({ exists: true, role, username });
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

app.delete("/rem-cart-item", async (req, res) => {
  const { username, product_id } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("username", username)
      .input("product_id", product_id)
      .query(
        "DELETE FROM dbo.cart_items WHERE username = @username AND product_id = @product_id"
      );
    await pool.close();

    res.json({ message: "Item removed from cart." });
  } catch (err) {
    console.error("❌ Failed to delete cart item:", err);
    res
      .status(500)
      .json({ error: "Failed to delete cart item", details: err.message });
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
