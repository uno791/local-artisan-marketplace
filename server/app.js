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

//this one get the products and category from sp seller

app.get("/seller-dashboard", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const pool = await connectDB();

    // Fetch artisan info
    const artisanResult = await pool
      .request()
      .input("username", username)
      .query(`
        SELECT shop_name, bio, shop_pfp, shop_address, shop_banner
        FROM dbo.artisans
        WHERE username = @username AND verified = 1
      `);

    if (artisanResult.recordset.length === 0) {
      await pool.close();
      return res.status(404).json({ error: "Artisan not found or not verified" });
    }

    const artisan = artisanResult.recordset[0];
    

    // Fetch products with category
    const productsResult = await pool
      .request()
      .input("username", username)
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



// app.get("/SellerProducts", async (req, res) => {
//   const { username } = req.query;

//   try {
//     const pool = await connectDB();
//     const result = await pool
//       .request()
//       .input("username", username)
//       .query(`
//         SELECT 
//           p.product_id,
//           p.product_name,
//           p.price,
//           p.image_url,
//           ISNULL(mc.category_name, 'Uncategorized') AS category_name
//         FROM dbo.products p
//         LEFT JOIN dbo.link_main_categories lmc ON p.product_id = lmc.product_id
//         LEFT JOIN dbo.main_categories mc ON lmc.category_id = mc.category_id
//         WHERE p.username = @username
//       `);
//     await pool.close();
//     const formatted = result.recordset.map((p) => ({
//       id: p.product_id,
//       name: p.product_name,
//       price: `R${parseFloat(p.price).toLocaleString()}`,
//       category: p.category_name,
//       image: p.image_url,
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("Failed to fetch products:", err);
//     res.status(500).json({ error: "DB query failed", details: err.message });
//   }
// });

// app.get("/getartisan", async (req, res) => {
//   const { username } = req.query;

//   try {
//     const pool = await connectDB();
//     const result = await pool
//       .request()
//       .input("username", username)
//       .query(`
//         SELECT shop_name, bio, shop_pfp, shop_address
//         FROM dbo.artisans
//         WHERE username = @username AND verified = 1
//       `);
//     await pool.close();

//     if (result.recordset.length === 0) {
//       return res.status(404).json({ error: "Artisan not found or not verified" });
//     }

//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error("Error fetching artisan:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// });

// app.get("/SellerProducts", async (req, res) => {
//   const { username } = req.query;

//   try {
//     const pool = await connectDB();
//     const result = await pool
//       .request()
//       .input("username", username)
//       .query("SELECT product_id, product_name, price, image_url, description FROM dbo.products WHERE username = @username");
//     await pool.close();

    
//     const formatted = result.recordset.map((p) => ({
//       id: p.product_id,
//       name: p.product_name,
//       price: `R${parseFloat(p.price).toLocaleString()}`, 
//       category: p.description || "Uncategorized", 
//       image: p.image_url,
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("Failed to fetch products:", err);
//     res.status(500).json({ error: "DB query failed", details: err.message });
//   }
// });



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

// PUT /api/users/:username
app.put("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  const { postal_code, phone_no } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("postal_code", postal_code)
      .input("phone_no", phone_no)
      .input("username", username).query(`
        UPDATE dbo.users
        SET postal_code = @postal_code,
            phone_no = @phone_no
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

// --- Server Listen ---
app.listen(PORT, () => {
  console.log("🚀 Server Listening on PORT:", PORT);
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
    typeOfArt
  } = req.body;

  try {
    const pool = await connectDB();

    // Step 1: Insert product
    const insertProductResult = await pool.request()
      .input("username", username)
      .input("product_name", product_name)
      .input("description", description)
      .input("price", price)
      .input("stock_quantity", stock_quantity)
      .input("image_url", image_url)
      .input("width", width)
      .input("height", height)
      .input("weight", weight)
      .input("details", details)
      .query(`
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
    const categoryResult = await pool.request()
      .input("category_name", typeOfArt)
      .query(`
        SELECT category_id 
        FROM dbo.main_categories 
        WHERE category_name = @category_name
      `);

    if (categoryResult.recordset.length > 0) {
      const categoryId = categoryResult.recordset[0].category_id;
      await pool.request()
        .input("product_id", productId)
        .input("category_id", categoryId)
        .query(`
          INSERT INTO dbo.link_main_categories (product_id, category_id)
          VALUES (@product_id, @category_id)
        `);
    } else {
      console.warn(`⚠️ No matching main category for: ${typeOfArt}`);
    }

    // Step 3: Handle and link tags (minor categories)
    for (const tag of tags) {
      let tagId;
      const tagLookup = await pool.request()
        .input("minor_category_name", tag)
        .query(`
          SELECT minor_category_id 
          FROM dbo.minor_categories 
          WHERE minor_category_name = @minor_category_name
        `);

      if (tagLookup.recordset.length === 0) {
        const insertTag = await pool.request()
          .input("minor_category_name", tag)
          .query(`
            INSERT INTO dbo.minor_categories (minor_category_name)
            OUTPUT INSERTED.minor_category_id
            VALUES (@minor_category_name)
          `);
        tagId = insertTag.recordset[0].minor_category_id;
      } else {
        tagId = tagLookup.recordset[0].minor_category_id;
      }

      await pool.request()
        .input("product_id", productId)
        .input("minor_category_id", tagId)
        .query(`
          INSERT INTO dbo.link_minor_categories (product_id, minor_category_id)
          VALUES (@product_id, @minor_category_id)
        `);
    }

    await pool.close();
    res.status(201).json({ message: "✅ Product and categories added successfully" });
  } catch (err) {
    console.error("❌ Error inserting product:", err);
    res.status(500).json({ error: "Failed to add product", details: err.message });
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
  } = req.body;

  try {
    const pool = await connectDB();

    // Step 1: Update main product fields
    await pool.request()
      .input("id", id)
      .input("product_name", product_name)
      .input("description", description)
      .input("price", price)
      .input("stock_quantity", stock_quantity)
      .input("width", width)
      .input("height", height)
      .input("weight", weight)
      .input("details", details)
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
          details = @details
        WHERE product_id = @id
      `);

    // Step 2: Update main category
    const categoryResult = await pool.request()
      .input("category_name", typeOfArt)
      .query(`SELECT category_id FROM dbo.main_categories WHERE category_name = @category_name`);

    if (categoryResult.recordset.length > 0) {
      const categoryId = categoryResult.recordset[0].category_id;

      // Remove old links
      await pool.request()
        .input("product_id", id)
        .query(`DELETE FROM dbo.link_main_categories WHERE product_id = @product_id`);

      // Add new one
      await pool.request()
        .input("product_id", id)
        .input("category_id", categoryId)
        .query(`INSERT INTO dbo.link_main_categories (product_id, category_id) VALUES (@product_id, @category_id)`);
    }

    // Step 3: Update tags (minor categories)
    await pool.request()
      .input("product_id", id)
      .query(`DELETE FROM dbo.link_minor_categories WHERE product_id = @product_id`);

    for (const tag of tags) {
      let tagId;

      const tagLookup = await pool.request()
        .input("minor_category_name", tag)
        .query(`SELECT minor_category_id FROM dbo.minor_categories WHERE minor_category_name = @minor_category_name`);

      if (tagLookup.recordset.length === 0) {
        const insertTag = await pool.request()
          .input("minor_category_name", tag)
          .query(`INSERT INTO dbo.minor_categories (minor_category_name) OUTPUT INSERTED.minor_category_id VALUES (@minor_category_name)`);
        tagId = insertTag.recordset[0].minor_category_id;
      } else {
        tagId = tagLookup.recordset[0].minor_category_id;
      }

      await pool.request()
        .input("product_id", id)
        .input("minor_category_id", tagId)
        .query(`INSERT INTO dbo.link_minor_categories (product_id, minor_category_id) VALUES (@product_id, @minor_category_id)`);
    }

    await pool.close();
    res.json({ message: "✅ Product updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update product:", err);
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});







