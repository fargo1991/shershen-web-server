/**
 * Created by yaroslav on 27.08.18.
 */
var app = require("express")();
var Sequelize = require("sequelize");
var bodyParser = require("body-parser");
var SecureService = require("./services/secureService");

var CONFIG = require('./config.json');

var models = require('./models');
var routes = require('./routes');

var DB = new Sequelize( CONFIG["DB"]["development"] );

global.DB = DB;
global.APP = app;

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );
var secureService = SecureService();
app.use(secureService.authenticate)
models.init();
routes.init();



DB.sync({ alter : true }).then(
  (res) => {
      console.log('Sequelize-models synchronized with DB')
  },
  (err) => {
      console.log('Error was occured during sequelize.sync()');
      console.error(err);
  }
);

app.listen( CONFIG.HOST_URL, function(){
    console.log(`Server listening on :${CONFIG.HOST_URL}`)
})