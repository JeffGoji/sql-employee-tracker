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
  console.log("**************************");
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
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startPrompts();
  });
};

// This function will show all roles
showRoles = () => {
  console.log("Showing all roles...\n");

  const sql = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startPrompts();
  });
};
