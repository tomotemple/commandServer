const net= require('net');
//const { on } = require('process');

let client = net.createConnection({port: 6000}, () => {
    process.stdin.on('data', chunk => {
        chunk = chunk.toString().trim();
        if(chunk === 'exit'){
            client.emit('end')
        } else {
           // console.log('test', chunk);
            client.write(chunk);
        }
    })
})

client.on('data', (data) => {
    console.log(data.toString())
})

client.on('end', () => {process.stdin.emit('end')});

function mathProblem(a, b, c) {
    
}