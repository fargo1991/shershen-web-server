var Sequelize = require('sequelize'),
  { ROLES } = require('../constants.json');

module.exports = function(){

  let user = global.DB.define('user', {
    login : Sequelize.STRING,
    phone : Sequelize.STRING,
    password : Sequelize.STRING,
    email : Sequelize.STRING,
    role : { type : Sequelize.STRING, allowNull : false, defaultValue : ROLES.CUSTOMER }
  },
    {
      paranoid : true
    }
  );

  return user;

}