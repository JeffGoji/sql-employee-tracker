//Util const:
const util = require("util");
//Express NPM
const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
//Inquirer npm:
const Inquirer = require("inquirer");
//consoletable npm:
const consoleTable = require("console.table");
//nodemon:
const nodemon = require("nodemon");
const inquirer = require("inquirer");
// const Connection = require("mysql2/typings/mysql/lib/Connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the Starfleet employee database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log(`Connected to ${db}`);
  beginPrompts();
});

// function after connection is established and welcome image shows
beginPrompts = () => {
  console.log("**************************");
  console.log("*                        *");
  console.log("*   STARFLEET DATABASE   *");
  console.log("*                        *");
  console.log("**************************", "\n");
  startPrompts();
};

//inquirer prompts:
const startPrompts = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "Make your choice:",
        choices: [
          "View all departments",
          "View all roles",
          "View all Employees",
          "Add department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee",
          "Update a Manager",
          "View employees by Department",
          "Delete an Employee",
          "Delete a role",
          "Delete a department",
          "View Department Budgets",
          "Exit Screen",
        ],
      },
    ])

    .then((answers) => {
      const { choices } = answers;
      if (choices === "View all departments") {
        showDepartments();
      }

      if (choices === "View all roles") {
        showRoles();
      }

      if (choices === "View all Employees") {
        viewallEmployees();
      }

      if (choices === "Add department") {
        addDepartment();
      }

      if (choices === "Add a Role") {
        addRole();
      }

      if (choices === "Add an Employee") {
        addEmployee();
      }

      if (choices === "Update an Employee") {
        updateEmployee();
      }

      if (choices === "Update a Manager") {
        updateManager();
      }

      if (choices === "View employees by Department") {
        viewByDepartment();
      }
      if (choices === "Delete an Employee") {
        deleteEmployee();
      }
      if (choices === "Delete a Role") {
        deleteRole();
      }
      if (choices === "Delete a department") {
        deleteDepartment();
      }
      if (choices === "View Department Budgets") {
        viewByBudget();
      }
      if (choices === "Exit Screen") {
        db.end();
      }
    });
};

//***** Functions section *********
//This function will show all of the departments:

showDepartments = () => {
  console.log(`Select your department to view`);
  const sqlCommand = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(sqlCommand, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startPrompts();
  });
};

// This function will show all roles
showRoles = () => {
  console.log("Showing all roles:\n");

  const sqlCommand = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;

  db.query(sqlCommand, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startPrompts();
  });
};

//This function will show all of the Employees:
viewallEmployees = () => {
  console.log(`Showing all Employees: \n`);

  const sqlCommand = `SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.name AS department,
  role.salary, 
  CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sqlCommand, (err, rows) => {
    console.table(rows);
    startPrompts();
  });
};

//This function will add a Department:
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        validate: (addDepartment) => {
          if (addDepartment) {
            return true;
          } else {
            console.log("Enter the name of the Department you want to Create");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sqlCommand = `INSERT INTO department (name) VALUES (?)`;
      db.query(sqlCommand, answer.addDepartment, (err, res) => {
        if (err) throw err;
        console.log(`Added ${answer.addDepartment} to the Departments`);

        showDepartments();
      });
    });
};

//This is the function to add a Role:

addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What Role would you like to add?",
        validate: (addRole) => {
          if (addRole) {
            return true;
          } else {
            console.log("Please Enter a Role");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?",
        validate: (addSalary) => {
          if (isNaN(addSalary)) {
            return true;
          } else {
            console.log("Please Enter a Salary");
            return false;
          }
        },
      },
    ])

    .then((answer) => {
      const params = [answer.role, answer.salary];

      const roleSql = `SELECT name, id FROM department`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: `list`,
              name: `dept`,
              message: `What Department is this role in?`,
              choices: `dept`,
            },
          ])

          .then((deptChoice) => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sqlCommand = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

            db.query(sqlCommand, params, (err, res) => {
              if (err) throw err;
              console.log(`Added ${answer.role} to the Roles`);

              showRoles();
            });
          });
      });
    });
};

// This function will add an employee
addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "What is the employee's first name?",
        validate: (addFirst) => {
          if (addFirst) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLast) => {
          if (addLast) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.fistName, answer.lastName];

      // grab roles from roles table
      const roleSql = `SELECT role.id, role.title FROM role`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            params.push(role);

            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  params.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has been added!");

                    viewallEmployees();
                  });
                });
            });
          });
      });
    });
};

//Function to update Employee:
updateEmployee = () => {
  // Get Employee to be updated:
  const employeeSql = `SELECT * FROM employee`;

  db.query(employeeSql, (err, data) => {
    if (err) throw err;
    const roles = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Choose your Employee to update",
          choices: roles,
        },
      ])
      .then((employeeSelected) => {
        const employee = employeeSelected.name;
        const params = [];
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        db.query(roleSql, (err, data) => {
          if (err) throw err;

          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What Role for this Employee?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              params.push(role);

              let employee = params[0];
              params[0] = role;
              params[1] = employee;

              const sqlCommand = `UPDATE employee SET role_id =? WHERE id = ?`;

              db.query(sqlCommand, params, (err, res) => {
                if (err) throw err;
                console.log("Updated Employee Successfully");

                viewallEmployees();
              });
            });
        });
      });
  });
};

//Function to Update Manager:
updateManager = () => {
  // Get Employee to be updated:
  const employeeSql = `SELECT * FROM employee`;

  db.query(employeeSql, (err, data) => {
    if (err) throw err;
    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Choose your Employee to update",
          choices: employees,
        },
      ])
      .then((employeeSelected) => {
        const employee = employeeSelected.name;
        const params = [];
        params.push(employee);

        const managerSql = `SELECT * FROM employee`;

        db.query(managerSql, (err, data) => {
          if (err) throw err;

          const managers = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "manager",
                message: "Who is the Manager for this Employee?",
                choices: "managers",
              },
            ])
            .then((managerChoice) => {
              const manager = managerChoice.manager;
              params.push(manager);

              let employee = params[0];
              params[0] = manager;
              params[1] = employee;

              const sqlCommand = `UPDATE employee SET manager_id =? WHERE id = ?`;

              db.query(sqlCommand, params, (err, res) => {
                if (err) throw err;
                console.log("Updated Employee");

                viewallEmployees();
              });
            });
        });
      });
  });
};

// View all employees by department:
viewByDepartment = () => {
  console.log(`Showing employees by department`);
  const sqlInfo = `SELECT employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id`;

  db.query(sqlInfo, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    startPrompts();
  });
};

//View budget Function:
viewByBudget = () => {
  console.log("Displaying budget for each Department \n");

  const sqlBudget = `SELECT department_id AS id, 
  department.name AS department,
  SUM(salary) AS budget
FROM  role  
JOIN department ON role.department_id = department.id GROUP BY  department_id`;

  db.query(sqlBudget, (err, rows) => {
    if (err) throw err;
    console.table(rows);

    viewallEmployees();
  });
};
