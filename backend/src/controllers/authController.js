const pool = require('../config/db');
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');
const signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        let normalizedEmail = email.toLowerCase();
        if (!name || !email || !password || !address) {
            return res.status(400).json({ success: false, message: 'All fields required - name,email,password,address' });
        }
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
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }
        //password hash
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
            [name, normalizedEmail, address, hashedPassword, "user"]
        );
        const newUser = result.rows[0];
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role, email: newUser.email },
            process.env.JWT_SECRET || "mysecret",
            { expiresIn: "2h" }
        );
        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: 'server error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let normalizedEmail = email.toLowerCase();
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const existingUser = await pool.query(
            "select * from users where email=$1",
            [normalizedEmail]
        );
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ error: "Email not found" });
        }
        const user = existingUser.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Password not matches" });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || "mysecret",
            { expiresIn: "2h" }
        );
        const { password: pwd, ...safeUser } = user;
        res.status(200).json({
            message: 'Login Successful',
            user: safeUser,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: 'server error' });
    }
}
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id; // from JWT token (middleware sets this)
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both current and new password are required" });
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({ error: "Both current and new password must be different" });

        }

        // Fetch user
        const userResult = await pool.query("SELECT id, password FROM users WHERE id=$1", [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult.rows[0];

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Validate new password (8-20 chars, at least 1 uppercase, 1 special char)
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/.test(newPassword)) {
            return res.status(400).json({
                error: "New password must be 8-20 characters long, include at least 1 uppercase and 1 special character"
            });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password=$1 WHERE id=$2", [hashedPassword, userId]);

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ error: error, message: "Server error" });
    }
}
// Create Admin
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        let normalizedEmail = email.toLowerCase();
        if (!name || !normalizedEmail || !password || !address) {
            return res.status(400).json({ error: "All fields required" });
        }

        // 1️⃣ Check if any admin already exists
        const adminCheck = await pool.query(
            "SELECT * FROM users WHERE role = 'admin'"
        );

        if (adminCheck.rows.length > 0) {
            return res.status(403).json({ error: "Admin already exists. Only admins can create new admins." });
        }

        // 2️⃣ Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [normalizedEmail]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Insert admin
        const result = await pool.query(
            "INSERT INTO users (name, email, address, password, role) VALUES ($1,$2,$3,$4,'admin') RETURNING id, name, email, role",
            [name, normalizedEmail, address, hashedPassword]
        );
        const newAdmin = result.rows[0];

        // 5️⃣ Generate token
        const token = jwt.sign(
            { id: newAdmin.id, role: newAdmin.role, email: newAdmin.email },
            process.env.JWT_SECRET || "mysecret",
            { expiresIn: "2h" }
        );

        res.status(201).json({ message: "Admin created successfully", admin: newAdmin, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        email = email.toLowerCase();
        const result = await pool.query(
            "select * from users where email=$1", [email]
        );
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password" });

        }
        const admin = result.rows[0];
        if (admin.role !== 'admin') {
            return res.status(403).json({ error: "Access denied: not an admin" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign(
            { id: admin.id, role: admin.role, email: admin.email },
            process.env.JWT_SECRET || "mysecret",
            { expiresIn: "2h" }
        );
        const { password: pwd, ...safeUser } = admin;
        res.status(200).json({
            message: "Admin login successful",
            user: safeUser,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: 'server error' });

    }
}
module.exports = {
    signup, login, createAdmin, adminLogin, updatePassword
}
