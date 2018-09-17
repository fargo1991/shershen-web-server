var nodemailer = require('nodemailer'),
    Handlebars = require('handlebars'),
    signupCodeTemplate = require('../templates/email/signupCode'),
    passwordRestore = require('../templates/email/passwordRestore'),

    { MAIL } = require('../config.json');

module.exports = function () {

  var transporter = nodemailer.createTransport({
    service : 'Jino',
    host : MAIL.HOST,
    port : MAIL.PORT,
    auth : {
      user : MAIL.E_MAIL,
      pass : MAIL.PASSWORD
    }
  });

  return {
    sendCode : function(email, code, username){

        return new Promise ( (resolve, reject) => {

          var template = Handlebars.compile( signupCodeTemplate );
          var mailOptions = {
            from : MAIL.E_MAIL,
            to : email,
            subject : 'ШЕРШЕНЬ | Подтверждение почтового адреса',
            html : template({ code : code, username : username })
          }

          transporter.sendMail(mailOptions, function (err, info) {
            if(err) reject(err);
            resolve(info)
          })

        });

      },

      sendRestoreLetter : function (email, restoreToken, userName) {

        return new Promise( (resolve, reject) => {

          var template = Handlebars.compile( passwordRestore );
          var mailOptions = {
            from : MAIL.E_MAIL,
            to : email,
            subject : 'ШЕРШЕНЬ | Восстановление доступа к учетной записи',
            html : template({ username: userName, restore_token : restoreToken})
          }

          transporter.sendMail(mailOptions, function (err, info) {
            if(err) reject(err);
            resolve(info);
          })
        })

      }

    }
}