const express = require('express');
const authRouter = express.Router();

const { signup, login,
    createAdmin, adminLogin } = require('../controllers/authController');

authRouter.post('/user/signup', signup);
authRouter.post('/login', login);
authRouter.post('/admin/signup', createAdmin);
module.exports = authRouter;
