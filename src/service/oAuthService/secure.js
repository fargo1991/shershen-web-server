let Secure = function(){

  const SECRET = 'mynameisvasya';

  let jwt = require("jsonwebtoken");

  let getSecret = function(){ return SECRET }
  let generateToken = function(userId){ return jwt.sign({ 'userId': userId, tokenRandomizer : Math.random(256*userId) }, SECRET) }
  let verifyToken = function (token){ jwt.verify(token, SECRET)}

  return {
      getSecret : getSecret,
      generateToken : generateToken,
      verifyToken : verifyToken
  }
}

module.exports = new Secure();