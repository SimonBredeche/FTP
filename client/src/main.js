import { launch } from "./client";

if(process.argv[2] != null && process.argv[3] != null){
    launch(process.argv[2],process.argv[3]);
}
else{
    console.log("missing arguments usage : node main.js <port> <host>")
}
