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
  let verifyToken = function (token){ jwt.verify(token, SECRET)}

  return {
      getSecret : getSecret,
      generateToken : generateToken,
      verifyToken : verifyToken,
      authenticate : function(seq){
          return function(req,res,next){

              if(!req.query.access_token) {
                  res.status(401);
                  res.send({ success: false, msg : 'Need access_token'})
              } else {
                seq.models.token.findOne({ where : { token : req.query.access_token } })
                    .then( res => {
                        if (res) next();
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

              next();
          }
      }

  }
}

module.exports = new Secure();