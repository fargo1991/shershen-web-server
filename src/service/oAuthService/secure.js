var accessControl = require('../../accessControl.js');

let Secure = function(){

  const SECRET = 'mynameisvasya';
  let ROUTES = [];

  let jwt = require("jsonwebtoken");

  let getSecret = function(){ return SECRET }

  let generateToken = function(userId, role){
      return jwt.sign(
          {
              'userId': userId,
              'role' : role,
              'tokenRandomizer' : Math.random(256*userId) }, SECRET)
        }

  /** Возвращает расшифрованые поля токена (userId, роль, шифрованный святым рандомом userId) */
  let verifyToken = function (token){ return jwt.verify(token, SECRET) }


  // DEPRECATED
  let checkAccessTokenNeeded = function(req){

    let routeAccess = ROUTES.find( route => { return req.baseUrl == route.route });

    if (routeAccess){
      return routeAccess.methods.find( method => { return method == req.method })
    }
    return false;
  }

  let hasFieldValues = function(field){

      // let regExp = /=/;
      let result = field.search(/=/);

      return result > -1
  }

  let illegalValues = function(field){
      return (field.split('=')[1].split(','));
    }


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
                        illegalValues(field).forEach( illegalValue => {
                            if(illegalValue == params[reqField]) rejected++ })
                    }
                }

                //rejected += (reqField==field ? 1 : 0)
            }
          })
          if (rejected) return false;
        }
      } else {
        return false
      }
    }
    return true;
  }

  let authenticate = function(seq){
      return function(req,res,next){

          let access_token = (req.method == 'GET') ?
              req.query.access_token :
              req.body.access_token;

          let userRole = access_token ?
              verifyToken(access_token).role :
              'GUEST';


          if( !checkAccessControl(
                  req.baseUrl,
                  req.method,
                  userRole,
                  req.method.toUpperCase() == 'GET' ? req.query : req.body) )
          {
              res.status(403);
              res.send({ success: false, msg : 'Access denied.'});
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
                      console.log('df')
                      res.status(401);
                      res.send({ success : false })
                  }
              })
              .catch( error => {
                console.log(error)
                  res.status(500);
                  res.send({ success : false, msg : error })
              })

      }
  }


  let initRoutes = function(app, seq, routes){
    ROUTES = routes;

    routes.forEach( route => {
          app.use(route.route, authenticate(seq))
      });
  }



  return {
      initRoutes : initRoutes,
      getSecret : getSecret,
      generateToken : generateToken,
      verifyToken : verifyToken,
      authenticate : authenticate
  }
}

module.exports = new Secure();