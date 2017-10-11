var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

//ROUTE: NEW (form)
router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//ROUTE: CREATE (new comment)
router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("Reference error: ");
            console.log(err);
            res.send("Campground not found...");
        } else {
            Comment.create(req.body.comment,                //REQUIRES BODY-PARSER
                function(err, newComment){
                    if(err){
                        console.log("Create error: ");
                        console.log(err);
                        res.send("Some error creating new comment...");
                    } else {
                        foundCampground.comments.push(newComment);
                        foundCampground.save();
                        console.log("NEW COMMENT: ");
                        console.log(newComment);
                        res.redirect("/campgrounds/"+foundCampground._id);
                    }
            });
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