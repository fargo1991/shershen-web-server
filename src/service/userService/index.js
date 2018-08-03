/**
 * Created by yaroslav on 31.07.18.
 */

var models = require("./models.js");
var routes = require("./routes.js");
var secure = require('../oAuthService/secure.js');

module.exports = function(app, seq, auth){

    models.init(seq);
    routes.init(app, seq,
        {
            create : function(params, callback){
                seq.models.user.create(params)
                    .then(
                        (result) => {
                            callback.success({ success : true, msg : `User ${result.dataValues.login} was created.`})
                            console.log('New USER was created:')
                            console.log(result);
                        },
                        (error) => {
                            callback.error({ success : false, msg : `Something went wrong.`})
                            console.log('Error was occured during USER creating')
                        }
                    )
            },
            get : function (access_token, callback) {

                let userId = secure.verifyToken(access_token).userId;

              seq.models.user.findOne({
                  where : { id : userId },
                  attributes: { exclude : ['password']}
              })
                  .then(
                      (result) => {
                          if (result) callback.success({ success : true, data : result })
                          else callback.success({ success : false, msg : "User not found", status : 404 })
                      },
                      (error) => {
                          callback.error({ success : false, msg: 'Something went wrong.' })
                          console.log('Error was occured during USER getting')
                      }
                  )
            }
        }
    );

}