const express = require("express");
const cors = require("cors");
const { connectDB } = require("./dbConfig");

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ API is live and running!");
});

app.get("/status", (req, res) => {
  res.json({ status: "Running" });
});

const normalizeSort = (raw) => {
  const allowed = ["new", "price_asc", "price_desc"];
  return allowed.includes(raw) ? raw : "new";
};

// Users Fetch
// GET /artisan/:username - fetch artisan shop info
app.get("/artisan/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("username", username)
      .query("SELECT * FROM dbo.artisans WHERE username = @username");
    await pool.close();

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Artisan not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Failed to fetch artisan:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch artisan", details: err.message });
  }
});

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

app.get("/allproducts", async (req, res) => {
  const sort = req.query.sort;
  let orderBy;
  switch (sort) {
    case "priceAsc":
      orderBy = "price ASC, product_id ASC";
      break;
    case "priceDesc":
      orderBy = "price DESC, product_id ASC";
      break;
    default:
      orderBy = "created_at DESC, product_id ASC";
  }

  try {
    const pool = await connectDB();
    const sql = `
      SELECT 
        product_id,
        product_name,
        description,
        price,
        image_url,
        username,
        created_at
      FROM dbo.products
      ORDER BY ${orderBy};
    `;
    const result = await pool.request().query(sql);
    await pool.close();
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

//this one get the products and category from sp seller

app.get("/seller-dashboard", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const pool = await connectDB();

    // Fetch artisan info
    const artisanResult = await pool.request().input("username", username)
      .query(`
        SELECT shop_name, bio, shop_pfp, shop_address, shop_banner
        FROM dbo.artisans
        WHERE username = @username AND verified = 1
      `);

    if (artisanResult.recordset.length === 0) {
      await pool.close();
      return res
        .status(404)
        .json({ error: "Artisan not found or not verified" });
    }

    const artisan = artisanResult.recordset[0];

    // Fetch products with category
    const productsResult = await pool.request().input("username", username)
      .query(`
        SELECT 
          p.product_id,
          p.product_name,
          p.price,
          p.image_url,
          ISNULL(mc.category_name, 'Uncategorized') AS category_name
        FROM dbo.products p
        LEFT JOIN dbo.link_main_categories lmc ON p.product_id = lmc.product_id
        LEFT JOIN dbo.main_categories mc ON lmc.category_id = mc.category_id
        WHERE p.username = @username
      `);

    await pool.close();
    //forrmating it to how i wanted:
    const products = productsResult.recordset.map((p) => ({
      id: p.product_id,
      name: p.product_name,
      price: `R${parseFloat(p.price).toLocaleString()}`,
      category: p.category_name,
      image: p.image_url,
    }));

    res.json({ artisan, products });
  } catch (err) {
    console.error("❌ Failed to fetch seller dashboard:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET all main categories
app.get("/main-categories", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .query(
        "SELECT category_name FROM dbo.main_categories ORDER BY category_name"
      );
    await pool.close();
    // return as a simple array of strings
    res.json(result.recordset.map((r) => r.category_name));
  } catch (err) {
    console.error("❌ Failed to fetch main categories:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

// GET all minor categories
app.get("/minor-categories", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .query(
        "SELECT minor_category_name FROM dbo.minor_categories ORDER BY minor_category_name"
      );
    await pool.close();
    res.json(result.recordset.map((r) => r.minor_category_name));
  } catch (err) {
    console.error("❌ Failed to fetch minor categories:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

//Get /specific product - fetch specific product by ID
app.get("/product/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const pool = await connectDB();

    // 1. Fetch main product + main category
    const productResult = await pool.request().input("id", productId).query(`
        SELECT p.*, mc.category_name
        FROM dbo.products p
        LEFT JOIN dbo.link_main_categories lmc ON p.product_id = lmc.product_id
        LEFT JOIN dbo.main_categories mc ON lmc.category_id = mc.category_id
        WHERE p.product_id = @id
      `);

    if (productResult.recordset.length === 0) {
      await pool.close();
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.recordset[0];

    // 2. Fetch minor categories (tags)
    const tagsResult = await pool.request().input("id", productId).query(`
        SELECT mc.minor_category_name
        FROM dbo.link_minor_categories lmc
        JOIN dbo.minor_categories mc ON lmc.minor_category_id = mc.minor_category_id
        WHERE lmc.product_id = @id
      `);

    const tags = tagsResult.recordset.map((r) => r.minor_category_name);

    await pool.close();

    // 3. Return everything
    res.json({
      ...product,
      tags,
      product_image: product.image_url, // ✅ This is the key line
    });
  } catch (err) {
    console.error("❌ Failed to fetch product:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

// Backend route: Add to app.js

app.post("/recommend-by-tags", async (req, res) => {
  const { tags, excludeProductIds = [], limitPerTag = 4 } = req.body;

  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ error: "Tags must be an array." });
  }

  try {
    const pool = await connectDB();
    const recommendedProducts = [];
    const seenProductIds = new Set(excludeProductIds);

    for (const tag of tags) {
      const result = await pool.request().input("tag", tag).query(`
          SELECT TOP (${limitPerTag * 2})
            p.product_id,
            p.product_name,
            p.price,
            p.image_url,
            a.username
          FROM dbo.products p
          JOIN dbo.artisans a ON p.username = a.username
          LEFT JOIN dbo.link_main_categories lmc ON p.product_id = lmc.product_id
          LEFT JOIN dbo.main_categories mc ON lmc.category_id = mc.category_id
          LEFT JOIN dbo.link_minor_categories lmnc ON p.product_id = lmnc.product_id
          LEFT JOIN dbo.minor_categories mnc ON lmnc.minor_category_id = mnc.minor_category_id
          WHERE mc.category_name = @tag OR mnc.minor_category_name = @tag
          ORDER BY NEWID();
        `);

      for (const product of result.recordset) {
        if (!seenProductIds.has(product.product_id)) {
          recommendedProducts.push(product);
          seenProductIds.add(product.product_id);
        }
        if (recommendedProducts.length >= limitPerTag * tags.length) break;
      }
    }

    await pool.close();
    res.json(recommendedProducts.slice(0, limitPerTag * tags.length));
  } catch (err) {
    console.error("❌ Failed to fetch recommendations:", err);
    res
      .status(500)
      .json({ error: "Recommendation fetch failed.", details: err.message });
  }
});

app.get("/sales-data", async (req, res) => {
  try {
    const pool = await connectDB();
    // Group by month number and name, order chronologically
    const result = await pool.request().query(`
      SELECT
        MONTH(created_at)      AS month,
        DATENAME(month, created_at) AS monthName,
        SUM(total_amount)      AS total
      FROM dbo.orders
      GROUP BY MONTH(created_at), DATENAME(month, created_at)
      ORDER BY MONTH(created_at);
    `);
    await pool.close();
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching sales data", err);
    res.status(500).json({ error: "Failed to fetch sales data" });
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
        SELECT
          ci.product_id,
          ci.quantity,
          ci.added_at,
          p.product_name,
          p.price,
          p.image_url,
          p.stock_quantity AS stock,
          p.username        AS seller_username
        FROM dbo.cart_items ci
        JOIN dbo.products    p ON ci.product_id = p.product_id
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
  const { username, user_ID, role, postal_code, phone_no, interests } =
    req.body;

  try {
    const pool = await connectDB();
    // Check if the user already exists

    await pool
      .request()
      .input("username", username)
      .input("user_ID", user_ID)
      .input("interests", interests).query(`
        INSERT INTO dbo.users 
        (username, user_ID, interests)
        VALUES 
        (@username, @user_ID, @interests)
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

app.get("/products/search", async (req, res) => {
  const q = String(req.query.query || "");
  const sort = String(req.query.sort || "new");

  // 1) decide how to sort inside the CTE (p. alias allowed)
  // 2) decide how to sort in the outer SELECT (columns only)
  let cteOrderBy, outerOrderBy;
  switch (sort) {
    case "priceAsc":
      cteOrderBy = "p.price ASC, p.product_id ASC";
      outerOrderBy = "price ASC, product_id ASC";
      break;
    case "priceDesc":
      cteOrderBy = "p.price DESC, p.product_id ASC";
      outerOrderBy = "price DESC, product_id ASC";
      break;
    default: // "new"
      cteOrderBy = "p.created_at DESC, p.product_id ASC";
      outerOrderBy = "created_at DESC, product_id ASC";
  }

  try {
    const pool = await connectDB();
    const request = pool.request().input("q", q);

    const sql = `
      WITH RankedProducts AS (
        SELECT
          p.product_id,
          p.product_name,
          p.description,
          p.price,
          p.image_url,
          a.username        AS username,
          p.created_at,
          ROW_NUMBER() OVER (
            PARTITION BY p.product_id
            ORDER BY ${cteOrderBy}
          ) AS rn
        FROM dbo.products p
        JOIN dbo.artisans a
          ON p.username = a.username
        LEFT JOIN dbo.link_main_categories lmc
          ON p.product_id = lmc.product_id
        LEFT JOIN dbo.main_categories mc
          ON lmc.category_id = mc.category_id
        LEFT JOIN dbo.link_minor_categories lmnc
          ON p.product_id = lmnc.product_id
        LEFT JOIN dbo.minor_categories mnc
          ON lmnc.minor_category_id = mnc.minor_category_id
        WHERE
          p.product_name           LIKE '%' + @q + '%'
          OR a.username            LIKE '%' + @q + '%'
          OR mc.category_name      LIKE '%' + @q + '%'
          OR mnc.minor_category_name LIKE '%' + @q + '%'
      )
      SELECT
        product_id,
        product_name,
        description,
        price,
        image_url,
        username,
        created_at
      FROM RankedProducts
      WHERE rn = 1
      ORDER BY ${outerOrderBy};
    `;

    const result = await request.query(sql);
    await pool.close();

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error in /products/search:", err);
    res
      .status(500)
      .json({ error: "Error searching products", details: err.message });
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

// GET /api/users/:username
app.get("/getuser/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("username", username)
      .query("SELECT * FROM dbo.users WHERE username = @username");
    await pool.close();

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/seller-sales-trends", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Missing username query parameter" });
  }
  try {
    const pool = await connectDB();
    const result = await pool.request().input("username", username).query(`
        SELECT
          MONTH(o.created_at)             AS mon,
          SUM(oi.quantity * p.price)      AS revenue
        FROM dbo.orders o
        JOIN dbo.order_items oi ON o.order_id    = oi.order_id
        JOIN dbo.products p     ON oi.product_id  = p.product_id
        WHERE p.username = @username
        GROUP BY MONTH(o.created_at)
        ORDER BY MONTH(o.created_at);
      `);

    // build full 12‐month array
    const map = {};
    result.recordset.forEach((r) => (map[r.mon] = +r.revenue));
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const data = months.map((m) => map[m] || 0);

    await pool.close();
    res.json({ months, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// 2) current stock per product for that artisan
app.get("/seller-inventory-status", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Missing username query parameter" });
  }
  try {
    const pool = await connectDB();
    const result = await pool.request().input("username", username).query(`
        SELECT product_name, stock_quantity
        FROM dbo.products
        WHERE username = @username
        ORDER BY product_name;
      `);

    await pool.close();
    res.json({
      products: result.recordset.map((r) => r.product_name),
      data: result.recordset.map((r) => r.stock_quantity),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.get("/seller-top-products", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Missing username query parameter" });
  }

  try {
    const pool = await connectDB();
    const result = await pool.request().input("username", username).query(`
        SELECT TOP 5
          p.product_name   AS productName,
          SUM(oi.quantity) AS unitsSold
        FROM dbo.order_items oi
        JOIN dbo.orders o   ON oi.order_id   = o.order_id
        JOIN dbo.products p ON oi.product_id = p.product_id
        WHERE p.username = @username
        GROUP BY p.product_name
        ORDER BY unitsSold DESC;
      `);
    await pool.close();

    const productNames = result.recordset.map((r) => r.productName);
    const unitsSold = result.recordset.map((r) => Number(r.unitsSold));

    res.json({ productNames, unitsSold });
  } catch (err) {
    console.error("❌ /seller-top-products error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// PUT /api/users/:username
app.put("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  const { postal_code, phone_no, interests } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("postal_code", postal_code ?? 0)
      .input("phone_no", phone_no ?? null)
      .input("interests", interests ?? "")
      .input("username", username).query(`
        UPDATE dbo.users
        SET postal_code = @postal_code,
            phone_no = @phone_no,
            interests = @interests
        WHERE username = @username
      `);
    await pool.close();
    res.json({ message: "User info updated successfully" });
  } catch (err) {
    console.error("❌ Error updating user info:", err);
    res.status(500).json({ error: "Failed to update user info" });
  }
});
//update users with out interests
//update users with out interests
app.put("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  const { postal_code, phone_no } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("postal_code", postal_code ?? 0)
      .input("phone_no", phone_no ?? null)
      .input("username", username).query(`
        UPDATE dbo.users
        SET postal_code = @postal_code,
            phone_no = @phone_no,
            interests = @interests
        WHERE username = @username
      `);
    await pool.close();
    res.json({ message: "User info updated successfully" });
  } catch (err) {
    console.error("❌ Error updating user info:", err);
    res.status(500).json({ error: "Failed to update user info" });
  }
});
// POST /api/artisans
app.post("/createartisan", async (req, res) => {
  const { username, shop_name, bio, shop_address, shop_pfp } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("username", username)
      .input("shop_name", shop_name)
      .input("bio", bio)
      .input("shop_address", shop_address)
      .input("shop_pfp", shop_pfp).query(`
        INSERT INTO dbo.artisans (username, shop_name, bio, shop_address, shop_pfp, join_date)
        VALUES (@username, @shop_name, @bio, @shop_address, @shop_pfp, GETDATE())
      `);
    await pool.close();
    res.status(201).json({ message: "Artisan created successfully" });
  } catch (err) {
    console.error("❌ Error inserting artisan:", err);
    res.status(500).json({ error: "Failed to create artisan" });
  }
});

app.post("/addproduct", async (req, res) => {
  const {
    username,
    product_name,
    description,
    price,
    stock_quantity,
    image_url,
    width,
    height,
    weight,
    details,
    tags,
    typeOfArt,
  } = req.body;

  try {
    const pool = await connectDB();

    // Step 1: Insert product
    const insertProductResult = await pool
      .request()
      .input("username", username)
      .input("product_name", product_name)
      .input("description", description)
      .input("price", price)
      .input("stock_quantity", stock_quantity)
      .input("image_url", image_url)
      .input("width", width)
      .input("height", height)
      .input("weight", weight)
      .input("details", details).query(`
        INSERT INTO dbo.products (
          username, product_name, description, price, stock_quantity,
          image_url, width, height, weight, details, created_at
        )
        OUTPUT INSERTED.product_id
        VALUES (
          @username, @product_name, @description, @price, @stock_quantity,
          @image_url, @width, @height, @weight, @details, GETDATE()
        )
      `);

    const productId = insertProductResult.recordset[0].product_id;

    // Step 2: Link to main category
    const categoryResult = await pool
      .request()
      .input("category_name", typeOfArt).query(`
        SELECT category_id 
        FROM dbo.main_categories 
        WHERE category_name = @category_name
      `);

    if (categoryResult.recordset.length > 0) {
      const categoryId = categoryResult.recordset[0].category_id;
      await pool
        .request()
        .input("product_id", productId)
        .input("category_id", categoryId).query(`
          INSERT INTO dbo.link_main_categories (product_id, category_id)
          VALUES (@product_id, @category_id)
        `);
    } else {
      console.warn(`⚠️ No matching main category for: ${typeOfArt}`);
    }

    // Step 3: Handle and link tags (minor categories)
    for (const tag of tags) {
      let tagId;
      const tagLookup = await pool.request().input("minor_category_name", tag)
        .query(`
          SELECT minor_category_id 
          FROM dbo.minor_categories 
          WHERE minor_category_name = @minor_category_name
        `);

      if (tagLookup.recordset.length === 0) {
        const insertTag = await pool.request().input("minor_category_name", tag)
          .query(`
            INSERT INTO dbo.minor_categories (minor_category_name)
            OUTPUT INSERTED.minor_category_id
            VALUES (@minor_category_name)
          `);
        tagId = insertTag.recordset[0].minor_category_id;
      } else {
        tagId = tagLookup.recordset[0].minor_category_id;
      }

      await pool
        .request()
        .input("product_id", productId)
        .input("minor_category_id", tagId).query(`
          INSERT INTO dbo.link_minor_categories (product_id, minor_category_id)
          VALUES (@product_id, @minor_category_id)
        `);
    }

    await pool.close();
    res
      .status(201)
      .json({ message: "✅ Product and categories added successfully" });
  } catch (err) {
    console.error("❌ Error inserting product:", err);
    res
      .status(500)
      .json({ error: "Failed to add product", details: err.message });
  }
});
app.put("/editproduct/:id", async (req, res) => {
  const id = req.params.id;
  const {
    product_name,
    description,
    price,
    stock_quantity,
    width,
    height,
    weight,
    details,
    typeOfArt,
    tags,
    product_image, // ✅ New field
  } = req.body;

  try {
    const pool = await connectDB();

    // Step 1: Update product including image
    await pool
      .request()
      .input("id", id)
      .input("product_name", product_name)
      .input("description", description)
      .input("price", price)
      .input("stock_quantity", stock_quantity)
      .input("width", width)
      .input("height", height)
      .input("weight", weight)
      .input("details", details)
      .input("product_image", product_image) // ✅ New line
      .query(`
        UPDATE dbo.products
        SET 
          product_name = @product_name,
          description = @description,
          price = @price,
          stock_quantity = @stock_quantity,
          width = @width,
          height = @height,
          weight = @weight,
          details = @details,
          image_url = @product_image -- ✅ Store base64
        WHERE product_id = @id
      `);

    // Step 2: Update main category
    const categoryResult = await pool
      .request()
      .input("category_name", typeOfArt)
      .query(
        `SELECT category_id FROM dbo.main_categories WHERE category_name = @category_name`
      );

    if (categoryResult.recordset.length > 0) {
      const categoryId = categoryResult.recordset[0].category_id;

      await pool
        .request()
        .input("product_id", id)
        .query(
          `DELETE FROM dbo.link_main_categories WHERE product_id = @product_id`
        );

      await pool
        .request()
        .input("product_id", id)
        .input("category_id", categoryId).query(`
          INSERT INTO dbo.link_main_categories (product_id, category_id)
          VALUES (@product_id, @category_id)
        `);
    }

    // Step 3: Update tags
    await pool
      .request()
      .input("product_id", id)
      .query(
        `DELETE FROM dbo.link_minor_categories WHERE product_id = @product_id`
      );

    for (const tag of tags) {
      let tagId;
      const tagLookup = await pool
        .request()
        .input("minor_category_name", tag)
        .query(
          `SELECT minor_category_id FROM dbo.minor_categories WHERE minor_category_name = @minor_category_name`
        );

      if (tagLookup.recordset.length === 0) {
        const insertTag = await pool
          .request()
          .input("minor_category_name", tag)
          .query(
            `INSERT INTO dbo.minor_categories (minor_category_name) OUTPUT INSERTED.minor_category_id VALUES (@minor_category_name)`
          );
        tagId = insertTag.recordset[0].minor_category_id;
      } else {
        tagId = tagLookup.recordset[0].minor_category_id;
      }

      await pool
        .request()
        .input("product_id", id)
        .input("minor_category_id", tagId).query(`
          INSERT INTO dbo.link_minor_categories (product_id, minor_category_id)
          VALUES (@product_id, @minor_category_id)
        `);
    }

    await pool.close();
    res.json({ message: "✅ Product updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update product:", err);
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

app.put("/api/user-profile-image", async (req, res) => {
  const { username, user_pfp } = req.body;

  if (!username || !user_pfp) {
    return res.status(400).json({ error: "Missing username or image data" });
  }

  try {
    const pool = await connectDB();
    await pool.request().input("username", username).input("user_pfp", user_pfp)
      .query(`
        UPDATE dbo.users
        SET user_pfp = @user_pfp
        WHERE username = @username
      `);
    await pool.close();

    res.json({ message: "✅ Profile image updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update user profile image:", err);
    res.status(500).json({ error: "DB update failed", details: err.message });
  }
});

//Adding stuff for cart
app.post("/checkout", async (req, res) => {
  const { username, token } = req.body;

  if (!username) return res.status(400).json({ error: "Missing username" });

  try {
    const pool = await connectDB();

    // FIXED: Explicitly prefix column names to avoid ambiguity
    const cartRes = await pool.request().input("username", username).query(`
        SELECT p.product_id, ci.quantity, p.price 
        FROM dbo.cart_items ci
        JOIN dbo.products p ON ci.product_id = p.product_id
        WHERE ci.username = @username
      `);

    const cartItems = cartRes.recordset;
    if (cartItems.length === 0) {
      await pool.close();
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderResult = await pool
      .request()
      .input("buyer_username", username)
      .input("total_amount", totalAmount).query(`
        INSERT INTO dbo.orders (buyer_username, created_at, total_amount)
        OUTPUT INSERTED.order_id
        VALUES (@buyer_username, GETDATE(), @total_amount)
      `);

    const orderId = orderResult.recordset[0].order_id;

    for (const item of cartItems) {
      await pool
        .request()
        .input("order_id", orderId)
        .input("product_id", item.product_id)
        .input("quantity", item.quantity).query(`
          INSERT INTO dbo.order_items (order_id, product_id, quantity)
          VALUES (@order_id, @product_id, @quantity)
        `);
    }

    /*await pool.request()
      .input("order_id", orderId)
      .input("payment_status", "Paid")
      .query(`
        INSERT INTO dbo.payments (order_id, payment_status, paid_at)
        VALUES (@order_id, @payment_status, GETDATE())
      `);*/

    await pool
      .request()
      .input("username", username)
      .query(`DELETE FROM dbo.cart_items WHERE username = @username`);

    await pool.close();
    res.status(200).json({ message: "Order placed", orderId });
  } catch (err) {
    console.error("❌ Checkout failed:", err);
    res.status(500).json({ error: "Checkout failed", details: err.message });
  }
});
app.get("/orders/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const pool = await connectDB();
    const result = await pool.request().input("username", username).query(`
        SELECT o.order_id, oi.status, o.created_at,
               oi.quantity, p.product_name, p.price, p.image_url
        FROM dbo.orders o
        JOIN dbo.order_items oi ON o.order_id = oi.order_id
        JOIN dbo.products p ON oi.product_id = p.product_id
        WHERE o.buyer_username = @username
        ORDER BY o.created_at DESC
      `);

    await pool.close();
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

// --- Server Listen ---
app.listen(PORT, () => {
  console.log("🚀 Server Listening on PORT:", PORT);
});

app.get("/user-reports", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT 
        ur.reporterby_username,
        ur.seller_username,
        ur.product_id,
        p.product_name,
        ur.details,
        ur.evidence_url,
        ur.created_at,
        ur.status,
        r.reason
      FROM dbo.user_reports ur
      JOIN dbo.products p ON ur.product_id = p.product_id
      LEFT JOIN dbo.reasons r ON ur.reason_id = r.reason_id
      WHERE ur.status < 3
      ORDER BY ur.created_at DESC
    `);
    await pool.close();
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch user reports:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

app.put("/update-report-status", async (req, res) => {
  const { reporterby_username, product_id, status } = req.body;

  if (!reporterby_username || !product_id || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("reporterby_username", reporterby_username)
      .input("product_id", product_id)
      .input("status", status).query(`
        UPDATE dbo.user_reports
        SET status = @status
        WHERE reporterby_username = @reporterby_username AND product_id = @product_id
      `);
    await pool.close();

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update report status:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.post("/mark-product-kept", async (req, res) => {
  const { product_id } = req.body;
  try {
    const pool = await connectDB();
    await pool.request().input("product_id", product_id).query(`
      UPDATE dbo.user_reports
      SET status = 2
      WHERE product_id = @product_id
    `);
    await pool.close();
    res.json({ message: "Product marked as kept." });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

app.post("/mark-product-kept", async (req, res) => {
  const { product_id } = req.body;

  try {
    const pool = await connectDB();

    // 1. Delete the report
    await pool.request().input("product_id", product_id).query(`
      DELETE FROM dbo.user_reports WHERE product_id = @product_id
    `);

    // 2. (Optional) Delete reviews if that's also your requirement
    await pool.request().input("product_id", product_id).query(`
      DELETE FROM dbo.reviews WHERE product_id = @product_id
    `);

    await pool.close();
    res.json({ message: "Product kept and report removed." });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

app.delete("/delete-product/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing product ID" });
  }

  try {
    const pool = await connectDB();

    console.log("🧹 Deleting product and dependencies:", id);

    // 1. Delete from order_items
    await pool.request().input("id", id).query(`
      DELETE FROM dbo.order_items WHERE product_id = @id
    `);

    // 2. Delete from link_minor_categories
    await pool.request().input("id", id).query(`
      DELETE FROM dbo.link_minor_categories WHERE product_id = @id
    `);

    // 3. Delete from link_main_categories
    await pool.request().input("id", id).query(`
      DELETE FROM dbo.link_main_categories WHERE product_id = @id
    `);

    // 4. Delete reviews
    await pool.request().input("id", id).query(`
      DELETE FROM dbo.reviews WHERE product_id = @id
    `);

    // 5. Delete user_reports
    await pool.request().input("id", id).query(`
      DELETE FROM dbo.user_reports WHERE product_id = @id
    `);

    // 6. Finally delete product
    await pool.request().input("id", id).query(`
      DELETE FROM dbo.products WHERE product_id = @id
    `);

    await pool.close();
    res.json({ message: "✅ Product and related records deleted." });
  } catch (err) {
    console.error("❌ Product deletion error:", err);
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

app.get("/seller-orders/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const pool = await connectDB();
    const result = await pool.request().input("username", username).query(`
      SELECT 
        o.order_id,
        o.created_at,
        oi.product_id,
        oi.quantity,
        oi.status,
        p.product_name,
        p.price
      FROM dbo.orders o
      JOIN dbo.order_items oi ON o.order_id = oi.order_id
      JOIN dbo.products p ON oi.product_id = p.product_id
      WHERE p.username = @username
      ORDER BY o.created_at DESC
    `);

    await pool.close();
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch seller orders:", err);
    res.status(500).json({ error: "DB query failed", details: err.message });
  }
});

app.put("/update-order-status", async (req, res) => {
  const { order_id, product_id, status } = req.body;

  if (!order_id || !product_id || !status) {
    return res
      .status(400)
      .json({ error: "Missing order_id, product_id, or status" });
  }

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("order_id", order_id)
      .input("product_id", product_id)
      .input("status", status).query(`
        UPDATE dbo.order_items
        SET status = @status
        WHERE order_id = @order_id AND product_id = @product_id
      `);
    await pool.close();

    res.json({ message: "Order item status updated" });
  } catch (err) {
    console.error("❌ Failed to update order item status:", err);
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});
