var db_options={
	host:'localhost',
	port : 3306,
	user : 'root', 
	password : 'root', 
	database:'babata'
	}
var mqDriver = require("mysql");
var mysql = mqDriver.createConnection(db_options);
module.exports = mysql;