/**
 *
 * Отправка письма с ссылкой для восстановления пароля
 *
 * */

var MailService = require("../../services/mailService"),
    { successResponse, failResponse } = require('../response');

module.exports = function(){

  var mailService = MailService();

  try {
    global.APP.post('/access/restore/mail', function (req, res) {

      //TODO: валидация по наличию одного из трех идентификационных параметров mail/phone/login
      //TODO: проверка на привязвнность аккаунта к почте

      try {
        mailService.sendRestoreLetter("fargo1991@inbox.ru", "1234", "fargo1991")
          .then(
            result => {
              successResponse(res, 'Письмо успешно отправлено');
            }
          )
          .catch(
            err => {
              failResponse(res);
            }
          )
      } catch (err){
        console.log(err);
        failResponse(res);
      }
    });


    console.log('[ INIT | SUCCESS ] sendAccessRrestoreMail router');

  } catch (err){
    console.log('[ INIT | ERROR ] sendAccessRrestoreMail router');
  }

}