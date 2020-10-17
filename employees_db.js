var mysql = require("mysql");
// var dbpw = require("./js/dbpw"); 
var Department = require("./js/department");
var Employee = require("./js/employee");
var Role = require("./js/role");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "L4l#6hkmnSP4wv",
  database: "employees_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  beginPrompt(); 
});

function beginPrompt() { 

  console.log("starting prompt")

}