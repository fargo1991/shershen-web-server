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
      ])
    ]

    global.APP.post('/signin', function(req, res){

          secureService.authorize(req.body)
            .then(
              result => {
                  console.log(result)
                  successResponse(res, result)
              },
              error => {
                  console.log('error')
                if (error.message == "401") unauthorized(res)
                else { console.log(error); failResponse(res) }
              }
            )
            .catch(
              error => {
                console.log(error)
                if (error.message == "401") unauthorized(res)
                else failResponse(res)
              }
            )

    })

}