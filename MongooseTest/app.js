var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    User                    = require("./models/user"),
    executionResult         = "CODE RESULT COMES HERE";

//APP CONFIG
app.use(express.static(__dirname+"/public"));       //FOR GOOD DIRECTORY ORGANIZATION
app.use(bodyParser.urlencoded({extended: true}));   //STANDARD PACKAGE CALL
app.set("view engine", "ejs");                      //FOR IGNORING ".ejs" IN RENDER METHODS
app.use(methodOverride("_method"));                 //SIMULATES PUT HTTP REQUESTS

//DB CONNECTION
mongoose.connect("mongodb://localhost/mongoosetest", {useMongoClient: true});           //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise;                                                  //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));  //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
    console.log("\'DBtest\' database connected!");
});

//ROUTE: LANDING PAGE
app.get("/", function(req, res){
    res.render("landing", {result: executionResult});
});

app.post("/", function(req, res){
    console.log(req.body.dbcode);
    //EXECUTE CODE AFTER DB CONNECTION AND GET RESULTS
    //executionResult = console.log(eval(req.body.dbcode));
    res.render("landing", {result: executionResult});
});

//SERVER START
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("DBtest server started...");
});