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


    fn: async function (inputs, exits) {
        if (inputs.employeeId !== this.req.me.employeeId)
            return exits.incorrect({ message: 'Employee id incorrect' })


        var doj = this.req.me.dateOfJoining;
        var now = new Date();
        var years = (now - doj);
        years = Math.abs(years / 31557600000);

        try {
            let response = await axios.post(inputs.urlMBR + '/confirmation/employment', {
                mortId: inputs.mortId,
                employeeId: this.req.me.employeeId,
                name: this.req.me.name,
                address: this.req.me.address,
                salary: this.req.me.salary,
                yearsOfEmployment: years
            });
            return exits.success({ message: 'Request sent.' })
        } catch (err) {
            return exits.incorrect({ message: 'Error in submitting profile to broker. Error: ' + err.message })
        }
    }


};
