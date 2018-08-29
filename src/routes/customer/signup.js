/**
 * Created by yaroslav on 27.08.18.
 */
var SmsService = require('../../services/smsService'),
    SecureService = require('../../services/secureService'),
    MailService = require('../../services/mailService.js'),
    { check, oneOf, validationResult } = require('express-validator/check'),

    { MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH,
      MIN_PHONE_LENGTH, MAX_PHONE_LENGTH,
      MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } = require('../../constants.json');

function failPhoneConflict(res) {
  res.status(409);
  res.send({success: false, errMsg: 'Номер телефона уже занят'})
}

function failMailConflict(res){
  res.status(409);
  res.send({ success : false, errMsg : 'Почтовый адрес уже занят'})
}

function failLoginConflict(res){
  res.status(409);
  res.send({ success : false, errMsg : 'Login уже занят'})
}

function successResponse(res, obj){
    res.status(200);
    res.send({ success : true, obj : obj })
}

function failResponse(res) {
  res.status(500);
  res.send({ success: false, msg : 'Ошибка сервера'})
}

module.exports = function(){

  var smsService = SmsService(),
      secureService = SecureService(),
      mailService = MailService();

  function phoneSignUp(req, res) {
    var user={}

    secureService.checkPhoneUnique(req.body.phone)
      .then(
        (_res)=> {
          if(_res) return DB.models.user.create( req.body )
        },
        (err)=> {
          if(!err) failPhoneConflict(res);
          else failResponse(res);
        }
      )
      .then(
        (result) => {
          user = result.dataValues;
          return smsService.sendCode(req.body.phone)
        }
      )
      .then( result => successResponse(res, user) )
      .catch( result => failResponse(res) )
  }

  function mailSignUp(req, res) {
    var user = {}

    secureService.checkEMailUnique(req.body.email)
      .then(
        result => {
          if (result) return DB.models.user.create( req.body )
        },
        error => {
          if(!error) failMailConflict(res);
          else failResponse(res);
        }
      )
      .then(
        result => {
          user = result.dataValues;
          mailService.sendCode(req.body.email);
          successResponse(res, user)
        },
        error => {
          console.log(error)
        }
      )
      .catch(
        error => {
          console.log(error)
          failResponse(res);
        }
      )
  }

  var validationRules = [
    oneOf([
      check('phone').exists().isLength({ min: MIN_PHONE_LENGTH, max : MAX_PHONE_LENGTH }),
      check('email').exists().isEmail()
    ]),
    check('login').exists().isLength({ min : MIN_LOGIN_LENGTH, max : MAX_LOGIN_LENGTH }),
    check('password').exists().isLength({ min : MIN_PASSWORD_LENGTH, max : MAX_PASSWORD_LENGTH})
  ];

  global.APP.post('/signup', validationRules,
    function(req, res){

      const errors = validationResult(req);

      if(!errors.isEmpty()){
        res.status(400)
        res.send({ errors : errors.array() });
        return false;
      }

      if (req.body.phone && req.body.email){
          res.status(404);
          res.send({ success : false, msg : 'Нужно выбрать тип регистрации по телефону или почте. ' +
          '* Привязка почты или телефона будет доступна после регистрации.'})
      }

      try {
        secureService.checkLoginUnique(req.body.login)
          .then(
            result => {
              // регистрация по номеру телефона
              if (req.body.phone) {
                phoneSignUp(req, res)
                // регистрация по почте
              } else if (req.body.email) {
                mailSignUp(req, res)
              }
            },
            (err) => {
              if (!err) failLoginConflict(res);
              else failResponse(res);
            }
          )
          .catch(err => console.log(err))
      } catch (err){
        failResponse(res);
        console.log(err)
      }

    })

}