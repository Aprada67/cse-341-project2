const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks');
const validation = require('../middleware/taskValidate');

router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getSingle);
router.post('/', validation.saveTask, tasksController.createTask);
router.put('/:id', validation.saveTask, tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;