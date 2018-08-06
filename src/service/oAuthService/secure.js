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

  let verifyToken = function (token){ return jwt.verify(token, SECRET) }

  let checkAccessTokenNeeded = function(req){
    let routeAccess = ROUTES.find( route => { return req.baseUrl == route.route });
    if (routeAccess){
      return routeAccess.methods.find( method => { return method == req.method })
    }
    return false;
  }

  let checkAccessControl = function(route, role, body){

  }

  let authenticate = function(seq){
      return function(req,res,next){
          if (!checkAccessTokenNeeded(req)){ next(); return; }

          let access_token = ''

          if(req.method == 'GET'){ access_token  = req.query.access_token; }
          else if(req.method == 'POST'){ access_token = req.body.access_token; }

          if(!access_token) {
              res.status(401);
              res.send({ success: false, msg : 'Need access_token'})
          } else {
              seq.models.token.findOne({ where : { token : access_token } })
                  .then( result => {
                      if (result){
                          console.log(verifyToken(access_token).role)
                          // checkAccessControl(req.baseUrl, role, body)
                          next()
                      }
                      else {
                          res.status(401);
                          res.send({ success : false })
                      }
                  })
                  .catch( error => {
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