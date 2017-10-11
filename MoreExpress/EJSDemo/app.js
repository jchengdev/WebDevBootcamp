var express = require("express");
var app = express();

app.use(express.static("public")); //FOR GOOD DIRECTORY ORGANIZATION
app.set("view engine", "ejs");  //FOR IGNORING ".ejs" IN RENDER METHODS

app.get("/", function(req, res){
    // res.send("<h1>Welcome to the home page!</h1><h2>blah blah</h2>");
    //res.render("home.ejs");
    res.render("home");
});

app.get("/fallinlovewith/:thing", function(req, res){
    let thing = req.params.thing;
    // res.send("You fell in love with "+thing);
    //res.render("love.ejs", {thingVar: thing});
    res.render("love", {thingVar: thing});
});

app.get("/posts", function(req, res) {
    let posts = [
            {title: "Post 1", author: "Susy"},
            {title: "My adorable pet bunny", author: "Charlie"},
            {title: "Can you believe this pomsky? ", author: "Colt"},
        ];
    
    //res.render("posts.ejs", {posts: posts});
    res.render("posts", {posts: posts});
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening!!!") 
});