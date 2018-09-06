var Sequelize = require('sequelize'),
  { ROLES } = require('../constants.json');

module.exports = function(){

  let user = global.DB.define('user', {
    login : Sequelize.STRING,
    phone : Sequelize.STRING,
    password : Sequelize.STRING,
    email : Sequelize.STRING,
    mailConfirmationCode : Sequelize.STRING,
    mailConfirmed : { type : Sequelize.BOOLEAN, defaultValue : false },
    phoneConfirmationCode : Sequelize.STRING,
    phoneConfirmed : { type : Sequelize.BOOLEAN, defaultValue : false },
    role : { type : Sequelize.STRING, allowNull : false, defaultValue : ROLES.CUSTOMER }
  },
    {
      paranoid : true
    }
  );

  return user;

}