var mongoose = require("mongoose");
var db = mongoose.connection;

mongoose.connect("mongodb://localhost/cat_app", {useMongoClient: true});
mongoose.Promise = global.Promise; //FIX FOR PACKAGE DEPRECATION
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connection open!!!");
});

var catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});
var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil"
// });
// george.save(function(err, cat){
//     if(err){
//         console.log("SOMETHING WENT WRONG");
//     } else {
//         console.log("JUST SAVED THE CAT:");
//         console.log(cat);
//     }
// });
Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, function(err, cat){
    if(err){
        console.log("Cat.create error:");
        console.log(err);
    } else {
        console.log("NEW CAT.......");
        console.log(cat);
    }
});

Cat.find({}, function(err, cats){
    if(err){
        console.log("Cat.find error:");
        console.log(err);
    } else {
        console.log("ALL THE CATS......");
        console.log(cats);
    }
})
