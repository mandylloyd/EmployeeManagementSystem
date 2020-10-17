//checklist:
// add departments, roles, employees
// view departments, roles, employees -- DONE
// update employee roles -- DONE

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

connection.connect(function(error) {
  if (error) throw error;
  console.log("connected as id " + connection.threadId);
  beginPrompt(); 
});

// STARTING THE PROMPT

function beginPrompt() { 

console.log("starting prompt")

 inquirer
    .prompt({
      name: "beginRequest",
      type: "list",
      message: "Select an option below.",
      choices: ["View", "Add", "Update Employee Roles", "Exit"]
    })
    .then(function(answer) {
      if (answer.beginRequest==="View") {
        selectView();
      } else if(answer.beginRequest==="Update Employee Roles") {
        selectUpdate();
      } else if(answer.beginRequest==="Add") {
        selectAdd();
      }else{
        connection.end();
      }
 });
}

// VIEW FUNCTION
function selectView() { 

   inquirer
      .prompt({
        name: "viewRequest",
        type: "list",
        message: "What would you like to view?",
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

// ADD FUNCTIONS

function selectAdd() {

};

// VIEW FUNCTIONS

function viewDepartments(){ 
  connection.query("SELECT * FROM departments", function(error,response){ 
      if (error) throw error; 
      console.table(response); 
      beginPrompt(); 
  })
}

function viewEmployees() { 
  connection.query("SELECT * FROM employees", function(error,response){ 
      if (error) throw error; 
      console.table(response); 
      beginPrompt(); 
  })
}

function viewRoles() { 
  connection.query("SELECT * FROM roles", function(error,response){ 
      if (error) throw error; 
      console.table(response); 
      beginPrompt(); 
  })
}

// UPDATE ROLE FUNCTIONS

function selectUpdate(){

  connection.query("SELECT * FROM roles", function(error,response) { 
      if (error) throw error;  
      for (i=0; i<response.length; i++) {

          response[i].name = response[i].title; 
          response[i].value = response[i].id; 
          delete response[i].id; 
          delete response[i].title; 

      }
      allRoles = response; 
      updateSelected(allRoles); 
  })

  function updateSelected(allRoles){

      connection.query("SELECT * FROM employees", function(error,response) { 
          if (error) throw error;  
          for (i=0; i<response.length; i++){ 
              var firstAndLast = response[i].first_name + " " + response[i].last_name; 
              response[i].name = firstAndLast;  
              response[i].value = response[i].role_id; 
              delete response[i].employee_id;  
              delete response[i].first_name; 
              delete response[i].last_name; 
          }

          allEmployees = response; 

          selectUpdatePrompt(allEmployees, allRoles); 
      }) 
  }

  function selectUpdatePrompt(allEmployees, allRoles) { 
  
      inquirer.prompt([{
          name: "employee",
          type: "list",
          message: "Select an employee to update.", 
          choices: allEmployees
      },

      {
          name: "role",
          type: "list",
          message: "Select an option below.",
          choices: allRoles
      }

      ]).then(function(answer){ 
          connection.query("UPDATE employees SET ? WHERE ?", [
            {role_id: answer.role}, 
            {id: answer.employee}], 
            function(error, response){ 
              if (error) throw error; 
              console.log (response.affectedRows + " role(s) has been changed'\n")

              beginPrompt(); 

          })

      })
  }

}

function updateDepartments() {

};

function updateEmployees() {

};

function updateRoles() {

};