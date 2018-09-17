/**
 *
 * Проверка на наличие phone в базе
 *
 * */

var SecureService = require('../../services/secureService'),

   { check, validationResult } = require('express-validator/check'),
   { MIN_PHONE_LENGTH, MAX_PHONE_LENGTH } = require('../../constants.json'),

  { failResponse, successResponse, invalidRequest, failPhoneConflict } = require('../response');


module.exports = function(){

  var secureService = SecureService();

  var validationRules = [ check('phone').exists().isLength({ min : MIN_PHONE_LENGTH, max : MAX_PHONE_LENGTH })]

  global.APP.post('/check/phone/exist', validationRules,
    function(req, res){

      const errors = validationResult(req);

      if(!errors.isEmpty()){
        invalidRequest(res, errors.array() );
        return false;
      }

      secureService.checkPhoneUnique(req.body.phone)
        .then(
          result => {
            if(result) { successResponse(res, 'Телефон не используется')}
          },
          error => {
            if(!error) failPhoneConflict(res)
            else failResponse(res)
          }
        )
        .catch(
          error => {
            failResponse(res);
            console.log(error)
          }
        );

    }
  );

  console.log('[ INIT | SUCCESS ] checkPhoneExist router');

}