var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    localStrategy           = require("passport-local"),
    User                    = require("./models/user");

//APP CONFIG
app.use(bodyParser.urlencoded({extended: true})); //STANDARD PACKAGE CALL
app.set("view engine", "ejs");  //FOR IGNORING ".ejs" IN RENDER METHODS

//DB CONNECTION
mongoose.connect("mongodb://localhost/authdemo", {useMongoClient: true}); //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
    console.log("MongoDB -> \'authdemo\' database connected!");
});

//AUTHENTICATION AND SESSION CONFIG
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); //FOR PLUGIN
app.use(passport.session());    //FOR PLUGIN
passport.use(new localStrategy(User.authenticate()));   //PLUGIN 'passport-local-mongoose' PATTERN
passport.serializeUser(User.serializeUser());           //PLUGIN 'passport-local-mongoose' PATTERN
passport.deserializeUser(User.deserializeUser());       //PLUGIN 'passport-local-mongoose' PATTERN

//ROUTE: LANDING PAGE
app.get("/", function(req, res){
    res.render("home");
});

//ROUTE: SECRET PAGE
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
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
            res.redirect("/secret");
        });
    });
});

//ROUTE: LOGIN (form)
app.get("/login", function(req, res){
    res.render("login");
});

//ROUTE: LOGIN (access)
app.post("/login", passport.authenticate("local", {
                                            successRedirect: "/secret", //MIDDLEWARE
                                            failureRedirect: "/login"   //MIDDLEWARE
                                        }), function(req, res){
});

//ROUTE: LOGOUT
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
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
   console.log("AuthDemo server started...");
});