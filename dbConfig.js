const sql = require('mssql');

const config = {
    server: 'local-artisan-marketplace-server.database.windows.net',
    database: 'local-artisan-marketplace',
    authentication: {
        type: 'azure-active-directory-default' 
    },
    options: {
        encrypt: true
    }
};

async function connectDB() {
    try {
        let pool = await sql.connect(config);
        console.log("👻 Connected to Azure SQL Database!");
        return pool;
    } catch (err) {
        console.error("😔 Database connection error:", err);
        throw err;
    }
}

module.exports = { connectDB, sql };