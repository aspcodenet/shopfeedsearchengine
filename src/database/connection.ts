import { createPool } from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();
 

const pool = createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

export const connection = pool.getConnection()