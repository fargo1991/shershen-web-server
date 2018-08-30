var jwt = require("jsonwebtoken"),
    { SECRET } = require('../constants.json'),

    accessControl = require('./accessControls'),
    { unauthorized, forbidden, failResponse } = require('../routes/response');

var generateToken = function(user){
  return jet.sign(
    {
      "userId" : user.id,
      "role" : user.role
    }, SECRET
  )
}
var verifyToken = function(token){ return jwt.verify(token, SECRET) }
let hasFieldValues = function(field){   let result = field.search(/=/); return result > -1 }
/**
 *
 *  Проверка доступа к контроллеру, методу, и полям объекта, в зависимотси от роли пользователя.
 *  Возвращает статус проверки: false - не прошла, true - ресурс доступен.
 *  Принимает:
 *    @route (String) - url контроллера. ('/user', '/merchant' и т.п.)
 *    @method (String) - один из следующих методов : 'GET', 'POST', 'PUT', 'DELETE'
 *    @role (String) - одна из следующих ролей : 'ADMIN', 'FRAN_ADMIN', 'BRAND_ADMIN', 'MERCHANT_ADMIN', 'CUSTOMER',
 *                    если роль не определена, то проверка будет осуществляться для роли 'GUEST'
 *    @params (Object) - DTO запрашиваемого объекта
 *
 * */

let checkAccessControl = function(route, method, role, params){

  let roleAccessControls = accessControl.find( roleControls => { return roleControls.role == role });
  let routeAccessControls = roleAccessControls.routes.find( accessRoute => { return accessRoute.route == route });

  if (routeAccessControls !== -1){
    let methodAccessControls = routeAccessControls.methods[method.toUpperCase()];

    if (!methodAccessControls.access) return false;

    if (methodAccessControls.accessFields == 'all'){

      if(methodAccessControls.exceptedFields && methodAccessControls.exceptedFields.length){

        let rejected = 0;
        methodAccessControls.exceptedFields.forEach( field => {
          for (reqField in params){

            let fieldName = hasFieldValues(field) ? field.split('=')[0] : field;

            if (reqField==fieldName) {
              if( hasFieldValues(field) ){
                illegalValues(field).forEach(
                  illegalValue => {
                    if(illegalValue == params[reqField]) rejected++
                  })
              }
            }
          }
        });

        if (rejected) return false;
      }
    } else if (!methodAccessControls.accessFields){
      return true
    }
  }
  return true;
}

let authenticate = function(seq){
  return function(req,res,next){

    let access_token = (req.headers['Authorization'])

    let userRole = access_token ?
      verifyToken(access_token).role :
      'GUEST';


    if( !checkAccessControl(
        req.baseUrl,
        req.method,
        userRole,
        req.method.toUpperCase() == 'GET' ? req.query : req.body) )
    {
      forbidden(res)
      return false
    }

    if(userRole == 'GUEST') {
      next();
      return false;
    }


    seq.models.token.findOne({ where : { token : access_token } })
      .then( result => {
        if (result){
          next();
        }
        else {
          unauthorized(res)
        }
      })
      .catch( error => {
        console.log(error)
        failResponse(res);
      })
  }
}


module.exports = function(){

  var DB = GLOBAL["DB"]

  var generateToken = function () {

  }


  /**
   *
   * PUBLIC
   *
   * */
  return{

    // Возвращает true, если проверка прошла и совпадений в базе нет
    checkPhoneUnique : function(phone) {

      return new Promise( (resolve, reject)=> {
        DB.models.user.findOne({where: {phone: phone}})
          .then(
            result => {
              if (!result) resolve(true)
              reject(false)
            },
          )
          .catch(err => {
            console.log(err);
            throw new Error(err)
          })
      });

    },
    // Возвращает true, если проверка прошла и совпадений в базе нет
    checkEMailUnique : function(email){

      return new Promise( (resolve, reject) => {
        DB.models.user.findOne({ where : { email: email } })
          .then(
            result => {
              if (!result) resolve(true)
              reject(false)
            },
          )
          .catch(err => {
            resolve(err);
            throw new Error(err)
          })
      });

    },
    checkLoginUnique : function (login) {

      return new Promise( (resolve, reject) => {
        DB.models.user.findOne({ where : { login: login } })
          .then(
            result => {
              if (!result) resolve(true)
              reject(false)
            },
          )
          .catch(err => {
            resolve(err);
            throw new Error(err)
          })
      });

    },
    /**
     * middleware
     * */
    authenticate : function (token) {



    }
  }

}