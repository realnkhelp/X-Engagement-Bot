import mysql from 'mysql2/promise';

// SSL Certificate handling for TiDB Cloud
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '4000'),
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false // Cloud databases ke liye often false rakhna padta hai
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const db = mysql.createPool(dbConfig);