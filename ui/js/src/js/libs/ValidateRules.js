import validate from 'validate.js';

validate.validators.customBool = (value, options, key, attributes) => {
    if(typeof value !== 'boolean'){
        if(value !== "true" || value !== "false"){
            return "can only contain be true or false"
        }
    }
}

let rules = {
    "roomNumber": {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
            lessThanOrEqualTo: 999
        }
    },
    "type": {
        presence: true,
        format: {
            pattern: "Single|Twin|Family|Suite",
            flags: "i",
            message: "can only contain the room options Single, Twin, Family, Suite"
        }        
    }, 
    "beds": {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThan: 0,
            lessThanOrEqualTo: 10
        }
    },
    "accessible": {
        presence: true,
        customBool: null
    },
    "details": {
        presence: true,
        length: {
            maximum: 2000,
            minimum: 1
        },
        format: {
            pattern: "[ ,-A-Za-z0-9]+",
            flags: "i",
            message: "can only contain A-Z, a-z and 0-9"
        }        
    }
}

export const constraints = rules;