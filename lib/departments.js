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

//==================================================Department Functions=========================================//

//This function will show all of the departments:

showDepartments = () => {
  console.log(`Showing all Departments`);
  const sqlCommand = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(sqlCommand, (err, rows) => {
    if (err) throw err;
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
        console.log();
        startPrompts();
      });
    });
};

// Delete a department:
deleteDepartment = () => {
  const deptSql = "SELECT * FROM department";

  db.query(deptSql, (err, data) => {
    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "What department will you delete?",
          choices: dept,
        },
      ])

      .then((deptChoice) => {
        const dept = deptChoice.dept;
        const sql = "DELETE FROM department WHERE id = ?";

        db.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("You have Deleted a department.");
          console.log(dept);
          startPrompts();
        });
      });
  });
};

module.exports = router;
