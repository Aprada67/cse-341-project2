const validator = require('../helpers/taskValidate');

const saveTask = (req, res, next) => {
    const validationRule = {
        title: 'required|string',
        description: 'required|string',
        completed: 'required|boolean',
        priority: 'required|string',
        category: 'required|string',
        notes: 'string',
        dueDate: 'required|date'
    };

    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            return res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        }
        next();
    });
};

module.exports = {
    saveTask
};