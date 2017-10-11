var faker = require("faker");

var prodName;
var price;

for(var i=0; i<10; i++){
    prodName = faker.commerce.productName();
    price = faker.commerce.price();
    console.log(prodName+" - $"+price);
}
