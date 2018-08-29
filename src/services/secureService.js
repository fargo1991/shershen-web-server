
module.exports = function(){

  var DB = GLOBAL["DB"]

  var generateToken = function () {

  }

  return{

    // Возвращает true, если проверка прошла и совпадений в базе нет
    checkPhoneUnique : function(phone) {

      return new Promise( (resolve, reject)=> {
        DB.models.user.findOne({where: {phone: phone}})
          .then(
            result => {
              if (!result) resolve(true)
              reject(false)
            },
          )
          .catch(err => {
            console.log(err);
            throw new Error(err)
          })
      });

    },
    // Возвращает true, если проверка прошла и совпадений в базе нет
    checkEMailUnique : function(email){

      return new Promise( (resolve, reject) => {
        DB.models.user.findOne({ where : { email: email } })
          .then(
            result => {
              if (!result) resolve(true)
              reject(false)
            },
          )
          .catch(err => {
            resolve(err);
            throw new Error(err)
          })
      });

    },
    checkLoginUnique : function (login) {

      return new Promise( (resolve, reject) => {
        DB.models.user.findOne({ where : { login: login } })
          .then(
            result => {
              if (!result) resolve(true)
              reject(false)
            },
          )
          .catch(err => {
            resolve(err);
            throw new Error(err)
          })
      });

    },
    /**
     * middleware
     * */
    authenticate : function (token) {

    }
  }

}