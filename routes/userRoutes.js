const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const uploadPictures = require('../utils/uploadPictures');

router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.post('/signup', userController.signup);
router.patch('/updateMe', userController.protect, uploadPictures, userController.updateMe);
router.patch('/updatePass', userController.protect, userController.updatePass);
router.get('/getUser', userController.getUser);
router.post('/contact', userController.contact);

module.exports = router;
