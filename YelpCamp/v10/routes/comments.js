var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//ROUTE: NEW (form)
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params["id"], function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//ROUTE: CREATE (new comment)
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params["id"], function(err, foundCampground){
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
                        newComment.author.id = req.user._id;
                        newComment.author.username = req.user.username;
                        newComment.save();
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

//ROUTE: EDIT (form)
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params["comment_id"], function(err, foundComment){
        if(err){
            //NOT NECESSARY, JUST CHECKED IN MIDDLEWARE
            res.redirect("back");
        } else {
            console.log("EDIT COMMENT: ");
            console.log(foundComment);
            res.render("comments/edit", {campground_id: req.params["id"], comment: foundComment});
        }
    });
});

// //ROUTE: UPDATE (comment text)
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    //req.body.blog.body = req.sanitize(req.body.blog.body); //<<<DELETE?>>>
    Comment.findByIdAndUpdate(req.params["comment_id"], req.body.comment, function(err, editCampground){ //REQUIRES BODY-PARSER (campground[name]+campground[image]+campground[description] collapsed into an object by BODY-PARSER syntax)
        if(err){
            console.log("Update error: ");
            console.log(err);
            res.redirect("/campgrounds/"+req.params["id"]);
        } else {
            console.log("UPDATED COMMENT: ");
            console.log("comment_id: "+req.params["comment_id"]);
            res.redirect("/campgrounds/"+req.params["id"]);
        }
    });
});

//ROUTE: DELETE (selected comment)
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params["comment_id"], function(err){
        if(err){
            console.log("Delete error: ");
            console.log(err);
            res.redirect("/campgrounds/"+req.params["id"]);
        } else {
            console.log("DELETED COMMENT: ");
            console.log("comment_id: "+req.params["comment_id"]);
            res.redirect("/campgrounds/"+req.params["id"]);
        }
    });
});

module.exports = router;