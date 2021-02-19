"use strict";
const mysql = require("mysql");
const dbConfig = require("./dbConfig");
var connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    charset: 'utf8mb4',
});
module.exports = connection;
