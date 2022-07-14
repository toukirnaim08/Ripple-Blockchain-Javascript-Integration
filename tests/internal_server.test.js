const request = require("supertest");
const app = require("../app");
const customer_a = {
    wallet_address: 'rKSRW6fEuD2KCq3J4oYWWeE8BPK4gJu5PF',
    secret: 'ss8VXscmez6x2T3KEejRCbFC8rP6E'
}

const customer_b = {
    wallet_address: 'rn54TBHXvWfwWpGYnCHeETTpJAXUQp73jX',
    secret: 'ss7VkpEK4E6CqBY4sUouJ1FLdJYU3'
}


describe('internal tests, data mocked locally', () => {

    test("Make sure that the estimate-ripple-fee route is working", done => {
        request(app)
            .get("/unido-ripple-tx-service/rest/v1/estimate-ripple-fee/internal_test")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.minimum_fee === 10);
                done();
            });
    });

    test("Make sure that the tokenTransfer route is working", done => {
        data = {
            walletFromSeed: customer_b.secret,
            walletFrom: customer_b.wallet_address,
            walletTo: customer_a.wallet_address,
            amount: 20000000,
            fee: 10
        }

        request(app)
            .post("/unido-ripple-tx-service/rest/v1/transfer/internal_test")
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.data.walletFrom).toBe('- 20000010');
                expect(response.body.data.walletTo).toBe('+ 20000000');
                done();
            });
    });
});