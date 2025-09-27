// controllers/adminController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Create a normal user
const addUser = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        if (!name || !email || !password || !address) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (name.length < 6 || name.length > 20) {
            return res.status(400).json({ message: 'Name field should contain 6-20 chars' });
        }
        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({ message: 'Password field should contain 8-20 chars' });
        }
        const normalizedEmail = email.toLowerCase();
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, address, password, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, role`,
            [name, normalizedEmail, address, hashedPassword, 'user']
        );

        res.status(201).json({
            message: `User added successfully`,
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
const getProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await pool.query(
            `select name,email,address,role from users where id=$1`, [id]
        );
        const admin = result.rows[0];
        res.status(200).json({ success: true, admin });

    } catch (error) {
        res.status(500).json({ error: error, message: 'Server Error' });
    }
}
// Create a store + store_owner
const addStore = async (req, res) => {
    try {
        const { name, email, password, storename, storeEmail, storeaddress } = req.body;

        if (!name || !email || !password || !storename || !storeEmail || !storeaddress) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const normalizedEmail = email.toLowerCase();
        const normalizedStoreEmail = storeEmail.toLowerCase();

        const existingUser = await pool.query('SELECT * FROM users WHERE email=$1', [normalizedEmail]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "User email already registered" });
        }

        const existingStoreEmail = await pool.query('SELECT * FROM stores WHERE email=$1', [normalizedStoreEmail]);
        if (existingStoreEmail.rows.length > 0) {
            return res.status(400).json({ error: "Store email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create store owner in users table
        const userResult = await pool.query(
            `INSERT INTO users (name, email, address, password, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, role`,
            [name, normalizedEmail, storeaddress, hashedPassword, 'store_owner']
        );

        const newStoreOwner = userResult.rows[0];

        // Create store linked to store owner
        const storeRes = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, address, owner_id`,
            [storename, normalizedStoreEmail, storeaddress, newStoreOwner.id]
        );

        res.status(201).json({
            success: true,
            message: 'Created Store Owner and store',
            storeOwner: newStoreOwner,
            store: storeRes.rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error, message: 'Server Error' });
    }
};

// Create an admin
const addAdmin = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        if (!name || !email || !password || !address) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }

        const normalizedEmail = email.toLowerCase();

        if (name.length < 6 || name.length > 20) {
            return res.status(400).json({ error: "Name must be 6-20 chars" });
        }
        if (address.length > 400) {
            return res.status(400).json({ error: "Address too long" });
        }
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(password)) {
            return res.status(400).json({ error: "Password must be 8-16 chars, include uppercase & special char" });
        }
        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        const existing = await pool.query(`SELECT * FROM users WHERE email=$1`, [normalizedEmail]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email Already Registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminResult = await pool.query(
            `INSERT INTO users (name, email, password, address, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, address, role`,
            [name, normalizedEmail, hashedPassword, address, 'admin']
        );

        res.status(201).json({
            message: 'Admin added successfully',
            admin: adminResult.rows[0]
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error, message: 'Server error' });
    }
};

