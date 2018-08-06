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
              rejected += (reqField==field ? 1 : 0)
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

          let access_token = ''

          if(req.method == 'GET'){ access_token  = req.query.access_token; }
          else if(req.method == 'POST' || 'PUT'){ access_token = req.body.access_token; }

          if(!access_token) {
              res.status(401);
              res.send({ success: false, msg : 'Need access_token'})
          } else {
              seq.models.token.findOne({ where : { token : access_token } })
                  .then( result => {
                      if (result){
                          if(
                            checkAccessControl(
                              req.baseUrl,
                              req.method,
                              verifyToken(access_token).role, req.method.toUpperCase() == 'GET' ? req.query : req.body)
                          ){
                            next() }
                          else{
                            res.status(403);
                            res.send({ success: false, msg : 'Access denied.s'});
                          }
                      }
                      else {
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