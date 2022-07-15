const request = require("supertest");
const app = require("../app");

// Test transfer
test("1", () => {
    expect(true);
    const url = "/ripple-integration/transfer";

    const body = {
        query: {
            "TransactionType": "Payment",
            "Account": 'rn54TBHXvWfwWpGYnCHeETTpJAXUQp73jX',
            "Amount": "0.001",
            "Destination": 'rKSRW6fEuD2KCq3J4oYWWeE8BPK4gJu5PF',
            "Fee": "0.0001",
        },
        secret: 'ss7VkpEK4E6CqBY4sUouJ1FLdJYU3'
    };

    return request(app)
        .post(url)
        .send(body)
        .then(response => {
            // Validate if we have valid response
            expect(response.statusCode).toBe(200);
            expect(response.body.hash).toBe('onzXEzuigrHW8NCFndiUJxeME58HSs6tr6LBbjwPSKuiouZ9Mpc');
        });
});