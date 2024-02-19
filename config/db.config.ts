import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

export const connection = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: parseInt(process.env.DB_PORT as string) || 5433,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
})
