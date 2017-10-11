var express = require("express");
var app = express();

// "/" => "Hi there!"
app.get("/", function(req, res){
    res.send("Hi there!");
});


// "/bye" => "Goodbye!!"
app.get("/bye", function(req, res){
    res.send("Goodbye!!");
});
// "/dog" => "MEOW!"
app.get("/dog", function(req, res){
    console.log("resquest for /dog");
    res.send("MEOW!");
});

// app.get("/:something", function(req, res){
//     res.send("entered some folder");
// });

app.get("/folder/:something", function(req, res){
    let specPage = req.params.something;
    res.send("entered "+specPage+" page");
    console.log(req);
});

app.get("*", function(req, res){
    console.log("request for not defined page");
    res.send("\"star\" page");
});

// Tell Express to listen for requests (start server)
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server - IP:"+process.env.IP+"PORT:"+process.env.PORT);
});
