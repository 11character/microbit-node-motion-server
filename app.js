const { spawn } = require('child_process');
const { Server } = require('ws');

const wss = new Server({port: 3000});

let socket = null;

wss.on('connection', (ws) => {
    socket = ws;
});

function start() {
    const cProcess = spawn('node', ['./bluetooth.js']);
    
    console.log('start!');

    cProcess.stdout.on('data', onData);

    cProcess.stderr.on('data', (data) => {
        console.error('bluetooth error : ' + data.toString());
    });

    cProcess.on('exit', (code) => {
        console.log('bluetooth restart');
        start();
    });
}

// 받은 데이터 처리.
function onData(data) {
    let str = data.toString();
    str = str.replace(/\r|\n/gm, '');

    if (socket) {
        socket.send(str);
    }
}

start();