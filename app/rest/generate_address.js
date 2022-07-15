const { generate_address} = require('../services/svc_ripple');

module.exports = {
    /**
     * @swagger
     * /ripple-integration/generate-address:
     *   post:
     *     summary: Generate/Re-Generate ripple address.
     *     description: Generate or re-create ripple address from private key
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               key:
     *                 type: string
     *                 description: (optional) 64 character long hex string, all lowercase
     *                 example: 5fc948bb65bf13e7dca445e17ea6f7e7168352a9e92f6e53f996faadf6ac8a0c
     *     responses:
     *       200:
     *         description: keypair.
     *       400:
     *         description: Bad Request.
     *       500:
     *         description: Server error.
     */
    genearteAddress: async function (app, req, res) {
        try {
            // console.log('hittet');
            const result = generate_address(req.body.key);
            
            res.send({
                status: 0,
                message: null,
                result: result
            })
        } catch (e) {
            res.status(500).send({
                status: 1,
                message: e.message,
                result: null
            })
        }
    }
    
};