var jwt = require("jsonwebtoken"),
    authorizer = require('./authorizer')(),
    { SECRET } = require('../config.json'),

    { unauthorized, forbidden, failResponse } = require('../routes/response');

module.exports = function(){

  var DB = GLOBAL["DB"];
  var accessControl = require('./accessControls');

  var generateToken = function(user){
    return jwt.sign(
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

    if (routeAccessControls !== -1 && routeAccessControls){
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
      // TODO: Нет проверки accessFields == none. Надо сделать
    }
    return true;
  }

  let authenticate = function(){
    return function(req,res,next){

      let access_token = req.headers.authorization;//['authorization'])
      console.log(access_token)

      let userRole = access_token ?
        verifyToken(access_token).role :
        'GUEST';

      if( !checkAccessControl(
          req.originalUrl,
          req.method,
          userRole,
          req.method.toUpperCase() == 'GET' ? req.query : req.body) )
      {
        console.log(checkAccessControl(
          req.originalUrl,
          req.method,
          userRole,
          req.method.toUpperCase() == 'GET' ? req.query : req.body));
        console.log(userRole)
        forbidden(res)
        return false
      }

      if(userRole == 'GUEST') {
        next();
        return false;
      }


      DB.models.token.findOne({ where : { token : access_token } })
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

    generateMailConfirmationCode : function(userId){
      return new Promise( (resolve, reject) => {

        let code = jwt.sign({ userId : userId, createdAt : Date.now() },
          SECRET
        );

        DB.models.user.update({ mailConfirmationCode : code }, { where : { id : userId } })
          .then(
            result => resolve(code),
            error => reject(error)
          )
      });

    },

    verifyMailConfirmationCode : function (code) {

      return new Promise( (resolve, reject) => {

        DB.models.user.find({ where : { mailConfirmationCode : code } })
          .then(
            result => {
              if (!result) reject("Code confirmation failed");
              resolve(result.dataValues);
            },
            reject => reject("Code confirmation failed")
          )
      })
    },

    approveMailConfirmation : function(userId){
      return new Promise( (resolve, reject) => {
        DB.models.user.update({ mailConfirmed : true, mailConfirmationCode : null }, { where : { id : userId }, returning : true })
          .then(
            result => { resolve( result[1][0].dataValues ) },
            error => reject(error)
          )
      })
    },
    /**
     * authentication middleware
     * */
    authenticate : authenticate(),
    authorize : authorizer.authorize
  }

}