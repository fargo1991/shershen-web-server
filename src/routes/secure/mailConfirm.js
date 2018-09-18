/**
 * Created by yaroslav on 06.09.18.
 *
 * Зарпос с токеном на подтверждение привязки почты в базе.
 * Принимает code, проверяет соответствует ли тому коду, что записан в базе,
 * если ок
 * -> отмечает признак подтверждения почты юзеру в базе у юзера, обнуляет mailConfirmationCode, отправляет страницу с подтвержденем
 *
 */
var SecureService = require('../../services/secureService'),
    jwt = require("jsonwebtoken"),
    { SECRET } = require('../../config.json'),

    HandleBars = require('handlebars'),
    mailConfirmedTemplate = require('../../templates/pages/mailConfirmed'),
    failVerifyCodeTemplate = require('../../templates/pages/failVerifyCode');
module.exports = function(){

  var secureService = SecureService();

  // TODO: Прикрутить валидацию

  global.APP.get('/mail/confirm', function(req, res) {

    var user = {};

    secureService.verifyMailConfirmationCode(req.query.code)
      .then(
        result => {
          user = result;
          return secureService.approveMailConfirmation(user.id);
        },
        error => {
          res.status(403);
          res.send( HandleBars.compile(failVerifyCodeTemplate)({ username: user.login }) )
          return false;
        }
      )
      // TODO: Использовать стандартные ответы сервера из response.js
      .then(
        result => {
            res.status(200)
            res.send( HandleBars.compile(mailConfirmedTemplate)({ username : user.login }) );
        },
      )
      .catch(
        error => {
            console.log(error)
            res.status(500);
            res.send('<p>Что-то пошло не так =(</p>')
        }
      )
  })

}