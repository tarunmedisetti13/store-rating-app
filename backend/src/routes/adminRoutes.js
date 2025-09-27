const { verifyToken } = require('../middlewares/authMiddleware');
const { addAdmin, addUser, addStore,
    getDashboardStats, getStores, getUsers, getAdmins, getProfile

} = require('../controllers/adminController');
const express = require('express');
const { updatePassword } = require('../controllers/authController');
const adminRouter = express.Router();

adminRouter.post('/update-password', updatePassword);
adminRouter.post('/add-store', addStore);
adminRouter.post('/add-admin', addAdmin)
adminRouter.post('/add-user', addUser);
adminRouter.get('/dashboard', getDashboardStats);
adminRouter.get('/stores', getStores);
adminRouter.get('/users', getUsers);
adminRouter.get('/admins', getAdmins);
adminRouter.get('/profile', getProfile);

module.exports = adminRouter;