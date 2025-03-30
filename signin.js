// example.js
const { connectDB, sql } = require('./dbConfig');

async function fetchUsers() {
    let pool = await connectDB(); // Get DB connection
    let result = await pool.request().query('SELECT * FROM [dbo].[Users]');
    console.log(result.recordset);
    await pool.close();
}

fetchUsers();
