import validate from 'validate.js';

validate.validators.customBool = (value, options, key, attributes) => {
    if(typeof value !== 'boolean'){
        if(value !== 'true' || value !== 'false'){
            return 'can only contain be true or false'
        }
    }
}

let rules = {
    'room' : {
        'roomNumber': {
            presence: true,
            numericality: {
                onlyInteger: true,
                greaterThan: 0,
                lessThanOrEqualTo: 999
            },

        },
        'type': {
            presence: true,
            format: {
                pattern: 'Single|Double|Twin|Family|Suite',
                flags: 'i',
                message: 'can only contain the room options Single, Double, Twin, Family or Suite'
            }        
        },
        'accessible': {
            presence: true,
            customBool: null
        }
    },

    'booking' : {
        firstname : {
            presence: true,
            format: {
                pattern: '[a-zA-Z]+',
                flags: 'i',
                message: 'can only contain alphas'
            },
            length: {
                maximum: 18,
                minimum: 3
            }
        },
        lastname : {
            presence: true,
            format: {
                pattern: '[a-zA-Z]+',
                flags: 'i',
                message: 'can only contain alphas'
            },
            length: {
                maximum: 30,
                minimum: 3
            }
        },
        totalprice: {
            presence: true,
            numericality: {
                onlyInteger: true,
                greaterThan: 10,
                lessThanOrEqualTo: 999
            }
        },
        depositpaid: {
            presence: true,
            format: {
                pattern: 'true|false',
                flags: 'i',
                message: 'can only be true or false'
            }
        },
        'bookingdates.checkin': {
            presence: true,
            format: {
                pattern: '[0-9]...-[0-9].-[0-9].',
                flags: 'i',
                message: 'can only be YYYY-MM-DD format got'
            }
        },
        'bookingdates.checkout': {
            presence: true,
            format: {
                pattern: '[0-9]...-[0-9].-[0-9].',
                flags: 'i',
                message: 'can only be YYYY-MM-DD format'
            }
        }
    }
}

export const constraints = rules;