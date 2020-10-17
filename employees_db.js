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

      updateSelectedPrompt(allEmployees, allRoles); 
  }) 
  }

  function updateSelectedPrompt(allEmployees, allRoles) {
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

function selectAdd()  { 
  inquirer
  .prompt({
    name: "addRequest",
    type: "list",
    message: "What would you like to add?",
    choices: ["Department", "Employee", "Role", "Go back"]
  })
  .then(function(answer) {
    if (answer.addRequest==="Department") {
      addDepartment();
    } else if(answer.addRequest==="Employee") {
      addEmployee();
    } else if(answer.addRequest==="Role") {
      addRole();
    }else{
      beginPrompt();
    }
  });
 }

function addDepartment() { 
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Type department name below.",
      })
      .then(function(answer){ 
      const departmentName = new Department(answer.department);
      connection.query("INSERT INTO departments SET department_name = ?", [departmentName.department_name], function(error, response){ 
          if (error) throw error; 
          console.log (response.affectedRows + " new department has been created.\n")
      })
      beginPrompt(); 
  })
  console.log(answer);
};

function addEmployee() {
  
  inquirer.prompt([{
      name: "first_name",
      type: "input",
      message: "Type employee's first name."
  },
  {
      name: "last_name",
      type: "input",
      message: "Type employee's last name"
  },
  { 
      name: "role_id", 
      type: "input", 
      message: "What is the employee's role?",
  }])
  
  .then(function(answer){ 
      const insertEmployee = new Employee(answer.first_name, answer.last_name, answer.role_id);
      connection.query("INSERT INTO employees SET ?", insertEmployee, function(error, response){ 
          if (error) throw error; 
          console.log (response.affectedRows + " has been added to employees.\n")
          beginPrompt(); 

      })
    
  })
  }

function addRole() {
  connection.query("SELECT * FROM departments", function(error,response){ 
      if (error) throw error;  
      for (i=0; i<response.length; i++){ 
          response[i].value = response[i].id; 
          response[i].name = response[i].department_name; 
          delete response[i].department_name
          delete response[i].id; 
      }
      var allDepartments = response; 
      rolePrompt(allDepartments); 
  })
  

  function rolePrompt(allDepartments){ 
    inquirer.prompt([{
        name: "role",
        type: "input",
        message: "Type the new role name below."
    },
    { 
        name: "salary", 
        type: "input", 
        message: "Type the salary below."
    }, 
    { 
        name: "department_id", 
        type: "list", 
        message: "Select a department.",
        choices: allDepartments
    }])
    
    .then(function(answer){ 
        const addRole = new Role(answer.role, answer.salary, answer.department_id);
        connection.query("INSERT INTO roles SET ?", addRole, function(error, response){ 
            if (error) throw error; 
            console.log (response.affectedRows + " has been added.\n"); 
            beginPrompt(); 

        })
    })
  }
}