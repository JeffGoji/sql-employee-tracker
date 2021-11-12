//Util const:
const util = require("util");
//Express NPM
const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
//consoletable npm:
const consoleTable = require("console.table");

// Router:
const router = express.Router();

const PORT = process.env.PORT || 3001;
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
  console.log(`Connected to server`);
  beginPrompts();
});

module.exports = db;
