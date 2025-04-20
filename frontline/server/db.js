import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    password: "6853",
    host: "localhost",
    port: 5432,
    database: "frontline"
});

export default pool;