//dashboard
const getDashboardStats = async (req, res) => {
    try {
        const totalRatingsResult = await pool.query(
            'SELECT COUNT(*) AS total_ratings FROM ratings'
        );
        const totalUsersResult = await pool.query(
            "SELECT COUNT(*) AS total_users FROM users WHERE role='user'"
        );
        const totalStoresResult = await pool.query(
            "SELECT COUNT(*) AS total_stores FROM stores"
        );

        let total_ratings = parseInt(totalRatingsResult.rows[0].total_ratings);
        const total_users = parseInt(totalUsersResult.rows[0].total_users);
        const total_stores = parseInt(totalStoresResult.rows[0].total_stores);
        total_ratings = Math.round(total_ratings * 100) / 100;
        return res.status(200).json({
            success: true,
            total_ratings,
            total_users,
            total_stores
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: "Server error" });
    }
};
//getStores
const getStores = async (req, res) => {
    try {
        let { sortField = "id", sortOrder = "asc", page = 1, limit = 10, name, email, address, rating } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        // Whitelisted sort fields (to prevent SQL injection)
        const validSortFields = ["id", "name", "email", "address", "avg_rating"];
        const validSortOrders = ["asc", "desc"];

        const safeSortField = validSortFields.includes(sortField) ? sortField : "id";
        const safeSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

        let filters = [];
        let params = [];

        if (name) {
            params.push(`%${name}%`);
            filters.push(`s.name ILIKE $${params.length}`);
        }
        if (email) {
            params.push(`%${email}%`);
            filters.push(`s.email ILIKE $${params.length}`);
        }
        if (address) {
            params.push(`%${address}%`);
            filters.push(`s.address ILIKE $${params.length}`);
        }

        // Base WHERE clause
        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        // Main query
        let query = `
            SELECT s.id, s.name, s.email, s.address,
                   ROUND(COALESCE(AVG(sr.rating), 0)::numeric, 2) AS avg_rating
            FROM stores s
            LEFT JOIN ratings sr ON s.id = sr.store_id
            ${whereClause}
            GROUP BY s.id
        `;

        // Add rating filter (HAVING works on aggregates)
        if (rating) {
            params.push(Number(rating));
            query += ` HAVING ROUND(COALESCE(AVG(sr.rating), 0)::numeric, 2) >= $${params.length}`;
        }

        // Add sorting
        query += safeSortField === "avg_rating"
            ? ` ORDER BY avg_rating ${safeSortOrder}`
            : ` ORDER BY s.${safeSortField} ${safeSortOrder}`;

        // Add pagination
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        // Execute query
        const result = await pool.query(query, params);

        res.json({
            success: true,
            stores: result.rows,
            pagination: {
                page,
                limit,
                count: result.rows.length,
            },
        });
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};





const getUsers = async (req, res) => {
    try {
        let { name, email, address, sortField = "id", sortOrder = "asc", page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        let baseQuery = "FROM users WHERE role='user'";
        let conditions = [];
        let params = [];

        if (name) {
            params.push(`%${name}%`);
            conditions.push(`name ILIKE $${params.length}`);
        }
        if (email) {
            params.push(`%${email}%`);
            conditions.push(`email ILIKE $${params.length}`);
        }
        if (address) {
            params.push(`%${address}%`);
            conditions.push(`address ILIKE $${params.length}`);
        }

        if (conditions.length > 0) {
            baseQuery += " AND " + conditions.join(" AND ");
        }

        const countResult = await pool.query(`SELECT COUNT(*) ${baseQuery}`, params);
        const total = parseInt(countResult.rows[0].count);

        const allowedFields = ["id", "name", "email", "address"];
        if (!allowedFields.includes(sortField)) sortField = "id";
        sortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

        const query = `
            SELECT id, name, email, address, role
            ${baseQuery}
            ORDER BY ${sortField} ${sortOrder}
            LIMIT ${limit} OFFSET ${offset}
        `;

        const userResult = await pool.query(query, params);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            users: userResult.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

const getAdmins = async (req, res) => {
    try {
        let { sortField = "id", sortOrder = "asc", page = 1, limit = 10, name, email, address } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        // ✅ Allowed fields (prevent SQL injection)
        const allowedFields = ["id", "name", "email", "address"];
        sortField = allowedFields.includes(sortField) ? sortField : "id";
        sortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

        let filters = [];
        let params = [];

        if (name) {
            params.push(`%${name}%`);
            filters.push(`name ILIKE $${params.length}`);
        }
        if (email) {
            params.push(`%${email}%`);
            filters.push(`email ILIKE $${params.length}`);
        }
        if (address) {
            params.push(`%${address}%`);
            filters.push(`address ILIKE $${params.length}`);
        }

        // ✅ Build WHERE clause
        let whereClause = `WHERE role='admin'`;
        if (filters.length > 0) {
            whereClause += " AND " + filters.join(" AND ");
        }

        // ✅ Count query (for pagination)
        const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
        const countResult = await pool.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // ✅ Final query
        const query = `
            SELECT id, name, email, address, role
            FROM users
            ${whereClause}
            ORDER BY ${sortField} ${sortOrder}
            LIMIT ${limit} OFFSET ${offset}
        `;

        const adminResult = await pool.query(query, params);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            admins: adminResult.rows
        });

    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};




module.exports = {
    addUser, addStore, addAdmin, getDashboardStats,
    getStores, getUsers, getAdmins, getProfile
};
