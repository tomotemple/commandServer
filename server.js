const net = require('net');
//const { Stream } = require('stream');
const fs = require('fs');
const printer = fs.createWriteStream('chat.log');
let users = [];
let counter = 0;
let passWord = 1234;
const server = net.createServer((socket) =>{

    socket.id = ++counter;
    socket.write('Welcome new person');
    let connectMessage = `Person number ${socket.id} has joined`;
    printer.write(connectMessage);
    for (let i in users) {
        users[i].write(connectMessage);
    }
    users.push(socket);

    socket.on('data', (data) => {
        data = data.toString().trim()
        if (data.match(/^\/w/)) {
              whisper(data)
        } else if (data.match(/^\/username/)) {
              updateUsername(data)
        } else if (data.match(/^\/kick/)) {
              removeUser(data)
        } else if (data.match(/^\/clientlist$/)) {
              displayClientList(data)
        } else
        
        users.filter(user => {
            if (user.id !== socket.id) {
                user.write(`message from user ${socket.id}: ${data}`);
            }
        })
        printer.write(`message from user ${socket.id}: ${data}`);
    });

    function whisper(dataString) {
        let dataArray = dataString.split(' ');
        dataArray.shift();
        let filterStorage = users.filter(user => {
            if (user.id == dataArray[0]) {
                return user;
            } 
        })

        if (filterStorage.length) {
            let messageArray = dataArray.slice(1);
            filterStorage[0].write(`message from ${socket.id}: ${messageArray.join(' ')}`)    
        } else {
            socket.write('We cannot write to that user.')
        }
    };

   function updateUsername(dataString) {
       let dataArray = dataString.split(' ');
       dataArray.shift();
       let filterStorage = users.filter(user => {
        if (user.id == dataArray[0]) {
            return user;
        } 
        })
       if (socket.id == dataArray[0]) {
        socket.write("you are already using this user name")
       } else if (filterStorage.length) {
        socket.write("Somebody else is already using that name")
       } 
       else {
         users.filter(user => {
          if (user.id == socket.id){
              let oldId = user.id;
               user.id = dataArray[0];
               users.filter(user => {
                if (user.id !== socket.id) {
                    user.write(`User: ${oldId} changed their username to ${socket.id}`);
                }
            })
           }
           })
       }


    };
    function removeUser(dataString) {
        let dataArray = dataString.split(' ');
        dataArray.shift();
        let userIndex;
        let filterStorage = users.filter((user, index) => {
            if (user.id == dataArray[0]) {
                userIndex = index;
                return user;
            }})    
            if (dataArray[1] == passWord && !filterStorage.length) {
                    socket.write("That username does not exist")       
            } else if(dataArray[1] != passWord){
                socket.write("That is not the correct password")
            }else {
                filterStorage[0].write("You have been kicked off of the island")
                users.splice(userIndex, 1);
                users.forEach(user => {
                    user.write(`${filterStorage[0].id} has been kicked off of the island.`)
                })
            } 
      
    };
    function displayClientList(dataString) {
        socket.write('These are the current users:\n');
        users.forEach(user => {
            socket.write(`${user.id},\n`)
        })
    };

    socket.on('end', () => {
        console.log('outa here')
        users.filter(user => {
            if (user.id !== socket.id) {
                user.write(`User number ${socket.id} logged out.`);
            }
        printer.write(`User number ${socket.id} logged out.`);
    })
});
})
process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
    if(data.toLowerCase().trim() === 'exit') {
        console.log('thank you')

        process.exit()
    }
    })
server.listen(6000, () => console.log('Listen on port 6000'))

    //function whisper((dataString) => {}); 