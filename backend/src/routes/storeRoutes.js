const express = require('express');
const { getStoreDashboard, getStoreUserRatings, getStoreProfile, updateStorePassword } = require('../controllers/storeController');

const storeRouter = express.Router();

storeRouter.get('/dashboard', getStoreDashboard);
storeRouter.get('/user-ratings', getStoreUserRatings);
storeRouter.put('/update-password', updateStorePassword)
storeRouter.get('/profile', getStoreProfile)
module.exports = { storeRouter };