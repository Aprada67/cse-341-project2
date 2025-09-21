const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const db = mongodb.getDatabase().db();
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Must use a valid user id' });
        }

        const userId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase().db();
        const users = await db.collection('users').find({ _id: userId }).toArray();

        if (!users[0]) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(users[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const user = {
            username: req.body.username,
            email: req.body.email,
            passwordHash: req.body.passwordHash
        };

        const db = mongodb.getDatabase().db();
        const response = await db.collection('users').insertOne(user);

        if (response.acknowledged) {
            res.status(201).json({ message: 'User created successfully', id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Must use a valid user id' });
        }

        const userId = new ObjectId(req.params.id);
        const user = {
            username: req.body.username,
            email: req.body.email,
            passwordHash: req.body.passwordHash
        };

        const db = mongodb.getDatabase().db();
        const response = await db.collection('users').replaceOne({ _id: userId }, user);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found or no changes made' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Must use a valid user id' });
        }

        const userId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase().db();
        const response = await db.collection('users').deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};
