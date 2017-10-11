var express = require("express");
var app = express();
var request = require("request");

app.use(express.static("public")); //FOR GOOD DIRECTORY ORGANIZATION
app.set("view engine", "ejs");  //FOR IGNORING ".ejs" IN RENDER METHODS

app.get("/", function(req, res){
    res.render("search");
});

app.get("/results", function(req, res){
    var query = req.query["search"];
    var url = "http://www.omdbapi.com/?apikey=thewdb&s="+query;
    
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body);
            res.render("results", {data: parsedData});
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Movie App has started!!!") 
});