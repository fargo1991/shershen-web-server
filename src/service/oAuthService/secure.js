let Secure = function(){

    const roles = {
        merchant : {
            routes : [
                ''
            ]
        }
    }

  const SECRET = 'mynameisvasya';

  let jwt = require("jsonwebtoken");

  let getSecret = function(){ return SECRET }
  let generateToken = function(userId){ return jwt.sign({ 'userId': userId, tokenRandomizer : Math.random(256*userId) }, SECRET) }
  let verifyToken = function (token){ return jwt.verify(token, SECRET) }
  let authenticate = function(seq){
      return function(req,res,next){
          let access_token = ''

          if(req.method == 'GET'){ access_token  = req.query.access_token; }
          else if(req.method == 'POST'){ access_token = req.body.access_token; }

          if(!access_token) {
              res.status(401);
              res.send({ success: false, msg : 'Need access_token'})
          } else {
              seq.models.token.findOne({ where : { token : access_token } })
                  .then( result => {
                      if (result){ next() }
                      else {
                          res.status(401);
                          res.send({ success : false })
                      }
                  })
                  .catch( error => {
                      res.status(500)
                      res.send({ success : false, msg : error })
                  })
          }
      }
  }
  let initRoutes = function(app, seq, routes){
      routes.forEach( route => {
          app.use(route, authenticate(seq))
      })
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