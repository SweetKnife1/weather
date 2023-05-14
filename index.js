const http = require("http");
const fs = require("fs");
var requests = require("requests");

const home = fs.readFileSync("homepage.html","utf-8");
const replaceVal = ( tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
     temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
     temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}", orgVal.name);
     temperature = temperature.replace("{%country%}", orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
     return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url === "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Surat&appid=42b3681120888e20afa68bd818c3498a&units=metric")
         .on("data",(chunk) => {

            const objdata = JSON.parse(chunk);
            const arrdata = [objdata]
            
            const realData = arrdata
                .map((val) => replaceVal(home, val))
                .join("");
                res.write(realData);
         })
         .on("end", (err) => {
            if(err) return console.log("Connection Closed", err)
            res.end();
         });
    }else{
        res.end("Not Found")
    }

});

server.listen(3000, "127.0.0.1");