var cat = require("cat-me");

console.log(cat.catNames);
console.log(cat("grumpy"));
console.log(cat(""));
console.log(cat(0));
console.log(cat(false));
console.log(cat(undefined));
console.log(cat(NaN));

var knock = require("knock-knock-jokes");
console.log(knock());