var express             = require("express"),
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    app                 = express();

// MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

function blogDbReset(){
    Blog.remove({}, function(err){
        if(err){
            console.log("DATABASE FLUSH ERROR: ");
            console.log(err);
            return 0;
        } else {
            console.log("DATABASE FLUSHED!");
            var sampleData = [
                    {title:"Test Blog", image: "https://thumb9.shutterstock.com/display_pic_with_logo/1963319/292700015/stock-vector-more-than-pixel-perfect-vector-line-icons-fully-editable-and-scalable-292700015.jpg", body: "1st blog sample"},
                    {title:"Blog2", image: "https://thumb1.shutterstock.com/display_pic_with_logo/84249/392661373/stock-photo-hi-res-d-highway-road-sign-with-real-cloudscape-at-background-392661373.jpg", body: "2nd blog sample"},
                    {title:"Blog3", image: "https://thumb7.shutterstock.com/display_pic_with_logo/165995232/686542777/stock-photo-picturesque-mediaeval-stone-church-in-south-of-france-at-laroque-des-alb-res-686542777.jpg", body: "3rd blog sample"}
                ];
            sampleData.forEach(function(sample){
                Blog.create({
                    title: sample.title,
                    image: sample.image,
                    body: sample.body
                }, function(err, blog){
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
app.use(expressSanitizer()); //FOR USER-ENTERED SCRIPTS CLEANING (NEEDS TO BE AFTER BODY-PARSER)
app.set("view engine", "ejs");  //FOR IGNORING ".ejs" IN RENDER METHODS
app.use(methodOverride("_method"));

// DB CONNECTION
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true}); //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
    console.log("MongoDB -> \'restful_blog_app\' database connected!");
    blogDbReset();
});

//ROUTE: LANDING PAGE
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//ROUTE: INDEX
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: allBlogs});
        }
    });
});

//ROUTE: NEW (form)
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//ROUTE: CREATE (new blog)
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){ //REQUIRES BODY-PARSER (blog[title]+blog[image]+blog[body] collapsed into an object by BODY-PARSER syntax)
        if(err){
            console.log("Create error: ");
            console.log(err);
            res.render("new");
        } else {
            console.log("NEW BLOG: ");
            console.log(newBlog);
            res.redirect("/blogs");
        }
    });
});


//ROUTE: SHOW (blog details)
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("Show error: ");
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log("SHOW BLOG: ");
            console.log(foundBlog);
            res.render("show", {blog: foundBlog});
        }
    });
});

//ROUTE: EDIT (form)
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("Show error: ");
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log("SHOW BLOG: ");
            console.log(foundBlog);
            res.render("edit", {blog: foundBlog});
        }
    });
});

//ROUTE: UPDATE (selected blog)
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, editBlog){ //REQUIRES BODY-PARSER (blog[title]+blog[image]+blog[body] collapsed into an object by BODY-PARSER syntax)
        if(err){
            console.log("Update error: ");
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log("UPDATED BLOG: ");
            console.log(editBlog);
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//ROUTE: DELETE (selected blog)
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Delete error: ");
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log("DELETED BLOG: ");
            console.log("id: "+req.params.id);
            res.redirect("/blogs");
        }
    });
});

//SERVER START
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("RESTful Blog server started...");
});