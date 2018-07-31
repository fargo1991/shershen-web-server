/**
 * Created by yaroslav on 31.07.18.
 */

var models = require("./models.js");
var routes = require("./routes.js");

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
              auth.authenticate(access_token, {
                success : function(parms ){callback.success(parms) },
                error : function(parms){callback.error(parms) },
              })
            }
        }
    );

}