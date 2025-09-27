const pool = require('../config/db');

const getStoreDashboard = async (req, res) => {
    try {
        const storeOwnerId = req.user.id;

        // 1️⃣ Get store of this owner
        const storeResult = await pool.query(
            'SELECT id, name FROM stores WHERE owner_id=$1',
            [storeOwnerId]
        );
        if (storeResult.rows.length === 0) {
            return res.status(404).json({ error: "Store not found for this owner" });
        }
        const store = storeResult.rows[0];

        // 2️⃣ Get average rating & total ratings
        const statsResult = await pool.query(
            `SELECT 
                 COALESCE(ROUND(AVG(rating)::numeric, 2), 0) AS avg_rating,
                 COUNT(*) AS total_ratings
             FROM ratings
             WHERE store_id=$1`,
            [store.id]
        );

        res.status(200).json({
            success: true,
            store: {
                id: store.id,
                name: store.name,
                avg_rating: statsResult.rows[0].avg_rating,
                total_ratings: parseInt(statsResult.rows[0].total_ratings, 10)
            }
        });

    } catch (error) {
        console.error("Store dashboard error:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

const getStoreUserRatings = async (req, res) => {
    try {
        const storeOwnerId = req.user.id;
        const { sortField = "name", sortOrder = "asc", page = 1, limit = 10 } = req.query;

        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Validate store
        const storeResult = await pool.query(
            "SELECT id, name FROM stores WHERE owner_id=$1",
            [storeOwnerId]
        );
        if (storeResult.rows.length === 0) {
            return res.status(404).json({ error: "Store not found for this owner" });
        }
        const store = storeResult.rows[0];

        // Allowed fields for sorting
        const allowedFields = ["name", "email", "rating"];
        let safeSortField = allowedFields.includes(sortField) ? sortField : "name";
        let safeSortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

        // Fetch users who rated this store
        const userRatingsQuery = `
            SELECT u.id, u.name, u.email, r.rating
            FROM ratings r
            JOIN users u ON u.id = r.user_id
            WHERE r.store_id = $1
            ORDER BY ${safeSortField === "rating" ? "r.rating" : `u.${safeSortField}`} ${safeSortOrder}
            LIMIT $2 OFFSET $3
        `;
        const userRatingsRes = await pool.query(userRatingsQuery, [store.id, limitNum, offset]);

        // Total count
        const countRes = await pool.query(
            "SELECT COUNT(*) FROM ratings WHERE store_id=$1",
            [store.id]
        );
        const total = parseInt(countRes.rows[0].count);

        res.status(200).json({
            success: true,
            page: pageNum,
            limit: limitNum,
            total,
            store: { id: store.id, name: store.name },
            user_ratings: userRatingsRes.rows
        });

    } catch (error) {
        console.error("Error fetching user ratings:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
const getStoreProfile = async (req, res) => {
    try {
        const storeOwnerId = req.user.id; // from auth middleware

        // 1️⃣ Get store owner info
        const ownerResult = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE id = $1`,
            [storeOwnerId]
        );
        if (ownerResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Owner not found" });
        }
        const owner = ownerResult.rows[0];

        // 2️⃣ Get store info
        const storeResult = await pool.query(
            `SELECT id, name, email, address
             FROM stores
             WHERE owner_id = $1`,
            [storeOwnerId]
        );

        const store = storeResult.rows.length > 0 ? storeResult.rows[0] : null;

        res.status(200).json({
            success: true,
            owner,
            store
        });
    } catch (error) {
        console.error("Store profile error:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
const updateStorePassword = async (req, res) => {
    try {
        const storeOwnerId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const userRes = await pool.query(`SELECT password FROM users WHERE id=$1`, [storeOwnerId]);
        if (!userRes.rows.length) return res.status(404).json({ error: "User not found" });

        const bcrypt = require("bcrypt");
        const match = await bcrypt.compare(currentPassword, userRes.rows[0].password);
        if (!match) return res.status(400).json({ error: "Current password is incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query(`UPDATE users SET password=$1 WHERE id=$2`, [hashed, storeOwnerId]);

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};




module.exports = { getStoreDashboard, getStoreUserRatings, getStoreProfile, updateStorePassword }