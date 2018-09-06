/**
 * Created by yaroslav on 06.09.18.
 */
var SecureService = require('../../services/secureService'),
    jwt = require("jsonwebtoken"),
    { SECRET } = require('../../config.json');
module.exports = function(){

  var secureService = SecureService();

  // TODO: Прикрутить валидацию

  global.APP.get('/mail/confirm', function(req, res) {

    secureService.verifyMailConfirmationCode(req.query.code)
      .then(
        result => {
          var { userId } = jwt.verify(req.query.code, SECRET)
          return secureService.approveMailConfirmation(userId)
        }
      )
      // TODO: Использовать стандартные ответы сервера из response.js
      // TODO: Припилить редирект
      .then(
        result => {
              res.status(200)
              res.send('<p>Ваш почтовый адрес подтвержден!</p>')
        },
        error => {
          res.status(403);
          res.send('<p>Код подтверждения неверный</p>')
        }
      )
      .catch(
        error => {
            res.status(500);
            res.send('<p>Что-то пошло не так =(</p>')
        }
      )
  })

}