var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: '',
  database: "Bamazon"
});


var start = function() {

  connection.query("Select item_id,product_name,price from products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Item Id: " + res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price);
    }

    inquirer.prompt({
      name: "choice",
      type: "input",
      message: "What item would you like to purchase?",
      validate: function(value) {
        if (isNaN(value) === false && value > 0 && value < res.length) {
          return true;
        }
        return false;
      }

    }).then(function(itemId) {
      purchaseAmount(itemId);
    });
  });

};

var purchaseAmount = function(itemId) {
  inquirer.prompt({
    name: "choice",
    type: "input",
    message: "How many would you like to purchase?",
    validate: function(value) {
      if (isNaN(value) === false && value > 0) {
        return true;
      }
      return false;
    }

  }).then(function(amount) {
    buyProduct(itemId.choice, amount.choice);
  });


};

var buyProduct = function(itemId, amount) {

  connection.query("Select * from products where item_id = ?", itemId, function(err, res) {
    console.log(res[0].stock_quantity + " " + res[0].product_name + " are in stock.");
    if (res[0].stock_quantity - amount >= 0) {
      console.log("You have purchased " + amount + " " + res[0].product_name + " for $" + res[0].price);
      var new_quantity = res[0].stock_quantity - amount;
      updateDB(itemId, new_quantity);
    } else {
      console.log("Insufficient quantity! Only " + res[0].stock_quantity + " in stock");
      start();
    }
  });
};

var updateDB = function(itemId, new_amt) {

  connection.query("UPDATE products SET ? WHERE item_id = ?", [{
      stock_quantity: new_amt
    },
    itemId
  ], function(err, res) {
    if (err) throw err;
    connection.query("Select * from products where item_id = ?", itemId, function(err, res) {
      console.log("Only " + res[0].stock_quantity + " " + res[0].product_name + " remains!");
    });
  });
};

start();
