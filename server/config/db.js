import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// PostgreSQL connection setup
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Function to test the database connection
export const connectDB = async () => {
    try {
        await pool.connect();
        console.log('PostgreSQL Connected!');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the application if DB connection fails
    }
};

// Export the `pool` instance for making queries
export { pool };
