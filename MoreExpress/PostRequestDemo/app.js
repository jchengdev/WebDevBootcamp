var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var friends = ["Tony", "Miranda", "Justin", "Pierre", "Lily"]; //TO BE REPLACED BY A DATABASE

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.post("/addfriend", function(req, res){
    //console.log(req.body.newfriend); //FOR THIS TO WORK BODY-PARSER IS REQUIRED
    var newFriend = req.body.newfriend;
    friends.push(newFriend); //USING COMMON ARRAY (MOVED OUT FROM ROUTE "/friends")
    //res.send("POST ROUTE REACHED");
    res.redirect("/friends");
});

app.get("/friends", function(req, res){
    //var friends = ["Tony", "Miranda", "Justin", "Pierre", "Lily"];
    res.render("friends", {friendsArr: friends});
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!!!") 
});