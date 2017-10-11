var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo2", {useMongoClient: true}); //FOR MONGODB CONNECTION
mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); //ON CONNECTION ERROR
mongoose.connection.once('open', function() {
  console.log("MongoDB -> \'blog_demo2\' database connected!");
});


// USER - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
var User = mongoose.model("User", userSchema);

// POST - title, content
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});
var Post = mongoose.model("Post", postSchema);

// User.create({
//     email: "bob@gmail.com",
//     name: "Bob Belcher"
// });

// Post.create({
//     title: "How to cook",
//     content: "blablabablalbabllabbal"
// }, function(err, post){
//     console.log(post);
// });

//ASSOCIATING DATA
// Post.create({
//     title: "How to cook pt.3",
//     content: "sadkjhgk wehgikweu welkiuy ewfr "
// }, function(err, post){
//     if(err){
//         console.log(err);
//     } else {
//         User.findOne({email: "bob@gmail.com"}, function(err, foundUser){
//             if(err){
//                 console.log(err);
//             } else {
//                 foundUser.posts.push(post);
//                 foundUser.save(function(err, data){
//                     if(err){
//                         console.log(err);
//                     } else {
//                         console.log(data);
//                     }
//                 });
//             }
//         });
//     }
// });

//RETRIEVE REFERENCED DATA
User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});