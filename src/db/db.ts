import mysql from 'mysql2/promise';

// 建立連線池
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function getAllUsers() {
    try {
        // 1. 從 pool 取得連線
        const connection = await pool.getConnection();

        // 2. 執行查詢
        const [rows] = await connection.query('SELECT * FROM users');

        console.log('Query result:', rows);

        // 3. 釋放連線
        connection.release();
    } catch (err) {
        console.error('MySQL Error:', err);
    }
}
