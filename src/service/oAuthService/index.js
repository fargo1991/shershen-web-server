/**
 * Created by yaroslav on 31.07.18.
 */

const models = require("./models.js");
const routes = require("./routes.js");
const secure = require("./secure.js");

module.exports = function(app, seq){
    var self = this;

    self.authenticate = function (token, callback) {

        if(!token) throw new Error('Token is undefined')

      seq.models.token.findOne({where : { token : token } })
        .then(result => {
          if (result) callback.success({ success : true, uid : result.dataValues.userId })
          else callback.error({ success : false })
        } )
        .catch( err => {
          callback.error({ success : false })
        })

    }

    models.init(seq);
    routes.init(app, seq,
        {
        /**
         * credentials : {
         *      @login : String,
         *      @password : String
         *  }
         *  callback : {
         *      @success : function(params for response),
         *      @error : function(params for response)
         *  }
         */
            auth : function(credentials, callback){

                var user = {};

                seq.models.user.findOne({ where : { login : credentials.login }})
                  .then(
                    (result) => {
                        if (result.dataValues.password == credentials.password){
                            user = result.dataValues;
                            return seq.models.token.findOne({ where : { userId : user.id }});
                        }
                      else callback.error({ success : false, status : 401 })
                    }
                  )
                  .then(
                    (result) => {
                      if (!result){
                        var token = secure.generateToken(user.id, user.role);
                        return seq.models.token.create({ userId : user.id, token : token})

                      } else {
                          // Здесь надо написать проверку срока годности токена,
                          // на данный момент генерируется новый токен без проверки
                        var token = secure.generateToken(user.id, user.role);
                        return seq.models.token.update( Object.assign(result.dataValues, { token : token }),
                          { where : { id : result.dataValues.id }, returning : true } )
                      }
                    }
                  )
                  .then(
                    (result) => {
                      if(result.length == 2) result.token = result[1][0].token

                        callback.success({ success : true, access_token : result['token'] })
                    }
                  )
                  .catch( (err) => { console.log(err); callback.error({ success : false, status : 500 })})
                
                /*
                  find user be `username`
                  compare `password`
                   if password confirmed
                   find token by `userId`
                    if access_token exist -> resolve -> return access_token
                    else -> resolve -> create new access_token
                   if password not confirmed -> reject -> return false
                * */
            },
            /**
             * @access_token : String,
             *  callback : {
             *      @success : function(params for response),
             *      @error : function(params for response)
             *  }
             * */
            authenticate : function (access_token, callback) {
                /*
                * find user by `access_token`
                * if user exist
                * resolve, return userId
                * else
                * reject, return false
                * */
            }
        }
    );

    return {
      authenticate : self.authenticate
    }

}