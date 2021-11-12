//Util const:
const db = require("./sqlserver");
const util = require("util");
//Express NPM
const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
//Inquirer npm:
const inquirer = require("inquirer");
//consoletable npm:
const consoleTable = require("console.table");

// Router:
const router = express.Router();

//Port and express:
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Router routes:
router.use(require("./lib/employees"));
router.use(require("./lib/departments"));
router.use(require("./lib/roles"));
router.use(require("./lib/manager"));
router.use(require("./lib/budget"));

// function after connection is established and welcome image shows and then the inquirer prompts start:
beginPrompts = () => {
  console.log("**************************");
  console.log("*            *            *");
  console.log("*           *  *          *");
  console.log("*          *    *         *");
  console.log("*         *      *        *");
  console.log("*        *    **  *       *");
  console.log("*       *   *    * *      *");
  console.log("*       *  *      **      *");
  console.log("*        **        *      *");
  console.log("*                         *");
  console.log("*   STARFLEET DATABASE    *");
  console.log("*       CONNECTED         *");
  console.log("**************************", "\n");
  startPrompts();
};

//=============================== Inquirer prompts ========================////
exports.startPrompts = startPrompts = () => {
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
          "Delete a Role",
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

//Delete Fucntions section ===========================

module.exports = router;
