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

//===============================================Employee Functions============================================//
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

// Delete an Employee
const deleteEmployee = () => {
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
          message: "Which employee would you like to delete?",
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;

        const deleteEmp = `DELETE FROM employee WHERE id = ?`;

        db.query(deleteEmp, employee, (err, res) => {
          if (err) throw err;
          console.log("Employee has been deleted");

          viewallEmployees();
        });
      });
  });
};

module.exports = router;
