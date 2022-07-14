const { is_query_validator } = require('../app/services/ripple_service')
require('dotenv').config({ path: __dirname + '/../.env' });

const customer_a = {
    wallet_address: 'rKSRW6fEuD2KCq3J4oYWWeE8BPK4gJu5PF',
    secret: 'ss8VXscmez6x2T3KEejRCbFC8rP6E'
}

const customer_b = {
    wallet_address: 'rn54TBHXvWfwWpGYnCHeETTpJAXUQp73jX',
    secret: 'ss7VkpEK4E6CqBY4sUouJ1FLdJYU3'
}

describe('Unit Test Ripple_service Suite', () => {

    test('valid query ', () => {
        let query = {
            "TransactionType": "Payment",
            "Account": "rP4Th2BRu7wWD6nS8ektKnMkCjf6sHXbm5",
            "Destination": "rBMJvAfH5uEGopno5C5CJyEPsQ7y51oYiz",
            "Amount": "1.26",
            "Fee": "0.004",
        }
        expect(is_query_validator(query)).toBe(true);
    })

    test('invalid query -> object keys ', () => {
        let query = {
            "Transactio23nType": "Paymasdent",
            "Accoaaunt": "rP4Th2BRu7wWD6nS8ektKnMkCjf6sHXbm5",
            "Destdddination": "rBMJvAfH5uEGopno5C5CJyEPsQ7y51oYiz",
            "Amossunt": "1.26",
            "Fee": "0.004",
        }
        expect(is_query_validator(query)).toBe(false);
    })

    test('invalid query -> object values', () => {
        let query = {
            "TransactionType": "Payment",
            "Account": "rP4Th2BRu7wW2134124512341243D6nS8ektKnMkCjf6sHXbm5",
            "Destination": "rBMJvAfH5uEGopno1l5C5CJyEPsQ7y51oYiz",
            "Amount": "1.26",
            "Fee": "0.004",
        }
        expect(is_query_validator(query)).toBe(false);
    })

    test('invalid query -> amount value non digit ', () => {
        let query = {
            "TransactionType": "Payment",
            "Account": "rP4Th2BRu7wWD6nS8ektKnMkCjf6sHXbm5",
            "Destination": "rBMJvAfH5uEGopno5C5CJyEPsQ7y51oYiz",
            "Amount": "1.2ea6cb",
            "Fee": "0.004",
        }
        expect(is_query_validator(query)).toBe(false);
    })

});
