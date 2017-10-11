var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    localStrategy           = require("passport-local"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds");

//APP CONFIG
app.use(express.static(__dirname+"/public")); //FOR GOOD DIRECTORY ORGANIZATION
app.use(bodyParser.urlencoded({extended: true})); //STANDARD PACKAGE CALL
app.set("view engine", "ejs");  //FOR IGNORING ".ejs" IN RENDER METHODS

//DB CONNECTION
mongoose.connect("mongodb://localhost/yelpcamp", {useMongoClient: true}); //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
    console.log("MongoDB -> \'yelpcamp\' database connected!");
    seedDB();
});

//AUTHENTICATION AND SESSION CONFIG
app.use(require("express-session")({
    secret: "Anything that we want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); //FOR PLUGIN
app.use(passport.session());    //FOR PLUGIN
passport.use(new localStrategy(User.authenticate()));   //PLUGIN 'passport-local-mongoose' PATTERN
passport.serializeUser(User.serializeUser());           //PLUGIN 'passport-local-mongoose' PATTERN
passport.deserializeUser(User.deserializeUser());       //PLUGIN 'passport-local-mongoose' PATTERN

//MIDDLEWARE FOR USER SESSION
app.use(function(req, res, next){
    res.locals.currentUser = req.user;  //DEFINES COMMON USER DATA FOR EJS TEMPLATES
    next();
});

//ROUTE: LANDING PAGE
app.get("/", function(req, res){
    res.render("landing");
});

//ROUTE: INDEX
app.get("/campgrounds", function(req, res) {
    console.log(req.user);
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//ROUTE: NEW (form)
app.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//ROUTE: CREATE (new camp)
app.post("/campgrounds", isLoggedIn, function(req, res) {
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
app.get("/campgrounds/:id", function(req, res) {
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

//ROUTE: NEW (form)
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//ROUTE: CREATE (new comment)
app.post("/campgrounds/:id/comments/", isLoggedIn, function(req, res) {
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

//ROUTE: REGISTER (form)
app.get("/register", function(req, res){
    res.render("register");
});

//ROUTE: REGISTER (new)
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
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
app.get("/login", function(req, res){
    res.render("login");
});

//ROUTE: LOGIN (access)
app.post("/login", passport.authenticate("local", {
                                            successRedirect: "/campgrounds",    //MIDDLEWARE
                                            failureRedirect: "/login"           //MIDDLEWARE
                                        }), function(req, res){
});

//ROUTE: LOGOUT
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

//MIDDLEWARE: session
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//SERVER START
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp server started...");
});
