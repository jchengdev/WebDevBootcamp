var express = require("express");
var app = express();
var bodyParser = require("body-parser");
//var request = require("request");
var campgrounds = [
            {name:"Salmon Creek", image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"},
            {name:"Granite Hill", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
            {name:"Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
            {name:"Salmon Creek", image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"},
            {name:"Granite Hill", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
            {name:"Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
            {name:"Salmon Creek", image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"},
            {name:"Granite Hill", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
            {name:"Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
            {name:"Salmon Creek", image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg"},
            {name:"Granite Hill", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
            {name:"Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
        ];

app.use(express.static("public")); //FOR GOOD DIRECTORY ORGANIZATION
app.use(bodyParser.urlencoded({extended: true})); //STANDARD PACKAGE CALL
app.set("view engine", "ejs");  //FOR IGNORING ".ejs" IN RENDER METHODS

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// app.get("/results", function(req, res){
//     var query = req.query["search"];
//     var url = "http://www.omdbapi.com/?apikey=thewdb&s="+query;
    
//     request(url, function(error, response, body){
//         if(!error && response.statusCode == 200) {
//             var parsedData = JSON.parse(body);
//             res.render("results", {data: parsedData});
//         }
//     });
// });

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp server started!!!");
});