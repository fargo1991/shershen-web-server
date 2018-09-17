/**
 *
 * Проверка на наличие email в базе
 *
 * */

var SecureService = require('../../services/secureService'),

  { check, validationResult } = require('express-validator/check'),

  { invalidResponse, successResponse, failResponse, failMailConflict } = require('../response');


module.exports = function () {
  var secureService = SecureService();

  var validationRules = [ check('email').exists().isEmail()];

  global.APP.post('/check/email/exist', validationRules,
      function (req, res) {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
          invalidResponse(res, errors.array());
          return false;
        }

        secureService.checkEMailUnique(req.body.email)
          .then(
            result => {
              if(result){
                successResponse(res, 'Почтовый адрес не используется')
              }
            },
            err => {
              if(!err) failMailConflict(res)
              else failResponse(res)
            }
          )
          .catch( err => {
            failResponse(res)
            console.log(err)
          })

      }
    )

  console.log('[ INIT | SUCCESS ] checkMailExist router');

}