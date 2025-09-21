const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const tasks = await mongodb.getDatabase().db().collection('tasks').find().toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Tasks']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid task id' });
    }

    const taskId = new ObjectId(req.params.id);
    try {
        const tasks = await mongodb.getDatabase().db().collection('tasks').find({ _id: taskId }).toArray();
        if (!tasks[0]) return res.status(404).json({ error: 'Task not found' });
        res.status(200).json(tasks[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    const task = {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        priority: req.body.priority,
        category: req.body.category,
        notes: req.body.notes || '',
        dueDate: req.body.dueDate
    };

    try {
        const response = await mongodb.getDatabase().db().collection('tasks').insertOne(task);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Task created successfully', id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to create task' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid task id' });
    }

    const taskId = new ObjectId(req.params.id);
    const task = {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        priority: req.body.priority,
        category: req.body.category,
        notes: req.body.notes || '',
        dueDate: req.body.dueDate
    };

    try {
        const response = await mongodb.getDatabase().db().collection('tasks').replaceOne({ _id: taskId }, task);
        if (response.modifiedCount > 0) res.status(204).send();
        else res.status(404).json({ error: 'Task not found or no changes made' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Must use a valid task id' });
    }

    const taskId = new ObjectId(req.params.id);
    try {
        const response = await mongodb.getDatabase().db().collection('tasks').deleteOne({ _id: taskId });
        if (response.deletedCount > 0) res.status(204).send();
        else res.status(404).json({ error: 'Task not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createTask,
    updateTask,
    deleteTask
};