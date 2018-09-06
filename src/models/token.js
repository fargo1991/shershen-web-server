/**
 * Created by yaroslav on 31.08.18.
 */
var Sequelize = require("sequelize");

module.exports = function(){
  var DB = global["DB"];

  let token = DB.define('token', {
    token : Sequelize.STRING,
    refresh_token : Sequelize.STRING,
    restore_token : Sequelize.STRING
  });

  return token;

}