var nodemailer = require('nodemailer');
var Handlebars = require('handlebars');
var signupCodeTemplate = require('../templates/email/signupCode');

module.exports = function () {

  var template = Handlebars.compile( signupCodeTemplate );

  return {
    sendCode : function(email, code){
        return new Promise ( (resolve, reject) => {

          var transporter = nodemailer.createTransport({
            service : 'Jino',
            host : 'smtp.jino.ru',
            port : 25,
            auth : {
              user : 'robot@fargo-1991.myjino.ru',
              pass : 'qwerty'
            }
          });

          var mailOptions = {
            from : 'robot@fargo-1991.myjino.ru',
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