const express = require('express');
const userController = require('../controllers/userController');
const projectController = require('../controllers/projectController');
const uploadPictures = require('../utils/uploadPictures');
const router = express.Router();

router.route('/').get(projectController.getAllProjects).post(userController.protect, uploadPictures, projectController.createProject);
router.route('/categories').get(projectController.getCategories);
router.route('/:id').get(projectController.getProject).patch(userController.protect, uploadPictures, projectController.updateProject).delete(userController.protect, projectController.deleteProject);



module.exports = router;
