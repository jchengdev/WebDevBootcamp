var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo", {useMongoClient: true}); //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
  console.log("MongoDB -> \'blog_demo\' database connected!");
});


// POST - title, content
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});
var Post = mongoose.model("Post", postSchema);

// USER - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [postSchema] //POST SCHEMA NEEDS TO BE DEFINED BEFORE
});
var User = mongoose.model("User", userSchema);

//INDEPENDENT
// var newUser = new User({
//     email: "charlie@brown.edu",
//     name: "Charlie Brown"
// });
// newUser.save(function(err, user){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });

// var newPost = new Post({
//     title: "Reflections on Apples",
//     content: "They are delicious"
// });
// newPost.save(function(err, post){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// });

//EMBEDDED
// var newUser = new User({
//     email: "joao@dasilva.edu",
//     name: "Joao da Silva"
// });
// newUser.posts.push({
//     title: "How to bre polyjuice potion",
//     content: "Just kidding. Go to potions class to learn it!"
// });
// newUser.save(function(err, user){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });

//MANIPULATING
User.findOne({name: "Joao da Silva"}, function(err, user){
    if(err){
        console.log(err);
    } else {
        user.posts.push({
            title: "3 things I really hate",
            content: "coco, xixi, peido"
        });
        user.save(function(err, user){
            if(err){
                console.log(err);
            } else {
                console.log(user);
            }
        });
    }
});