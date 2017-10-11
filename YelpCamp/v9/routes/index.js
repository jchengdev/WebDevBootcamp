var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

//ROUTE: LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
});

//ROUTE: REGISTER (form)
router.get("/register", function(req, res){
    res.render("register");
});

//ROUTE: REGISTER (new)
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//ROUTE: LOGIN (form)
router.get("/login", function(req, res){
    res.render("login");
});

//ROUTE: LOGIN (access)
router.post("/login", passport.authenticate("local", {
                                            successRedirect: "/campgrounds",    //MIDDLEWARE
                                            failureRedirect: "/login"           //MIDDLEWARE
                                        }), function(req, res){
});

//ROUTE: LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;