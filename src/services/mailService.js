var nodemailer = require('nodemailer'),
    Handlebars = require('handlebars'),
    signupCodeTemplate = require('../templates/email/signupCode'),

    { MAIL } = require('../config.json');

module.exports = function () {

  var template = Handlebars.compile( signupCodeTemplate );

  return {
    sendCode : function(email, code){
        return new Promise ( (resolve, reject) => {

          var transporter = nodemailer.createTransport({
            service : 'Jino',
            host : MAIL.HOST,
            port : MAIL.PORT,
            auth : {
              user : MAIL.E_MAIL,
              pass : MAIL.PASSWORD
            }
          });

          var mailOptions = {
            from : MAIL.E_MAIL,
            to : email,
            subject : 'SHERSHEN | Подтверждение почтового адреса',
            html : template({ code : code })
          }

          transporter.sendMail(mailOptions, function (err, info) {
            if(err) reject(err);
            resolve(info)
          })

        });
      }

    }
}