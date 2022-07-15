const { publish_transaction} = require('../services/svc_ripple');

module.exports = {
    /**
     * @swagger
     * /ripple-integration/publish:
     *   post:
     *     summary: Publishes a transaction of the given query, non blocking returns immediately with the hash of the sent query
     *     description: Performs a transfer, and immediately returns with hash
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
    publishTransaction: async function (app, req, res) {
        let data = req.body;
        data.server = process.env.MAINNET;
        try {
            let result = await publish_transaction(data.server, data.query, data.secret);
            let returnData = {
                status: 200,
                tx_hash: result
            }
            console.log(returnData, 'Transaction Published successfully returning response')
            res.send(returnData);
        }
        catch (e) {
            console.log(e, 'Transaction error')
            let returnData = {
                status: 400,
                message: "User Input Error"
            }
            res.send(returnData);
        }
    }
};