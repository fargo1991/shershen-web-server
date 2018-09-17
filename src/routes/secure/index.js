var checkLoginExistRoute = require('./checkLoginExist');
var checkMailExistRoute = require('./checkMailExist');
var checkPhoneExistRoute = require('./checkPhoneExist');

var sendMailConfirmRoute = require('./sendMailConfirm');
var mailConfirmRoute = require('./mailConfirm');

var sendAccessRestoreMail = require('./sendAccessRestoreMail');
var accessRestoreMail = require('./redirectAccessRestoreMail');

module.exports = function(){

  checkLoginExistRoute();
  checkMailExistRoute();
  checkPhoneExistRoute();

  sendMailConfirmRoute();
  mailConfirmRoute();

  sendAccessRestoreMail();
  accessRestoreMail();

}