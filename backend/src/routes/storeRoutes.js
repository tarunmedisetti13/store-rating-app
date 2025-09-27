const express = require('express');
const { updatePassword, } = require('../controllers/authController');
const { getStoreDashboard, getStoreUserRatings, getStoreProfile, updateStorePassword } = require('../controllers/storeController');

const storeRouter = express.Router();

storeRouter.post('/update-password', updatePassword);
storeRouter.get('/dashboard', getStoreDashboard);
storeRouter.get('/user-ratings', getStoreUserRatings);
storeRouter.put('/update-password', updateStorePassword)
storeRouter.get('/profile', getStoreProfile)
module.exports = { storeRouter };