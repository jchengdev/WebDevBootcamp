var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

// MODEL CONFIG
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

// DB FLUSHING FUNCTION
function yelpCampDbReset(){
    Campground.remove({}, function(err){
        if(err){
            console.log("DATABASE FLUSH ERROR: ");
            console.log(err);
            return 0;
        } else {
            console.log("DATABASE FLUSHED!");
            var sampleData = [
                    {name:"Salmon Creek", image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg", description: "1st sample"},
                    {name:"Granite Hill", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg", description: "2nd sample"},
                    {name:"Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg", description: "3rd sample"}
                ];
            sampleData.forEach(function(sample){
                Campground.create({
                    name: sample.name,
                    image: sample.image,
                    description: sample.description
                }, function(err, campground){
                    if(err){
                        console.log("Sample creation error: ");
                        console.log(err);
                    }
                });
            });
        }
    });
}

// APP CONFIG
app.use(express.static("public")); //FOR GOOD DIRECTORY ORGANIZATION
app.use(bodyParser.urlencoded({extended: true})); //STANDARD PACKAGE CALL
app.set("view engine", "ejs");  //FOR IGNORING ".ejs" IN RENDER METHODS

// DB CONNECTION
mongoose.connect("mongodb://localhost/yelpcamp", {useMongoClient: true}); //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
  console.log("MongoDB -> \'yelpcamp\' database connected!");
  yelpCampDbReset();
});

//ROUTE: LANDING PAGE
app.get("/", function(req, res){
    res.render("landing");
});

//ROUTE: INDEX
app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

//ROUTE: CREATE (new camp)
app.post("/campgrounds", function(req, res) {
    Campground.create({
        name: req.body.name,                //REQUIRES BODY-PARSER
        image: req.body.image,              //REQUIRES BODY-PARSER
        description: req.body.description   //REQUIRES BODY-PARSER
    }, function(err, newCampground){
        if(err){
            console.log("Create error: ");
            console.log(err);
            res.send("Some error creating new campground...");
        } else {
            console.log("NEW CAMPGROUND: ");
            console.log(newCampground);
            res.redirect("/campgrounds");
        }
    });
});

//ROUTE: NEW (form)
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//ROUTE: SHOW (campground details)
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("Show error: ");
            console.log(err);
            res.send("Some error getting campground details...");
        } else {
            console.log("SHOW CAMPGROUND: ");
            console.log(foundCampground);
            res.render("show", {campground: foundCampground});
        }
    });
});

//SERVER START
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp server started...");
});