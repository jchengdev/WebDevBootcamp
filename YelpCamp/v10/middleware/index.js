var middlewareObj   = {},
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment");

//MIDDLEWARE: campground permission check
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params["id"], function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){ //ATTENTION WITH 'undefined' AUTHOR ID (ON CREATION)
                    next();
                } else {
                    console.log("No permission..."); //<<<REFACTOR>>>
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//MIDDLEWARE: comment permission check
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params["comment_id"], function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){ //ATTENTION WITH 'undefined' AUTHOR ID (ON CREATION)
                    next();
                } else {
                    console.log("No permission..."); //<<<REFACTOR>>>
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//MIDDLEWARE: session
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;