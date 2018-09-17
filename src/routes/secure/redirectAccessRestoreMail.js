/**
 *
 *  Перенаправление на страницу смены пароля
 *
 */
var { unauthorized } = require('../response');

var MailService = require("../../services/mailService");

module.exports = function(){

  var mailService = MailService();

  try {

    global.APP.get('/access/restore/mail', function (req, res) {

        // TODO: Найти юзера по login|mail|phone, одно из них должно быть указано в запросе
        // TODO: Сделать проверку на соответствие restore_token с тем, что записан в базе у юзера.
        // Совпадает -> редирект на страничку со сменой пароля,
        // Не совпадает -> обнуление токена в базе -> редирект на страницу с ошибкой, запись в базу secureError-ов
        // И вообще, все это дело запихнуть в secureService

        // а пока что:
        if(req.query.restore_token && req.query.restore_token == "1234"){

          res.header('Location', 'http://localhost:3000/password/restore')
          res.status(301);
          res.send({msg: 'Redirecting to restorePage'})

        } else {
            unauthorized(res);
        }

      }
    )

    console.log('[ INIT | SUCCESS ] redirectAccessRrestoreMail router');

  } catch (ex){
    console.log('[ INIT | ERROR ] redirectAccessRrestoreMail router');
  }

}