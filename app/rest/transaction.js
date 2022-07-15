const { send_token} = require('../services/svc_ripple');

module.exports = {
    /**
     * @swagger
     * /ripple-integration/transfer:
     *   post:
     *     summary: Sends a transaction on the selected network.
     *     description: performs a transfer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *                  query:
     *                      $ref: '#/components/schemas/ripple_transfer_query'
     *                  secret: 
     *                      type: string
     *                      description: User Secrete Entropy
     *                      example: "40894230741611627681334940161831938974457257059691575147256097143736863012824"
     *     responses:
     *       200:
     *         description: A list of users.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                       status:
     *                         type: integer
     *                         description: HTTP status.
     *                         example: 200
     *                       hash:
     *                         type: string
     *                         description: the hash of the validated transaction.
     *                         example: 5FC948BB65BF13E7DCA445E17EA6F7E7168352A9E92F6E53F996FAADF6AC8A0C
     */
    transfer: async function (app, req, res) {
        let data = req.body;
        server = process.env.MAINNET;
        let result = await send_token(server, data.query, data.secret);
        if (result) {
            let returnData = {
                status: 200,
                hash: result.hash
            }
            res.send(returnData);
        }
        else {
            let returnData = {
                status: 400,
                message: "User Input Error"
            }
            res.send(returnData);
        }
    }

/**
 * @swagger
 * components:
 *   schemas:
 *     ripple_transfer_query:
 *       type: object
 *       properties:
 *         TransactionType:
 *           type: string
 *           description: The type of query.
 *           example: Payment
 *         Account:
 *           type: string
 *           description: sender wallet
 *           example: 	rP4Th2BRu7wWD6nS8ektKnMkCjf6sHXbm5
 *         Destination:
 *           type: string
 *           description: destination wallet
 *           example: rBMJvAfH5uEGopno5C5CJyEPsQ7y51oYiz
 *         Amount:
 *           type: string
 *           description: amount transfered in unscaled version
 *           example: 1.26
 *         Fee:
 *           type: string
 *           description: network fee being payed
 *           example: 0.004
 */
};