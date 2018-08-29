var checkLoginExistRoute = require('./checkLoginExist');
var checkMailExistRoute = require('./checkMailExist');
var checkPhoneExistRoute = require('./checkPhoneExist');

module.exports = function(){

  checkLoginExistRoute();
  checkMailExistRoute();
  checkPhoneExistRoute();

}