var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

// DB FLUSHING FUNCTION
function yelpCampDbReset(){
    //TODO: flush comments collection
    Campground.remove({}, function(err){
        if(err){
            console.log("DATABASE FLUSH ERROR: ");
            console.log(err);
            return 0;
        } else {
            console.log("DATABASE FLUSHED!");
            var sampleData = [
                    {name:"Salmon Creek", image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg", description: "1st sample"},
                    {name:"Granite Hill", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg", description: "2nd sample"},
                    {name:"Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg", description: "3rd sample"}
                ];
            sampleData.forEach(function(sample){
                Campground.create(sample, function(err, campground){
                    if(err){
                        console.log("Sample creation error: ");
                        console.log(err);
                    } else {
                        console.log("campground sample added");
                        Comment.create({
                            text: "This place is great",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log("Comment creation error: ");
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("new comment created");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = yelpCampDbReset;