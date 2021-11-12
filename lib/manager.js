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

//==============================================Manager Functions==================================//

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
                choices: managers,
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
                console.log("\nUpdated the Manager for the Employee\n");

                viewallEmployees();
              });
            });
        });
      });
  });
};

module.exports = router;
