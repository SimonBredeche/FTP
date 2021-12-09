const fs = require('fs');
export const socketArray = {};
export let fileName = "";

export function QUIT(socket){
    socket.write("221 Closing connection");
}

export function CWD(socket,args){
    try{
        process.chdir(args.toString());
    }catch(e){
        socket.write("Directory not found ! ");
    }
    socket.write(`250 new directory : ${process.cwd()}`)
}

export function LIST(socket){
    fs.readdir(process.cwd(), (err, files) => {
        let outputString = "";
        files.forEach(file => {
            outputString += `- ${file} \r\n`;
        });
        socket.write(outputString);
    })
}

export function USER(socket,args){
    socket.write("230 user logged in")
    let response = checkIfUserExist(args);
    if(response.password != null){
        socketArray[socket.id] = response;
        socket.write(`Please enter password for user ${response["name"]}`);
    }
    else{
        socket.write(response);
    }
}

export function PASS(socket,args){
    if(socketArray[socket.id] != ""){
        let user = socketArray[socket.id];
        if(args == user.password){
            socket.write(`AUTHENTIFACTED AS ${user.name}`)
        }
        else{
            socket.write("Invalid creditential");
        }
    }
}

export function RETR(socket,args){
    const fileStream = fs.createReadStream(`${process.cwd()}\\${args}`);
    fileStream.on('error', function(e){console.log(e); socket.write(`ERR ${e}`); });
    fileStream.pipe(socket);
}

export function HELP(socket){
    
    let rawdata = fs.readFileSync(`${__dirname}/config.json`);
    let data = JSON.parse(rawdata).HELPSTRING;
    let response = "---AVAIBLE COMMANDS--- \r\n";
    for (const [key, value] of Object.entries(data)) {
        response += `-> ${key} : ${value} \r\n`; 
    }
    socket.write(response);
}

export function checkIfUserExist(username){
    let rawdata = fs.readFileSync(`${__dirname}/users.json`);
    let user = JSON.parse(rawdata);
    let response = `User ${username} does not exist.`;
    if(user[username] != null){
        user = user[username];
        response = user;
    }
    return response;

}

export function STOR(socket, args){
    fileName = args.toString();
    socket.write(`uploading file : ${args.toString()}`)
}

export function PWD(socket,args){
    socket.write(`257 new directory : ${process.cwd()}`);
}