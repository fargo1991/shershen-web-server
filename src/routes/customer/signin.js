/**
 * Created by yaroslav on 27.08.18.
 */

var SecureService = require('../../services/secureService'),
  { successResponse, failResponse, unauthorized, invalidRequest } = require('../response'),
  { check, validationResult, oneOf } = require('express-validator/check');

module.exports = function(){
    var secureService = SecureService();

    var validationRules = [
      oneOf([
        check('phone').exists(),
        check('email').exists(),
        check('login').exists()
      ]),
      check('password').exists()
    ]

    global.APP.post('/signin', validationRules, function(req, res){

      const errors = validationResult(req);

      if(!errors.isEmpty()){
        invalidRequest(res, errors.array());
        return false;
      }

      try {
        secureService.authorize(req.body)
          .then(
            result => {
              if (result)
                successResponse(res, result)
              else unauthorized(res)
            },
            error => {
              if (error.message == "401") unauthorized(res)
              else {
                failResponse(res)
              }
            }
          )
          .catch(
            error => {
              if (error.message == "401") unauthorized(res)
              else failResponse(res)
            }
          )
      } catch (err){
        if(err.message == 401) unauthorized(res);
        else failResponse(res)
      }

    })

}