const request = require("supertest");
const { get_estimated_ripple_fee, request_fee, get_connection, get_account_info, send_token, terminate_connection, check_hash_status } = require('../app/services/ripple_service')
const app = require("../app");

const customer_a = {
    wallet_address: 'rKSRW6fEuD2KCq3J4oYWWeE8BPK4gJu5PF',
    secret: 'ss8VXscmez6x2T3KEejRCbFC8rP6E'
}

const customer_b = {
    wallet_address: 'rn54TBHXvWfwWpGYnCHeETTpJAXUQp73jX',
    secret: 'ss7VkpEK4E6CqBY4sUouJ1FLdJYU3'
}

/**
 "TransactionType": "Payment",
            "Account": "rKSRW6fEuD2KCq3J4oYWWeE8BPK4gJu5PF" ,
            "Amount": "2000000",
            "Destination": "rn54TBHXvWfwWpGYnCHeETTpJAXUQp73jX",
            "Fee": "10",
 */

describe.skip('External tests, connects to testnet', () => {
    test('test generate address', async () => {
        request(app)
            .post('/unido-ripple-tx-service/rest/v1/generate-address')
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.status).toBe(0);
                expect(response.body.message).toBe(null);
                expect(response.body).toHaveProperty('result');
                expect(response.body.result.private).toHaveLength(64);
                expect(response.body.result.public).toHaveLength(66);
                expect(response.body.result.address).toHaveLength(34);

                // Make sure we have not received static data
                expect(response.body.result.private).not.toBe('fc4a59d3b0979f1df41613547015bc216ab7b6786e277f7d04bba190e126a400');
                expect(response.body.result.public).not.toBe('021C0B21AE2AC8A79812C509634CC1D3546CD44E5E247A300E16D04E0EC55B843A');
                expect(response.body.result.address).not.toBe('r4DshugLLsyypbNeYGx6jycQNYVxaeAL78');
                done();
            });
    })

    test('test re-generate address', async () => {
        const payload = {
            key: "fc4a59d3b0979f1df41613547015bc216ab7b6786e277f7d04bba190e126a400"
        }

        request(app)
            .post('/unido-ripple-tx-service/rest/v1/generate-address')
            .send(payload)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.status).toBe(0);
                expect(response.body.message).toBe(null);
                expect(response.body.result.private).toBe('fc4a59d3b0979f1df41613547015bc216ab7b6786e277f7d04bba190e126a400');
                expect(response.body.result.public).toBe('021C0B21AE2AC8A79812C509634CC1D3546CD44E5E247A300E16D04E0EC55B843A');
                expect(response.body.result.address).toBe('r4DshugLLsyypbNeYGx6jycQNYVxaeAL78');
                done();
            });
    })

    test('test generate address bad payload', async () => {
        const payload = {
            key: "fc4a59d3b0979f1df41613547015bc216ab7b6786e277f7d04bba190e126a4"
        }

        request(app)
            .post('/unido-ripple-tx-service/rest/v1/generate-address')
            .send(payload)
            .then(response => {
                expect(response.status).toBe(500);
                expect(response.body.status).toBe(1);
                expect(response.body.message).not.toBe(null);
                expect(response.body.result).toBe(null);
                done();
            });
    })

    test('test generate address bad payload 2', async () => {
        const payload = {
            key: "FC4A59D3B0979F1DF41613547015BC216AB7B6786E277F7D04BBA190E126A400"
        }

        request(app)
            .post('/unido-ripple-tx-service/rest/v1/generate-address')
            .send(payload)
            .then(response => {
                expect(response.status).toBe(500);
                expect(response.body.status).toBe(1);
                expect(response.body.message).not.toBe(null);
                expect(response.body.result).toBe(null);
                done();
            });
    })

    test("Make sure that the estimate-ripple-fee route is working", done => {
        request(app)
            .get("/unido-ripple-tx-service/rest/v1/estimate-ripple-fee")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.median_fee !== undefined);
                done();
            });
    });

    test("Make sure that the tokenTransfer route is working", done => {
        let data = {
            query: {
                "TransactionType": "Payment",
                "Account": customer_b.wallet_address,
                "Amount": "0.001",
                "Destination": customer_a.wallet_address,
                "Fee": "0.0001",
            },
            secret: 'ss7VkpEK4E6CqBY4sUouJ1FLdJYU3'
        }
        request(app)
            .post("/unido-ripple-tx-service/rest/v1/transfer")
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test("Make sure that the get_confirmation route is working", done => {
        let data = {
            hash: "5FC948BB65BF13E7DCA445E17EA6F7E7168352A9E92F6E53F996FAADF6AC8A0C"
        }
        request(app)
            .post("/unido-ripple-tx-service/rest/v1/get_confirmation/mainnet")
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body.result.hash == data.hash).toBe(true);
                expect(response.statusCode).toBe(200);
                done();
            });
    });

    test('Query the ripple webhook for the minimum fee', async () => {
        let response = get_estimated_ripple_fee(process.env.TESTNET);
        let test = await request_fee(await get_connection(process.env.TESTNET));

        let testResponse = Math.min(parseInt(test.result.drops.minimum_fee), parseInt(test.result.drops.open_ledger_fee));

        response.then((data) => {
            expect(data == testResponse).toBe(true);
        }).catch(() => {
        })

    })

    test('Query the ripple webhook for an account information', async () => {

        let client = await get_connection(process.env.TESTNET);

        let response = await get_account_info(client, customer_a.wallet_address);
        let wallet_address = response.result.account_data.Account;

        await terminate_connection(client);

        expect(wallet_address == customer_a.wallet_address).toBe(true);
    })

    test('Query the ripple webhook with hash for information', async () => {
        let hash = "5FC948BB65BF13E7DCA445E17EA6F7E7168352A9E92F6E53F996FAADF6AC8A0C";
        let result = await check_hash_status(process.env.MAINNET, hash);
        expect(result.result.hash == hash).toBe(true);
    })

    test('Test transferring tokens between two test wallets on the testnet', async () => {
        let client = await get_connection(process.env.TESTNET);

        let walletFrom = customer_a.wallet_address;
        let walletTo = customer_b.wallet_address;

        // retrives only the account ballance from the two wallets
        let response = await get_account_info(client, walletFrom)
        let walletFromAmount = parseInt(response.result.account_data.Balance);
        response = await get_account_info(client, walletTo)
        let walletToAmount = parseInt(response.result.account_data.Balance);

        // Sends 20 ripple with the fee of 10
        let fee = 10 / 1000000;
        let amount = 0.001;
        let query = {
            "TransactionType": "Payment",
            "Account": walletFrom,
            "Amount": amount.toString(),
            "Destination": walletTo,
            "Fee": fee.toString(),
        }
        await send_token(process.env.TESTNET, query, 'ss8VXscmez6x2T3KEejRCbFC8rP6E');

        // Gets the account wallet balances of the two accoutns post transaction
        response = await get_account_info(client, walletFrom);
        let walletFromAmount2 = parseInt(response.result.account_data.Balance);
        response = await get_account_info(client, walletTo);
        let walletToAmount2 = parseInt(response.result.account_data.Balance);
        await terminate_connection(client);
        walletFromAmount2 = walletFromAmount2 + amount * 1000000 + fee * 1000000;
        walletToAmount2 = walletToAmount2 - amount * 1000000;

        // Checks to see that the resulting account ballances post transaction is correct
        expect(walletFromAmount === walletFromAmount2 &&
            walletToAmount === walletToAmount2).toBe(true);
    })
});