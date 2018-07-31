/**
 * Created by yaroslav on 31.07.18.
 */

const models = require("./models.js");
const routes = require("./routes.js")

function initRoutes(){

}

module.exports = function(app, seq){
    var self = this;

    self.app = app;

    models.init(seq);
    routes.init(app, seq,
        {
        /**
         * credentials : {
         *      @username : String,
         *      @password : String
         *  }
         *  callback : {
         *      @success : function(params for response),
         *      @error : function(params for response)
         *  }
         */
            auth : function(credentials, callback){
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

}