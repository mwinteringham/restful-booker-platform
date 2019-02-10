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
            pattern: "Single|Double|Twin|Family|Suite",
            flags: "i",
            message: "can only contain the room options Single, Double, Twin, Family or Suite"
        }        
    },
    "accessible": {
        presence: true,
        customBool: null
    }
}

export const constraints = rules;