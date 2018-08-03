/**
 * Created by yaroslav on 31.07.18.
 */

var express = require("express");
var app = express();
var Sequelize = require("sequelize");

var bodyParser = require("body-parser");
var secure = require("./service/oAuthService/secure");
// var authenticate = secure().authenticate;

var sequelize = new Sequelize( require('./config.js')["development"] )

var oAuthService = require("./service/oAuthService");
var userService = require("./service/userService");
var merchantService = require('./service/merchantService');

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

secure.initRoutes(app, sequelize, [
    '/user',
    '/merchant'
])

var auth = oAuthService(app, sequelize);
userService(app, sequelize, auth);
merchantService(app,sequelize);

sequelize.sync()

app.get('/', function(req, res){
    res.send('Server is running')
});

app.listen(3030, function(params){
    console.log("Server listening in port:3030")
})
