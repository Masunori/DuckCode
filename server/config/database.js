import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "duckcode_dev", 
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: process.env.DATABASE_PORT || 5432,
    dialect: "postgres",
    logging: console.log, // Enable SQL logging in development
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
    },
  },
  test: {
    username: process.env.DATABASE_TEST_USERNAME || "postgres",
    password: process.env.DATABASE_TEST_PASSWORD || "",
    database: process.env.DATABASE_TEST_NAME || "duckcode_test",
    host: process.env.DATABASE_TEST_HOST || "127.0.0.1",
    port: process.env.DATABASE_TEST_PORT || 5432,
    dialect: "postgres",
    logging: false, // Disable logging in test
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: false
    },
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // Disable logging in production
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  },
};
