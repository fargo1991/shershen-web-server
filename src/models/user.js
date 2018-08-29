var Sequelize = require('sequelize');

module.exports = function(){

  global.DB.define('user', {
    login : Sequelize.STRING,
    phone : Sequelize.STRING,
    password : Sequelize.STRING,
    email : Sequelize.STRING
  });

}