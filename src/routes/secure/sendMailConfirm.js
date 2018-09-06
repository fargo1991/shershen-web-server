/**
 * Created by yaroslav on 06.09.18.
 */

var SecureService = require("../../services/secureService"),
    MailService = require("../../services/mailService"),

    jwt = require("jsonwebtoken"),
    { SECRET } = require("../../constants.json"),
    { successResponse, failResponse, invalidRequest } = require("../response");

module.exports = function(){

  var secureService = SecureService();
  var mailService = MailService();

  //TODO: Прикрутить валидацию

  global.APP.get('/send/mail/confirm', function(req, res){

    var user = {}

    global.DB.models.user.findOne({ where : { email : req.query.email }})
      .then(
        result => {
          user = result.dataValues;
          return secureService.generateMailConfirmationCode(user.id)
        }
      )
      .then(
        result => {
          return mailService.sendCode(user.email, result)
        }
      )
      .then(
        result => {
          successResponse(res)
        }
      )
      .catch(
        error => {
          failResponse(res)
        }
      )



  });

}