require('dotenv').config({ path: __dirname + '/../../.env' });
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


io.on('connection', (socket) => {
    socket.on('get_gas', () => {
        socket.emit('return_gas', 10)
    })

    socket.on('transfer_ripple', (data) => {
        let remaining = parseInt(data.amount + data.fee)
        res = {
            id: Date.now(),
            walletFrom: "- " + remaining.toString(),
            walletTo: "+ " + data.amount.toString()
        }
        socket.emit('transfer_result', res);
    })
});

let port = parseInt(process.env.WSPORT);

server.listen(port);