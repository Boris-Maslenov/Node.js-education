const net = require('node:net');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
const socket = new net.Socket();

socket.connect({ port: 2001, host: '127.0.0.1' }, () => {
    addName();
});

socket.on('data', (data) => {
    console.log(data.toString());
    addMessage();
});

function addMessage() {
    rl.question('Написать сообщение: ', (answer) => {
        if( !answer.length ) {
            throw new Error('Строка не может быть пустой');
        }
        socket.write(answer);
    });
}

function addName(){
    rl.question('Ваше имя: ', (answer) => {
        if( !answer.length ) {
            throw new Error('Строка не может быть пустой');
        }
        socket.write(answer);
    });
}