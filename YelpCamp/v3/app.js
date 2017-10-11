var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

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
    seedDB();
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
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Show error: ");
            console.log(req.params.id); //TODO: some issue related to showing a newly added camp
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