const express = require('express');
const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const router = express.Router();

router.route('/').get(serviceController.getAllServices).post(userController.protect, serviceController.createService);
router.route('/:id').get(serviceController.getService).patch(userController.protect, serviceController.updateService).delete(userController.protect, serviceController.deleteService);


module.exports = router;
