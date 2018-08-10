/**
 * Created by yaroslav on 31.07.18.
 */

var models = require("./models.js");
var routes = require("./routes.js");
var secure = require('../oAuthService/secure.js');
var SmsService = require('./smsService/index.js');
var verifyToken = require('../oAuthService/secure').verifyToken;


module.exports = function(app, seq, auth){
  var worker = this;

    var smsService = new SmsService(app, seq, { userService : worker  });

    models.init(seq);

    worker.getUserById = function (id) {

      return new Promise( (resolve, reject) => {
        seq.models.user.findOne( { where : { id: id } })
          .then(
            (result) => {

              resolve(result.dataValues)
            })
          .catch(
            (error) => {
              console.log(error)
              reject(error)
            })

      });
    }

    worker.updateUser = function (params, callback){
      seq.models.user.update(params, { where : { id : params.id } })
        .then(
          (result) => {
            if (result) {
              callback.success({ success : true, msg : 'User was updated succesfully'})
            }
            else callback.success({ success : false, msg : 'User not found', status :404 })
          }
        )
        .catch(
          (error) => {
            console.log(error)
            callback.error({ success : false, msg : error })
          }
        )
    }

    routes.init(app, seq,
        {
            create : function(params, callback){
                seq.models.user.create(
                  Object.assign({}, params, { phoneConfirmed : 0 } )
                )
                    .then(
                        (result) => {
                            callback.success({ success : true, msg : `User ${result.dataValues.login} was created.`})
                            console.log('New USER was created:')
                            console.log(result);
                        }
                    )
                    .catch(
                        (error) => {
                            callback.error({ success : false, msg : error.name == 'SequelizeUniqueConstraintError' ? 'SequelizeUniqueConstraintError' : 'Something went wrong =('})
                            console.log('Error was occured during USER creating')
                            console.log(error)
                        }
                    )
            },
            get : function (access_token, callback) {

                let userId = secure.verifyToken(access_token).userId;

              seq.models.user.findOne({
                  where : { id : userId },
                  attributes: { exclude : ['password'] }
              })
                  .then(
                      (result) => {
                          if (result) callback.success({ success : true, data : result })
                          else callback.success({ success : false, msg : "User not found", status : 404 })
                      },
                      (error) => {
                          callback.error({ success : false, msg: 'error' })
                          console.log('Error was occured during USER getting')
                      }
                  )
            },
            updateUser : worker.updateUser,
            getUserById : worker.getUserById,
            getConfirmationCode : function(access_token, callback){

              let userId = verifyToken(access_token).userId;

              smsService.checkPhoneConfirm(userId)
                .then(
                  (result) => {
                    callback.success({ success : true, msg : result})
                  },
                  (error) => {
                    callback.error({ success : false, msg : 'Something went wrong =(' + error})
                  }
                )


            }
        }
    );

    return worker

}