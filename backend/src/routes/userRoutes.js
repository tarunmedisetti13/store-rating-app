const express = require('express');
const userRouter = express.Router();
const { addRating, getStores, getUserRatings, getProfile } = require('../controllers/userController');
const { updatePassword } = require('../controllers/authController')
userRouter.put('/update-password', updatePassword);
userRouter.post('/add-rating', addRating);
userRouter.get('/stores', getStores);
userRouter.get('/ratings', getUserRatings);
userRouter.get('/profile', getProfile);

module.exports = userRouter;