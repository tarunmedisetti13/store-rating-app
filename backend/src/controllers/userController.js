const pool = require('../config/db');
const bcrypt = require('bcrypt');
// const addRating = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const { storeId, rating } = req.body;
//         if (!storeId || !rating) {
//             return res.status(400).json({ message: 'StoreId and rating required' });
//         }
//         const ratingNum = Number(rating);
//         if (!Number.isInteger(ratingNum)) {
//             return res.status(400).json({ message: 'Rating must be Integer not in float' });
//         }
//         if (!storeId || !rating || rating < 1 || rating > 5) {
//             return res.status(400).json({
//                 message: 'All fields required and rating must be 1-5'
//             });
//         }
//         const existing = await pool.query(
//             'select * from ratings where store_id=$1 and user_id=$2',
//             [storeId, userId]
//         );
//         if (existing.rows.length > 0) {
//             await pool.query(
//                 `update ratings set rating=$1 where store_id=$2 and user_id=$3`,
//                 [rating, storeId, userId]
//             );
//         } else {
//             await pool.query(
//                 'insert into ratings (store_id,user_id,rating) values ($1,$2,$3)',
//                 [storeId, userId, rating]
//             );
//         }
//         res.status(200).json({ success: true, message: "Rating submitted successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: error,
//             message: 'Server Error'
//         });
//     }
// }

const getStores = async (req, res) => {
    const { search } = req.query;
    try {
        let query = 'SELECT s.id, s.name, s.address, COALESCE(AVG(r.rating),0) AS overall_rating FROM stores s LEFT JOIN ratings r ON s.id=r.store_id GROUP BY s.id';
        let params = [];
        if (search) {
            query = 'SELECT s.id, s.name, s.address, COALESCE(AVG(r.rating),0) AS overall_rating FROM stores s LEFT JOIN ratings r ON s.id=r.store_id WHERE s.name ILIKE $1 OR s.address ILIKE $1 GROUP BY s.id';
            params = [`%${search}%`];
        }
        const stores = await pool.query(query, params);
        res.status(200).json({ success: true, stores: stores.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// 5️⃣ Add / update rating (from your code)
const addRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId, rating } = req.body;
        if (!storeId || !rating) return res.status(400).json({ message: 'StoreId and rating required' });

        const ratingNum = Number(rating);
        if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ message: 'Rating must be integer between 1-5' });
        }

        const existing = await pool.query(
            'SELECT * FROM ratings WHERE store_id=$1 AND user_id=$2',
            [storeId, userId]
        );

        if (existing.rows.length > 0) {
            await pool.query(
                'UPDATE ratings SET rating=$1 WHERE store_id=$2 AND user_id=$3',
                [ratingNum, storeId, userId]
            );
        } else {
            await pool.query(
                'INSERT INTO ratings (store_id,user_id,rating) VALUES ($1,$2,$3)',
                [storeId, userId, ratingNum]
            );
        }

        res.status(200).json({ success: true, message: "Rating submitted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
const getUserRatings = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT 
                r.id AS rating_id,
                r.rating,
                s.id AS store_id,
                s.name AS store_name,
                s.address AS store_address
             FROM ratings r
             JOIN stores s ON r.store_id = s.id
             WHERE r.user_id = $1
             ORDER BY r.id DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            ratings: result.rows
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getProfile = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).json({ message: 'No user id provided' });
    }
    const userResult = await pool.query(
        `select name,email,address,role from users where id=$1`, [userId]
    );
    if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: "Owner not found" });
    }
    const user = userResult.rows[0];
    return res.status(200).json({ success: true, user });

}
module.exports = { addRating, getStores, getUserRatings, getProfile };
