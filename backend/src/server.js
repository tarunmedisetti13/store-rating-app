const express = require('express');
const authRouter = require('./routes/authRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');
const { storeRouter } = require('./routes/storeRoutes');
const cors = require('cors');

require("./config/db");
const app = express();
app.use(express.json());

const allowedOrigins = process.env.CLIENT_URL.split(",");
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use('/api/auth', authRouter);
app.use('/api/admin', verifyToken(['admin']), adminRouter);
app.use('/api/user', verifyToken(['user']), userRouter);
app.use('/api/store', verifyToken(['store_owner']), storeRouter);
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server running on ${port}`);
})