const validator = require('../helpers/userValidate');

const saveUser = (req, res, next) => {
    const validationRule = {
        username: 'required|string',
        email: 'required|email',
        passwordHash: 'required|string'
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        } else {
            next();
        }
    });
};

module.exports = {
    saveUser
};