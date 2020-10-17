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

 inquirer
    .prompt({
      name: "beginRequest",
      type: "list",
      message: "Select an option below.",
      choices: ["View", "Update", "Delete", "Exit"]
    })
    .then(function(answer) {
      if (answer.beginRequest==="View") {
        selectView();
      } else if(answer.beginRequest==="Update") {
        selectUpdate();
      } else if(answer.beginRequest==="Delete") {
        selectDelete();
      }else{
        connection.end();
      }
 });
}

// what would you like to view?
function selectView() { 

   inquirer
      .prompt({
        name: "viewRequest",
        type: "list",
        message: "Select an option below.",
        choices: ["Departments", "Employees", "Roles", "Go back"]
      })
      .then(function(answer) {
        if (answer.viewRequest==="Departments") {
          viewDepartments();
        } else if(answer.viewRequest==="Employees") {
          viewEmployees();
        } else if(answer.viewRequest==="Roles") {
          viewRoles();
        }else{
          connection.end();
        }
   });
  }

// what would you like to update?
function selectUpdate() {

};

//what would you like to delete?
function selectDelete() {

};

function viewDepartments(){ 
  connection.query("SELECT * FROM departments", function(err,res){ 
      if (err) throw err; 
      console.table(res); 
      beginPrompt(); 
  })
}

function viewEmployees() { 
  connection.query("SELECT * FROM employees", function(err,res){ 
      if (err) throw err; 
      console.table(res); 
      beginPrompt(); 
  })
}

function viewRoles() { 
  connection.query("SELECT * FROM roles", function(err,res){ 
      if (err) throw err; 
      console.table(res); 
      beginPrompt(); 
  })
}