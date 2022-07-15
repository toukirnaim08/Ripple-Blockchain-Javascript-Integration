require('dotenv').config({ path: __dirname + './.env' });

const express = require('express');
const cors = require('cors')
const app = express();

// Api controller
const rippleEstimateFee = require('./app/rest/estimate_fee');
const rippleTransaction = require('./app/rest/transaction');
const ripplePublish = require('./app/rest/publish');
const rippleGenerateAddress = require('./app/rest/generate_address');

const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: "app" });
delete log.fields.hostname;

// Configure swagger
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");
var swaggerDocument = require('./swagger.json');
const openapiSpecification = swaggerJsdoc(swaggerDocument);
const swaggerOption = {
    swaggerOptions: {
        defaultModelsExpandDepth: -1,
    }
};

app.use(express.json());
app.use(cors());

// Route: swagger ui
app.use(
    '/ripple-integration/apidocs',
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification, swaggerOption)
);

// Route: ripple estimate fee
app.get('/ripple-integration/estimate-ripple-fee', async (req, res) => {
    await rippleEstimateFee.estimateRippleFee(app, req, res);
});

// Route: ripple transfer
app.post('/ripple-integration/transfer', async (req, res) => {
    await rippleTransaction.transfer(app, req, res);
});

// Route: ripple publish transaction
app.post('/ripple-integration/publish', async (req, res) => {
    await ripplePublish.publishTransaction(app, req, res);
});

// Route: ripple generate address
app.post('/ripple-integration/generate-address', async (req, res) => {
    await rippleGenerateAddress.genearteAddress(app, req, res);
});

// Route: handle 404
app.use(function (req, res, next) {
    console.debug(`404 ${req.method} ${req.path}`)

    res.status(404).send({
        status: 404,
        message: 'URL not found',
    });
});

module.exports = app;