const http = require('http');
module.exports = {


    friendlyName: 'Borrower info',


    description: '',


    inputs: {
        applicationNo: {
            type: 'number',
            required: true,
        },
        brokerAddress: {
            type: 'string',
            required: true
        },
        consent: {
            type: 'boolean',
            required: true
        }
    },


    exits: {
        success: {
            statusCode: 200,
            description: "Info sent successfully"
        },
        invalidRequest: {
            statusCode: 400,
            description: 'Consent not provided'
        },
        errorInSending: {
            statusCode: 409,
            description: "Third party conflict"
        }
    },


    fn: async function (inputs, exits) {
        if (!consent) {
            exits.invalidRequest({ message: 'Consent not provided.' });
        }

        let userInfo = this.req.me
        delete userInfo['password'];
        userInfo.applicationNo = inputs.applicationNo;

        const options = {
            url: inputs.brokerAddress,
            port: 80,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(userInfo).length
            }
        };

        const req = http.request(options, (res) => {
            let response = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                response += chunk;
            });
            res.on('end', () => {
                let resp = JSON.parse(response);
                if (res.statusCode === 200) {
                    return exits.errorInSending({ message: 'Successfully sent information to borrower.' })
                }
            });
        });

        req.on('error', (e) => {
            return exits.errorInSending({ message: e.message });
        });

        // Write data to request body
        req.write(userInfo);
        req.end();
    }


};
