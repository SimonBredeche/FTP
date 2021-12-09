import { Socket } from "dgram";
import { createServer } from "net"
import * as serverModule from "./serverModules";
const fs = require('fs');
const path = require("path");
let UID = 0; //UID for each sockets
export function launch(port){

    const server = createServer((socket) => {
        let uidtemp = UID;
        socket.id = uidtemp;
        UID++;
        console.log(`created new socket with UID : ${UID}`);
        serverModule.socketArray[socket.id] = "";
        socket.on("data", (data) => {
            //Receiving file
            if(socket.fileName != undefined){
                const dest = fs.createWriteStream(`sendedFiles/${path.basename(socket.fileName.toString())}`);
                dest.write(data.toString("utf-8"));
                socket.fileName = "";
            }
            else{
                const message = data.toString();
                const [command, ...args] = message.trim().split(" ");
                if(serverModule[command] != null){
                    console.log(command);
                    serverModule[command](socket,args);
                }
                else{
                    socket.write("502 unknow command");
                }
            }
        });
        socket.write("220 Hello \r\n");
    });

    server.listen(port, () => {
        console.log("server found");
    })

}