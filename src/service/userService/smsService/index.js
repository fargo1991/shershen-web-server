var config = require('../../../config');


module.exports = function(app, seq, services){

  let generateSmsCode = function(){
    return Math.round(Math.random()*1000000) + '.' + Date.now()
  }

  let checkCode = function (code, resolve, reject) {
    if (code == 1) {
      resolve({ success : true, msg : 'Already confirmed'})
    }
    if ( Date.now() - code.split('.'[1]) > config.PHONE_CONFIRMATION_TIME_LIMIT )
      reject({ success : false, msg : 'Timeout reject.'})
  }

  let checkPhoneConfirm = function(userId){
    return new Promise( (resolve, reject) => {
      services.userService.getUserById(userId)
        .then(
          (result) => {
            if (result) {

              // checkCode(result.phoneConfirmed, resolve, reject);

              let codeInfo = generateSmsCode()

              let userForUpdate = Object.assign( {}, result.dataValues,
                  {
                    phoneConfirmed : codeInfo
                  }
                );

              services.userService.updateUser(userForUpdate, {
                success : function(msg){
                  if(msg.success)
                  resolve({ success : true, msg : { code :codeInfo.split('.')[0] } })
                  else reject(msg)
                },
                error : function(error){
                  reject(error)
                }
              })

            }
            else reject({ error : 'error'})
          },
          (error) => {
            reject(error)
          }
        )
    });
  }

  return {
      checkPhoneConfirm : checkPhoneConfirm
  }

}