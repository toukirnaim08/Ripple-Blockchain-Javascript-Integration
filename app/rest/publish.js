const { publish_transaction} = require('../services/ripple_service');

module.exports = {
    /**
     * @swagger
     * /ripple-integration/publish:
     *   post:
     *     summary: Publishes a transaction of the given query, non blocking returns immediately with the hash of the sent query
     *     description: Fires of a query from unido_transanction_service which performs a transfer, and immediately returns with hash
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
     *                  server: 
     *                      type: string
     *                      description: specifies server
     *                      example: mainnet
     *     parameters:
     *       - in: path
     *         name: network
     *         description: Selects the nework to use, defaults to testnet
     *         schema:
     *           type: string
     *           enum: ["mainnet","testnet"]
     *           default: mainnet
     *           required: true
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
    publishTransaction: async function (app, req, res) {
        let data = req.body;
        data.server = process.env.MAINNET;
        try {
            let result = await publish_transaction(data.server, data.query, data.secret);
            let returnData = {
                status: 200,
                tx_hash: result
            }
            log.info(returnData, 'Transaction Published successfully returning response')
            res.send(returnData);
        }
        catch (e) {
            log.info(e, 'Transaction error')
            log.info(query, 'Transaction query')
            {
                let returnData = {
                    status: 400,
                    message: "User Input Error"
                }
                res.send(returnData);
            }
        }
    }
};