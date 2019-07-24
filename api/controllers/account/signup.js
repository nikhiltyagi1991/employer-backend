const crypto = require("crypto");
module.exports = {


    friendlyName: 'Signup',


    description: 'Signup account.',


    inputs: {
        employeeId: {
            type: "number",
            required: true
        },
        name: {
            type: "string",
            required: true
        },
        password: {
            type: "string",
            required: true,
            description: "New Password of the user"
        },
        confirmPwd: {
            type: "string",
            required: true,
            description: "Type in the password again."
        },
        address: {
            type: "string",
            description: "Type in address of employee."
        },
        salary: {
            type: 'number',
            description: 'Salary in dollars'
        },
        joiningDate: {
            type: 'number',
            description: 'This is an epoch date'
        }
    },


    exits: {
        success: {
            statusCode: 200,
            description: "User created"
        },
        alreadyExists: {
            statusCode: 400,
            description: "User already exists with this email"
        },
        invalidRequest: {
            statusCode: 400,
            description: "Password Confirm password not matching"
        }
    },


    fn: async function (inputs, exits) {
        // Check password and confirm password equal or not
        if (inputs.password !== inputs.confirmPwd) {
            return exits.invalidRequest({ message: 'Password and Confirm Password don\'t match.' });
        }

        let hash = crypto.createHash("sha512");
        hash.update(inputs.password);

        let registerUser = {
            employeeId: inputs.employeeId,
            name: inputs.name,
            password: hash.digest("hex")
        };

        Object.assign(registerUser, inputs.address ? { address: inputs.address } : null)

        // Create the user
        let createdUser = await Employee.findOrCreate(
            {
                employeeId: inputs.employeeId
            },
            registerUser
        );

        // Send success or fail depending if user was created or not.
        if (createdUser) {
            return exits.success({
                message: "User successfully created."
            });
        } else {
            return exits.invalidRequest({
                message: "Unable to create user."
            });
        }

    }


};
