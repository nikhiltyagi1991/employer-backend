const axios = require('axios');

module.exports = {


    friendlyName: 'Application',


    description: 'Application share.',


    inputs: {
        employeeId: {
            type: 'number',
            description: 'Employee id of the user.',
            required: true
        },
        mortId: {
            type: 'string',
            description: 'mortgage id.',
            required: true
        },
        urlMBR: {
            type: 'string',
            description: 'url of the mbr.',
            required: true
        }
    },


    exits: {
        success: {
            statusCode: 200,
            description: 'success'
        },
        incorrect: {
            statusCode: 400,
            description: 'incorrect request'
        }
    },


    fn: async function (inputs) {
        if (inputs.employeeId !== this.req.me.employeeId)
            return exits.incorrect({ message: 'Employee id incorrect' })

        try {
            let response = await axios.post(inputs.urlMBR + '/confirmation/employment', {
                mortId: inputs.mortId,
                employeeId: this.req.me.employeeId,
                employeeName: this.req.me.name,
                address: this.req.me.address,
                salary: this.req.me.salary,
                yearsOfEmployment: (this.req.me.dateOfJoining - new Date())
            });
            return this.exits.incorrect({ message: 'Request sent.' })
        } catch (err) {
            return this.exits.incorrect({ message: 'Error in submitting profile to broker.' })
        }
    }


};
