/**
 * Created by yaroslav on 27.08.18.
 */
var CONFIG = require('./config.json');

var app = require("express")();
var DB = require("sequelize")(
    CONFIG["DB"]["DEVELOP"] =
)

app.listen( CONFIG.HOST_URL, function(){

    console.log(`Server listening on :${CONFIG.HOST_URL}`)

})