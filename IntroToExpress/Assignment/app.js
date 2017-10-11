var express = require("express");
var app = express();

app.get("/", function(req, res){
    res.send("Hi there, welcome to my assignment!");
});

app.get("/speak/:something", function(req, res){
    let sounds = {
        pig: "Oink",
        cow: "Moo",
        dog: "Woof Woof!",
        cat: "I hate you human",
        goldfish: "..."
    }
    let animal = req.params.something.toLowerCase();
    
    // if(animal === "pig"){
    //     res.send("The "+animal+" says \'Oink\'");
    // } else if(animal === "cow"){
    //     res.send("The "+animal+" says \'Moo\'");
    // } else if(animal === "dog"){
    //     res.send("The "+animal+" says \'Woof Woof!\'");
    // } else{
    //     console.log("request for not defined animal");
    //     res.send("Sorry, page not found... What are you doing with your life?");
    // }
    res.send("The "+animal+" says \'"+sounds[animal]+"\'");
});

app.get("/repeat/:word/:times", function(req, res){
    let wordSpoken = req.params.word;
    let repeatTimes = Number.parseInt(req.params.times);
    
    if(!Number.isNaN(repeatTimes)){
        let responseStr = "";
        for(let i=0; i<repeatTimes; i++){
            responseStr += wordSpoken+" ";
        }
        responseStr += "\n\nRepeating times: "+repeatTimes;
        res.send(responseStr);
    } else {
        res.send("number of repetition invalid: "+repeatTimes);
    }
});

app.get("*", function(req, res){
    console.log("request for not defined page");
    res.send("Sorry, page not found... What are you doing with your life?");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server - IP:"+process.env.IP+"PORT:"+process.env.PORT);
});
