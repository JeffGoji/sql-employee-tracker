//Util const:
const util = require("util");
//Express NPM
const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
//Inquirer npm:
const inquirer = require("inquirer");
//consoletable npm:
const consoleTable = require("console.table");
//Express router:
const router = express.Router();

const db = require("./../sqlserver");

const { builtinModules } = require("module");

//====================================Role functions================================///

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

//This is the function to add a Role:

addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the name of the Role",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "Enter the salary for this Role",
        name: "roleSalary",
      },
      {
        type: "input",
        message: "Enter the Role's department ID",
        name: "roleDept",
      },
    ])
    .then(function (res) {
      const title = res.roleTitle;
      const salary = res.roleSalary;
      const departmentID = res.roleDept;
      const query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentID}")`;
      db.query(query, (err, res) => {
        if (err) {
          throw err;
        }
        console.log(`You have added ${title} into Roles!`);
        startPrompts();
      });
    });
};

// Delete a role:
deleteRole = () => {
  const roleSql = "SELECT * FROM role";

  db.query(roleSql, (err, data) => {
    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Which Role would you like to delete?",
          choices: role,
        },
      ])

      .then((roleChoice) => {
        const role = roleChoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        db.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log(`Deleted the selected Role!`);
          startPrompts();
        });
      });
  });
};

module.exports = router;
