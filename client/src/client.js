import { count } from "console";
import { createConnection, createServer } from "net"
import { createInterface } from "readline";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
let fileName = ""; 
export function launch(port,connectListener = "localhost"){
    const client = createConnection({port: port,connectListener: connectListener}, () =>{
        console.log("client connected");
    });
    client.on("data", (data) => {
        const message = data.toString();
        const [status, ...args] = message.trim().split(" ")
        if(fileName != ""){
            //if we are downloading the file
            let dest = fs.createWriteStream(`output/${fileName}`);
            dest.write(data);
            fileName = "";
        }
        else{
            //print the received data from server
            console.log(message); 
        }

        switch(status){
            case "220":
                console.log("Connected ! ")
                handleInput(client,port,connectListener);
                break;
            case "221":
                client.end();
                break;
            case "ERR":
                //HANDLING ERRORS WHEN DOWNLOADING FILES
                console.log(args.toString());
                break;
        }
        process.stdout.write(">");
    })
}

function downloadSocket(port,connectListener){
    const dlsock = createConnection({port: port,connectListener: connectListener}, () =>{
        console.log("download socket connected");
        dlsock.write(`RETR ${fileName}`)
    });
    dlsock.on("data", (data) => {
        const message = data.toString();
        const [status, ...args] = message.trim().split(" ")
        if(fileName != ""){
            let writer = fs.createWriteStream(`output/${fileName}`);
            writer.write(data, () =>{
                fileName = "";
                console.log("download finish closing socket ...")
                dlsock.end();
            });
            writer.on('finish', () => {
                console.log("Closing download sockets")
            });

        }
    })
    
}

function handleInput(client,port,connectListener){
    const rl = createInterface({
        input: process.stdin,
    });
    rl.on("line", (input) => {
        
        const [command, ...args] = input.trim().split(" ")
        if(command != "RETR"){
            client.write(input);
        }
        switch(command){
            case "RETR":
                fileName = args;
                downloadSocket(port,connectListener);
                break;
            case "STOR":
                const fileStream = fs.readFileSync(args.toString(), {encoding: 'utf-8'});
                client.write(fileStream);
                break;
        }
    });
}