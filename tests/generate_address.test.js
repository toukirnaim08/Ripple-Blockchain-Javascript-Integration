const { json } = require("express");
const request = require("supertest");
const app = require("../app");

test('test generate address', async () => {
    const payload = {
        key: "fc4a59d3b0979f1df41613547015bc216ab7b6786e277f7d04bba190e126a400"
    }

    return request(app)
        .post('/ripple-integration/generate-address')
        .send(payload)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.status).toBe(0);
            expect(response.body.message).toBe(null);
            expect(response.body.result.private).toBe('fc4a59d3b0979f1df41613547015bc216ab7b6786e277f7d04bba190e126a400');
            expect(response.body.result.public).toBe('021C0B21AE2AC8A79812C509634CC1D3546CD44E5E247A300E16D04E0EC55B843A');
            expect(response.body.result.address).toBe('r4DshugLLsyypbNeYGx6jycQNYVxaeAL78');
        });
});

test('test generate address 2', async () => {
    const payload = {
        key: "xxxxxx" // invalid key
    }

    return request(app)
        .post('/ripple-integration/generate-address')
        .send(payload)
        .then(response => {
            expect(response.status).toBe(500);
        });
});
