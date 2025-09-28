const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks');
const validation = require('../middleware/taskValidate');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getSingle);
router.post('/', validation.saveTask, isAuthenticated, tasksController.createTask);
router.put('/:id', validation.saveTask, isAuthenticated, tasksController.updateTask);
router.delete('/:id', isAuthenticated,tasksController.deleteTask);

module.exports = router;