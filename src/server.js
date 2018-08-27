/**
 * Created by yaroslav on 27.08.18.
 */
var app = require("express")();
var Sequelize = require("sequelize");

var CONFIG = require('./config.json');

var routes = require('./routes');

var DB = new Sequelize( CONFIG["DB"]["development"] );

global.DB = DB;
global.APP = app;

routes.init();

app.listen( CONFIG.HOST_URL, function(){
    console.log(`Server listening on :${CONFIG.HOST_URL}`)
})