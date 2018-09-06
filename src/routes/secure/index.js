var checkLoginExistRoute = require('./checkLoginExist');
var checkMailExistRoute = require('./checkMailExist');
var checkPhoneExistRoute = require('./checkPhoneExist');

var sendMailConfirmRoute = require('./sendMailConfirm');
var mailConfirmRoute = require('./mailConfirm');

module.exports = function(){

  checkLoginExistRoute();
  checkMailExistRoute();
  checkPhoneExistRoute();

  sendMailConfirmRoute();
  mailConfirmRoute();

}