const jwt = require('jsonwebtoken');
const crypto = require('crypto');
module.exports = {


    friendlyName: 'Login',


    description: 'Login account.',


    inputs: {
        employeeId: {
            type: 'number',
            description: 'Employee id of the user.',
            required: true
        },
        password: {
            type: 'string',
            description: 'password in simple format',
            required: true
        }
    },


    exits: {
        success: {
            statusCode: 200,
            description: 'Login Success'
        },
        userNotFound: {
            statusCode: 401,
            description: 'Unauthorized User'
        }

    },


    fn: async function (inputs, exits) {
        let hash = crypto.createHash('sha512');
        hash.update(inputs.password);
        let hashedPwd = hash.digest('hex');
        let loginUser = await Employee.findOne({
            employeeId: inputs.employeeId,
            password: hashedPwd
        });

        if (loginUser) {
            // User successfully found
            delete loginUser['password'];
            let payload = {
                userId: loginUser.id
            };
            let jwtToken = jwt.sign(payload, sails.config.session.secret, { expiresIn: '24h' });
            return exits.success({
                token: jwtToken,
                employeeId: loginUser.employeeId,
                name: loginUser.name
            });
        } else {
            return exits.userNotFound({ message: 'Login Email or Password Invalid.' });
        }
    }


};
