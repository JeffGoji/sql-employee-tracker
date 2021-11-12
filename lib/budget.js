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

//===============================================Budget Function============================================//

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

    startPrompts();
  });
};

module.exports = router;
