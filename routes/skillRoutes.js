const express = require('express');
const userController = require('../controllers/userController');
const skillController = require('../controllers/skillController');
const router = express.Router();

router.route('/').get(skillController.getAllSkills).post(userController.protect, skillController.createSkill);
router.route('/:id').get(skillController.getSkill).patch(userController.protect, skillController.updateSkill).delete(userController.protect, skillController.deleteSkill);


module.exports = router;
