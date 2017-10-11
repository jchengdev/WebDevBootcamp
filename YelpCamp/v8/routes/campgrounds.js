var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground  = require("../models/campground");

//ROUTE: INDEX
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//ROUTE: NEW (form)
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//ROUTE: CREATE (new camp)
router.post("/", isLoggedIn, function(req, res) {
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

//ROUTE: SHOW (campground details)
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Show error: ");
            console.log(req.params.id); //TODO: some issue related to showing a newly added camp (double GET request)
            console.log(err);
            res.send("Some error getting campground details...");
        } else {
            console.log("SHOW CAMPGROUND: ");
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//MIDDLEWARE: session
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;