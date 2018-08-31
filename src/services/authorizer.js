/**
 * Created by yaroslav on 31.08.18.
 */
var jwt = require("jsonwebtoken"),
    { PASSWORD_SECRET, SECRET } = require("../config.json");

module.exports = function() {

  var createToken = function (user) {
    var token = {
      token: jwt.sign(
        {
          userId: user.id,
          role: user.role,
          created: Date.now(),
          expiredThrow: 1209600033
        }, SECRET),
      refresh_token: jwt.sign(
        {
          userId: user.id,
          role: user.role,
          created: Date.now()
        }, SECRET),
      userId : user.id
    }

    return new Promise( (resolve, reject) => {

      global.DB.models.token.findOne({ where : { userId : user.id }})
        .then(
          result => {
            // TODO: сделать 2 типа обновления токенов.
            // TODO: ForceUpdate - заменить существующий токен без учета срока годности токена.
            // TODO: SoftUpdate - заменить на новый токен, только если истек срок годности, если не истек, то вернуть старый.
            if(result) return global.DB.models.token.update(token, { where : { userId : user.id } })
            else return global.DB.models.token.create(token)
          }
        )
        .then(
          result => { if(result) resolve(token) },
          error => { console.log(error); reject(error) }
        )
        .catch( error => {
          console.log(error)
        })
    })
  }

  var authorizeByPhone = function (credentials) {
    return global.DB.models.user.findOne({where: { phone : credentials.phone }})
        .then(
          result => {
            if (result) {
              var user = result.dataValues;
              if (credentials.password == jwt.verify(user.password, PASSWORD_SECRET).password)  return createToken(user)
              throw new Error("401")
            } else {
              throw new Error("401")
            }
          }
        )
      .catch(err => { console.log(err); if(!err.message == "401") throw new Error("500") })
  }

  var authorizeByMail = function (credentials) {
    return global.DB.models.user.findOne({where: { email : credentials.email }})
      .then(
        result => {
          if (result) {
            var user = result.dataValues;
            if (credentials.password == jwt.verify(user.password, PASSWORD_SECRET).password)  return createToken(user)
            throw new Error("401")
          } else {
            throw new Error("401")
          }
        }
      )
      .catch(err => { console.log(err); if(!err.message == "401") throw new Error("500") })
  }

  var authorizeByLogin = function (credentials){
    return global.DB.models.user.findOne({where: { login : credentials.login }})
      .then(
        result => {
          if (result) {
            var user = result.dataValues;
            if (credentials.password == jwt.verify(user.password, PASSWORD_SECRET).password)  return createToken(user)
            throw new Error("401")
          } else {
            throw new Error("401")
          }
        }
      )
      .catch(err => { console.log(err); if(!err.message == "401") throw new Error("500") })
  }

  return {
    authorize: function (credentials) {
      if (!credentials.password) throw new Error('PASSWORD needs');

      if (credentials.phone) return authorizeByPhone(credentials);
      else if (credentials.email) return authorizeByMail(credentials);
      else if (credentials.login) return authorizeByLogin(credentials);
      else throw new Error('PHONE || EMAIL || LOGIN needs to authorize user');
    }
  }
}