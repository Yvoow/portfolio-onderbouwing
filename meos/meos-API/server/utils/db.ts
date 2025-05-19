import * as mysql from 'mysql2/promise';

export const meosPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_DATABASE || 'meos',
  port: parseInt(process.env.DB_PORT || '3306', 10),
});
