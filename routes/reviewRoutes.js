const express = require('express');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const router = express.Router();
const uploadPictures = require('../utils/uploadPictures');

router.route('/').get(reviewController.getAllReviews).post(userController.protect, uploadPictures, reviewController.createReview);
router.route('/:id').delete(userController.protect, reviewController.deleteReview);


module.exports = router;
