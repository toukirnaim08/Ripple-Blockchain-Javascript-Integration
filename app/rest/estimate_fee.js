const { get_estimated_ripple_fee} = require('../services/ripple_service');

module.exports = {
    /**
     * @swagger
     * /ripple-integration/estimate-ripple-fee:
     *   get:
     *     summary: Retrieves the network fee of the desired ripple network.
     *     description: Retrieves a network fee, can be used to ping for aliveness. Use mainnet as input for the mainnet
     *     responses:
     *       200:
     *         description: A list of users.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                       open_ledger_fee:
     *                         type: integer
     *                         description: The minimum fee top open a ripple ledger.
     *                         example: 15
     *                       median_fee:
     *                         type: integer
     *                         description: the median fee of all transactions.
     *                         example: 5000
     */
    estimateRippleFee: async function (app, req, res) {
        let minimum_fee = 0;
        try {
            minimum_fee = await get_estimated_ripple_fee(process.env.MAINNET);
            res.status(200).send({ minimum_fee: minimum_fee });
        } catch (e) {
            console.log(e, 'Failed to get gas fee')
            res.sendStatus(500)
        }
    }
};