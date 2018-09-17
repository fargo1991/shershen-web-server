/**
 *
 * Проверка на наличие login в базе
 *
 * */


var SecureService = require('../../services/secureService'),
    { check, validationResult } = require('express-validator/check'),
    { MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH } = require('../../constants.json'),

   { failLoginConflict, successResponse, failResponse, invalidRequest } = require('../response')

module.exports = function(){

  var secureService = SecureService();

  var validationRules = [ check('login').exists().isLength({ min : MIN_LOGIN_LENGTH, max : MAX_LOGIN_LENGTH }) ];

  global.APP.post('/check/login/exist', validationRules,
      function (req, res) {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
          invalidRequest(res, errors.array())
          return false
        }

        secureService.checkLoginUnique(req.body.login)
          .then(
            result => {
              if(result){
                successResponse(res, { success : true, msg : 'Логин свободен'})
              }
            },
            err => {
              if(!err) failLoginConflict(res)
              else failResponse(res)

            }
          )
          .catch( err => {
            failResponse(res)
            console.log(err)
          })
      }
    )

  console.log('[ INIT | SUCCESS ] checkLoginExist router');

}