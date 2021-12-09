import { launch } from "./server";
launch(4242);
/*if(process.argv[2] != null){
    console.log(`Starting serving on port : ${process.argv[2]}`)
    launch(process.argv[2]);
}
else{
    console.log("missing arguments usage : node main.js <port> ")
}*/