require('dotenv').config({ path: __dirname + '/../.env' });

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

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ripple Integration',
            version: '1.0.0',
        },
    },
    apis: ['./app/rest/*.js'], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options)
app.use(express.json());
app.use(cors());

app.use('/ripple-integration/apidocs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Route: ripple estimate fee
app.get('/ripple-integration/estimate-ripple-fee', async (req, res) => {
    await rippleEstimateFee.estimateRippleFee(app, req, res);
});

// Route: ripple transfer
app.post('/ripple-integration/transfer', async (req, res) => {
    await rippleTransaction.transfer(app, req, res);
});

// Route: ripple publish transaction
app.get('/ripple-integration/publish', async (req, res) => {
    await ripplePublish.publishTransaction(app, req, res);
});

// Route: ripple generate address
app.post('/ripple-integration/generate-address', async (req, res) => {
    await rippleGenerateAddress.genearteAddress(app, req, res);
});
module.exports = app;