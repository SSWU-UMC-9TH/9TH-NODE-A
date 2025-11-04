import mysql from "mysql2/promise";
import 'dotenv/config'; // dotenv를 import 해야 process.env를 사용할 수 있습니다.

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", 
  user: process.env.DB_USER || "node_user", 
  port: process.env.DB_PORT || 3306, 
  database: process.env.DB_NAME || "umc_node_db", 
  password: process.env.DB_PASSWORD || "node_password123", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});