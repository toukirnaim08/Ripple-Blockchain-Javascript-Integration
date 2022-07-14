require('dotenv').config({ path: __dirname + '/../../.env' });
const io = require("socket.io-client");
const port = parseInt(process.env.WSPORT)
let ret = {};
let gas = 0;


//hits the mock websocket and get a stubbed result
function estimate_gas_WS(callback) {
    estimate_gas_helper();
    new Promise((resolve) => {
        setInterval(() => {
            if (gas !== 0) {
                resolve(gas);
            }
        }, 20);
    }).then(callback);
}

//sents a client to the websocket 
function estimate_gas_helper() {
    let socket = io("ws://localhost:" + port);
    socket.emit('get_gas');

    socket.on('return_gas', (data) => {
        gas = data;
    })

}

//sents a client to the websocket 
function transfer_WS_helper(payload) {
    let socket = io("ws://localhost:" + port);

    socket.emit('transfer_ripple', payload);
    socket.on('transfer_result', async (response) => {
        ret = response;

    })
}

//return a stubbed result from a websocket
function transfer_WS(data, callback) {
    transfer_WS_helper(data);
    new Promise((resolve) => {
        setInterval(() => {
            if (ret.id) {
                resolve(ret);
            }
        }, 20);
    }).then(callback)
}

module.exports = {
    estimate_gas_WS,
    transfer_WS
}